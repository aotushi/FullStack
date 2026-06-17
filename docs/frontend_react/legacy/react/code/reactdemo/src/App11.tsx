import {useState, useRef, useEffect} from 'react';

function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {

  const { defaultValue, value: propsValue } = props ?? {};
  
  const [stateValue, setStateValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue
    } else if (defaultValue !== undefined) {
      return defaultValue
    } else {
      return defaultStateValue
    }
  })

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender.current) {
      setStateValue(propsValue!)
    }

    isFirstRender.current = false
  }, [propsValue])

  const mergedValue = propsValue === undefined ? stateValue : propsValue;



  return [mergedValue, setStateValue]
}


interface CalenderProps {
    defaultValue?: Date;
    value?: Date;
    onChange?: (date: Date) => void;
}

function Calender(props: CalenderProps) {
  
  const {
    value: propsValue,
    defaultValue,
    onChange
  } = props;

  const [mergedValue, setMergedValue] = useMergeState(new Date(), {
    value: propsValue,
    defaultValue
  });

  function changeValue(date:Date) {
    if (propsValue === undefined) {
      setMergedValue(date);
    }
    onChange?.(date)
  }

  return <div>
    {mergedValue?.toLocaleDateString()}
    <div onClick={() => changeValue(new Date("2024-5-1"))}>2023-5-1</div>
    <div onClick={() => changeValue(new Date("2024-5-2"))}>2023-5-2</div>
    <div onClick={() => changeValue(new Date("2024-5-3"))}>2023-5-3</div>
  </div>
}




// 受控模式
function App() {
  const [value, setValue] = useState(new Date("2025-5-1"));

  return (
   <Calender value={value} onChange={
    date => {
      console.log(date.toLocaleDateString());
      setValue(date);
    }
   }></Calender>
  )
}

// 非受控模式
function App2() {
  return (
    <Calender defaultValue={new Date("2025-5-1")} onChange={date => console.log(date.toLocaleDateString())}></Calender>
  )
}