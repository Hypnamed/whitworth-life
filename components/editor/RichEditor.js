"use client";
import { useEffect } from "react";

export default function RichEditor({ initialContent, onChange }) {
  useEffect(() => {
    if (!initialContent && onChange) {
      onChange({ type: "doc", content: [] });
    }
  }, [initialContent, onChange]);

  return (
    <textarea
      className="w-full min-h-40 border rounded-xl p-3"
      placeholder="Event details…"
      onChange={(e) =>
        onChange?.({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [{ type: "text", text: e.target.value }],
            },
          ],
        })
      }
      defaultValue=""
    />
  );
}
