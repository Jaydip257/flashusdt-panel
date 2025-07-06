// CONNECT WEB3 + CONTRACT SETUP
let web3;
let contract;
const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";
const CONTRACT_ABI = [ /* ← paste your ABI here */ ];

async function connectWallet() {
  if (window.ethereum) {
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      const accounts = await web3.eth.getAccounts();
      document.getElementById("connectWallet").innerText = `✅ ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`;
    } catch (err) {
      alert("Wallet connection failed!");
      console.error(err);
    }
  } else {
    alert("MetaMask not found. Install it first.");
  }
}

// MINT FUNCTION
async function mintTokens() {
  const accounts = await web3.eth.getAccounts();
  const amount = document.getElementById("mintAmount").value;
  try {
    await contract.methods.mint(accounts[0], amount).send({ from: accounts[0] });
    alert("✅ Minted successfully!");
  } catch (e) {
    alert("Mint failed");
    console.error(e);
  }
}

// TRANSFER FUNCTION
async function transferTokens() {
  const accounts = await web3.eth.getAccounts();
  const recipient = document.getElementById("transferTo").value;
  const amount = document.getElementById("transferAmount").value;
  try {
    await contract.methods.transfer(recipient, amount).send({ from: accounts[0] });
    alert("✅ Transfer successful!");
  } catch (e) {
    alert("Transfer failed");
    console.error(e);
  }
}

// SET EXPIRY FUNCTION
async function setExpiry() {
  const accounts = await web3.eth.getAccounts();
  const user = document.getElementById("expiryAddress").value;
  const days = parseInt(document.getElementById("expiryDays").value);
  const expiryTimestamp = Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60);
  try {
    await contract.methods.setExpiry(user, expiryTimestamp).send({ from: accounts[0] });
    alert("✅ Expiry set successfully!");
  } catch (e) {
    alert("Failed to set expiry");
    console.error(e);
  }
}
