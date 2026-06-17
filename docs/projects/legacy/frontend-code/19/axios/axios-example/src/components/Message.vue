<template>
  <Teleport to="body">
    <div class="msgComponent" v-show="show">
      <span :class="['msg', activeMsgClass]">{{ msgConfig.content }}</span>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, reactive } from "vue";
import { computed } from "vue";

const show = ref(false);
const msgConfig = reactive({
  type: "",
  content: "",
  duration: 2000,
});

const activeMsgClass = computed(() => {
  switch (msgConfig.type) {
    case "success":
      return "success";
    case "error":
      return "error";
    case "warning":
      return "warning";
    default:
      return "default";
  }
});

const showMessage = (type, content, duration = 2000) => {
  msgConfig.type = type;
  msgConfig.content = content;
  msgConfig.duration = duration;
  show.value = true;
  setTimeout(() => {
    show.value = false;
  }, duration);
};

// 暴露方法给全局使用
defineExpose({
  showMessage,
});
</script>

<style scoped>
.msgComponent {
  position: fixed;
  top: 4px;
  left: 50%;
  transform: translateX(-50%);
  min-width: 50px;
  text-align: center;
  z-index: 9999;
}
.msg {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 4px;
  background: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.success {
  color: #67c23a;
}
.error {
  color: #f56c6c;
}
.warning {
  color: #e6a23c;
}
.default {
  color: #909399;
}
</style>
