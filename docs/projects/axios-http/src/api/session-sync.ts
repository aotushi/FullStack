/**
 * 跨标签页会话同步：把「这个标签页登录/登出/换了令牌」的事实广播给同源的其他
 * 标签页，让所有标签页共享同一份会话。
 *
 * 本文件只是**传输机制**——BroadcastChannel 收发加乱序防护，不碰任何会话存储；
 * 事件到达后做什么由调用方的 handlers 决定（项目侧把 handlers 接到自己的会话
 * 存储上：收到更新就写入并调用 resetAuthState() 开新代际，收到终结就清空）。
 *
 * 它与 http/ 目录是并列关系，不是其中一环：同步不参与「什么时候刷新」的决策，
 * 只搬运刷新/登录/登出的结果。跨标签页的**互斥**（防并发刷新触发轮换重放）被
 * 有意排除在外——那要重写单飞状态机，且正确性本就由后端轮换宽限窗口保证，
 * 划界依据见 DESIGN.md D-66/D-67。
 *
 * 乱序防护解决的问题：BroadcastChannel 不保证多标签页事件的全局顺序。标签页 A
 * 广播「会话更新」、标签页 B 紧接着广播「会话终结」，C 可能先收到终结再收到更新，
 * 于是一个已登出的会话被复活。给每个事件盖单调递增的时间戳，只接受比已见事件更新
 * 的，就把「旧事实覆盖新事实」挡住了。
 */

export type SessionSyncEvent<Session> =
  | { sentAt: number; sourceId: string; type: "session-ended" }
  | { sentAt: number; session: Session; sourceId: string; type: "session-updated" };

export interface SessionSyncHandlers<Session> {
  onSessionEnded(): void;
  onSessionUpdated(session: Session): void;
}

export interface SessionSync<Session> {
  dispose(): void;
  publishSessionEnded(): void;
  publishSessionUpdated(session: Session): void;
}

function createSourceId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createSessionSync<Session>(
  channelName: string,
  handlers: SessionSyncHandlers<Session>,
): SessionSync<Session> {
  // 环境没有 BroadcastChannel（SSR、极旧浏览器）就降级为空实现：单标签页照常工作，
  // 只是失去跨标签页联动。调用方不需要感知差别。
  if (typeof BroadcastChannel === "undefined") {
    return {
      dispose() {},
      publishSessionEnded() {},
      publishSessionUpdated() {},
    };
  }

  const sourceId = createSourceId();
  const channel = new BroadcastChannel(channelName);
  // Node 环境（测试）里别让频道句柄拖住进程退出；浏览器没有 unref，安静跳过。
  (channel as unknown as { unref?: () => void }).unref?.();

  let disposed = false;
  let lastEventAt = 0;
  let lastEventSourceId = "";

  // 本地时钟可能和其他标签页有偏差，也可能同一毫秒连发两个事件。取
  // max(现在, 上一事件 + 1) 保证自己发出的时间戳一定比已见过的所有事件都新。
  function stampEvent() {
    const sentAt = Math.max(Date.now(), lastEventAt + 1);
    lastEventAt = sentAt;
    lastEventSourceId = sourceId;
    return sentAt;
  }

  channel.onmessage = (event: MessageEvent) => {
    const data = event.data as Partial<SessionSyncEvent<Session>> | undefined;
    if (disposed || !data || typeof data.sentAt !== "number" || typeof data.sourceId !== "string") {
      return;
    }

    // 比已处理事件旧的丢弃；同一时间戳同一来源视为重复投递，也丢弃。
    // 同一时间戳不同来源无法排序，按新事件放行。
    if (
      data.sentAt < lastEventAt ||
      (data.sentAt === lastEventAt && data.sourceId === lastEventSourceId)
    ) {
      return;
    }

    lastEventAt = data.sentAt;
    lastEventSourceId = data.sourceId;

    if (data.type === "session-ended") {
      handlers.onSessionEnded();
    } else if (data.type === "session-updated") {
      handlers.onSessionUpdated((data as SessionSyncEvent<Session> & { session: Session }).session);
    }
  };

  return {
    dispose() {
      disposed = true;
      channel.close();
    },
    publishSessionEnded() {
      if (disposed) {
        return;
      }
      channel.postMessage({ sentAt: stampEvent(), sourceId, type: "session-ended" });
    },
    publishSessionUpdated(session: Session) {
      if (disposed) {
        return;
      }
      channel.postMessage({ sentAt: stampEvent(), session, sourceId, type: "session-updated" });
    },
  };
}
