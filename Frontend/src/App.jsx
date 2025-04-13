import { useState } from "react";
import "./App.css";
import { Outlet } from "react-router-dom";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
    <main>
      <Outlet/>
    </main>
    </>
  );
}

export default App;
