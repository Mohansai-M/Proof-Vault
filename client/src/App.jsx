import { useState } from "react";
import Dashboard from "./components/Dashboard";
import WalletConnector from "./components/WalletConnect";
import CertificateUploader from "./components/CertificateUpload";

export default function App() {
  const [wallet, setWallet] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white font-sans p-6">
      {/* Header */}
      <header className="text-center py-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
          🧾 ProofVault
        </h1>
        <p className="mt-2 text-gray-300">Secure. Verify. Trust.</p>
      </header>

      <div className="flex flex-col lg:flex-row justify-center">

        <div className="flex flex-col w-full gap-8">
          <WalletConnector wallet={wallet} setWallet={setWallet} />
          {wallet && <CertificateUploader wallet={wallet} />}
        </div>
        
        {wallet && (
          <div className="flex flex-col w-full gap-8">
            <Dashboard wallet={wallet} />
          </div>
        )}
      </div>

      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        Built with ❤️ on Web3 | Tailwind + Vite
      </footer>
    </div>
  );
}
