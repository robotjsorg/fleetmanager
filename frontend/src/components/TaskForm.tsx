import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Flex, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { Mutation, useQuery } from "../doctype";
import { v4 as uuidv4 } from "uuid";
import { IRobot } from "../@types/robot";
import { sql } from "@orbitinghail/sqlsync-react";

interface TaskFormProps {
  docId: JournalId;
  mutate: (m: Mutation) => Promise<void>;
}

export const TaskForm = ({ docId, mutate }: TaskFormProps) => {
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
    sql`select * from robots order by description`
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
            robot.id
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
