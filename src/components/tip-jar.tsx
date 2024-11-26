import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
  SystemProgram,
} from "@solana/web3.js";
import { Coffee } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const RECIPIENT_ADDRESS = "7PFMLp3fxFuzVG5ZhJKiJ2aW7tTq86KfWpigieZu76uQ";

export function TipJar() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, disconnect } = useWallet();
  const [amount, setAmount] = useState("0.1");
  const { toast } = useToast();

  const handleSendTip = async () => {
    if (!publicKey) return;

    try {
      const recipientPubKey = new PublicKey(RECIPIENT_ADDRESS);
      const lamports = parseFloat(amount) * LAMPORTS_PER_SOL;

      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: recipientPubKey,
          lamports,
        })
      );

      const signature = await sendTransaction(transaction, connection);
      await connection.confirmTransaction(signature, "confirmed");

      toast({
        title: "Thank you!",
        description: `Tip of ${amount} SOL sent successfully!`,
      });
    } catch (error) {
      console.log("🚀 ~ handleSendTip ~ error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send tip. Please try again.",
      });
    }
  };

  const disconnectWallet = () => {
    setAmount("0");

    disconnect();
  };

  return (
    <Card className="w-full max-w-md p-6 space-y-6">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Coffee className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-center">Support My Work</h2>
        <p className="text-center text-muted-foreground">
          If you enjoy my content, consider buying me a coffee with SOL!
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Amount (SOL)</Label>
          <Input
            id="amount"
            type="number"
            step="0.1"
            min="0.1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        {publicKey ? (
          <Button
            className="w-full"
            size="lg"
            onClick={handleSendTip}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            Send {amount} SOL
          </Button>
        ) : (
          <WalletMultiButton className="w-full !bg-primary hover:!bg-primary/90 !h-11" />
        )}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        Connected: {publicKey?.toBase58().slice(0, 8)}...
      </div>

      {publicKey && (
        <Button
          className="w-full !bg-danger hover:!bg-danger/90 !h-11"
          onClick={disconnectWallet}
        >
          Disconnect my wallet
        </Button>
      )}
    </Card>
  );
}
