const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";
const CONTRACT_ABI = [ /* 🔥 Paste your full ABI here from BscScan */ ];

let web3;
let user;
let contract;

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.enable();
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
    alert("Connected: " + user);
  } else {
    alert("Please install MetaMask to use this feature.");
  }
}

async function mintToken() {
  const to = document.getElementById("mintAddress").value;
  const amount = document.getElementById("mintAmount").value;
  await contract.methods.mint(to, amount).send({ from: user });
}

async function transferToken() {
  const to = document.getElementById("transferAddress").value;
  const amount = document.getElementById("transferAmount").value;
  await contract.methods.transfer(to, amount).send({ from: user });
}

async function setExpiry() {
  const addr = document.getElementById("expiryAddress").value;
  const days = document.getElementById("expiryDays").value;
  const expiry = Math.floor(Date.now() / 1000) + (days * 86400);
  await contract.methods.setExpiry(addr, expiry).send({ from: user });
}
