import { useSqlSync } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useCallback, useContext } from "react";

import { Mutation } from "../@types/mutation";
import { IRobot, RobotContextType } from "../@types/robot";
import { RobotContext } from "../context/robotContext";
import selectionContext from "../context/selectionContext";

const Robot = (props: IRobot) => {
  const { mutate } = useSqlSync<Mutation>();
  const { deleteRobot } = useContext(RobotContext) as RobotContextType;
  const handleDelete = useCallback(async () => {
    await mutate({ tag: "DeleteRobot", id: props.id});
    deleteRobot(props.id);
  }, [props.id, mutate]);
  const { setSelection } = useContext(selectionContext);
  const handleNewSelect = () => {
    setSelection(props.id);
  }

  return (
    <div className="flex mb-4 items-center" onClick={handleNewSelect}>
      <p className="w-full">{props.description}</p>
      <button
        onClick={handleDelete}
        className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red-500"
      >
        Remove
      </button>
    </div>
  );
}

export default Robot;