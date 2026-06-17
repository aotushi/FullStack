interface messageType {
  success: (content: string, duration?: number) => void
  error: (content: string, duration?: number) => void
  warning: (content: string, duration?: number) => void
  info: (content: string, duration?: number) => void
}

// 正确扩展Vue 3的类型声明
declare module 'dtype' {
  interface ComponentCustomProperties {
    $message: messageType
  }
}

