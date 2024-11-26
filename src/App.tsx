import { TipJar } from '@/components/tip-jar';
import { WalletProvider } from '@/components/wallet-provider';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <WalletProvider>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
        <TipJar />
      </div>
      <Toaster />
    </WalletProvider>
  );
}

export default App;