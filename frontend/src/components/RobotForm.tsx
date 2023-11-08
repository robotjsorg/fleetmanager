import { useCallback, useContext } from "react";

import { Button, Flex, Select, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { guiSelectionContext } from "../context/guiSelectionContext";
import { locationSelectionContext } from "../context/locationSelectionContext";
import { JournalId } from "@orbitinghail/sqlsync-worker";

export const RobotForm = ({ docId }: { docId: JournalId }) => {
  const { setGuiSelection } = useContext(guiSelectionContext);
  const { locationSelection } = useContext(locationSelectionContext);

  const form = useForm({
    initialValues: {
      location: "",
      description: "",
    },
    validate: {
      location: (value) => (value.trim().length === 0 ? "Select Location" : null),
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null),
    },
  });
  const mutate = useMutate( docId );
  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => {
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        const locationid = locationSelection;
        mutate({ tag: "CreateRobot", id, locationid, description })
          .then(() => {
            form.reset();
            setGuiSelection(id);
            form.setValues( { description: "" } );
          })
          .catch(( err ) => {
            form.setFieldError('description', String(err));
            console.error("Failed to create robot", err);
            form.setValues( { description: "" } );
          });
      },
      [locationSelection, mutate, form, setGuiSelection]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="xs" onClick={() => setGuiSelection("no selection")}>
        <Select
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          allowDeselect
          placeholder="Location"
          data={["Warehouse"]}
          {...form.getInputProps("location")}
        />
        { locationSelection == "no selection" ?
          <TextInput
            style={{ flex: 1 }}
            styles={{ input: { fontSize: "16px" } }}
            required
            
            disabled
            placeholder="Desc"
            {...form.getInputProps("description")}
          />
        : 
          <TextInput
            style={{ flex: 1 }}
            styles={{ input: { fontSize: "16px" } }}
            required
            placeholder="Desc"
            {...form.getInputProps("description")}
          />
        }
        <Button color="gray" type="submit">Add</Button>
      </Flex>
    </form>
  );
};