import { STF, Transitions } from "@stackr/sdk/machine";
import { CrissCrossState } from "./state";
import { machine } from "./machine";

const move: STF<CrissCrossState> = {
  handler: ({ inputs: { moves, id }, state, emit }) => {

    if (JSON.parse(moves).move > 1) {

      const prevgame = JSON.parse(JSON.parse(machine.state)[id]).game;
      const prevMove = JSON.parse(JSON.parse(machine.state)[id]).move;
      const currentMove = JSON.parse(moves).move;
      const updatingRow = JSON.parse(moves).row;
      const updatingCol = JSON.parse(moves).col;

      const oldState = prevgame[updatingRow][updatingCol];
      if (oldState) {
        throw new Error('cannot update already filled state')
      }
      //condition 3 
      if (JSON.parse(moves).move % 2 == 1) {
        const prevRow = JSON.parse(JSON.parse(machine.state)[id]).row;
        const prevCol = JSON.parse(JSON.parse(machine.state)[id]).col;
        const currentRow = JSON.parse(moves).row;
        const currentCol = JSON.parse(moves).col;

        if (
          !((Math.abs(prevRow - currentRow) === 1 && Math.abs(prevCol - currentCol) === 0) ||
            (Math.abs(prevRow - currentRow) === 0 && Math.abs(prevCol - currentCol) === 1))
        ) {
          throw new Error('Place number to adajacent cells only!');
        }
      }
      if (currentMove != prevMove + 1) {
        throw new Error('cannot jump states')
      }
      const prevState = machine.state;
      const preStateJSON = JSON.parse(prevState);
      const newState = JSON.stringify({ ...preStateJSON, [id]: moves })
      state = newState
      // state = moves;
      // // const prevState = JSON.parse(machine.state);
      // // console.log(prevState)
      // console.log("new state", moves)
      // emit({ name: "After Move", value: state });
      // return state;
    } else {
      const prevState = machine.state;
      if (prevState == '') {
        state = JSON.stringify({ [id]: moves });
      } else {
        const preStateJSON = JSON.parse(prevState);
        const newState = JSON.stringify({ ...preStateJSON, [id]: moves })
        state = newState
      }
      console.log("new state", state)
      emit({ name: "After Move", value: state });
    }
    return state;

  },
};



export const transitions: Transitions<CrissCrossState> = {
  move,
};
