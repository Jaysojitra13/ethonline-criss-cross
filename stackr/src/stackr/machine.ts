import { StateMachine } from "@stackr/sdk/machine";

import * as genesisState from "../../genesis-state.json";
import { CrissCrossState } from "./state";
import { transitions } from "./transitions";

const machine = new StateMachine({
  id: "criss-cross",
  stateClass: CrissCrossState,
  initialState: genesisState.state,
  on: transitions,
});

export { machine };
