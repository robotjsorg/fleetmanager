import { Button, Flex, TextInput } from "@mantine/core"; // , Select
import { useForm } from "@mantine/form";
import { useCallback, useContext } from "react";
import { Mutation } from "../doctype";
import { v4 as uuidv4 } from "uuid";
import { selectionContext } from "../context/selectionContext";
import { ILocation } from "../@types/location";

interface RobotFormProps {
  mutate: (m: Mutation) => Promise<void>;
  location: ILocation | null;
}

export const RobotForm = (props: RobotFormProps) => {
  const { setSelection } = useContext(selectionContext);

  const form = useForm({
    initialValues: {
      // type: "",
      description: "",
    },
    validate: {
      // type: (value) => (value.trim().length === 0 ? "Select Type" : null),
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null),
    },
  });

  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => { // type,
        const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        const locationid = props.location ? props.location.id : crypto.randomUUID ? crypto.randomUUID() : uuidv4();
        props.mutate({ tag: "CreateRobot", id, locationid, description })
          .then(() => {
            form.reset();
            setSelection(id);
          })
          .catch((err) => {
            console.error("Failed to create robot", err);
          });
      },
      [props, form, setSelection]
    )
  );

  return (
    <form onSubmit={handleSubmit}>
      <Flex gap="xs" onClick={() => setSelection("no selection")}>
        {/* <Select
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          required
          allowDeselect
          placeholder="Type"
          data={['ABB IRB 52']}
          {...form.getInputProps("type")}
        /> */}
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