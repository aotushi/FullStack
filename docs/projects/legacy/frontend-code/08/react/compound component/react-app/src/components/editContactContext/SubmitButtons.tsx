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