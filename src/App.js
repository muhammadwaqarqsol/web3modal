import logo from "./logo.svg";
import "./App.css";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import WalletConnect from "@walletconnect/web3-provider";
import NFTListing from "./mint";
import { toHex, truncateAddress } from "./utils";
import { networkParams } from "./networks";

function App() {
  const [chainId, setChainId] = useState();
  const [error, setError] = useState("");
  const [provider,setProvider]=useState();
  const [connectedAccount, setConnectedAccount] = useState("");
  const [library, setLibrary] = useState();
  const [network, setNetwork] = useState(1666600000);


  console.log("Infura :: ",process.env.REACT_APP_INFURA_ID)
  const providerOptions = {  
    coinbasewallet: {
      package: CoinbaseWalletSDK,
      options: {
        appName: "Coinbase", 
        infuraId: process.env.REACT_APP_INFURA_ID, 
      },
    },
    walletconnect: {
      package: WalletConnect, 
      options: {
        appName:"Wallet Connect",
        infuraId: process.env.REACT_APP_INFURA_ID 
      }
    }
  };

  const web3Modal = new Web3Modal({
    providerOptions,
  });


  const connectWeb3Wallet = async () => {
    try {
      const web3Provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(web3Provider);
      const web3Accounts = await library.listAccounts();
      setLibrary(library);
      setProvider(web3Provider);
      console.log("ACCOUNTS : ",web3Accounts[0])
      setConnectedAccount(web3Accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshState = () => {
    setConnectedAccount();
    setChainId();
  };

 async function disconnectWeb3Modal(){
    await web3Modal.clearCachedProvider();
    refreshState();
    window.localStorage.clear();
    setConnectedAccount("");
  };
  const switchNetwork = async () => {
   
    try {
     
      await library.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: toHex(network) }],
      });
      console.log("check")
    } catch (switchError) {
      console.log("failed")
      if (switchError.code === 4902) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(network)]]
          });
        } catch (error) {
          setError(error);
        }
      }
    }
  };


  useEffect(() => {
    const setupEventListeners = async () => {
      if (provider?.on) {
        const handleAccountsChanged = (accounts) => {
          setConnectedAccount(accounts);
        };

        const handleChainChanged = (chainId) => {
          setChainId(chainId);
        };

        const handleDisconnect = () => {
          disconnectWeb3Modal();
        };

        provider.on("accountsChanged", handleAccountsChanged);
        provider.on("chainChanged", handleChainChanged);
        provider.on("disconnect", handleDisconnect);

        return () => {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnectWeb3Modal", handleDisconnect);
        };
      }
    };

    setupEventListeners();
  }, [provider]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <br />

        {connectedAccount && <p>Connected to {connectedAccount}</p> && <p>Chain Id : {chainId}</p>}

        {!connectedAccount ? (
          <button onClick={connectWeb3Wallet}>Connect Wallet</button>
        ) : (
          <>
            <NFTListing />
            {/* disabled={toHex(network)===chainId} style={{backgroundColor:"gray"} */}
            <button onClick={()=> switchNetwork()} >Change Network</button>
            <br />
            <button onClick={disconnectWeb3Modal}>Disconnect</button>
          </>
        )}
      </header>
    </div>
  );
}

export default App;