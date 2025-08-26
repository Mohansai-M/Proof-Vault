import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function WalletConnector({ setWallet }) {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        const acc = accounts[0] || null;
        setAccount(acc);
        setWallet(acc);
      });
    }
  }, [setWallet]);

  const connectWallet = async () => {
    if (!window.ethereum) return alert("Install MetaMask to continue!");
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const acc = accounts[0];
    setAccount(acc);
    setWallet(acc);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative overflow-hidden   bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 border border-emerald-400/20 shadow-lg shadow-emerald-500/20 rounded-2xl p-4 text-white rounded-2xl shadow-xl p-6 max-w-md mx-auto mb-6"
    >
      {/* Decorative glow */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">
        <h2 className="text-2xl font-extrabold mb-3 flex items-center gap-2">
          🔗 Connect Wallet
        </h2>
        <p className="mb-5 text-sm text-white/90 leading-relaxed">
          Connect your Ethereum wallet to upload and verify certificates
          securely on the blockchain.
        </p>

        {account ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative overflow-hidden bg-gradient-to-br 
               from-emerald-500/30 via-teal-500/30 to-cyan-500/30 
               border border-emerald-400/20 
               shadow-lg shadow-emerald-500/20 
               rounded-2xl p-4 text-white text-sm font-medium
               max-w-md mx-auto mb-6"
          >
            {/* Decorative glow overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-2xl pointer-events-none" />
            <div className="relative flex items-center gap-2">
              ✅ Connected:{" "}
              <span className="font-mono">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.button
            onClick={connectWallet}
            className="relative w-full py-3 rounded-2xl font-semibold text-white shadow-lg 
                 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400
                 hover:shadow-emerald-500/50
               backdrop-blur-md bg-opacity-90"
            whileHover={{
              scale: 1.08,
              boxShadow: "0px 0px 25px rgba(16, 185, 129, 0.8)", // emerald glow
            }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <span className="relative z-10">🔗 Connect MetaMask</span>
            {/* Glassy overlay for depth */}
            <span className="absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
