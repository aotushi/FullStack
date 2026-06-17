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