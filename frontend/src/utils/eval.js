import { connectWallet } from "./wallet";
import {
  requestTokens,
  getBalance,
  canClaim,
  getRemainingAllowance
} from "./contracts";

window.__EVAL__ = {
  connectWallet: async () => {
    return await connectWallet();
  },

  requestTokens: async () => {
    return await requestTokens();
  },

  getBalance: async (address) => {
    return await getBalance(address);
  },

  canClaim: async (address) => {
    return await canClaim(address);
  },

  getRemainingAllowance: async (address) => {
    return await getRemainingAllowance(address);
  },

  getContractAddresses: async () => ({
    token: import.meta.env.VITE_TOKEN_ADDRESS,
    faucet: import.meta.env.VITE_FAUCET_ADDRESS
  })
};
