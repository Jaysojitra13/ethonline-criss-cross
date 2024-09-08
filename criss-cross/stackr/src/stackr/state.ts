import { State } from "@stackr/sdk/machine";
import { solidityPackedKeccak256 } from "ethers";

export class CrissCrossState extends State<string> {
  constructor(state: string) {
    super(state);
  }


  transformer() {
    return {
      wrap: () => {
        return this.state;
      },
      unwrap: (wrappedState: string) => {
        return wrappedState
      },
    };
  }

  getRootHash(): string {
    return solidityPackedKeccak256(["string"], [this.state]);
  }
}
