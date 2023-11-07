import { useCallback, useContext } from "react";

import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { locationSelectionContext } from "../context/locationSelectionContext";
import { JournalId } from "@orbitinghail/sqlsync-worker";

export const LocationForm = ({ docId }: { docId: JournalId; }) => {
  const { setLocationSelection } = useContext( locationSelectionContext );

  const form = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null),
    },
  });
  const mutate = useMutate( docId );
  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        mutate({ tag: "CreateLocation", id, description })
          .then(() => {
            form.reset();
            setLocationSelection( id );
          })
          .catch((err) => {
            form.setFieldError('description', String(err));
            console.error("Failed to create location", err);
          });
      },
      [mutate, form, setLocationSelection]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="xs">
        <TextInput
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          placeholder="Desc"
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Flex>
    </form>
  );
};