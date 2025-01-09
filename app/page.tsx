import { Sidebar } from '@/components/sidebar';
import { Chat } from '@/components/chat';
import { WalletPanel } from '@/components/wallet';
import { Toaster } from '@/components/ui/toaster';
export default function Home() {
  return (
    <main className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <Chat />
      <WalletPanel />
      <Toaster />
    </main>
  );
}
