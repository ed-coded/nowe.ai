"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { MessageSquare, Loader2 } from "lucide-react";
import { getOrCreateConversation } from "@/services/messaging/conversationService";

export function MessageAgentButton({ agentId, propertyId }: { agentId: string; propertyId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const conversationId = await getOrCreateConversation(agentId, propertyId);
      router.push(`/dashboard/messages?tab=agents&conversation=${conversationId}`);
    } catch {
      toast.error("Couldn't start a conversation with this agent");
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] disabled:opacity-60 transition-colors py-2"
    >
      {loading ? <Loader2 size={14} className="animate-spin" /> : <MessageSquare size={14} />}
      {loading ? "Starting conversation..." : "Message agent"}
    </button>
  );
}
