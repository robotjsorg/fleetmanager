import { useQuery } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { useState } from "react";

import { IRobot } from "../@types/robot";
import RobotProvider from '../context/robotContext';
import selectionContext from "../context/selectionContext";
import FleetmanagerView from "../views/FleetmanagerView";
import RobotsView from "../views/RobotsView";
import TasksView from "../views/TasksView";
import SelectionView from "../views/SelectionView";

const MainAppContainer = () => {
  const [selection, setSelection] = useState("empty");
  const { rows: robots } = useQuery<IRobot>("select * from robots order by description");

  return (
    // TODO: Maybe refactor selection context provider into robot context provider
    <RobotProvider robots={robots} >
      <selectionContext.Provider value={{ selection, setSelection }}>
        <div className="grid grid-cols-3">
            <div className="col-span-3 md:col-span-3 lg:col-span-2 p-4 py-0">
              <FleetmanagerView />
            </div>
            <div className="col-span-3 md:col-span-2 lg:col-span-1 p-4 pb-0 pt-4 lg:pt-0">
              <RobotsView robots={robots} />
              <TasksView />
              <SelectionView />
            </div>
        </div>
      </selectionContext.Provider>
    </RobotProvider>
  );
};

export default MainAppContainer;