import { useState, useEffect, useRef } from "react";

function Test() {
  const [inputValue, setInputValue] = useState(0);
  const count = useRef("");

  useEffect(() => {
    count.current = count.current + "1";
  });

  return (
    <>
      <input type="text" ref={count} onChange={(e) => count.current++} />
      <div onClick={() => count.current.focus()}>jjn</div>
      <h1>Render Count: {count.current}</h1>
    </>
  );
}

export default Test;
