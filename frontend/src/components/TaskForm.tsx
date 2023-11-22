import { useCallback, useContext, useEffect, useState } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";
import { IRobot } from "../@types/robot";

import { RobotContext } from "../context/robotContext";
import { locSelectionContext } from "../context/locSelectionContext";

export const TaskForm = ({ docId }: { docId: JournalId }) => {
  const { robots, tasks } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const [filteredRobots, setFilteredRobots] = useState<IRobot[]>([]);
  useEffect(()=>{
    setFilteredRobots(robots.filter(( robot ) => ( robot.locationid == locSelection )));
  }, [locSelection, robots]);
  
  const form = useForm({
    initialValues: {
      robot: "",
      description: ""
    },
    validate: {
      robot: (value) => (value.trim().length === 0 ? "Select Robot" : null),
      description: (value) => (value.trim().length === 0 ? "Select Task" : null)
    }
  });
  const mutate = useMutate( docId );
  const handleSubmit = form.onSubmit(
    useCallback(
      ({ robot, description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        mutate({ tag: "CreateTask", id, robotid: robot, description })
          .then(() => {
            form.reset();
          })
          .catch((err) => {
            form.setFieldError("description", String(err));
            form.setErrors({ robot: String(err), description: String(err) });
            console.error("Failed to create task", err);
          });
      }, [mutate, form]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs" align="flex-end">
       <Select
          label="Robot"
          description="Select which robot"
          placeholder="Select robot"
          clearable
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          data={( filteredRobots ).map(( robot ) => (
            { value: robot.id, label: robot.description }
          ))}
          {...form.getInputProps("robot")}
        />
       <Select
          label="New Task"
          description="Select discrete task"
          placeholder="Select task"
          clearable
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          data={['Idle', 'Actuate tool', 'Unactuate tool', 'Random position (one-shot)', 'Random positions (continuous)',
            'Move pre-pick', 'Move pick', 'Move post-pick', 'Move pre-place', 'Move place', 'Move post-place',
            'Pick and Place (one-shot)', 'Pick and Place (continuous)'
          ]}
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Group>
    </form>
  );
};
