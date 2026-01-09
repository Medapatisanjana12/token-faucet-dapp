import { ethers } from "ethers";

let provider;
let signer;

export async function connectWallet() {
  if (!window.ethereum) {
    throw new Error("MetaMask not found");
  }

  provider = new ethers.BrowserProvider(window.ethereum);
  const accounts = await provider.send("eth_requestAccounts", []);
  signer = await provider.getSigner();

  return accounts[0];
}

export function getProvider() {
  if (!provider) {
    provider = new ethers.BrowserProvider(window.ethereum);
  }
  return provider;
}

export function getSigner() {
  if (!signer) {
    throw new Error("Wallet not connected");
  }
  return signer;
}
