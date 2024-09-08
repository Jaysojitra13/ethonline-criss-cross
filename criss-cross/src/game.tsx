import React, { useState, useEffect } from "react";
import { initGame, move } from "./api/stackr.api";
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

type Cell = string;
type Grid = Cell[][];
interface LastFilled {
  row: number;
  col: number;
}

const CrissCross: React.FC = () => {
  const [grid, setGrid] = useState<Grid>(
    Array.from({ length: 5 }, () => Array(5).fill(""))
  );
  const [moveID, setMoveID] = useState(1);
  const [dice1, setDice1] = useState<number>(0);
  const [dice2, setDice2] = useState<number>(0);
  const [gameID, setGameId] = useState<string>("");
  const [diceCounts, setDiceCounts] = useState<{ [key: number]: number }>({});
  const [lastFilled, setLastFilled] = useState<LastFilled | null>(null);
  const [initialFilled, setInitialFilled] = useState<boolean>(false);
  const [placementsNeeded, setPlacementsNeeded] = useState<number>(0);
  const [rollCount, setRollCount] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    initializeGame();
  }, []);

  useEffect(() => {
    if (grid.flat().every((cell) => cell !== "")) {
      calculateScore();
      setGameOver(true);
    }
  }, [grid]);

  const initializeGame = async () => {
    try {
      const id = await initGame();
      console.log("Setting game ID:", id);
      setGameId(id);
      resetGame();
    } catch (error) {
      console.error("Failed to initialize game:", error);
    }
  };

  const resetGame = () => {
    setGrid(Array.from({ length: 5 }, () => Array(5).fill("")));
    setMoveID(1);
    setDice1(0);
    setDice2(0);
    setDiceCounts({});
    setLastFilled(null);
    setInitialFilled(false);
    setPlacementsNeeded(0);
    setRollCount(0);
    setScore(0);
    setGameOver(false);
  };

  const calculateScore = () => {
    const newScores = {
      rows: Array(5).fill(0),
      cols: Array(5).fill(0),
      diagonals: Array(2).fill(0),
      total: 0,
    };
    grid.forEach((row, rowIndex) => {
      newScores.rows[rowIndex] = calculateLineScore(row);
    });
    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const column = grid.map((row) => row[colIndex]);
      newScores.cols[colIndex] = calculateLineScore(column);
    }
    const diagonal2 = grid.map((row, index) => row[4 - index]);
    newScores.diagonals[0] = calculateLineScore(diagonal2);
    newScores.diagonals[1] = calculateLineScore(diagonal2);
    newScores.total =
      newScores.rows.reduce((a, b) => a + b, 0) +
      newScores.cols.reduce((a, b) => a + b, 0) +
      newScores.diagonals.reduce((a, b) => a + b, 0);
    console.log(newScores.rows, newScores.cols, newScores.diagonals);
    setScore(newScores.total);
  };

  const calculateLineScore = (line: string[]): number => {
    let score = 0;
    let consecutive = 1;
    let hasConsecutive = false;
    for (let i = 1; i < line.length; i++) {
      if (line[i] === line[i - 1] && line[i] !== "") {
        consecutive++;
        hasConsecutive = true;
      } else {
        score += getScoreForConsecutive(consecutive);
        consecutive = 1;
      }
    }
    score += getScoreForConsecutive(consecutive);
    if (!hasConsecutive) {
      score = -5;
    }
    return score;
  };

  const getScoreForConsecutive = (count: number): number => {
    switch (count) {
      case 2:
        return 2;
      case 3:
        return 3;
      case 4:
        return 8;
      case 5:
        return 10;
      default:
        return 0;
    }
  };

  const rollDice = (): void => {
    if (rollCount >= 12 || gameOver) return;
    const newDice1 = Math.floor(Math.random() * 6) + 1;
    const newDice2 = Math.floor(Math.random() * 6) + 1;
    setDice1(newDice1);
    setDice2(newDice2);
    const newCounts = { ...diceCounts };
    newCounts[newDice1] = (newCounts[newDice1] || 0) + 1;
    newCounts[newDice2] = (newCounts[newDice2] || 0) + 1;
    setDiceCounts(newCounts);
    setPlacementsNeeded(2);
    setRollCount(rollCount + 1);
  };

  const fillCell = async (
    row: number,
    col: number,
    diceNumber: number
  ): Promise<void> => {
    if (
      placementsNeeded <= 0 ||
      grid[row][col] !== "" ||
      (diceCounts[diceNumber] || 0) <= 0
    )
      return;
    if (diceNumber && isAdjacent(row, col)) {
      await move(diceNumber, row, col, gameID, moveID);
      setMoveID(moveID + 1);
      setGrid((prevGrid) => {
        const newGrid = [...prevGrid];
        newGrid[row][col] = diceNumber.toString();
        return newGrid;
      });
      setLastFilled({ row, col });
      setPlacementsNeeded(placementsNeeded - 1);
      const newCounts = { ...diceCounts };
      newCounts[diceNumber] -= 1;
      setDiceCounts(newCounts);
    }
  };

  const isAdjacent = (row: number, col: number): boolean => {
    if (!lastFilled || placementsNeeded === 2) return true;
    const { row: lastRow, col: lastCol } = lastFilled;
    return (
      Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1 &&
      (lastRow === row || lastCol === col)
    );
  };

  const handleFirstCellSelection = async (number: number): Promise<void> => {
    if (grid[0][0] !== "") return;
    await move(number, 0, 0, gameID, moveID);
    setMoveID(moveID + 1);
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[0][0] = number.toString();
      return newGrid;
    });
    setLastFilled({ row: 0, col: 0 });
    setInitialFilled(true);
  };

  const getDiceIcon = (value: number) => {
    switch (value) {
      case 1:
        return <Dice1 />;
      case 2:
        return <Dice2 />;
      case 3:
        return <Dice3 />;
      case 4:
        return <Dice4 />;
      case 5:
        return <Dice5 />;
      case 6:
        return <Dice6 />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Criss Cross</h1>

      <div className="flex justify-center mb-8">
        <button
          className="px-6 py-3 text-lg font-semibold rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
          onClick={initializeGame}
        >
          New Game
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <table className="w-full border-collapse">
            <tbody>
              {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => (
                    <td
                      key={`${rowIndex}-${colIndex}`}
                      className={`w-12 h-12 border border-gray-300 text-center align-middle cursor-pointer ${
                        placementsNeeded > 0 && isAdjacent(rowIndex, colIndex)
                          ? "hover:bg-blue-100"
                          : ""
                      } ${
                        rowIndex + colIndex === 4 ? "bg-yellow-200" : "bg-white"
                      }`}
                      onClick={() => {
                        if (
                          placementsNeeded > 0 &&
                          isAdjacent(rowIndex, colIndex)
                        ) {
                          if ((diceCounts[dice1] || 0) > 0) {
                            fillCell(rowIndex, colIndex, dice1);
                          } else if ((diceCounts[dice2] || 0) > 0) {
                            fillCell(rowIndex, colIndex, dice2);
                          }
                        }
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-center p-4 bg-blue-100 rounded-lg">
            <span className="text-xl font-bold">Score: {score}</span>
          </div>

          {!initialFilled ? (
            <div>
              <p className="text-lg mb-2">
                Select a number for the first cell:
              </p>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((number) => (
                  <button
                    key={number}
                    onClick={() => handleFirstCellSelection(number)}
                    className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    {number}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <button
                  className={`px-6 py-3 text-lg font-semibold rounded-full ${
                    rollCount === 12 || gameOver
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600 text-white transition-colors"
                  }`}
                  onClick={rollDice}
                  disabled={rollCount === 12 || gameOver}
                >
                  Roll Dice
                </button>
              </div>

              <div className="flex justify-center space-x-8">
                <div className="text-center">
                  <p className="text-lg mb-2">Dice 1</p>
                  <div className="text-4xl">{getDiceIcon(dice1)}</div>
                </div>
                <div className="text-center">
                  <p className="text-lg mb-2">Dice 2</p>
                  <div className="text-4xl">{getDiceIcon(dice2)}</div>
                </div>
              </div>
            </div>
          )}

          {gameOver && (
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-4">Game Over!</h2>
              <p className="text-xl">Final Score: {score}</p>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6">Rules</h2>
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg mb-2">Game Setup</h3>
              <p>
                Select any number from 1-6 for the first cell to start the game.
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg mb-2">Gameplay</h3>
              <p>
                Roll the dice to get two numbers. Fill these numbers in cells
                adjacent to the last filled cell (horizontally or vertically).
              </p>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg mb-2">Scoring</h3>
              <p>
                Only the highlighted diagonal (top-right to bottom-left) is
                scored:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  2 identical consecutive numbers:{" "}
                  <span className="font-semibold text-green-600">
                    +2 points
                  </span>
                </li>
                <li>
                  3 identical consecutive numbers:{" "}
                  <span className="font-semibold text-green-600">
                    +3 points
                  </span>
                </li>
                <li>
                  4 identical consecutive numbers:{" "}
                  <span className="font-semibold text-green-600">
                    +8 points
                  </span>
                </li>
                <li>
                  5 identical consecutive numbers:{" "}
                  <span className="font-semibold text-green-600">
                    +10 points
                  </span>
                </li>
                <li>
                  No consecutive identical numbers:{" "}
                  <span className="font-semibold text-red-600">-5 points</span>
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-md shadow">
              <h3 className="font-semibold text-lg mb-2">Game End</h3>
              <p>
                The game ends when all cells are filled. Be careful to place
                numbers strategically to maximize your score on the highlighted
                diagonal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrissCross;
