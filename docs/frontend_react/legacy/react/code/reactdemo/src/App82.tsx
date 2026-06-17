import { useState, useRef, useEffect, useLayoutEffect, forwardRef } from "react";
import React from "react";
// 受控组件
interface ControlledInputProps {
  value: string;
  onChange: (value: string) => void;
}

const ControlledInput = React.forwardRef<HTMLInputElement, ControlledInputProps>(({ value, onChange }, ref) => {
  return <input ref={ref} value={value} onChange={(e) => onChange(e.target.value)} />;
});

// 非受控组件
interface UncontrolledInputProps {
  defaultValue: string;
  onChange?: (value: string) => void;
}

const UncontrolledInput = React.forwardRef<HTMLInputElement, UncontrolledInputProps>(({ defaultValue, onChange }, ref) => {
  return <input defaultValue={defaultValue} ref={ref} />;
});

function App() {
  const [unValue, setUnValue] = useState("");
  const [controlledValue, setControlledValue] = useState("aaaa");
  const uncontrolledRef = useRef<HTMLInputElement>(null);
  const controlledRef = useRef<HTMLInputElement>(null);

  console.log("渲染了");

  useEffect(() => {
    controlledRef.current?.focus();

    setUnValue(uncontrolledRef.current?.value || "");
  }, [controlledValue]);

  return (
    <div>
      <h3>受控组件</h3>
      <ul>
        <li>组件完全由父组件通过props控制</li>
        <li>所有状态变更必须通过父组件处理</li>
        <li>组件只是一个傀儡, 只负责渲染和触发事件</li>
      </ul>
      <ControlledInput
        ref={controlledRef}
        value={controlledValue}
        onChange={(v) => {
          console.log("受控值被改变: ", v);
          setControlledValue(v.toUpperCase());
        }}
      />

      <h3>非受控组件</h3>
      <ul>
        <li>组件内部维护自己的状态</li>
        <li>父组件只能通过`defaultValue`提供初始值</li>
        <li>状态变更首先发生在组件内部,然后通过回调通知父组件</li>
      </ul>
      <UncontrolledInput defaultValue={"初始值"} ref={uncontrolledRef} />

      <p>非受控组件的值是: {unValue}</p>

      <button
        onClick={() => {
          console.log("打印非受控值: ", uncontrolledRef.current?.value);
          const value = uncontrolledRef.current?.value || "";
          setUnValue(value);
        }}
      >
        打印非受控值
      </button>
    </div>
  );
}

export default App;
