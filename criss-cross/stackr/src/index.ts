import { ActionConfirmationStatus, AllowedInputTypes } from "@stackr/sdk";
import { HDNodeWallet, Wallet } from "ethers";
import { mru } from "./stackr/mru.ts";
import { UpdateCrissCross } from "./stackr/schemas.ts";
import { signMessage } from "./utils.ts";
import { Playground } from "@stackr/sdk/plugins";
import { machine } from "./stackr/machine.ts";
import { input, number } from "@inquirer/prompts";

const main = async () => {

  Playground.init(mru);

  const totalMoves = 24;
  let currentMove = 1;
  const wallet = Wallet.createRandom();

  while (currentMove <= totalMoves) {

    if (currentMove == 1) {
      let res = await number({
        message: "Please enter number between 1 to 6",
        min: 1,
        max: 6,
        required: true
      });

      let inputs = {
        moves: JSON.stringify({
          game: [[res, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0], [0, 0, 0, 0, 0]],
          move: currentMove,
          dice: res,
          row: 0,
          col: 0
        })
      };

      await sendTransaction(wallet, inputs);
      currentMove += 1;
    } else {
      const firstDiceNumber = getRandomNumber();
      const secondDiceNumber = getRandomNumber();

      console.log(`Your dice numbers are ${firstDiceNumber} and ${secondDiceNumber}`);

      let row1: number = await number({
        message: `Please choose row where you want to put number ${firstDiceNumber}`,
        min: 1,
        max: 5,
        required: true
      }) as number;

      let col1: number = await number({
        message: `Please choose column where you want to put number ${firstDiceNumber}`,
        min: 1,
        max: 5,
        required: true
      }) as number;


      const newState = JSON.parse(machine.state).game

      if (newState[row1 - 1][col1 - 1]) {
        throw new Error('Cannot update number at this place');
      }
      newState[row1 - 1][col1 - 1] = firstDiceNumber;

      let inputs = {
        moves: JSON.stringify({
          game: newState,
          move: currentMove,
          dice: firstDiceNumber,
          row: row1,
          col: col1
        }),
      };

      await sendTransaction(wallet, inputs);

      currentMove += 1;
      let row2: number = await number({
        message: `Please choose row where you want to put number ${secondDiceNumber}`,
        min: 1,
        max: 5,
        required: true,
      }) as number;

      let col2: number = await number({
        message: `Please choose column where you want to put number ${secondDiceNumber}`,
        min: 1,
        max: 5,
        required: true,
      }) as number;

      const newState2 = JSON.parse(machine.state).game;

      newState2[row2 - 1][col2 - 1] = secondDiceNumber;

      let inputs2 = {
        moves: JSON.stringify({
          game: newState2,
          move: currentMove,
          dice: secondDiceNumber,
          row: row2,
          col: col2
        }),
      };

      await sendTransaction(wallet, inputs2);

      currentMove += 1;
    }
  }

};

main();

function getRandomNumber() {
  return Math.floor(Math.random() * 6) + 1;
}

async function sendTransaction(wallet: HDNodeWallet, inputs: AllowedInputTypes) {
  const signature = await signMessage(wallet, UpdateCrissCross, inputs);
  const incrementAction = UpdateCrissCross.actionFrom({
    inputs,
    signature,
    msgSender: wallet.address,
  });

  const ack = await mru.submitAction("move", incrementAction);
  console.log(ack.hash);

  const { logs, errors } = await ack.waitFor(ActionConfirmationStatus.C1);
  console.log({ logs, errors });
}