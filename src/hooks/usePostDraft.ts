import { useEffect, useRef, useState } from "react";

type PostType = "text" | "image" | "video" | "audio";

interface PostDraft {
  title: string;
  content: string;
  postType: PostType;
  communityId: string | null;
}

const STORAGE_KEY = "tomodachi_post_draft";

const defaultDraft: PostDraft = {
  title: "",
  content: "",
  postType: "text",
  communityId: null,
};

export const usePostDraft = () => {
  const [draft, setDraft] = useState<PostDraft>(defaultDraft);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<PostDraft>;
        setDraft({ ...defaultDraft, ...parsed });
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {
        // ignore
      }
    }, 3000);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
    };
  }, [draft]);

  const updateField = <K extends keyof PostDraft>(key: K, value: PostDraft[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const clearDraft = () => {
    setDraft(defaultDraft);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { draft, updateField, clearDraft };
};


