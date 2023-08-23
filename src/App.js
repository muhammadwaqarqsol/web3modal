import logo from "./logo.svg";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import NFTListing from "./mint";

function App() {
  console.log("Infura :: ",process.env.REACT_APP_INFURA_ID)
  const providerOptions = {  
    coinbasewallet: {
      package: CoinbaseWalletSDK, // Required
      options: {
        appName: "Coinbase", // Required
        infuraId: process.env.REACT_APP_INFURA_ID, // Required
        chainId: 4, //4 for Rinkeby, 1 for mainnet (default)
      },
    },
  };

  const web3Modal = new Web3Modal({
    
    providerOptions, // required
  });

  const [connectedAccount, setConnectedAccount] = useState("");

  const connectWeb3Wallet = async () => {
    try {
      const web3Provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(web3Provider);
      const web3Accounts = await library.listAccounts();
      console.log("ACCOUNTS : ",web3Accounts)
      setConnectedAccount(web3Accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  async function disconnectWeb3Modal(){
    console.log("chck")
    web3Modal.clearCachedProvider();
    setConnectedAccount("");
  };

  // useEffect(()=>{
  //   localStorage.clear();
  // },[disconnectWeb3Modal])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />

        {connectedAccount && <p>Connected to ${connectedAccount}</p>}

        {!connectedAccount ? (
          <button onClick={connectWeb3Wallet}>Connect Wallet</button>
        ) : (<> 
        <NFTListing/>
        <br/>
          <button onClick={disconnectWeb3Modal}>Disconnect</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
