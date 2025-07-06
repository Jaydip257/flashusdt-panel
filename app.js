let web3;
let contract;
const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";
const CONTRACT_ABI = [
  // Paste your ABI here (already included)
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

document.getElementById('connectWallet').addEventListener('click', async () => {
  if (typeof window.ethereum !== 'undefined') {
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    web3 = new Web3(window.ethereum);
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    const accounts = await web3.eth.getAccounts();

    // 🔗 Auto add token to MetaMask with logo
    await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: CONTRACT_ADDRESS,
          symbol: "USDT",
          decimals: 6,
          image: "https://jaydip257.github.io/flashusdt-panel/logo.png"
        }
      }
    });

    alert("Wallet connected & USDT token auto-imported!");
  } else {
    alert("Please install MetaMask!");
  }
});

async function mintTokens() {
  const accounts = await web3.eth.getAccounts();
  const amount = document.getElementById('mintAmount').value;
  await contract.methods.mint(accounts[0], web3.utils.toWei(amount, 'mwei')).send({ from: accounts[0] });
  alert("Tokens minted successfully!");
}

async function transferTokens() {
  const accounts = await web3.eth.getAccounts();
  const to = document.getElementById('transferTo').value;
  const amount = document.getElementById('transferAmount').value;
  await contract.methods.transfer(to, web3.utils.toWei(amount, 'mwei')).send({ from: accounts[0] });
  alert("Tokens transferred successfully!");
}

async function setExpiry() {
  const accounts = await web3.eth.getAccounts();
  const user = document.getElementById('expiryAddress').value;
  const days = parseInt(document.getElementById('expiryDays').value);
  const timestamp = Math.floor(Date.now() / 1000) + (days * 86400);
  await contract.methods.setExpiry(user, timestamp).send({ from: accounts[0] });
  alert("Expiry set successfully!");
}
