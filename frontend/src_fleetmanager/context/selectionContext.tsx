import { createContext } from "react";

const selectionContext = createContext({
  selection: "empty",
  setSelection: (_foo: any) => {}
});

export default selectionContext;