import { ChangeEvent, useRef, useEffect, useState } from "react";
// 提供了两种模式的基础组件-受控+非受控

interface CalendarProps {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date) => void;
}

function Calendar(props: CalendarProps) {
  // 参数同时支持 value 和 defaultValue，通过判断 value 是不是 undefined 来区分受控模式和非受控模式。

  const { value: propsValue, defaultValue, onChange } = props;

  const [value, setValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue;
    } else {
      return defaultValue;
    }
  });

  const isFirstRender = useRef(true);

  /**
   * 使用useEffect来监听propsValue的变化, 将受控模式切换为非受控模式
   * 同时确保首次渲染时正确处理初始状态。组件内的 isFirstRender 的逻辑正是用来解决这样的边界场景。
   */
  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setValue(defaultValue);
    }

    isFirstRender.current = false;
    console.log("useEffect");
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? value : propsValue;

  function changeValue(date: Date) {
    if (propsValue === undefined) {
      setValue(date);
    }

    onChange?.(date);
  }

  return (
    <div>
      {mergedValue?.toLocaleDateString()}
      <div onClick={() => changeValue(new Date("2024-5-1"))}>2023-5-1</div>
      <div onClick={() => changeValue(new Date("2024-5-2"))}>2023-5-2</div>
      <div onClick={() => changeValue(new Date("2024-5-3"))}>2023-5-3</div>
    </div>
  );
}

// 非受控
function App() {
  return (
    <Calendar
      defaultValue={new Date("2024-5-1")}
      onChange={(date) => {
        console.log(date.toLocaleDateString());
      }}
    />
  );
}

// 受控
function App2() {
  const [value, setValue] = useState(new Date("2024-5-1"));

  return (
    <Calendar
      value={value}
      onChange={(date) => {
        console.log(date.toLocaleDateString());
        setValue(date);
      }}
    />
  );
}

export default App;
