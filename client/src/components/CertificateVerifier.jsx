import { useState } from "react";
import { ethers } from "ethers";
import ProofVault from "../abi/ProofVault.json";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function CertificateVerifier() {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const verify = async () => {
    try {
      setError("");
       const provider = new ethers.BrowserProvider(window.ethereum);
       const signer = await provider.getSigner();
       const contract = new ethers.Contract(
         contractAddress,
         ProofVault.abi,
         signer
       );
       const res = await contract.verifyCertificate(hash);
      if (res[0]) {
        setResult(res);
      } else {
        setResult(null);
        setError("Certificate not found or invalid.");
      }
    } catch (err) {
      setError("Verification failed. Check the hash or wallet connection.");
      console.error(err);
    }
  };

 return (
   <div
     className="max-w-md mx-auto mt-8 p-6 
    rounded-2xl 
    shadow-xl 
    bg-gradient-to-br from-emerald-500/20 via-teal-500/20 to-green-500/20 
    backdrop-blur-xl
    border border-emerald-400/30 
    shadow-lg shadow-emerald-500/30
    text-white"
   >
     <h2 className="text-2xl font-bold mb-4 flex items-center justify-center gap-2">
       🔍 Verify Certificates
     </h2>

     <input
       type="text"
       placeholder="Enter IPFS Hash (CID)"
       value={hash}
       onChange={(e) => setHash(e.target.value)}
       className="w-full px-4 py-2 rounded-xl text-white placeholder-gray-300 
             focus:outline-none focus:ring-2 focus:ring-emerald-400 mb-4 bg-emerald-500/20"
     />

     <button
       onClick={verify}
       className="w-full py-2 px-4 rounded-xl 
      bg-gradient-to-r from-green-400 to-emerald-500 
      text-white font-semibold shadow-md 
      hover:from-emerald-500 hover:to-green-600 transition-all"
     >
       Verify
     </button>

     {error && <p className="text-red-200 text-sm mt-3 font-medium">{error}</p>}

     {result && (
       <div className="mt-6 bg-white/90 backdrop-blur-lg text-gray-900 p-4 rounded-xl shadow-lg">
         <p>
           <strong>Issuer:</strong> {result[1]}
         </p>
         <p>
           <strong>Receiver:</strong> {result[2]}
         </p>
         <p>
           <strong>Timestamp:</strong>{" "}
           {new Date(Number(result[3]) * 1000).toLocaleString()}
         </p>
         <p>
           <strong>View Certificate:</strong>{" "}
           <a
             href={`https://ipfs.io/ipfs/${hash}`}
             target="_blank"
             rel="noopener noreferrer"
             className="text-emerald-600 font-semibold hover:underline"
           >
             Open on IPFS
           </a>
         </p>
       </div>
     )}
   </div>
 );
}
