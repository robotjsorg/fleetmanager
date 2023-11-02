import { useSqlSync } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useCallback, useContext, useState } from "react";

import { Mutation } from "../@types/mutation";
import { IRobot, RobotContextType } from "../@types/robot";
import { RobotContext } from "../context/robotContext";
import Robot from '../components/Robot';

type RobotsViewsProps = {
  robots: IRobot[];
};

const RobotsView = (props: RobotsViewsProps) => {
  const { mutate } = useSqlSync<Mutation>();
  const [inputValue, setInputValue] = useState("");
  const { saveRobot } = useContext(RobotContext) as RobotContextType;
  const handleCreate = useCallback(async () => {
    if (!inputValue.trim()) {
      return;
    }
    const id = crypto.randomUUID();
    const locationid = crypto.randomUUID();
    await mutate({ tag: "CreateRobot", id, locationid, description: inputValue });
    saveRobot(id, locationid, inputValue);
    setInputValue("");
  }, [inputValue, mutate]);

  return (
    <>
      <div className="bg-white rounded shadow p-6 m-0 mb-4 w-full">
        <div className="mb-4">
          <h1 className="text-grey-darkest">Robots</h1>
          <div>
            {props.robots.map((robot) => (
              <Robot key={robot.id} {...robot} />
            ))}
          </div>
          <div className="flex mt-4">
            <input
              name="newRobot"
              className="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker"
              placeholder="Add Robot"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyUp={async (e) => {
                if (e.key === "Enter") {
                  await handleCreate();
                }
              }}
            />
            <button type="submit" onClick={handleCreate}
              className="flex-no-shrink p-2 border-2 rounded text-teal border-teal hover:text-white hover:bg-teal-500">
              Add
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default RobotsView;