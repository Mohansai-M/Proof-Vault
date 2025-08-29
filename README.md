🚀 ProofVault – Decentralized Certificate Verifier

ProofVault is a decentralized application (DApp) that enables users to upload, verify, and revoke certificates securely using IPFS and the Ethereum blockchain, ensuring authenticity and immutability.

**✨** **Features**

- 📤 Upload Certificates – Store certificates on IPFS and register on-chain.

- 🔍 Verify Certificates – Check authenticity and revocation status in real-time.

- 🚫 Revoke Certificates – Securely revoke certificates on the blockchain.

- 🟢 Live Dashboard – Real-time updates using smart contract events.

- 🔎 Search & Filter – Quickly find certificates by issuer or receiver.

- 🎨 Modern UI/UX – Animated, scrollable, responsive, and demo-ready.

- 🛎️ Toaster Notifications – Elegant feedback for every action, no intrusive alerts.

**💻 Tech Stack**

- Frontend: React, TailwindCSS, Material UI, Ant Design, MDBReact, Framer Motion

- Web3 Integration: ethers.js, web3.js, WalletConnect, Moralis

- Smart Contract: Solidity (Hardhat)

- Storage: IPFS (Pinata)

- State Management: React Context

**📝 How It Works**

📤 Certificate Upload

- File is hashed (keccak256) and uploaded to IPFS.

- IPFS hash + metadata are saved on-chain.

- Dashboard updates automatically via smart contract events.

🔍 Verification

- Fetch all certificates from the blockchain.

- Filter/search by issuer or receiver.

- Display IPFS link, issuer, receiver, timestamp, and revocation status.

🚫 Revocation

- Certificates can be revoked securely on-chain.

- Revocation triggers an instant dashboard update.

**⚡ Key Achievements**

✅ End-to-end Web3 DApp integrating React, Solidity, IPFS, Hardhat.

✅ Real-time, duplicate-proof certificate dashboard.

✅ Fully functional upload → verify → revoke workflow.

✅ Professional, demo-ready frontend with interactive notifications and smooth animations.

**📌 Notes**

- Currently uses local Hardhat network; avoids gas fees for live demos.

- Supports multiple wallets via WalletConnect and ethers.js.

**🖼️ Screenshots / Demo**
🎥 Loom Demo: Watch Here
