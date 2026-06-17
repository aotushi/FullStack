<script setup lang="ts">
import { inject, ref, onMounted } from "vue";
import axios from "axios";
import HttpRequest from "./axios/http";

const $http = inject("http") as HttpRequest;

const message = inject("$message") as messageType;

message.success("Hello, world!");

interface RequestItem {
  id: string;
  url: string;
  method: string;
  status: "pending" | "success" | "error" | "canceled";
  progress: number;
  startTime: number;
}

interface TestInfo {
  id: string | number;
  name: string;
  [key: string]: any;
}

const requestList = ref<RequestItem[]>([]);
const testInfoList = ref<TestInfo[]>([]);

// 添加请求到列表
const addRequestToList = (request: RequestItem) => {
  requestList.value.push(request);
};

// 更新请求状态
const updateRequestStatus = (id: string, status: RequestItem["status"], progress: number = 100) => {
  const index = requestList.value.findIndex((item) => item.id === id);
  if (index !== -1) {
    requestList.value[index].status = status;
    requestList.value[index].progress = progress;
  }
};

// 生成唯一ID
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
};
const allRequestIsResolved = ref(false)
// 重置所有请求
const InitRequests = () => {
  if (requestList.value.every(request => request.status)) {
    allRequestIsResolved.value = true
  }

  if (allRequestIsResolved.value) {
    requestList.value = []
    allRequestIsResolved.value = false
  } else {
    message.error('还有正在进行中的请求')
  }
}

// 取消所有请求
const cancelAllRequests = () => {
  try {
    $http.cancelAllRequests();
    requestList.value.forEach((request) => {
      if (request.status === "pending") {
        request.status = "canceled";
        request.progress = 0;
      }
    });
    message.info("已取消所有请求");
  } catch (error) {
    console.error("取消请求出错:", error);
    message.error("取消请求失败");
  }
};

// 发送新请求
const sendNewRequest = () => {
  const id = generateId();
  const requestItem: RequestItem = {
    id,
    url: "/tests",
    method: "GET",
    status: "pending",
    progress: 0,
    startTime: Date.now(),
  };

  addRequestToList(requestItem);

  // 模拟进度增加
  const progressInterval = setInterval(() => {
    const index = requestList.value.findIndex((item) => item.id === id);
    if (index !== -1 && requestList.value[index].status === "pending") {
      requestList.value[index].progress = Math.min(95, requestList.value[index].progress + 10);
    } else {
      clearInterval(progressInterval);
    }
  }, 300);

  $http
    .get<TestInfo[]>("/tests", {
      allowDuplicate: true
    })
    .then((res) => {
      console.log("请求成功:", res);
      clearInterval(progressInterval);
      updateRequestStatus(id, "success");
      if (res.data && res.data.data) {
        if (Array.isArray(res.data.data)) {
          testInfoList.value = res.data.data;
        } else {
          console.error("接收到的数据不是数组格式");
        }
      }
    })
    .catch((err) => {
      console.log("请求错误:", err);
      clearInterval(progressInterval);
      if (axios.isCancel && axios.isCancel(err)) {
        updateRequestStatus(id, "canceled");
      } else {
        updateRequestStatus(id, "error");
      }
    });
};

const handleBtnClick = () => {
  sendNewRequest();
};

// 发送多个测试请求
const sendMultipleRequests = () => {
  // 发送3个请求，使用setTimeout是为了让UI有时间渲染每个请求项
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      sendNewRequest();
    }, i * 200); // 每隔200ms发送一个请求
  }
};

// 发送多个真正并发的请求
const sendConcurrentRequests = () => {
  const requestPromises: Promise<any>[] = [];
  const requestIds: string[] = [];
  
  // 立即创建多个请求项
  for (let i = 0; i < 5; i++) {
    const id = generateId();
    requestIds.push(id);
    
    const requestItem: RequestItem = {
      id,
      url: "/tests",
      method: "GET",
      status: "pending",
      progress: 0,
      startTime: Date.now(),
    };
    
    addRequestToList(requestItem);
    
    // 为每个请求添加进度模拟
    const progressInterval = setInterval(() => {
      const index = requestList.value.findIndex((item) => item.id === id);
      if (index !== -1 && requestList.value[index].status === "pending") {
        requestList.value[index].progress = Math.min(95, requestList.value[index].progress + 10);
      } else {
        clearInterval(progressInterval);
      }
    }, 300);
    
    // 创建请求Promise
    const requestPromise = $http
      .get<TestInfo[]>("/tests", {
        allowDuplicate: true
      })
      .then((res) => {
        clearInterval(progressInterval);
        updateRequestStatus(id, "success");
        return res;
      })
      .catch((err) => {
        clearInterval(progressInterval);
        if (axios.isCancel && axios.isCancel(err)) {
          updateRequestStatus(id, "canceled");
        } else {
          updateRequestStatus(id, "error");
        }
        throw err;
      });
    
    requestPromises.push(requestPromise);
  }
  
  // 等待所有请求完成
  Promise.allSettled(requestPromises).then((results) => {
    console.log("所有并发请求已完成", results);
    const successCount = results.filter(r => r.status === "fulfilled").length;
    message.success(`完成 ${successCount}/${requestPromises.length} 个请求`);
  });
};

// 演示用，一开始加载一些请求
onMounted(() => {
  // sendNewRequest();
});
</script>

<template>
  <div class="container">
    <div class="actions">
      <button @click="handleBtnClick">发送单个请求</button>
      <button @click="sendMultipleRequests" class="multi-btn">发送多个请求</button>
      <button @click="sendConcurrentRequests" class="multi-btn">发送并发请求</button>
      <button @click="cancelAllRequests" class="cancel-btn">取消全部请求</button>
      <button @click="InitRequests" class="multi-btn">重置所有请求</button>
    </div>

    <div class="request-table">
      <h3>请求列表</h3>
      <table v-if="requestList.length > 0">
        <thead>
          <tr>
            <th>ID</th>
            <th>URL</th>
            <th>方法</th>
            <th>状态</th>
            <th>进度</th>
            <th>开始时间</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in requestList" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.url }}</td>
            <td>{{ item.method }}</td>
            <td>
              <span :class="['status', item.status]">
                {{
                  item.status === "pending" ? "请求中" : item.status === "success" ? "成功" : item.status === "error" ? "失败" : "已取消"
                }}
              </span>
            </td>
            <td>
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: `${item.progress}%` }"></div>
              </div>
              {{ item.progress }}%
            </td>
            <td>{{ new Date(item.startTime).toLocaleTimeString() }}</td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-table">暂无请求记录</div>
    </div>

    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.actions {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #45a049;
}

.cancel-btn {
  background-color: #f44336;
}

.cancel-btn:hover {
  background-color: #d32f2f;
}

.multi-btn {
  background-color: #2196f3;
}

.multi-btn:hover {
  background-color: #1976d2;
}

.request-table {
  margin-bottom: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

th,
td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

th {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #f5f5f5;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
}

.status.pending {
  background-color: #2196f3;
}

.status.success {
  background-color: #4caf50;
}

.status.error {
  background-color: #f44336;
}

.status.canceled {
  background-color: #9e9e9e;
}

.progress-bar {
  width: 100px;
  height: 10px;
  background-color: #f2f2f2;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 5px;
}

.progress-fill {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.3s ease;
}

.empty-table {
  padding: 20px;
  text-align: center;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.data-list {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
