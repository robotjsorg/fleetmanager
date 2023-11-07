/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useContext, useMemo } from "react";

import { JournalId } from "@orbitinghail/sqlsync-worker";
import { InlineCodeHighlight } from "@mantine/code-highlight";
import { Alert, Center, Code, Flex, ScrollArea, Title, Text } from "@mantine/core";

import { IconAlertCircle } from "@tabler/icons-react";

import { useQuery } from "../doctype";

import { guiSelectionContext } from "../context/guiSelectionContext";

export const SelectionView = ({docId}: {docId: JournalId}) => {
  const { guiSelection } = useContext(guiSelectionContext);
  const inputValue = ("SELECT description, created_at, locationid FROM robots WHERE id IS '" + guiSelection + "'");
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
      <Flex>
        <Center component={Title} order={5}>
          Selection
        </Center>
      </Flex>
      <ScrollArea type="auto">
        <Text size="xs">
          {guiSelection}
        </Text>
        {output}
      </ScrollArea>
    </>
  );
};
