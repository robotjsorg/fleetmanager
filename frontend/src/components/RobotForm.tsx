import { useCallback, useContext } from "react"

import { JournalId } from "@orbitinghail/sqlsync-worker"
import { Button, Group, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"

import { v4 as uuidv4 } from "uuid"

import { useMutate } from "../doctype"

import { RobotContext } from "../context/robotContext"
import { guiSelectionContext } from "../context/guiSelectionContext"
import { locSelectionContext } from "../context/locSelectionContext"

const randomPosition = () => {
  const x = 4 * (Math.random() - 0.5)
  const z = 2 * (Math.random() - 0.5) + 1
  return [x, -0.02, z]
}
const zeroRotation = () => {
  return [-Math.PI/2, 0, -Math.PI/4]
}

export const RobotForm = ({
  docId
}: {
  docId: JournalId
}) => {
  const { robots } = useContext( RobotContext )
  const { locSelection } = useContext( locSelectionContext )
  const { setGuiSelection } = useContext( guiSelectionContext )
  
  const form = useForm({
    initialValues: {
      description: ""
    },
    validate: {
      description: (value) => (value.trim().length === 0 ? "Enter Description" : null)
    },
  })
  const mutate = useMutate( docId )
  const handleSubmit = form.onSubmit(
    useCallback(
      ({ description }) => {
        if ( locSelection == "no selection" ) {
          form.setFieldError("description", "No Locations exist")
        } else {
          const filteredRobots = robots.filter(( robot ) => ( robot.locationid == locSelection ))
          const robotDescriptions = filteredRobots.map(( robot ) => ( robot.description ))
          if (robotDescriptions.includes(description)) {
            form.setFieldError("description", "Duplicate robot description")
          } else {
            const id = crypto.randomUUID ? crypto.randomUUID() : uuidv4()
            const position = randomPosition()
            const rotation = zeroRotation()
            mutate({ tag: "CreateRobot", id, locationid: locSelection, description, x: position[0], z: position[2], theta: rotation[2] })
              .then(() => {
                setGuiSelection(id)
                form.reset()
              })
              .catch(( err ) => {
                form.setFieldError("description", String(err))
                console.error("Failed to create robot", err)
                form.setValues( { description: "" } )
              })
          }
        }
      }, [robots, locSelection, form, mutate, setGuiSelection]
    )
  )

  return (
    <form onSubmit={handleSubmit}>
      <Group align="flex-end" gap="xs" onClick={() => setGuiSelection("no selection")}>
        <TextInput
          label="New Robot"
          description="Name"
          placeholder="Name the new robot"
          style={{ flex: 1 }}
          styles={{ input: { fontSize: "16px" } }}
          {...form.getInputProps("description")}
        />
        <Button variant="default" type="submit">Add</Button>
      </Group>
    </form>
  )
}