export const uploadToIPFS = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
    },
    body: formData,
  });

  const data = await res.json();
  return data.IpfsHash;
};
