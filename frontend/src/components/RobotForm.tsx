import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useCallback } from "react";
import { Mutation } from "../doctype";
import { v4 as uuidv4 } from "uuid";

interface RobotFormProps {
  mutate: (m: Mutation) => Promise<void>;
}

export const RobotForm = ({ mutate }: RobotFormProps) => {

  const form = useForm({
    initialValues: {
      description: "",
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Description is too short" : null),
    },
  });

  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        const locationid = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        mutate({ tag: "CreateRobot", id, locationid, description })
          .then(() => {
            form.reset();
          })
          .catch((err) => {
            console.error("Failed to create robot", err);
          });
      },
      [mutate, form]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="xs">
        <TextInput
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          placeholder="Add a robot"
          {...form.getInputProps("description")}
        />
        <Button type="submit">Add</Button>
      </Flex>
    </form>
  );
};
