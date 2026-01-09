# Token Faucet DApp

## 1. Project Overview
This project is a decentralized **Token Faucet DApp** that allows users to claim ERC-20 tokens under controlled conditions.  
It demonstrates end-to-end Web3 development using **Solidity smart contracts**, **Hardhat**, **React**, and **Docker**.

The faucet enforces:
- Cooldown periods between claims
- Lifetime claim limits per wallet
- Admin-controlled pause functionality

The application is deployed on the **Sepolia testnet** and is intended for testing, demos, and learning purposes.

---

## 2. Architecture

### Smart Contracts
- **Token.sol**
  - ERC-20 compliant token using OpenZeppelin
  - Fixed maximum supply
  - Minting restricted to the Faucet contract

- **TokenFaucet.sol**
  - Distributes tokens to users
  - Enforces cooldown and lifetime limits
  - Tracks user claims on-chain
  - Admin-only pause/unpause control

### Frontend
- Built with **React (Vite)**
- Uses **ethers.js**
- Features:
  - Wallet connection (MetaMask)
  - Real-time token balance
  - Claim eligibility status
  - Cooldown countdown
  - Transaction status & error handling

### Infrastructure
- **Hardhat** for compile, test, deploy
- **Docker & Docker Compose** for containerized frontend deployment

---

## 3. Deployed Contracts (Sepolia)

> Replace these with your deployed addresses

- **Token Contract**
  - Address: `0xYourTokenAddress`
  - Etherscan: https://sepolia.etherscan.io/address/0xYourTokenAddress

- **Faucet Contract**
  - Address: `0xYourFaucetAddress`
  - Etherscan: https://sepolia.etherscan.io/address/0xYourFaucetAddress

---

## 4. Quick Start

### Prerequisites
- Node.js v18+
- Docker & Docker Compose
- MetaMask wallet (Sepolia network)

### Setup
```bash
cp .env.example .env
```
### Edit .env:
```
VITE_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY
VITE_TOKEN_ADDRESS=0xYourTokenAddress
VITE_FAUCET_ADDRESS=0xYourFaucetAddress
```
### Run with Docker
```
docker compose up --build

```
--- 
## 5. Configuration
| Variable            | Description                      |
| ------------------- | -------------------------------- |
| VITE_RPC_URL        | Sepolia RPC endpoint             |
| VITE_TOKEN_ADDRESS  | Deployed ERC-20 token address    |
| VITE_FAUCET_ADDRESS | Deployed faucet contract address |

---
## 6. Design Decisions
- **Faucet Amount**
A fixed number of tokens is distributed per request to ensure fairness and prevent abuse.
- **Cooldown Period**
A cooldown between claims prevents rapid repeated withdrawals from the faucet.
- **Lifetime Claim Limit**
Each address has a maximum claim limit enforced on-chain to control token distribution.
- **Fixed Token Supply**
A fixed supply avoids inflation and ensures predictable token economics.
---
## 7. Testing Approach
Smart contracts tested using Hardhat
Covered:
- Deployment correctness
- Successful token claims
- Cooldown enforcement
- Lifetime limit enforcement
- Pause/unpause behavior
- Manual frontend testing with MetaMask on Sepolia

---
### Author
**Sanjana Medapati**
