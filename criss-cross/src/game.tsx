import React, { useState, useEffect } from "react";

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
  const [dice1, setDice1] = useState<number>(0);
  const [dice2, setDice2] = useState<number>(0);
  const [diceCounts, setDiceCounts] = useState<{ [key: number]: number }>({});
  const [lastFilled, setLastFilled] = useState<LastFilled | null>(null);
  const [initialFilled, setInitialFilled] = useState<boolean>(false);
  const [placementsNeeded, setPlacementsNeeded] = useState<number>(0);
  const [rollCount, setRollCount] = useState<number>(0);
  const [scores, setScores] = useState({
    rows: Array(5).fill(0),
    cols: Array(5).fill(0),
    diagonals: Array(2).fill(0),
    total: 0,
  });
  const [gameOver, setGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (grid.flat().every((cell) => cell !== "")) {
      calculateScore();
      setGameOver(true);
    }
  }, [grid]);

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

    const diagonal1 = grid.map((row, index) => row[index]);
    const diagonal2 = grid.map((row, index) => row[4 - index]);
    newScores.diagonals[0] = calculateLineScore(diagonal1);
    newScores.diagonals[1] = calculateLineScore(diagonal2);

    // Calculate total score
    newScores.total =
      newScores.rows.reduce((a, b) => a + b, 0) +
      newScores.cols.reduce((a, b) => a + b, 0) +
      newScores.diagonals.reduce((a, b) => a + b, 0);

    setScores(newScores);
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

  const fillCell = (row: number, col: number, diceNumber: number): void => {
    if (
      placementsNeeded <= 0 ||
      grid[row][col] !== "" ||
      (diceCounts[diceNumber] || 0) <= 0
    )
      return;
    if (diceNumber && isAdjacent(row, col)) {
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

  const handleFirstCellSelection = (number: number): void => {
    if (grid[0][0] !== "") return;
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[0][0] = number.toString();
      return newGrid;
    });
    setLastFilled({ row: 0, col: 0 });
    setInitialFilled(true);
  };

  const resetGame = () => {
    setGrid(Array.from({ length: 5 }, () => Array(5).fill("")));
    setDice1(0);
    setDice2(0);
    setDiceCounts({});
    setLastFilled(null);
    setInitialFilled(false);
    setPlacementsNeeded(0);
    setRollCount(0);
    setScores({
      rows: Array(5).fill(0),
      cols: Array(5).fill(0),
      diagonals: Array(2).fill(0),
      total: 0,
    });
    setGameOver(false);
  };
  return (
    <div>
      <h1>Dice Grid Game</h1>
      <table style={{ margin: "auto", borderCollapse: "collapse" }}>
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={`${rowIndex}-${colIndex}`}
                  style={{
                    width: "40px",
                    height: "40px",
                    border: "1px solid black",
                    textAlign: "center",
                    verticalAlign: "middle",
                    cursor:
                      placementsNeeded > 0 && isAdjacent(rowIndex, colIndex)
                        ? "pointer"
                        : "default",
                  }}
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
              <td style={{ width: "40px", textAlign: "center" }}>
                {scores.rows[rowIndex]}
              </td>
            </tr>
          ))}
          <tr>
            {Array.from({ length: 5 }).map((_, colIndex) => (
              <td
                key={`col-score-${colIndex}`}
                style={{ width: "40px", textAlign: "center" }}
              >
                {scores.cols[colIndex]}
              </td>
            ))}
            <td></td>
          </tr>
        </tbody>
      </table>

      <table style={{ margin: "20px auto", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              Diagonal 1: {scores.diagonals[0]}
            </td>
            <td style={{ border: "1px solid black", padding: "10px" }}>
              Diagonal 2: {scores.diagonals[1]}
            </td>
          </tr>
          <tr>
            <td
              colSpan={2}
              style={{
                border: "1px solid black",
                padding: "10px",
                textAlign: "center",
              }}
            >
              Total Score: {scores.total}
            </td>
          </tr>
        </tbody>
      </table>

      {!initialFilled && (
        <div>
          <p>Select a number for the first cell:</p>
          {[1, 2, 3, 4, 5, 6].map((number) => (
            <button
              key={number}
              onClick={() => handleFirstCellSelection(number)}
            >
              {number}
            </button>
          ))}
        </div>
      )}
      <button
        style={{ display: "block", margin: "20px auto" }}
        onClick={rollDice}
        disabled={rollCount === 12}
      >
        Roll Dice
      </button>
      <p>Dice 1: {dice1}</p>
      <p>Dice 2: {dice2}</p>
    </div>
  );
};

export default CrissCross;
