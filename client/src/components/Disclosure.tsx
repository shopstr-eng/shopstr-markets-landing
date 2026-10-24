import type { ReactNode } from "react";
import { Plus, Minus } from "lucide-react";

export default function Disclosure({
  title,
  children,
  open = false,
  level = 2,
}: {
  title: string;
  children: ReactNode;
  open?: boolean;
  level?: 2 | 3;
}) {
  const Heading = level === 3 ? "h3" : "h2";
  return (
    <details
      open={open}
      className="group rounded-xl border-2 border-black bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] open:bg-purple-50 open:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
    >
      <summary className="cursor-pointer list-none p-6 text-left [&::-webkit-details-marker]:hidden">
        <Heading className="flex items-center justify-between text-lg font-bold text-foreground group-open:text-purple-900">
          <span className="pr-8">{title}</span>
          <span
            aria-hidden="true"
            className="shrink-0 rounded-lg border-2 border-black p-1 group-open:bg-purple-600 group-open:text-white"
          >
            <Plus className="h-4 w-4 group-open:hidden" />
            <Minus className="hidden h-4 w-4 group-open:block" />
          </span>
        </Heading>
      </summary>
      <div className="px-6 pb-6 text-gray-600 leading-relaxed font-medium">
        {children}
      </div>
    </details>
  );
}
