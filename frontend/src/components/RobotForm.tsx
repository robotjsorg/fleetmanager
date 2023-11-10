import { useCallback, useContext } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";

import { v4 as uuidv4 } from "uuid";

import { useMutate } from "../doctype";

import { RobotContext } from "../context/robotContext";
import { guiSelectionContext } from "../context/guiSelectionContext";
import { locSelectionContext } from "../context/locSelectionContext";

export const RobotForm = ({ docId }: { docId: JournalId }) => {
  const { setGuiSelection } = useContext( guiSelectionContext );
  const { locSelection } = useContext( locSelectionContext );
  const { robots } = useContext( RobotContext );

  const form = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null)
    },
  });
  const mutate = useMutate( docId );
  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => {
        const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ));
        const robotDescriptions = filteredRobots.map(( robot ) => ( robot.description ));
        if (robotDescriptions.includes(description)) {
          form.setFieldError('description', "Duplicate robot description");
        } else {
          const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
          mutate({ tag: "CreateRobot", id, locationid: locSelection, description })
            .then(() => {
              setGuiSelection(id);
              form.reset();
            })
            .catch(( err ) => {
              form.setFieldError('description', String(err));
              console.error("Failed to create robot", err);
              form.setValues( { description: "" } );
            });
        }
      }, [robots, locSelection, form, mutate, setGuiSelection]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Group align="flex-end" gap="xs" onClick={() => setGuiSelection("no selection")}>
        <TextInput
          label="New Robot"
          description="Description"
          placeholder="New robot description"
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          {...form.getInputProps("description")}
        />
        <Button color="gray" type="submit">Add</Button>
      </Group>
    </form>
  );
};