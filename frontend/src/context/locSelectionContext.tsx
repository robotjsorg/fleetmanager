/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const locSelectionContext = createContext({
  locSelection: "no selection",
  setLocationSelection: (_foo: any) => {}
});