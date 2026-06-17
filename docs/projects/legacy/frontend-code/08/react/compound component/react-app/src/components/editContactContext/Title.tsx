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