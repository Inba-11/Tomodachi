import React from "react";
import type { PostMood } from "@/types";

interface MoodFilterProps {
  value: PostMood;
  onChange: (mood: PostMood) => void;
}

const moods: { id: PostMood; label: string }[] = [
  { id: "hype", label: "🔥 Hype" },
  { id: "emotional", label: "😭 Emotional" },
  { id: "plot_twist", label: "🤯 Plot Twist" },
  { id: "dark", label: "💀 Dark" },
];

export const MoodFilter: React.FC<MoodFilterProps> = ({ value, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`px-3 py-1 rounded-full text-xs ${
          value === null
            ? "bg-accent-primary text-foreground"
            : "bg-secondary text-muted-foreground"
        }`}
        onClick={() => onChange(null)}
      >
        All moods
      </button>
      {moods.map((mood) => (
        <button
          key={mood.id}
          type="button"
          className={`px-3 py-1 rounded-full text-xs ${
            value === mood.id
              ? "bg-accent-primary text-foreground"
              : "bg-secondary text-muted-foreground"
          }`}
          onClick={() => onChange(mood.id)}
        >
          {mood.label}
        </button>
      ))}
    </div>
  );
};


