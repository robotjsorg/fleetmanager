import { useCallback, useContext } from "react"

// import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Button, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"

import { v4 as uuidv4 } from "uuid"

import { useMutate } from "../doctype"

import { RobotContext } from "../context/robotContext"
import { locSelectionContext } from "../context/locSelectionContext"

export const LocationForm = ({
  // docId
}: {
  // docId: JournalId
}) => {
  const { locations } = useContext( RobotContext )
  const { setLocationSelection } = useContext( locSelectionContext )

  const form = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null),
    },
  })
  // const mutate = useMutate( docId )
  // TODO: How to create a location without sqlsync mutation?
  const handleSubmit = form.onSubmit(
    // useCallback(
    //   ({ description }) => {
    //     const locationDescriptions = locations.map(( location )=>( location.description ))
    //     if (locationDescriptions.includes(description)) {
    //       form.setFieldError("description", "Duplicate location description")
    //     } else {
    //       const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
    //       mutate({ tag: "CreateLocation", id, description })
    //         .then(() => {
    //           setLocationSelection( id )
    //           form.reset()
    //         })
    //         .catch((err) => {
    //           form.setFieldError("description", String(err))
    //           console.error("Failed to create location", err)
    //         })
    //       setLocationSelection( id )
    //     }
    //   }, [locations, form, mutate, setLocationSelection]
    // )
  )

  return (
    <form onSubmit={handleSubmit}>
      <Group gap="xs" align="flex-end">
        <TextInput
          label="New Location"
          description="Name"
          placeholder="Name the new location"
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          {...form.getInputProps("description")}
        />
        <Button variant="default" type="submit">Create</Button>
      </Group>
    </form>
  )
}