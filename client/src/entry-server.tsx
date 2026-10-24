import { renderToString } from "react-dom/server";
import App, { identifierPrefix } from "./App";
import { loadPage, resolveRoute } from "./routes";

export { routes, pageSource } from "./routes";

export async function renderRoute(pathname: string) {
  const route = resolveRoute(pathname);
  if (!route) throw new Error(`No public route for ${pathname}`);
  const { default: Page } = await loadPage(route.page);
  return {
    route,
    html: renderToString(<App Page={Page} />, { identifierPrefix }),
  };
}
