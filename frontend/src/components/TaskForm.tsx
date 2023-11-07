import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Flex, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";
import { RobotContext } from "../context/robotContext";

export const TaskForm = ({ docId }: { docId: JournalId }) => {
  const { robots } = useContext(RobotContext)!;
  
  const form = useForm({
    initialValues: {
      robotid: "",
      description: ""
    },
    validate: {
      robotid: (value) => (value.trim().length === 0 ? "Select Robot" : null),
      description: (value) => (value.trim().length === 0 ? "Select Task" : null)
    }
  });
  const mutate = useMutate( docId );

  const handleSubmit = form.onSubmit(
    useCallback(
      ({ robotid, description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        description = robotid + ": " + description;
        mutate({ tag: "CreateTask", id, robotid, description })
          .then(() => {
            form.reset();
            form.setValues( { robotid: "", description: "" } );
          })
          .catch((err) => {
            form.setFieldError('description', String(err));
            form.setErrors({ robot: String(err), description: String(err) });
            console.error("Failed to create task", err);
          });
      },
      [mutate, form]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="xs">
       <Select
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          placeholder="Robot"
          data={(robots).map((robot) => (
            { value: robot.id, label: robot.description }
          ))}
          {...form.getInputProps("robotid")}
        />
       <Select
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          placeholder="Task"
          data={['Manual', 'Automatic', 'Home', 'Move A', 'Move B', 'Clamp', 'Unclamp']}
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Flex>
    </form>
  );
};
