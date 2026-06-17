
import type {JSX} from "react";


interface AaaProps {
  name: string;
  // content: React.ReactElement  //对应 JSX类型
  content: React.ReactNode        //对应 除JSX类型外,还有string|number|null等类型
}



function Aaa(props: AaaProps) {
  return <div>aaa, {props.name} {props.content}</div>
}

function App() {
  return <div>
    {/* <Aaa name="guang" content={<button>xxx</button>}></Aaa> */}
    {/* <Aaa name="guang" content={null}></Aaa> */}
    <Aaa name="guang" content={123}></Aaa>

  </div>
}


/**
 * 1.JSX类型
 */

// 组件的类型默认不写, 可以自动推导出来. 将鼠标移上去后,显示: function App(): JSX.Element
// React 函数组件默认返回值就是 JSX.Element。

// 看下JSX.Element的类型定义, 需要引入
// Element类型显示为: interface React.JSX.Element  interface Element extends React.ReactElement<any, any> {}
const content: JSX.Element = <div>hello</div>


// 根据Element的类型,如果描述一个jsx类型, 就可以使用React.ReactElement来声明类型
const content2: React.ReactElement = <div>hello</div>


/**
 * 2.JSX类型的使用, 向组件中传递一个JSX类型
 */


/**
 * 3. JSX类型, 不接受null, number等, 会报错.
 * 报错信息: Type 'null' is not assignable to type 'ReactElement<unknown, string | JSXElementConstructor<any>>'.ts(2322)
 */


/**
 * 4. 如果需要传递null/number等其它类型, 可以用React.ReactNode
 */


/**
 * 5.ReactNode的类型定义
 * 可以看到它是一个联合类型, 包含ReactElement, string, boolean, null, undefined等等.
 * 
 * 3个类型的关系
 * ReactNode > ReactElement > JSX.Element
 * 
 * 使用介绍: 一般情况下，如果你想描述一个参数接收 JSX 类型，就用 ReactNode 就行。
 */

export default App;

