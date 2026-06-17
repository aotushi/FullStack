import{ ChangeEvent, useRef, useEffect, useState} from "react";
// 受控模式和非受控模式




function App() {

  const [value, setValue] = useState('guang')

  // 非受控模式 defaultValue + onChange事件获取用户输入
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log('e.target.value', e.target.value);
  }


  // 非受控模式 ref获取用户输入
  /**
   * 注意, inputRef的值, 只有在定时器执行前改变的才会被打印, 定时器执行后的改变不会被打印.
   */
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() =>  {
  setTimeout(() => {
      console.log('inputRef.current.value', inputRef.current?.value);
    }, 2000)
  }, [])

  return (
    <div>
      <input defaultValue={'guang'} onChange={onChange} />
      <br />
      {/* <input ref={inputRef} defaultValue={'guang'} /> */}
    </div>
  );
}

export default App;