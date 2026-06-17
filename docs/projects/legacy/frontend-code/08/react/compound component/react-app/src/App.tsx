// import { useState } from 'react'
import EditContactPage from "./editContactPage"
import ContactModal from "./ContactModal"
// import './styles/components/App.module.css'
import AppClass from './styles/components/App.module.css'



function App() {
  // const [count, setCount] = useState(0)

  return (
    <div className={AppClass.App}>
      <h1>联系人管理--编辑框</h1>
      <EditContactPage />

      <h1>联系人管理--模态框</h1>
      <ContactModal onClose={() => {}} />
    </div>
  )
}

export default App
