/* eslint-disable @typescript-eslint/no-unsafe-return */
import { InlineCodeHighlight } from "@mantine/code-highlight";
import { Alert, Center, Code, Flex, ScrollArea, Title, Text } from "@mantine/core";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { IconAlertCircle } from "@tabler/icons-react";
import { useContext, useMemo } from "react";
import { useQuery } from "../doctype";
import { selectionContext } from "../context/selectionContext";

interface Props {
  docId: JournalId;
}

export const QueryViewerInner = ({ docId }: Props) => {
  const { selection } = useContext(selectionContext);

  const inputValue = ("select description, created_at, locationid from robots where id is '" + selection + "'");
  const result = useQuery(docId, inputValue);

  const rowsJson = useMemo(() => {
    return JSON.stringify(
      result.rows ?? [],
      (_, value) => {
        if (typeof value === "bigint") {
          return value.toString();
        }
        return value;
      },
      2
    );
  }, [result.rows]);

  let output;
  if (result.state === "error") {
    output = (
      <Alert color="red" variant="light" title="SQL Error" icon={<IconAlertCircle />} p="sm">
        <Code color="transparent">{result.error.message}</Code>
      </Alert>
    );
  } else {
    output = <InlineCodeHighlight code={rowsJson} language="json" />;
  }

  return (
    <>
      <Text size="xs">
        {selection}
      </Text>
      {output}
    </>
  );
};

export const Selection = (props: Props) => {
  return (
    <>
      <Flex>
        <Center component={Title} order={5}>
          Selection
        </Center>
      </Flex>
      <ScrollArea type="auto">
        <QueryViewerInner {...props} />
      </ScrollArea>
    </>
  );
};
