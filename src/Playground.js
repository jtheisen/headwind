import { useEffect, useLayoutEffect, useRef, useState } from "react";

export default function Playground() {
  const [count, setCount] = useState(0);

  const ref = useRef();

  // useLayoutEffect(() => {
  //   setCount(count + 1);
  // }, [count]);

  console.info({ count });

  // useLayoutEffect(() => {
  //   //setCount(ref.current.getBoundingClientRect().width);
  //   console.info(ref.current.getBoundingClientRect().width);
  // }, [count]);

  return (
    <div className="App">
      <h1>{count}</h1>
      <h2 ref={ref}>Start editing to see some magic happen!</h2>
    </div>
  );
}
