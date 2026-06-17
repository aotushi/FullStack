## React中复合组件(compound component)



### 背景

>解决同一个React组件在不同场景下需要呈现完全不同的布局或样式



在页面1中需要引入联系人信息, 在模态框(Modal)中需要编辑联系人信息.

传统解决方式是:

* 创建两个单独的组件, 重复代码
* 创建复杂组件, 根据传入的json条件来配置

以上两种方式都是代码难以维护且扩展性差.





### 是什么

> 复合组件模式是一种组合式的组件设计方法. 你会创建一个父组件管理状态和行为，并暴露一系列子组件用于渲染不同的 UI 部分。



### 怎么做?

#### 1.创建用于传递数据的Root组件

0.创建数据判断

1.创建Root组件, 使用Context.Provider进行数据传递, children接收数据



```tsx
// src/components/EditContactContext/Root.tsx

import {createContext, useContext} from 'react'

function Root({contactId, children}) {
  
export interface FormData {
  name: string;
  email: string;
  phone: string;
}

function Root({ contactId, children }: RootProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
  });


  const handleSubmit = async () => {

    try {
      await {
        id: contactId,
        ...formData,
      };
    }
  };

  const contextValue = {
    formData,
    setFormData
  };
  
  return (
  	<EditContactContext.Provider value={contextValue}>
    	{children}
    </EditContactContext.Provider>
  )
}

const EditContactContext = createContext(null)

function useEditContactContext() {
  const cxt = useContext(EditContactContext)
  if (context === null) {
    throw new Error('子组件必须位于EditContact.Root内')
  }
  return cxt
}

export {
	Root,
  useEditContactContext
}
```



#### 2.创建UI样式组件

在UI样式组件中引入了消费者

```tsx
//src/components/EditContactContext/FormInput.tsx

import { useEditContactContext } from "./Root";
import { ChangeEvent } from "react";
import type { FormData } from "./Root";



function FormInputs() {
  const {formData, setFormData} = useEditContactContext()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target
    setFormData((pre: FormData) => ({...pre, [name]: value}))
  }

  return (
    <form>
      <input name="name" onChange={handleChange} value={formData.name} placeholder="Name"/>

      <input name="email" onChange={handleChange} value={formData.email} placeholder="Email"/>

      <input name="phone" onChange={handleChange} value={formData.phone} placeholder="Phone"/>
    </form>
  )
}

export default FormInputs

```



```tsx
//src/components/EditContactContext/Title.tsx

import { useEditContactContext } from "./Root";

function Title() {
  const {formData} = useEditContactContext()

  return (
    <>
      {formData ? `编辑联系人姓名 ${formData.name}` : "新建联系人"}
      <br/>
      {formData ? `编辑联系人邮箱 ${formData.email}` : "新建联系人"}
      <br />
      {formData ? `编辑联系人电话 ${formData.phone}` : "新建联系人"}
    </>
  )
}

export default Title
```



```tsx
//src/components/EditContactContext/SubmitButtons.tsx

import { useEditContactContext } from "./Root";

function SubmitButtons() {
  const {handleSubmit, loading} = useEditContactContext()

  return (
    <div>
      <button onClick={handleSubmit} disabled={loading}>{loading ? "保存中..." : "保存"}</button>
      <button>取消</button>
    </div>
  )
}

export default SubmitButtons
```



```tsx
////src/components/EditContactContext/index.tsx

import {Root} from "./Root";
import Title from "./Title";
import SubmitButtons from "./SubmitButtons";
import FormInputs from "./FormInputs";

const EditContact = {
  Root,
  Title,
  SubmitButtons,
  FormInputs,
};

export default EditContact;
```



#### 3.在目标组件中引入Root组件,并传入props

```tsx
// src/ContactModal.tsx

import EditContact from "./components/editContactContext/index";
import Modal from "../src/components/Modal";

// interface ContactModalProps {
//   onClose: () => void;
// }

function ContactModal(props: { onClose: () => void }) {
  const contactId = "234";

  return (
    <EditContact.Root contactId={contactId}>
      <Modal onClose={props.onClose} title={<EditContact.Title />} footer={<EditContact.SubmitButtons />}>
        <EditContact.FormInputs />
      </Modal>
    </EditContact.Root>
  );
}

export default ContactModal;
```



```tsx

// src/editContactPage.tsx

import EditContact from "./components/editContactContext/index";

function EditContactPage() {
  const contactId = '123'

  return (
    <div>
      <EditContact.Root contactId={contactId}>

        <div>
          <EditContact.Title />
          <EditContact.SubmitButtons/>
        </div>
        <div>
          <EditContact.FormInputs />
        </div>
      </EditContact.Root>
    </div>
  )
}

export default EditContactPage
```

