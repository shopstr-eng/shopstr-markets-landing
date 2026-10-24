import { createRoot, hydrateRoot } from "react-dom/client";
import App, { identifierPrefix } from "./App";
import { loadPage, resolveRoute } from "./routes";
import "./index.css";

async function start() {
  const root = document.getElementById("root");
  if (!root) throw new Error("Missing application root");
  const route = resolveRoute(window.location.pathname);
  const { default: Page } = await loadPage(route?.page ?? "not-found");
  const app = <App Page={Page} />;
  if (root.hasChildNodes()) {
    hydrateRoot(root, app, { identifierPrefix });
  } else {
    createRoot(root, { identifierPrefix }).render(app);
  }
}

start().catch((error: unknown) =>
  console.error("Unable to load this page", error),
);
