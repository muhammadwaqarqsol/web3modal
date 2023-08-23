import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ethers } from "ethers";


// Contract ABIs
import nftABI from "./ABI/NFTabi.json";
import nftMpABI from "./ABI/NftMarketPlaceabi.json";


const NFTListing = () => {

const [tokenUri, setTokenUri] = useState(null)
  // Contract addresses
  const nftAddress = "0x9359D0d8BA7521A2B84db19a528453C1ac89F152";
  const nftMpAddress = "0x04c6817b0bE37D988b778FF2E78C05049f49FD6c";

  // Provider and signer
  let provider;
  let signer;
  if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }
  

  // Create instances of the contracts
  const nftContract = new ethers.Contract(nftAddress, nftABI, signer);


  const handleChange = (event) => {
    setTokenUri(event.target.value);
  };


  const handleSubmission = async () => {
    const load = toast.loading("Please wait...")
    await NFTMint(tokenUri);
    await toast.update(load, { render: "Success", type: "success", isLoading: false, autoClose: 5000, hideProgressBar: false, closeOnClick: true });
    await toast.success('NFT Created Successfully '
    ,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true,
      progress: undefined,
      theme: "light",
      });
  };

  const NFTMint = async (tokenUri) => {

    const createNFTTransaction = await nftContract.createToken(tokenUri);
    const receipt = await createNFTTransaction.wait();
    console.log("NFT minted successfully");
    console.log("Transaction hash:", receipt.transactionHash);
  };
  
  return (
    <>
    <div>
    <input style={{height:40}} value={tokenUri} onChange={handleChange}></input>
        <button onClick={handleSubmission}>Mint NFT</button>
    </div>
    <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover={false}
            theme="light"
          />
    </>
  );
};

export default NFTListing;