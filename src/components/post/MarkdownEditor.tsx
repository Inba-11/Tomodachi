import { useState } from "react";
import DOMPurify from "dompurify";
import { marked } from "marked";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const renderMarkdown = (source: string): string => {
  const withSpoilers = source.replace(
    />!(.+?)!</g,
    (_, inner: string) =>
      `<span class="spoiler-inline">${inner}</span>`
  );

  const html = marked.parse(withSpoilers, {
    async: false, // 👈 force sync
  }) as string;

  return DOMPurify.sanitize(html);
};

export function MarkdownEditor({
  value,
  onChange,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div className="space-y-2">
      <div className="flex gap-2 text-xs">
        <button
          type="button"
          className={`px-2 py-1 rounded ${
            tab === "write"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setTab("write")}
        >
          Write
        </button>

        <button
          type="button"
          className={`px-2 py-1 rounded ${
            tab === "preview"
              ? "bg-secondary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setTab("preview")}
        >
          Preview
        </button>
      </div>

      {tab === "write" ? (
        <textarea
          className="w-full min-h-[160px] rounded border bg-background p-3 text-sm"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your post in markdown. Use >!spoiler!< for inline spoilers."
        />
      ) : (
        <div className="min-h-[160px] rounded border bg-card p-3 text-sm prose prose-invert max-w-none">
          <div
            dangerouslySetInnerHTML={{
              __html: renderMarkdown(value),
            }}
          />
        </div>
      )}
    </div>
  );
}
