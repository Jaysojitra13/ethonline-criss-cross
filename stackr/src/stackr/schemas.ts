import { ActionSchema, SchemaType, SolidityType } from "@stackr/sdk";

export const UpdateCrissCross = new ActionSchema("update-move", {
  // moves: SolidityType.STRING,
  moves: SolidityType.STRING
});
