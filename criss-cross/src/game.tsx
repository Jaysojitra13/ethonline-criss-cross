import React, { useState } from "react";

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

  const resetGame = () => {
    setGrid(Array.from({ length: 5 }, () => Array(5).fill("")));
    setDice1(0);
    setDice2(0);
    setDiceCounts({});
    setLastFilled(null);
    setInitialFilled(false);
    setPlacementsNeeded(0);
    setRollCount(0);
  };

  const rollDice = (): void => {
    if (rollCount === 12) return; // Skip roll on 12th if no adjacent cells are available
    const newDice1 = Math.floor(Math.random() * 6) + 1;
    const newDice2 = Math.floor(Math.random() * 6) + 1;
    setDice1(newDice1);
    setDice2(newDice2);
    const newCounts = { ...diceCounts };
    newCounts[newDice1] = (newCounts[newDice1] || 0) + 1;
    newCounts[newDice2] = (newCounts[newDice2] || 0) + 1;
    setDiceCounts(newCounts); // Update counts for each dice number
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
      newCounts[diceNumber] -= 1; // Decrement the count for this dice number
      setDiceCounts(newCounts);
    }
  };

  const isAdjacent = (row: number, col: number): boolean => {
    if (!lastFilled || placementsNeeded === 2) return true; // Allow placement anywhere for the first dice of the roll
    const { row: lastRow, col: lastCol } = lastFilled;
    return (
      Math.abs(lastRow - row) + Math.abs(lastCol - col) === 1 &&
      (lastRow === row || lastCol === col) // Ensure they are aligned horizontally or vertically
    );
  };

  const handleFirstCellSelection = (number: number): void => {
    setGrid((prevGrid) => {
      const newGrid = [...prevGrid];
      newGrid[0][0] = number.toString();
      return newGrid;
    });
    setLastFilled({ row: 0, col: 0 });
    setInitialFilled(true);
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
            </tr>
          ))}
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
        disabled={initialFilled && placementsNeeded !== 0}
      >
        Roll Dice
      </button>
      {/* <button
        style={{ display: "block", margin: "20px auto", marginTop: "10px" }}
        onClick={resetGame}
      >
        Reset Game
      </button> */}
      {initialFilled && dice1 && dice2 && placementsNeeded > 0 && (
        <div>
          <p>
            Dice Rolls: {dice1} and {dice2} - Place both in adjacent cells
          </p>
        </div>
      )}
    </div>
  );
};

export default CrissCross;
