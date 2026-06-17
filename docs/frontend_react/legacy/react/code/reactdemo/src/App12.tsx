
import {
  useState,
  useRef,
  useEffect,
  SetStateAction,
  useCallback
} from 'react';


function useMergeState<T>(
  defaultStateValue: T,
  props?: {
    defaultValue?: T;
    value?: T;
    onChange?: (value: T) => void
  }
): [T, React.Dispatch<React.SetStateAction<T>>] {

  const { defaultValue, value: propsValue, onChange } = props ?? {};

  const [stateValue, setStateValue] = useState(() => {
    if (propsValue !== undefined) {
      return propsValue!;
    } else if (defaultValue !== undefined) {
      return defaultValue!;
    } else {
      return defaultStateValue;
    }
  })

  const isFirstRender = useRef(true)

  useEffect(() => {
    if (propsValue === undefined && !isFirstRender) {
      setStateValue(propsValue!);
    }

    isFirstRender.current = false
  }, [propsValue])


  const mergedValue = propsValue === undefined ? stateValue : propsValue


  // 封装onChange
  function isFunction(value: unknown): value is Function {
    return typeof value === 'function';
  }


  const setState = useCallback((value: SetStateAction<T>) => {
    let res = isFunction(value) ? value(stateValue) : value;

    if (propsValue === undefined) {
      setStateValue(res)
    }

    onChange?.(res)
  }, [stateValue])

  // return [mergedValue, setMergedValue]

  return [mergedValue, setState]

}

interface CalenderProps {
  value?: Date;
  defaultValue?: Date;
  onChange?: (date: Date) => void;
}

function Calender(props: CalenderProps) {
  const {
    value: propsValue,
    defaultValue,
    onChange
  } = props;

  const [mergedValue, setValue] = useMergeState(new Date(), {
    value: propsValue,
    defaultValue,
    onChange
  });

  return <div>
    {mergedValue?.toLocaleDateString()}
    <div onClick={() => {setValue(new Date('2025-5-1'))}}>2025-5-1</div>
    <div onClick={()=> {setValue(new Date('2024-5-2'))}}>2023-5-2</div>
    <div onClick={()=> {setValue(new Date('2024-5-3'))}}>2023-5-3</div>
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

export default App;