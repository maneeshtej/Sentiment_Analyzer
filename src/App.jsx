import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import EmotionClassifier from "./EmotionClassifier";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <EmotionClassifier />
    </>
  );
}

export default App;
