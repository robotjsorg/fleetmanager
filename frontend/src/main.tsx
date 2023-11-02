import { DocumentProvider, JournalId, SqlSyncProvider } from "@orbitinghail/sqlsync-react/sqlsync-react.tsx";
import { RouterProvider, createBrowserRouter, redirect, useParams } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// HACK: switch to the .ts version for nicer local dev
// import workerUrl from "@orbitinghail/sqlsync-worker/worker.ts?url";
import workerUrl from "@orbitinghail/sqlsync-worker/worker.js?url";
import sqlSyncWasmUrl from "@orbitinghail/sqlsync-worker/sqlsync.wasm?url";

import { Mutation } from "./@types/mutation";
import App from "./App";
import "./index.css";

const DEMO_REDUCER_URL = new URL(
  "../../../target/wasm32-unknown-unknown/release/demo_reducer.wasm",
  import.meta.url
);

const COORDINATOR_URL = "localhost:8787";
// const COORDINATOR_URL = "api.robotjs.org";

const newDocument = async (name = "") => {
  let url = `${location.protocol}//${COORDINATOR_URL}/new`;
  if (name.trim().length > 0) {
    url += "/" + encodeURIComponent(name);
  }
  const response = await fetch(url, {
    method: "POST"
  });
  return (await response.text()) as JournalId;
};

const DocRoute = () => {
  const { docId } = useParams();

  if (!docId) {
    console.error("doc id not found in params");
  }

  return (
    <DocumentProvider<Mutation>
      docId={docId as JournalId}
      reducerUrl={DEMO_REDUCER_URL}
      initMutation={{ tag: "InitSchema" }}
    >
      <App />
    </DocumentProvider>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    loader: async () => {
      const docId = await newDocument();
      return redirect("/" + docId);
    },
  },
  {
    path: "/named/:name",
    loader: async ({ params }) => {
      const docId = await newDocument(params.name);
      return redirect("/" + docId);
    },
  },
  {
    path: "/:docId",
    element: <DocRoute />
  }
]);

const root = createRoot(document.getElementById("root")!);
root.render(
  <StrictMode>
    <SqlSyncProvider
      config={{ workerUrl, sqlSyncWasmUrl, coordinatorUrl: COORDINATOR_URL }}
    >
      <RouterProvider router={router} />
    </SqlSyncProvider>
  </StrictMode>
);