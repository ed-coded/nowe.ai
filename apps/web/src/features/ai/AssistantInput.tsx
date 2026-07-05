"use client";

import { useState } from "react";
import { Search, Mic, ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoiceInput } from "./useVoiceInput";

interface AssistantInputProps {
  onSubmit: (query: string) => void;
  loading?: boolean;
  variant?: "large" | "compact";
  placeholder?: string;
  autoFocus?: boolean;
}

export function AssistantInput({
  onSubmit,
  loading = false,
  variant = "large",
  placeholder = "Describe your ideal home, or ask a follow-up question...",
  autoFocus = false,
}: AssistantInputProps) {
  const [value, setValue] = useState("");

  const { isSupported: voiceSupported, isListening, start, stop } = useVoiceInput({
    onResult: (transcript) => setValue((prev) => (prev ? `${prev} ${transcript}` : transcript)),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    onSubmit(value.trim());
    setValue("");
  };

  const isLarge = variant === "large";

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", isLarge ? "max-w-2xl mx-auto" : "")}>
      <div className="relative group">
        <div
          className={cn(
            "absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[var(--accent)] via-purple-500 to-indigo-500 opacity-0 group-focus-within:opacity-40 transition-opacity duration-300 blur-sm",
            !isLarge && "rounded-xl"
          )}
        />
        <div
          className={cn(
            "relative glass border border-[var(--border)] group-focus-within:border-[var(--accent)] transition-colors duration-300 overflow-hidden flex items-center",
            isLarge ? "rounded-2xl" : "rounded-xl"
          )}
        >
          <div className={cn("flex-shrink-0", isLarge ? "pl-5 pr-3" : "pl-3 pr-2")}>
            {loading ? (
              <Loader2 size={isLarge ? 20 : 16} className="text-[var(--accent)] animate-spin" />
            ) : (
              <Search
                size={isLarge ? 20 : 16}
                className="text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
              />
            )}
          </div>

          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            autoFocus={autoFocus}
            disabled={loading}
            aria-label="Ask the nowe.ai assistant"
            className={cn(
              "flex-1 bg-transparent text-[var(--text-primary)] outline-none placeholder:text-[var(--text-faint)] py-4",
              isLarge ? "text-base" : "text-sm py-3"
            )}
          />

          {voiceSupported && (
            <button
              type="button"
              onClick={isListening ? stop : start}
              aria-label={isListening ? "Stop voice input" : "Search by voice"}
              aria-pressed={isListening}
              className={cn(
                "flex-shrink-0 mr-1 rounded-lg flex items-center justify-center transition-colors",
                isLarge ? "w-9 h-9" : "w-8 h-8",
                isListening
                  ? "bg-[var(--accent)] text-white animate-pulse"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface)]"
              )}
            >
              <Mic size={isLarge ? 16 : 14} />
            </button>
          )}

          <button
            type="submit"
            disabled={loading || !value.trim()}
            aria-label="Send"
            className={cn(
              "flex-shrink-0 mr-2 rounded-xl flex items-center justify-center bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-all focus-ring",
              isLarge ? "w-10 h-10" : "w-8 h-8"
            )}
          >
            <ArrowRight size={isLarge ? 17 : 14} />
          </button>
        </div>
      </div>
    </form>
  );
}
