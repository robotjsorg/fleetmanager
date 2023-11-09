import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { RobotContext } from "../context/robotContext";
import { locationSelectionContext } from "../context/locationSelectionContext";

export const LocationForm = ({ docId }: { docId: JournalId; }) => {
  const { locations } = useContext( RobotContext );
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
        const locationDescriptions = locations.map(( location )=>( location.description ));
        if (locationDescriptions.includes(description)) {
          form.setFieldError('description', "Duplicate location description");
        } else {
          const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
          mutate({ tag: "CreateLocation", id, description })
            .then(() => {
              setLocationSelection( id );
            })
            .catch((err) => {
              form.setFieldError('description', String(err));
              console.error("Failed to create location", err);
            });
        }
      }, [locations, form, mutate, setLocationSelection]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs" align="flex-end">
        <TextInput
          label="New Location"
          description="Description"
          placeholder="New location description"
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Group>
    </form>
  );
};