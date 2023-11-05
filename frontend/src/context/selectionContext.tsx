/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const selectionContext = createContext({
  selection: "empty",
  setSelection: (_foo: any) => {}
});