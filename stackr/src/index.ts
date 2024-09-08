import express from "express";
import cors from 'cors';
import { InitGame, move } from "./helper";
import { Wallet } from "ethers";
import { v4 as uuidv4 } from 'uuid';

InitGame();

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());
const wallet = Wallet.createRandom();

const gameMap = new Map();

app.post("/init-game", (req, res) => {
  try {
    const gameid = uuidv4();
    const randomNumber = generateRandomNumber();

    gameMap.set(gameid, randomNumber);

    res.status(200).send({ gameid: gameid, randomNumber: randomNumber });
  } catch (error) {
    console.error("Error initializing game:", error);
    res.status(500).send("Failed to initialize game");
  }
});

app.post("/move", async (req, res) => {
  const { value, row, col, id, moveNumber } = req.body;

  try {
    const randomNumberArray = gameMap.get(id);

    if (!randomNumberArray) {
      return res.status(400).send("Invalid game ID");
    }
    if (moveNumber != 1) {
      if (randomNumberArray[moveNumber - 2] !== value) {
        return res.status(400).send("Invalid move: Value does not match the expected random number");
      }
    }

    await move(value, row, col, wallet, id, moveNumber);
    res.status(200).send(`Move logged successfully: Value = ${value}, Row = ${row}, Col = ${col}`);
  } catch (error) {
    console.error("Error logging move:", error);
    res.status(500).send("Failed to log move");
  }
});

app.post("/get-random-numbers", (req, res) => {
  const { gameid, moveNumber } = req.body;

  try {
    const randomNumberArray = gameMap.get(gameid);

    if (!randomNumberArray) {
      return res.status(400).send("Invalid game ID");
    }

    if (moveNumber < 0) {
      return res.status(400).send("Invalid move number");
    }

    const firstNumber = randomNumberArray[moveNumber - 2];
    const secondNumber = randomNumberArray[moveNumber - 1];

    res.status(200).send({ firstNumber, secondNumber });
  } catch (error) {
    console.error("Error fetching random numbers:", error);
    res.status(500).send("Failed to fetch random numbers");
  }
});

app.listen(port, () => {
  console.log(`Game server listening at http://localhost:${port}`);
});

const generateRandomNumber = () => {
  const randomNumber = [];
  for (let i = 0; i < 24; i++) {
    randomNumber.push(Math.floor(Math.random() * 6) + 1);
  }
  return randomNumber;
}
