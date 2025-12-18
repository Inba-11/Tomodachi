import { useEffect, useState } from "react";

type FeedTab = "hot" | "new" | "top" | "rising";

interface FeedState {
  tab: FeedTab;
  scrollY: number;
}

const STORAGE_KEY = "tomodachi_feed_state";

const defaultState: FeedState = {
  tab: "hot",
  scrollY: 0,
};

export const useFeedState = () => {
  const [state, setState] = useState<FeedState>(defaultState);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<FeedState>;
        setState({ ...defaultState, ...parsed });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setTab = (tab: FeedTab) => setState((prev) => ({ ...prev, tab }));
  const setScrollY = (scrollY: number) =>
    setState((prev) => ({ ...prev, scrollY }));

  return { state, setTab, setScrollY };
};


