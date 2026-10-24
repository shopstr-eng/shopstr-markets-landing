import { createRoot, hydrateRoot } from "react-dom/client";
import App, { identifierPrefix } from "./App";
import { loadPage, resolveRoute, routes } from "./routes";
import "./index.css";

async function start() {
  const root = document.getElementById("root");
  if (!root) throw new Error("Missing application root");
  const prerendered = root.hasChildNodes();
  const route = prerendered
    ? routes.find(({ path }) => path === root.dataset.route)
    : resolveRoute(window.location.pathname);
  if (prerendered && !route)
    throw new Error("Invalid prerendered route identity");
  const { default: Page } = await loadPage(route?.page ?? "not-found");
  const app = <App Page={Page} />;
  if (prerendered) {
    hydrateRoot(root, app, { identifierPrefix });
  } else {
    createRoot(root, { identifierPrefix }).render(app);
  }
}

start().catch((error: unknown) =>
  console.error("Unable to load this page", error),
);
