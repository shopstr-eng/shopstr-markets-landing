import type { ComponentType } from "react";
import { NextUIProvider } from "@nextui-org/react";

export const identifierPrefix = "shopstr-";

export default function App({ Page }: { Page: ComponentType }) {
  return (
    <NextUIProvider locale="en-US">
      <Page />
    </NextUIProvider>
  );
}
