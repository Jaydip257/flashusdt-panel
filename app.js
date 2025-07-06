const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";
const CONTRACT_ABI = [ 
  // Paste full ABI here from BscScan
];

let web3;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    try {
      web3 = new Web3(window.ethereum);
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
      alert("✅ Wallet Connected");
    } catch (err) {
      alert("❌ Connection Failed: " + err.message);
    }
  } else {
    alert("🦊 Please install MetaMask!");
  }
}

async function mintTokens() {
  const amount = document.getElementById("mintAmount").value;
  if (!amount) return alert("Enter amount to mint");
  const accounts = await web3.eth.getAccounts();
  const value = web3.utils.toWei(amount, "mwei");
  try {
    await contract.methods.mint(accounts[0], value).send({ from: accounts[0] });
    alert("✅ Mint Successful");
  } catch (err) {
    alert("❌ Mint Failed: " + err.message);
  }
}

async function transferTokens() {
  const to = document.getElementById("recipient").value;
  const amount = document.getElementById("transferAmount").value;
  if (!to || !amount) return alert("Fill all transfer fields");
  const accounts = await web3.eth.getAccounts();
  const value = web3.utils.toWei(amount, "mwei");
  try {
    await contract.methods.transfer(to, value).send({ from: accounts[0] });
    alert("✅ Transfer Successful");
  } catch (err) {
    alert("❌ Transfer Failed: " + err.message);
  }
}

async function setExpiry() {
  const user = document.getElementById("expiryUser").value;
  const days = document.getElementById("expiryDays").value;
  if (!user || !days) return alert("Fill expiry fields");
  const accounts = await web3.eth.getAccounts();
  const expiryTimestamp = Math.floor(Date.now() / 1000) + (days * 86400);
  try {
    await contract.methods.setExpiry(user, expiryTimestamp).send({ from: accounts[0] });
    alert("✅ Expiry Set");
  } catch (err) {
    alert("❌ Expiry Failed: " + err.message);
  }
}
