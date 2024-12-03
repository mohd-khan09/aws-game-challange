import "./App.css";
import GameCanvas from "./components/GameCanvas/GameCanvas";

function App() {
  return (
    <>
      <div>
        <h1 style={{ textAlign: "center" }}>Shooting Game</h1>
        <GameCanvas />
      </div>
    </>
  );
}

export default App;
