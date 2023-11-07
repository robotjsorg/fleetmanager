/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react";

export const guiSelectionContext = createContext({
  guiSelection: "no selection",
  setGuiSelection: (_foo: any) => {},
  locationSelection: "no selection",
  setLocationSelection: (_foo: any) => {}
});