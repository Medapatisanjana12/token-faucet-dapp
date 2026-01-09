import { ethers } from "ethers";
import { getSigner, getProvider } from "./wallet";

// ENV addresses
const TOKEN_ADDRESS = import.meta.env.VITE_TOKEN_ADDRESS;
const FAUCET_ADDRESS = import.meta.env.VITE_FAUCET_ADDRESS;

// ABIs
import TokenABI from "../../../artifacts/contracts/Token.sol/YourToken.json";
import FaucetABI from "../../../artifacts/contracts/TokenFaucet.sol/TokenFaucet.json";

export function getTokenContract(withSigner = false) {
  const runner = withSigner ? getSigner() : getProvider();
  return new ethers.Contract(TOKEN_ADDRESS, TokenABI.abi, runner);
}

export function getFaucetContract(withSigner = false) {
  const runner = withSigner ? getSigner() : getProvider();
  return new ethers.Contract(FAUCET_ADDRESS, FaucetABI.abi, runner);
}

export async function getBalance(address) {
  const token = getTokenContract();
  return (await token.balanceOf(address)).toString();
}

export async function requestTokens() {
  const faucet = getFaucetContract(true);
  const tx = await faucet.requestTokens();
  await tx.wait();
  return tx.hash;
}

export async function canClaim(address) {
  const faucet = getFaucetContract();
  return await faucet.canClaim(address);
}

export async function getRemainingAllowance(address) {
  const faucet = getFaucetContract();
  return (await faucet.remainingAllowance(address)).toString();
}
