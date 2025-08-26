// src/components/DataViewer.jsx
import { useContext, useState } from "react";
import { ContractContext } from "../contexts/Web3Context";

const DataViewerStorage = () => {
  const { contract } = useContext(ContractContext);
  const [data, setData] = useState(null);

  console.log(contract,"CHECK_CONTRACT")

  const fetchData = async () => {
    if (!contract) return alert("Contract not ready");
    try {
      const result = await contract.getData();
      setData(result.toString());
    } catch (err) {
      console.error("Error fetching data:", err);
    }

    console.log("Contract address:", contract.target);
    console.log(
      "ABI:",
      contract.interface.fragments.map((f) => f.name)
    );
  };

  return (
    <div>
      <h3>Stored Chakra</h3>
      <button onClick={fetchData}>Unroll Scroll</button>
      {data !== null && <p>Chakra stored: {data}</p>}
    </div>
  );
};

export default DataViewerStorage;
