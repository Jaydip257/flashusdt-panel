const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";
const CONTRACT_ABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "mint", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [{ "internalType": "address", "name": "user", "type": "address" }, { "internalType": "uint256", "name": "timestamp", "type": "uint256" }], "name": "setExpiry", "outputs": [], "stateMutability": "nonpayable", "type": "function" }
];

let web3;
let contract;
let accounts = [];

window.addEventListener('load', async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);

    document.getElementById("connectWallet").addEventListener("click", async () => {
      try {
        accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        alert("Wallet Connected: " + accounts[0]);
      } catch (err) {
        alert("Wallet connection failed.");
      }
    });
  } else {
    alert("Please install MetaMask.");
  }
});

async function mintTokens() {
  const amount = document.getElementById("mintAmount").value;
  if (!amount || !contract) return alert("Enter amount and connect wallet first.");
  await contract.methods.mint(accounts[0], web3.utils.toWei(amount, "ether")).send({ from: accounts[0] });
  alert("Minted successfully.");
}

async function transferTokens() {
  const to = document.getElementById("transferTo").value;
  const amount = document.getElementById("transferAmount").value;
  if (!to || !amount || !contract) return alert("Enter details and connect wallet first.");
  await contract.methods.transfer(to, web3.utils.toWei(amount, "ether")).send({ from: accounts[0] });
  alert("Transferred successfully.");
}

async function setExpiry() {
  const user = document.getElementById("expiryAddress").value;
  const days = document.getElementById("expiryDays").value;
  if (!user || !days || !contract) return alert("Enter expiry details.");
  const timestamp = Math.floor(Date.now() / 1000) + (parseInt(days) * 86400);
  await contract.methods.setExpiry(user, timestamp).send({ from: accounts[0] });
  alert("Expiry set.");
}
