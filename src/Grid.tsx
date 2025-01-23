import { useEffect, useState } from "react"
import Square from "./Square"
import "./Grid.css"

type GridProps = {
    onPlay: (text: string) => void;
    onWinner: (winner: string) => void;
    onDraw: () => void;
    starter: string;
}

export default function Grid({ onPlay, onWinner, starter, onDraw }: GridProps) {
    // Reference to matrix willnever be changed
    let [matrix, setMatrix] = useState(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => "White")))
    let [playing, setPlaying] = useState(true)

    // Turn will change and cause rerender
    let [turn, setTurn] = useState(starter);
    // console.log("Starter", starter);

    let keyUpHandler: (e: KeyboardEvent) => void;
    let boldNumber: (e: KeyboardEvent) => void;


    let onColumnClicked = (num: number) => {
        for (let index = 7; index >= 0; index--) {
            if (matrix[num][index] !== "Red" && matrix[num][index] !== "Yellow") {
                matrix[num][index] = turn;
                console.log("Column", num, turn);
                let newturn;
                if (turn == "Yellow") {
                    newturn = "Red";
                } else {
                    newturn = "Yellow";
                }

                setTurn(newturn)
                onPlay(newturn + "'s turn")

                let winner = "White";
                let draw = true;
                // Search winning condition 
                for (let i = 0; i < matrix.length && winner === "White"; i++) {
                    for (let j = 0; j < matrix[i].length && winner === "White"; j++) {
                        if (matrix[i][j] !== "White") {
                            // Check all four possible winning directions
                            if (
                                // Diagonal (Top-Left to Bottom-Right)
                                (i < matrix.length - 3 && j < matrix[i].length - 3 &&
                                    matrix[i][j] === matrix[i + 1][j + 1] &&
                                    matrix[i][j] === matrix[i + 2][j + 2] &&
                                    matrix[i][j] === matrix[i + 3][j + 3]) ||

                                // Horizontal (Left to Right)
                                (j < matrix[i].length - 3 &&
                                    matrix[i][j] === matrix[i][j + 1] &&
                                    matrix[i][j] === matrix[i][j + 2] &&
                                    matrix[i][j] === matrix[i][j + 3]) ||

                                // Vertical (Top to Bottom)
                                (i < matrix.length - 3 &&
                                    matrix[i][j] === matrix[i + 1][j] &&
                                    matrix[i][j] === matrix[i + 2][j] &&
                                    matrix[i][j] === matrix[i + 3][j]) ||

                                // Diagonal (Bottom-Left to Top-Right)
                                (i >= 3 && j < matrix[i].length - 3 &&
                                    matrix[i][j] === matrix[i - 1][j + 1] &&
                                    matrix[i][j] === matrix[i - 2][j + 2] &&
                                    matrix[i][j] === matrix[i - 3][j + 3])
                            ) {
                                draw = false;
                                winner = matrix[i][j];
                                console.log("Winner:", winner);
                                onWinner(winner);
                                setPlaying(false);

                                // Reset the grid after some time
                                setTimeout(() => {
                                    setPlaying(true);
                                    setMatrix(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => "White")));
                                }, 3000);
                                // Exit the loops early since a winner is found
                                break;
                            }
                        } else {
                            draw = false;
                        }
                    }
                }
                if (draw) {
                    onDraw()
                    setPlaying(false);

                    // Reset the grid after some time
                    setTimeout(() => {
                        setPlaying(true);
                        setMatrix(Array.from({ length: 8 }, () => Array.from({ length: 8 }, () => "White")));
                    }, 3000);
                }
                break;
            }
        }

    }


    useEffect(() => {
        keyUpHandler = (e: KeyboardEvent) => {
            // e.preventDefault()
            let columnIndex = parseInt(e.key) - 1
            if (!isNaN(columnIndex) && 0 <= columnIndex && columnIndex <= 7) {
                // Put color on Grid
                console.log("Key Pressed", columnIndex, turn);

                onColumnClicked(columnIndex)
                let numElement = document.getElementById(`${columnIndex}`);
                if (numElement) {
                    // Change number back to normal
                    numElement.style.scale = "1";
                    numElement.style.fontWeight = "normal";
                }
            }
        }

        boldNumber = (e: KeyboardEvent) => {
            // e.preventDefault()
            let columnIndex = parseInt(e.key) - 1
            if (!isNaN(columnIndex) && 0 <= columnIndex && columnIndex <= 7) {
                let numElement = document.getElementById(`${columnIndex}`);
                if (numElement) {
                    // Make number bold and large
                    numElement.style.scale = "1.3";
                    numElement.style.fontWeight = "bold";
                }
            }
        }

        if (playing) {
            document.addEventListener("keyup", keyUpHandler)
            document.addEventListener("keydown", boldNumber)
        }

        return () => {
            document.removeEventListener("keyup", keyUpHandler)
            document.removeEventListener("keydown", boldNumber)
        }
    })

    return (
        <div className={`grid ${playing ? "" : "gameover " + turn + "-lose"}`}>
            {matrix.map((column, c) => (
                <div key={c} onClick={() => { if (playing) { onColumnClicked(c) } }}
                    className={`column ${playing ? "playing" : ""}`}>
                    <p id={`${c}`}>{c + 1}</p>
                    {column.map((value, r) => (<Square key={r * 8 + c} color={value} />))}
                </div>
            ))}
        </div>
    )
}