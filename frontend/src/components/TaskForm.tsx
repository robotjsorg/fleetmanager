import { useCallback } from "react";

import { sql } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Flex, Select } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate, useQuery } from "../doctype";
import { IRobot } from "../@types/robot";

export const TaskForm = ({ docId }: { docId: JournalId }) => {
  const mutate = useMutate( docId );
  const form = useForm({
    initialValues: {
      robot: "",
      description: "",
    },
    validate: {
      robot: (value) => (value.trim().length === 0 ? "Select Robot" : null),
      description: (value) => (value.trim().length === 0 ? "Select Task" : null),
    },
  });
  

  const { rows: robots } = useQuery<IRobot>(
    docId,
    sql`SELECT * FROM robots ORDER BY description`
  );

  const handleSubmit = form.onSubmit(
    useCallback(
      ({ robot, description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        const robotid = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        description = robot + ": " + description;
        mutate({ tag: "CreateTask", id, robotid, description })
          .then(() => {
            form.reset();
          })
          .catch((err) => {
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
          data={(robots ?? []).map((robot) => (
            robot.id // description is more user friendly but breaks because it's not unique
          ))}
          {...form.getInputProps("robot")}
        />
       <Select
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          placeholder="Task"
          data={['Manual', 'Automatic', 'Home', 'Move A', 'Move B', 'Clamp', 'Unclamp']}
          {...form.getInputProps("description")}
        />
        <Button type="submit">Add</Button>
      </Flex>
    </form>
  );
};
