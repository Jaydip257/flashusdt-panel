const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";

const CONTRACT_ABI = [
  {"inputs":[],"stateMutability":"nonpayable","type":"constructor"},
  {"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"}],"name":"getExpiry","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"user","type":"address"},{"internalType":"uint256","name":"timestamp","type":"uint256"}],"name":"setExpiry","outputs":[],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},
  {"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
  {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},
  {"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}
];

let web3;
let contract;
let userAccount;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const accounts = await web3.eth.getAccounts();
      userAccount = accounts[0];
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      document.getElementById("connectWallet").innerText = "Connected: " + userAccount.slice(0, 6) + "..." + userAccount.slice(-4);
    } catch (err) {
      alert("Connection failed: " + err.message);
    }
  } else {
    alert("Please install MetaMask");
  }
}

async function mintTokens() {
  const amount = document.getElementById("mintAmount").value;
  if (!amount) return alert("Enter amount");
  const value = web3.utils.toWei(amount, 'mwei');
  try {
    await contract.methods.mint(userAccount, value).send({ from: userAccount });
    alert("Mint successful");
  } catch (err) {
    alert("Mint failed: " + err.message);
  }
}

async function transferTokens() {
  const to = document.getElementById("transferTo").value;
  const amount = document.getElementById("transferAmount").value;
  if (!to || !amount) return alert("Enter recipient and amount");
  const value = web3.utils.toWei(amount, 'mwei');
  try {
    await contract.methods.transfer(to, value).send({ from: userAccount });
    alert("Transfer successful");
  } catch (err) {
    alert("Transfer failed: " + err.message);
  }
}

async function setExpiry() {
  const addr = document.getElementById("expiryAddress").value;
  const days = document.getElementById("expiryDays").value;
  if (!addr || !days) return alert("Enter address and days");
  const timestamp = Math.floor(Date.now() / 1000) + (parseInt(days) * 86400);
  try {
    await contract.methods.setExpiry(addr, timestamp).send({ from: userAccount });
    alert("Expiry set");
  } catch (err) {
    alert("Set expiry failed: " + err.message);
  }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
