
import type {JSX} from "react";
import { useState, useRef } from "react";
// hook类型



function Ccc() {
  const [number ,setNumber] = useState(0);


  // const ref = useRef<HTMLDivElement>(null);
  const ref = useRef<{num: number}>(null)

  ref.current = {num: 1}

  return <div>ccc</div>
}

function App() {
  return <div>
    <Ccc></Ccc>
  </div>
}

export default App;

