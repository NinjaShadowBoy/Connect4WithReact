import { useEffect, useState } from 'react'
import './App.css'
import Grid from './Grid'

function App() {
  let [starter, setStarter] = useState("Yellow")
  let [gameTitle, setGameTitle] = useState(`${starter} should start!!`)

  useEffect(() => {
    setGameTitle(`${starter} should start!!`);

    return () => {
      console.log("Game restart");
    }
  }, [starter])

  async function restart(winner: string) {
    setTimeout(() => {
      // waiting for 2 seconds before restarting the game
      setStarter(starter === "Yellow" ? "Red" : "Yellow")
    }, 2000);
  }
  
  async function draw() {
    setGameTitle(`"Draw! Nobody wins 🤷‍♂️"`)

    setTimeout(() => {
      // waiting for 2 seconds before restarting the game
      setStarter(starter === "Yellow" ? "Red" : "Yellow")
    }, 2000);
  }

  return (
    <div className="game">
      <h1>Connect 4 game</h1>
      <p>Press a key from <kbd>1</kbd> to <kbd>8</kbd> or click on colums</p>
      <h2>{gameTitle}</h2>
      <Grid onWinner={restart} onDraw={draw} onPlay={(text: string) => setGameTitle(text)} starter={starter} />
    </div>
  )
}

export default App
