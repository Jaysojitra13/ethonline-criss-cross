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


// Initialize the game
app.post("/init-game", (req, res) => {
  try {
    const gameid = uuidv4();
    res.status(200).send({ gameid: gameid });
  } catch (error) {
    console.error("Error initializing game:", error);
    res.status(500).send("Failed to initialize game");
  }
});

// Log a move
app.post("/move", async (req, res) => {
  const { value, row, col, id } = req.body;

  try {
    await move(value, row, col, wallet, id);
    res.status(200).send(`Move logged successfully: Value = ${value}, Row = ${row}, Col = ${col}`);
  } catch (error) {
    console.error("Error logging move:", error);
    res.status(500).send("Failed to log move");
  }
});

app.listen(port, () => {
  console.log(`Game server listening at http://localhost:${port}`);
});
