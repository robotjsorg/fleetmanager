import { CodeHighlight } from "@mantine/code-highlight";
import { Alert, Center, Code, Flex, Paper, ScrollArea, Stack, Title, Text } from "@mantine/core"; //, Button, Collapse
import { useViewportSize } from '@mantine/hooks'; // , useDisclosure
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { IconAlertCircle } from "@tabler/icons-react"; //, IconCaretDownFilled, IconCaretRightFilled
import { useContext, useMemo } from "react";
import { useQuery } from "../doctype";
import selectionContext from "../context/selectionContext";

interface Props {
  docId: JournalId;
}

export const QueryViewerInner = ({ docId }: Props) => {
  const { selection } = useContext(selectionContext);

  const inputValue = ("select description, created_at from robots where id is '" + selection + "'");
  const result = useQuery(docId, inputValue);

  const rowsJson = useMemo(() => {
    return JSON.stringify(
      result.rows ?? [],
      (_, value) => {
        // handle bigint values
        if (typeof value === "bigint") {
          return value.toString();
        }
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
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
    output = <CodeHighlight code={rowsJson} language="json" withCopyButton={false} />;
  }

  return (
    <>
      <Text size="xs">
        {selection}
      </Text>
      {/* <Textarea
        mb="sm"
        autosize
        description="Run any SQL query. Available tables: tasks"
        value={inputValue}
        styles={{ input: { fontFamily: "monospace" } }}
        onChange={(e) => setInputValue(e.currentTarget.value)}
      /> */}
      {output}
    </>
  );
};

export const Selection = (props: Props) => {
  // const [visible, { toggle }] = useDisclosure();
  // const icon = visible ? <IconCaretDownFilled /> : <IconCaretRightFilled />;
  const { height } = useViewportSize();

  return (
    <Paper component={Stack} shadow="xs" p="xs" h={(height-80)/3-20}>
      <Flex>
        <Center component={Title} order={5}>
          Selection
        </Center>
      </Flex>
      {/* <Button
        variant="subtle"
        fullWidth
        leftSection={icon}
        size="compact-md"
        styles={{ inner: { justifyContent: "left" } }}
        onClick={toggle}
        mb="sm"
      >
        Query Viewer
      </Button> */}
      {/* <Collapse in={visible}> */}
      <ScrollArea type="auto">
        <QueryViewerInner {...props} />
      </ScrollArea>
      {/* </Collapse> */}
    </Paper>
  );
};
