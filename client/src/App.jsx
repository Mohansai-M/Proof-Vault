// src/App.jsx
import { useState } from "react";
import WalletConnector from "./components/WalletConnect";
import CertificateUploader from "./components/CertificateUpload";
import CertificateVerifier from "./components/CertificateVerifier";

export default function App() {
  const [wallet, setWallet] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 font-sans">
      {/* Header */}
      <header className="text-center py-10">
        <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
          🧾 ProofVault
        </h1>
        <p className="mt-3 text-gray-500 text-lg tracking-wide">
          Secure • Verify • Trust
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 space-y-8">
        <WalletConnector setWallet={setWallet} />
        <CertificateUploader wallet={wallet} />
        <CertificateVerifier />
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 text-center text-gray-500 text-sm">
        Built with ❤️ on Web3 | Tailwind + Vite
      </footer>
    </div>
  );
}
