import { MicroRollup } from "@stackr/sdk";
import { stackrConfig } from "../../stackr.config";
import { machine } from "./machine";
import { UpdateCrissCross } from "./schemas";

const mru = await MicroRollup({
  config: stackrConfig,
  actionSchemas: [UpdateCrissCross],
  stateMachines: [machine],
});

await mru.init();

export { mru };
