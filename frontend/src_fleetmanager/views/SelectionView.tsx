import { useQuery } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useContext, useMemo } from "react";

import selectionContext from "../context/selectionContext";

const SelectionView = () => {
  const { selection } = useContext(selectionContext);
  const { rows, error } = useQuery("select description, created_at from robots where id is '" + selection + "'");
  const rows_string = useMemo(() => {
    return JSON.stringify(
      rows,
      (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      },
      2
    );
  }, [rows]);

  return (
    <div className="bg-white rounded shadow p-6 m-0 mb-4 w-full">
      <div className="mb-4">
        <h1 className="text-grey-darkest">Selection</h1>
        <p className="text-xs">{selection}</p>
        <p className="mt-4 break-words">{error ? error.message : rows_string}</p>
      </div>
    </div>
  );
}

export default SelectionView;