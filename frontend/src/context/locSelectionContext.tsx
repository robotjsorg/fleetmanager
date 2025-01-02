/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { createContext } from "react"

export const locSelectionContext = createContext({
  locSelection: "no selection",
  // locSelection: "c0f67f5f-3414-4e50-9ea7-9ae053aa1f99",
  setLocationSelection: (_foo: any) => {}
})