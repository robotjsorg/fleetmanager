import { useCallback } from "react";

import { useConnectionStatus } from "@orbitinghail/sqlsync-react";
import { JournalId } from "@orbitinghail/sqlsync-worker";
import { Button } from "@mantine/core";

import { IconWifi, IconWifiOff } from "@tabler/icons-react";

import { useSetConnectionEnabled } from "../doctype";

export const ConnectionStatus = ({ docId }: { docId: JournalId }) => {
  const status = useConnectionStatus();
  const setConnectionEnabled = useSetConnectionEnabled( docId );

  const handleClick = useCallback(() => {
    if (status === "disabled") {
      setConnectionEnabled(true).catch((err) => {
        console.error("Failed to enable connection", err);
      });
    } else {
      setConnectionEnabled(false).catch((err) => {
        console.error("Failed to disable connection", err);
      });
    }
  }, [status, setConnectionEnabled]);

  let color, icon, loading;
  switch (status) {
    case "disabled":
      color = "gray";
      icon = <IconWifiOff size={18} />;
      break;
    case "disconnected":
      color = "gray";
      icon = <IconWifiOff size={18} />;
      break;
    case "connecting":
      color = "yellow";
      loading = true;
      break;
    case "connected":
      color = "green";
      icon = <IconWifi size={18} />;
      break;
  }

  return (
    <Button
      variant="light"
      color={color}
      // rightSection={icon}
      loading={loading}
      onClick={handleClick}
    >
      {icon}
    </Button>
  );
};
