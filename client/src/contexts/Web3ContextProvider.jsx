// src/contexts/ContractProvider.jsx
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ContractContext } from "./Web3Context";
import StorageABI from "../abi/Storage.json";
import toast from "react-hot-toast";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

export const ContractProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not detected");
        return;
      }

      // MetaMask wallet connection
      const prov = new ethers.BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await prov.getSigner();
      const address = await signer.getAddress();

      // Load contract with signer
      const contractInstance = new ethers.Contract(
        contractAddress,
        StorageABI.abi,
        signer
      );

      const network = await signer.provider.getNetwork();
      console.log("CHAIN ID:", network.chainId); // should be 31337
      console.log("✅ Connected to wallet:", address);
      console.log("✅ Contract loaded at:", contractAddress);
      console.log(
        "🔍 Contract functions:",
        contractInstance.interface.fragments.map((f) => f.name)
      );
      console.log("Signer address:", await signer.getAddress());
      console.log("Chain ID:", (await signer.provider.getNetwork()).chainId);

      setProvider(prov);
      setSigner(signer);
      setContract(contractInstance);
      setWalletAddress(address);
    } catch (err) {
      console.error("❌ Error connecting wallet:", err);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  return (
    <ContractContext.Provider
      value={{ provider, signer, contract, walletAddress, connectWallet }}
    >
      {children}
    </ContractContext.Provider>
  );
};
