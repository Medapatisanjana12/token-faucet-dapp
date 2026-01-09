import { useState } from "react";
import { connectWallet } from "./utils/wallet";
import {
  getBalance,
  requestTokens,
  canClaim,
  getRemainingAllowance
} from "./utils/contracts";

function App() {
  const [address, setAddress] = useState(null);
  const [balance, setBalance] = useState("0");
  const [eligible, setEligible] = useState(false);
  const [remaining, setRemaining] = useState("0");
  const [loading, setLoading] = useState(false);

  async function refresh(addr) {
    setBalance(await getBalance(addr));
    setEligible(await canClaim(addr));
    setRemaining(await getRemainingAllowance(addr));
  }

  async function onConnect() {
    const addr = await connectWallet();
    setAddress(addr);
    await refresh(addr);
  }

  async function onClaim() {
    setLoading(true);
    try {
      await requestTokens();
      await refresh(address);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div style={{ padding: 30 }}>
      {!address ? (
        <button onClick={onConnect}>Connect Wallet</button>
      ) : (
        <>
          <p><b>Address:</b> {address}</p>
          <p><b>Balance:</b> {balance}</p>
          <p><b>Remaining Allowance:</b> {remaining}</p>

          <button disabled={!eligible || loading} onClick={onClaim}>
            {loading ? "Claiming..." : "Claim Tokens"}
          </button>
        </>
      )}
    </div>
  );
}

export default App;
