import { AssistantThread } from "@/features/ai/AssistantThread";

interface DashboardPageProps {
  searchParams: Promise<{ chat?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { chat } = await searchParams;
  return <AssistantThread initialChatId={chat} />;
}
