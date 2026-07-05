"use client";

import { useState } from "react";
import { Sparkles, Copy, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { assistantService, ASSISTANT_ACTIONS, type AssistantActionType } from "@/services/ai/assistantService";

/** Available throughout the CRM (mounted once in the layout) — mock responses only, see assistantService.ts. */
export function AgentAssistantDock() {
  const [open, setOpen] = useState(false);
  const [actionType, setActionType] = useState<AssistantActionType>("listing_description");
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const activeAction = ASSISTANT_ACTIONS.find((a) => a.value === actionType)!;

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);
    const output = await assistantService.generate(actionType, input);
    setResult(output);
    setLoading(false);
  };

  const handleCopy = async () => {
    if (!result) return;
    await navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard");
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className="fixed z-40 bottom-24 md:bottom-6 right-6 w-12 h-12 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white flex items-center justify-center shadow-[0_8px_30px_var(--accent-glow-strong)] transition-all duration-200 focus-ring"
      >
        <Sparkles size={20} />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-[var(--card)] border-[var(--border)] flex flex-col p-0">
          <SheetHeader className="p-5 border-b border-[var(--border)]">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[var(--accent)] flex items-center justify-center flex-shrink-0">
                <Sparkles size={13} className="text-white" />
              </div>
              <SheetTitle className="text-[var(--text-primary)]">nowe.ai Assistant</SheetTitle>
            </div>
            <SheetDescription className="text-[var(--text-muted)]">
              AI-assisted drafting for your CRM workflow — mock responses in this phase.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-faint)] mb-2">
                What do you need?
              </p>
              <div className="flex flex-wrap gap-1.5">
                {ASSISTANT_ACTIONS.map((action) => (
                  <button
                    key={action.value}
                    type="button"
                    onClick={() => {
                      setActionType(action.value);
                      setResult(null);
                    }}
                    className={cn(
                      "text-xs font-medium px-3 py-1.5 rounded-full border transition-colors",
                      actionType === action.value
                        ? "bg-[var(--accent)] border-[var(--accent)] text-white"
                        : "bg-[var(--surface)] border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    )}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1.5">Context</label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={activeAction.placeholder}
                rows={3}
                className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-xl px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-faint)] outline-none focus:border-[var(--accent)] transition-colors resize-none"
              />
            </div>

            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 text-sm font-medium bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl transition-colors focus-ring"
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {loading ? "Generating..." : "Generate"}
            </button>

            {result && (
              <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-faint)]">
                    Result
                  </p>
                  <button
                    type="button"
                    onClick={handleCopy}
                    aria-label="Copy result"
                    className="text-[var(--text-faint)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <Copy size={13} />
                  </button>
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
                  {result}
                </p>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
