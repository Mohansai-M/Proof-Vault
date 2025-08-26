// src/components/DataSetter.jsx
import { useContext, useState } from "react";
import { ContractContext } from "../contexts/Web3Context"

const DataSetterStorage = () => {
  const { contract } = useContext(ContractContext);
  const [inputValue, setInputValue] = useState("");

  const handleSetData = async () => {
    if (!contract) return alert("Contract not ready");
    try {
      const tx = await contract.setData(parseInt(inputValue));
      await tx.wait(); // ⏳ Wait for the block to be mined
      alert("Chakra added to scroll successfully!");
    } catch (err) {
      console.error("Error setting data:", err);
    }
  };

  return (
    <div>
      <h3>Set Chakra Value</h3>
      <input
        type="number"
        placeholder="Enter number"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={handleSetData}>Add Chakra</button>
    </div>
  );
};

export default DataSetterStorage;
