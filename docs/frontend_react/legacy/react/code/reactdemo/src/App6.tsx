import{ ChangeEvent, useRef, useEffect, useState} from "react";
// 受控模式和非受控模式




function App() {
// 受控模式
/**
 * 这种写法不推荐. 
 * - 不让用户自己控制,而是通过代码控制,饶了一圈也没有改变value的值,还是原封不动
 * - 受控模式每次setValue都会重新渲染. 而非受控模式只会渲染一次
 */
const [value, setValue] = useState('guang');
const onChange = (e: ChangeEvent<HTMLInputElement>) => {
  console.log('e.target.value', e.target.value);
  setValue(e.target.value);
}
  return (
    <div>
      <input value={value} onChange={onChange} />
    </div>
  );
}


/**
 * 受控模式,实现场景
 * - 需要对输入的值做处理之后设置到表单的时候.但这种场景很少.
 * - 或者是你想实时同步状态值到父组件。
 * 
 */

function App2() {
  const [value, setValue] = useState('guang');
  function onChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('e.target.value', e.target.value);
    setValue(e.target.value);
  }
  return (
    <div>
      <input value={value} onChange={onChange} />
    </div>)
}


export default App;