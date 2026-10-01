import { createStaticApp } from "./static-app.mjs";

const app = createStaticApp();
const server = app.listen(5000, "0.0.0.0", () => {
  console.log("Shopstr Markets static export server listening on port 5000");
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}
process.once("SIGTERM", shutdown);
process.once("SIGINT", shutdown);
