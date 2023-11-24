import { Text, Divider, Group } from "@mantine/core";

export const FMWidgetError = () => {
  return (
    <>
      <Divider mx="xs" />
      <Group gap={0} p="xs">
        <Text size="xs" truncate="end">
          <Text span c="red" inherit>message: </Text>
          Robot error text placeholder.
        </Text>
      </Group>
    </>
  );
};