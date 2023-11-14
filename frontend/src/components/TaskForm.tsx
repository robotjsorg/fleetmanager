import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Group, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { RobotContext } from "../context/robotContext";
import { locSelectionContext } from "../context/locSelectionContext";

export const TaskForm = ({ docId }: { docId: JournalId }) => {
  const { robots, tasks } = useContext( RobotContext );
  const { locSelection } = useContext( locSelectionContext );
  const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ));
  
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
        const robotTasks = tasks.filter(( task ) => ( task.robotid == robot ));
        const robotTaskDescriptions = robotTasks.map(( task ) => ( task.description ));
        if ( robotTaskDescriptions.includes( description ) ) {
          form.setFieldError("description", "Duplicate task assigned");
        } else {
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
        }    
      }, [tasks, mutate, form]
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
          data={["Idle", "Spin Around", "Random Positions"]} // , "Manual", "Auto", "Home", "Move A", "Move B", "Clamp", "Unclamp"
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Group>
    </form>
  );
};
