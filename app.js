const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b"; // Your live contract address

const CONTRACT_ABI = [  // Your verified ABI
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }, { "internalType": "address", "name": "", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }], "name": "getExpiry", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "setExpiry", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }
];

let web3;
let contract;
let currentAccount;

async function connectWallet() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      currentAccount = accounts[0];
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      alert("Wallet connected: " + currentAccount);
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  } else {
    alert("MetaMask not detected.");
  }
}

async function mintTokens() {
  const amount = document.getElementById("mintAmount").value;
  if (!contract || !currentAccount) return alert("Connect wallet first.");
  try {
    await contract.methods.mint(currentAccount, amount).send({ from: currentAccount });
    alert("Minted successfully!");
  } catch (err) {
    alert("Mint failed.");
    console.error(err);
  }
}

async function transferTokens() {
  const to = document.getElementById("transferTo").value;
  const amount = document.getElementById("transferAmount").value;
  if (!contract || !currentAccount) return alert("Connect wallet first.");
  try {
    await contract.methods.transfer(to, amount).send({ from: currentAccount });
    alert("Transfer successful!");
  } catch (err) {
    alert("Transfer failed.");
    console.error(err);
  }
}

async function setExpiry() {
  const address = document.getElementById("expiryAddress").value;
  const days = parseInt(document.getElementById("expiryDays").value);
  const timestamp = Math.floor(Date.now() / 1000) + (days * 86400);
  if (!contract || !currentAccount) return alert("Connect wallet first.");
  try {
    await contract.methods.setExpiry(address, timestamp).send({ from: currentAccount });
    alert("Expiry set!");
  } catch (err) {
    alert("Failed to set expiry.");
    console.error(err);
  }
}

async function addTokenToWallet() {
  try {
    const wasAdded = await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: CONTRACT_ADDRESS,
          symbol: "USDT",
          decimals: 6,
          image: "https://jaydip257.github.io/flashusdt-panel/tether-usdt-logo.png"
        },
      },
    });

    if (wasAdded) {
      alert("Token added!");
    } else {
      alert("Token not added.");
    }
  } catch (error) {
    console.error("Error adding token:", error);
  }
}

// Auto-connect if MetaMask already authorized
window.addEventListener("load", async () => {
  if (window.ethereum && window.ethereum.selectedAddress) {
    connectWallet();
  }
});
