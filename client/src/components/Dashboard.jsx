import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { motion } from "framer-motion";
import ProofVault from "../abi/ProofVault.json";
import { filterCertificates } from "./CertificateVerifier.jsx";
import toast from "react-hot-toast";


const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

export default function Dashboard({ wallet }) {
  const [certificates, setCertificates] = useState([]);
  const [filteredCerts, setFilteredCerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // to fetch all certificates
  async function fetchCertificates() {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ProofVault.abi,
        provider
      );
      const certs = await contract.getAllCertificates();

      const formatted = certs.map((cert) => ({
        ipfsHash: cert.ipfsHash, // fix here
        issuer: cert.issuer,
        receiver: cert.receiver,
        timestamp: new Date(Number(cert.timestamp) * 1000).toLocaleString(),
        revoked: cert.revoked,
      }));

      setCertificates(formatted);
    } catch (err) {
      console.error("Error fetching certificates:", err);
    } finally {
      setLoading(false);
    }
  }

  // revoking certificate
  async function revokeCertificate(ipfsHash) {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        ProofVault.abi,
        signer
      );

      const tx = await contract.revokeCertificate(ipfsHash);
      await tx.wait();

      toast.success("Certificate revoked!");
      fetchCertificates();
    } catch (err) {
      console.error("Error revoking:", err);
      toast.error("Failed to revoke certificate.");
    }
  }

  // filtering certificates
  useEffect(() => {
    if (!searchQuery.trim()) setFilteredCerts(certificates);
    else setFilteredCerts(filterCertificates(certificates, searchQuery));
  }, [searchQuery, certificates]);

  // Live updates of certification uploaded
  useEffect(() => {
    if (!wallet) return;

    fetchCertificates();

    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ProofVault.abi,
      provider
    );

    const uploadListener = (
      _ipfsHashBytes,
      ipfsHashString,
      issuer,
      receiver,
      timestamp
    ) => {
      const newHash =
        ipfsHashString || ethers.utils.toUtf8String(_ipfsHashBytes);

      setCertificates((prev) => {
        if (prev.some((c) => c.ipfsHash === newHash)) return prev; // prevent duplicates
        return [
          ...prev,
          {
            ipfsHash: newHash,
            issuer,
            receiver,
            timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
            revoked: false,
          },
        ];
      });
    };

    const revokeListener = (_ipfsHashBytes, ipfsHashString) => {
      const hash = ipfsHashString || ethers.utils.toUtf8String(_ipfsHashBytes);
      setCertificates((prev) =>
        prev.map((cert) =>
          cert.ipfsHash === hash ? { ...cert, revoked: true } : cert
        )
      );
    };

    // remove old listeners first
    contract.removeAllListeners("CertificateUploaded");
    contract.removeAllListeners("CertificateRevoked");

    contract.on("CertificateUploaded", uploadListener);
    contract.on("CertificateRevoked", revokeListener);

    return () => {
      contract.off("CertificateUploaded", uploadListener);
      contract.off("CertificateRevoked", revokeListener);
    };
  }, [wallet]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 border border-emerald-400/20 shadow-lg shadow-emerald-500/20 text-white rounded-2xl p-6 max-w-full space-y-6"
    >
      <h1 className="text-3xl font-extrabold text-white mb-6">Dashboard</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Filter by issuer or receiver"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 bg-emerald-500/20"
        />
        <button
          onClick={() => setSearchQuery("")}
          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 font-semibold shadow-md"
        >
          Clear
        </button>
      </div>


      {loading ? (
        <p>Loading certificates...</p>
      ) : filteredCerts.length === 0 ? (
        <p>No certificates found.</p>
      ) : (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto dashboard-scroll">
          {filteredCerts.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.4 }}
              className="p-4 rounded-2xl bg-white/10 backdrop-blur-xl border border-emerald-400/20 shadow-lg shadow-emerald-500/20"
            >
              <p>
                <b>IPFS:</b>{" "}
                <a
                  href={`https://ipfs.io/ipfs/${cert.ipfsHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 underline"
                >
                  {cert.ipfsHash}
                </a>
              </p>
              <p>
                <b>Issuer:</b> {cert.issuer}
              </p>
              <p>
                <b>Receiver:</b> {cert.receiver}
              </p>
              <p>
                <b>Timestamp:</b> {cert.timestamp}
              </p>
              <p>
                <b>Revoked:</b> {cert.revoked ? "✅ Yes" : "❌ No"}
              </p>
              {!cert.revoked && (
                <button
                  className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  onClick={() => revokeCertificate(cert.ipfsHash)}
                >
                  🚫 Revoke
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
