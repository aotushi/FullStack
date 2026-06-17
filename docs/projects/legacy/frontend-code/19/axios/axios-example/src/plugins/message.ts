import { createVNode, render } from 'vue'
import Message from '../components/Message.vue'

const message = {
  success: (content: string, duration = 2000) => {
    showMessage('success', content, duration)
  },
  error: (content: string, duration = 2000) => {
    showMessage('error', content, duration)
  },
  warning: (content: string, duration = 2000) => {
    showMessage('warning', content, duration)
  },
  info: (content: string, duration = 2000) => {
    showMessage('info', content, duration)
  }
}

const showMessage = (type: string, content: string, duration: number) => {
  const container = document.createElement('div')
  const vnode = createVNode(Message)
  render(vnode, container)
  document.body.appendChild(container)
  vnode.component?.exposed?.showMessage(type, content, duration)
  setTimeout(() => {
    document.body.removeChild(container)
  }, duration)
}

export default message 