// gameLogic.ts
import { ActionConfirmationStatus, AllowedInputTypes } from "@stackr/sdk";
import { HDNodeWallet } from "ethers";
import { mru } from "./stackr/mru.ts";
import { UpdateCrissCross } from "./stackr/schemas.ts";
import { signMessage } from "./utils.ts";
import { Playground } from "@stackr/sdk/plugins";
import { machine } from "./stackr/machine.ts";

const totalMoves = 24;
let currentMove: number;

export const InitGame = () => {
    console.log("init game called");
    Playground.init(mru);
    currentMove = 1;
};

export const move = async (
    value: number,
    row: number,
    col: number,
    wallet: HDNodeWallet
) => {
    console.log('current move', currentMove, 'total move', totalMoves)
    if (currentMove <= totalMoves) {
        if (currentMove == 1) {
            console.log('move called')
            let inputs = {
                moves: JSON.stringify({
                    game: [
                        [value, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                    ],
                    move: currentMove,
                    dice: value,
                    row: row,
                    col: col,
                }),
            };

            await sendTransaction(wallet, inputs);
            currentMove += 1;
        } else {
            const newState = JSON.parse(machine.state).game;
            newState[row][col] = value;
            let inputs = {
                moves: JSON.stringify({
                    game: newState,
                    move: currentMove,
                    dice: value,
                    row: row,
                    col: col,
                }),
            };
            try {

                await sendTransaction(wallet, inputs);
                currentMove += 1;
            } catch (err) {
                console.log(err)
            }

        }
    }
};

async function sendTransaction(
    wallet: HDNodeWallet,
    inputs: AllowedInputTypes
) {
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
