import { useState, useEffect, useRef } from "react";

function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {
  
  const { defaultValue, value: propsValue } = props ?? {};

  const isFirstRender = useRef(true);

  const [stateValue, setStateValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue;
    } else if (defaultValue !== undefined) {
      return defaultValue;
    } else {
      return defaultStateValue;
    }
  });

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!);
    }
    
    isFirstRender.current = false;
  }, [propsValue]);

  const mergedValue = propsValue === undefined ? stateValue : propsValue;

  return [mergedValue, setStateValue];
}

interface CalendarProps {
  defaultValue?: Date;
  value?: Date;
  onChange?: (date: Date) => void;
}

function Calender(props: CalendarProps) {
  const { value: propsValue, defaultValue, onChange } = props;

  const [mergedValue, setValue] = useMergeState(new Date(), { defaultValue, value: propsValue });

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

// 受控模式
function App2() {
  const [value, setValue] = useState(new Date("2025-5-1"));
  return (
    <div>
      <Calender
        value={value}
        onChange={(date) => {
          console.log(date.toLocaleDateString());
          setValue(date);
        }}
      ></Calender>
    </div>
  )
}

// 非受控模式
function App() {
  return (
    <div>
      <Calender
        defaultValue={new Date()}
        onChange={(date) => {
          console.log(date.toLocaleDateString());
        }}
      ></Calender>
    </div>
  );
}

export default App;
