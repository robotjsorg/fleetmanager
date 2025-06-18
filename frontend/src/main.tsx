import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { RouterProvider, createBrowserRouter, redirect, useParams } from "react-router-dom"

import workerUrl from "@orbitinghail/sqlsync-worker/worker.js?url"
import sqlSyncWasmUrl from "@orbitinghail/sqlsync-worker/sqlsync.wasm?url"

import { journalIdFromString, journalIdToString } from "@orbitinghail/sqlsync-worker"
import { SQLSyncProvider } from "@orbitinghail/sqlsync-react"

import "@mantine/core/styles.css"
import "@mantine/code-highlight/styles.css"

import { App } from "./App"

enum DbConfig {
    Default = "off",      // default is off
    Browser = "browser",  // react in browser
    Local = "local",      // sqlsync on local machine
    Remote = "remote"     // sqlsync on cloudflare
}

const dbConfig = DbConfig.Default

export const DocRoute = (dbConfig: DbConfig) => {
  if (dbConfig === DbConfig.Default) {
    return (
      <App />
    )
  } else if (dbConfig === DbConfig.Browser) {

  } else if (dbConfig === DbConfig.Local) {

  } else if (dbConfig === DbConfig.Remote) {
    const isLocalhost = location.hostname === "localhost" || location.hostname.startsWith("192.168")

    const COORDINATOR_URL = isLocalhost
      ? `${location.hostname}:8787`
      : "api.robotjs.org"
    const COORDINATOR_URL_WS = (isLocalhost ? "ws" : "wss") + "://" + COORDINATOR_URL

    const newDocumentId = async (name = "") => {
      let url = `${location.protocol}//${COORDINATOR_URL}/new`
      if (name.trim().length > 0) {
        url += "/" + encodeURIComponent(name)
      }
      const response = await fetch(url, {
        method: "POST",
      })
      return journalIdFromString(await response.text())
    }
    const { docId } = useParams()
    if (!docId) {
      console.error("doc id not found in params")
      return (
        <pre style={{ color: "red" }}>ERROR: doc id not found in params</pre>
      )
    } else {
      <App docId={journalIdFromString( docId )} />
    }
  } else {
    console.error("Invalid dbConfig")
    return (
      <pre style={{ color: "red" }}>ERROR: Invalid dbConfig</pre>
    )
  }
}

const router =  if (dbConfig === DbConfig.Default) {
    createBrowserRouter([
    {
      path: "/*",
      loader: async () => {
        return redirect("/")
      }
    },
    {
      path: "/",
      element: <DocRoute />
    }
  ]
  } else if (dbConfig === DbConfig.Browser) {

  } else if (dbConfig === DbConfig.Local) {

  } else if (dbConfig === DbConfig.Remote) {
    createBrowserRouter([
      {
        path: "/",
        loader: async () => {
          const docId = await newDocumentId()
          return redirect("/" + journalIdToString( docId ))
        }
        element: <DocRoute />
      },
      {
        path: "/named/:name",
        loader: async ({ params }) => {
          const docId = await newDocumentId(params.name)
          return redirect("/" + journalIdToString( docId ))
        }
      },
  {
    path: "/:docId",
    element: <DocRoute />
  }
])

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/*<SQLSyncProvider wasmUrl={sqlSyncWasmUrl} workerUrl={workerUrl} coordinatorUrl={COORDINATOR_URL_WS}>*/}
      <RouterProvider router={router} />
    {/*</SQLSyncProvider>*/}
  </StrictMode>
)