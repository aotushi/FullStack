import { afterEach, describe, expect, it, vi } from "vitest";

import {
  createSessionSync,
  type SessionSyncEvent,
} from "../src/api/session-sync";

interface TestSession {
  accessToken: string;
}

/** 每个用例独立频道，避免 BroadcastChannel 跨用例串音。 */
let channelSequence = 0;

function nextChannelName() {
  channelSequence += 1;
  return `session-sync-test-${channelSequence}`;
}

let cleanups: Array<() => void> = [];

function createRecorder() {
  const endedEvents: number[] = [];
  const updatedSessions: TestSession[] = [];

  return {
    endedEvents,
    updatedSessions,
    handlers: {
      onSessionEnded() {
        endedEvents.push(endedEvents.length + 1);
      },
      onSessionUpdated(session: TestSession) {
        updatedSessions.push(session);
      },
    },
  };
}

function openSync(channelName: string, recorder = createRecorder()) {
  const sync = createSessionSync<TestSession>(channelName, recorder.handlers);
  cleanups.push(() => sync.dispose());
  return { recorder, sync };
}

/** 旁路观察者：直接监听原始频道，用来断言线上报文和注入伪造事件。 */
function openProbe(channelName: string) {
  const events: Array<SessionSyncEvent<TestSession>> = [];
  const channel = new BroadcastChannel(channelName);
  channel.onmessage = (event: MessageEvent) => {
    events.push(event.data as SessionSyncEvent<TestSession>);
  };
  cleanups.push(() => channel.close());
  return { channel, events };
}

async function until(predicate: () => boolean, timeoutMs = 1000) {
  const startedAt = Date.now();
  while (!predicate()) {
    if (Date.now() - startedAt > timeoutMs) {
      throw new Error("等待条件超时");
    }
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

afterEach(() => {
  for (const cleanup of cleanups) {
    cleanup();
  }
  cleanups = [];
  vi.unstubAllGlobals();
});

describe("createSessionSync", () => {
  it("把会话终结事件广播给其他实例，且不回传给发布者自己", async () => {
    const channelName = nextChannelName();
    const publisher = openSync(channelName);
    const receiver = openSync(channelName);

    publisher.sync.publishSessionEnded();

    await until(() => receiver.recorder.endedEvents.length === 1);
    expect(publisher.recorder.endedEvents).toHaveLength(0);
  });

  it("会话更新事件携带完整会话数据", async () => {
    const channelName = nextChannelName();
    const publisher = openSync(channelName);
    const receiver = openSync(channelName);

    publisher.sync.publishSessionUpdated({ accessToken: "token-1" });

    await until(() => receiver.recorder.updatedSessions.length === 1);
    expect(receiver.recorder.updatedSessions[0]).toEqual({
      accessToken: "token-1",
    });
  });

  it("乱序到达的过期事件被丢弃", async () => {
    const channelName = nextChannelName();
    const receiver = openSync(channelName);
    const probe = openProbe(channelName);

    const freshAt = Date.now() + 5000;
    probe.channel.postMessage({
      sentAt: freshAt,
      sourceId: "peer",
      type: "session-ended",
    });
    // 时间戳落后于已处理事件的旧事件必须被丢弃
    probe.channel.postMessage({
      sentAt: 1,
      session: { accessToken: "stale" },
      sourceId: "peer",
      type: "session-updated",
    });
    // 收尾标记：等它被处理，就能确认前一条旧事件已经走完了判定
    probe.channel.postMessage({
      sentAt: freshAt + 1,
      sourceId: "peer",
      type: "session-ended",
    });

    await until(() => receiver.recorder.endedEvents.length === 2);
    expect(receiver.recorder.updatedSessions).toHaveLength(0);
  });

  it("同一时间戳同一来源的重复投递只处理一次", async () => {
    const channelName = nextChannelName();
    const receiver = openSync(channelName);
    const probe = openProbe(channelName);

    const sentAt = Date.now() + 5000;
    probe.channel.postMessage({ sentAt, sourceId: "dup", type: "session-ended" });
    probe.channel.postMessage({ sentAt, sourceId: "dup", type: "session-ended" });
    probe.channel.postMessage({
      sentAt: sentAt + 1,
      sourceId: "other",
      type: "session-ended",
    });

    await until(() => receiver.recorder.endedEvents.length === 2);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(receiver.recorder.endedEvents).toHaveLength(2);
  });

  it("dispose 之后既不再接收也不再发布", async () => {
    const channelName = nextChannelName();
    const alive = openSync(channelName);
    const disposed = openSync(channelName);
    const probe = openProbe(channelName);

    disposed.sync.dispose();
    alive.sync.publishSessionEnded();

    await until(() => probe.events.length === 1);
    expect(disposed.recorder.endedEvents).toHaveLength(0);

    // 已释放实例的发布应当静默失效，而不是抛错或继续上线
    disposed.sync.publishSessionUpdated({ accessToken: "ghost" });
    probe.channel.postMessage({
      sentAt: Date.now() + 60_000,
      sourceId: "marker",
      type: "session-ended",
    });

    await until(() => alive.recorder.endedEvents.length === 1);
    expect(alive.recorder.updatedSessions).toHaveLength(0);
  });

  it("连续发布的事件时间戳严格递增", async () => {
    const channelName = nextChannelName();
    const publisher = openSync(channelName);
    const probe = openProbe(channelName);

    publisher.sync.publishSessionEnded();
    publisher.sync.publishSessionEnded();

    await until(() => probe.events.length === 2);
    expect(probe.events[1]!.sentAt).toBeGreaterThan(probe.events[0]!.sentAt);
    expect(probe.events[0]!.sourceId).toBe(probe.events[1]!.sourceId);
  });

  it("环境缺少 BroadcastChannel 时降级为空实现", () => {
    vi.stubGlobal("BroadcastChannel", undefined);

    const recorder = createRecorder();
    const sync = createSessionSync<TestSession>("no-channel", recorder.handlers);

    expect(() => {
      sync.publishSessionUpdated({ accessToken: "noop" });
      sync.publishSessionEnded();
      sync.dispose();
    }).not.toThrow();
  });
});
