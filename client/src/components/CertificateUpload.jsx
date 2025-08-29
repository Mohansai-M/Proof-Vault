import { useState, useContext } from "react";
import { keccak256, hexlify, BrowserProvider, Contract } from "ethers";
import axios from "axios";
import { motion } from "framer-motion";
import ProofVault from "../abi/ProofVault.json";
import toast from "react-hot-toast";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

export default function CertificateUploader({ wallet, onUploaded }) {
  const [issuer, setIssuer] = useState("");
  const [receiver, setReceiver] = useState("");
  const [fileHash, setFileHash] = useState("");
  const [file, setFile] = useState(null);
  const [CID, setCID] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    const arrayBuffer = await selectedFile.arrayBuffer();
    const hash = keccak256(hexlify(new Uint8Array(arrayBuffer)));
    setFileHash(hash);
    setFile(selectedFile);
  };

  const uploadToPinata = async () => {
    if (!file) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", file);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Infinity,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${PINATA_JWT}`,
        },
      }
    );

    const cid = res?.data?.IpfsHash;
    if (!cid) throw new Error("Pinata did not return IpfsHash");
    setCID(cid);
    return cid;
  };


  const uploadCert = async () => {
    if (!wallet || !issuer || !receiver || !fileHash || !file) {
      toast.error("⚠️ Please fill all fields & select a file");
      return;
    }

    try {
      setLoading(true);
      const ipfsCID = await uploadToPinata();

      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(contractAddress, ProofVault.abi, signer);

      const tx = await contract.uploadCertificate(ipfsCID, issuer, receiver, {
        gasLimit: 500_000n,
      });
      await tx.wait();

      toast.success(`🎉 Certificate uploaded successfully!`);

      setIssuer("");
      setReceiver("");
      setFile(null);
      setCID("");
      onUploaded?.();
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error("Upload failed: " + (err?.message ?? err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative bg-gradient-to-br from-emerald-500/30 via-teal-500/30 to-cyan-500/30 
        border border-emerald-400/20 shadow-lg shadow-emerald-500/20 text-white 
        rounded-2xl p-6 max-w-lg mx-auto mt-8 overflow-hidden"
    >
      <div className="space-y-4 relative z-10">
        <h2 className="text-2xl font-extrabold">📤 Upload Certificate</h2>

        <input
          type="text"
          placeholder="Issuer"
          value={issuer}
          onChange={(e) => setIssuer(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 bg-white/90 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
        />

        <input
          type="text"
          placeholder="Receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 bg-white/90 text-gray-800 placeholder-gray-400 shadow-sm focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 outline-none transition"
        />

        <input
          type="file"
          onChange={handleFile}
          className="w-full text-sm text-gray-200 file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0 file:bg-gradient-to-r file:from-emerald-600/80 file:to-cyan-600/80
            file:text-white hover:file:from-emerald-500 hover:file:to-cyan-500 file:shadow-md file:shadow-emerald-500/30 cursor-pointer"
        />

        <motion.button
          onClick={uploadCert}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold shadow-lg transition
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed text-white"
              : "bg-gradient-to-r from-emerald-600/80 to-cyan-600/80 text-white hover:from-emerald-500 hover:to-cyan-500 shadow-emerald-500/30"
          }`}
        >
          {loading ? "⏳ Uploading..." : "🚀 Upload Certificate"}
        </motion.button>

        {CID && (
          <a
            href={`https://ipfs.io/ipfs/${CID}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-center mt-4 text-green-200 font-semibold"
          >
            🔎 <span className="hover:underline">View Certificate</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
