import { useCallback, useContext } from "react";

import { Button, Flex, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { locationSelectionContext } from "../context/locationSelectionContext";
import { JournalId } from "@orbitinghail/sqlsync-worker";

export const LocationForm = ({ docId }: { docId: JournalId }) => {
  const { setGuiSelection } = useContext( guiSelectionContext );
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
            setGuiSelection("no selection");
          })
          .catch((err) => {
            console.error("Failed to create location", err);
          });
      },
      [mutate, form, setLocationSelection, setGuiSelection]
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
        <Button type="submit">Add</Button>
      </Flex>
    </form>
  );
};