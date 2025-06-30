
const tokenAddress = "0xC47711d8b4Cba5D9Ccc4e498A204EA53c31779aD";
const tokenABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "transfer",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "account",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "daysFromNow",
        "type": "uint256"
      }
    ],
    "name": "setExpiry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

let web3, contract, accounts;

window.onload = () => {
  document.getElementById("connectBtn").onclick = connectWallet;
  document.getElementById("mintBtn").onclick = mint;
  document.getElementById("transferBtn").onclick = transfer;
  document.getElementById("expiryBtn").onclick = setExpiry;
};

async function connectWallet() {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
    accounts = await web3.eth.getAccounts();
    contract = new web3.eth.Contract(tokenABI, tokenAddress);
    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: tokenAddress,
          symbol: 'USDT',
          decimals: 6,
          image: location.origin + '/logo.png',
        },
      },
    });
    document.getElementById('status').innerText = "✅ Connected: " + accounts[0];
  } else {
    alert("Install MetaMask");
  }
}

async function mint() {
  const amount = prompt("Mint amount:");
  await contract.methods.mint(accounts[0], amount).send({ from: accounts[0] });
  alert("Minted " + amount);
}

async function transfer() {
  const to = prompt("Recipient address:");
  const amount = prompt("Amount to send:");
  await contract.methods.transfer(to, amount).send({ from: accounts[0] });
  alert("Transferred " + amount);
}

async function setExpiry() {
  const to = prompt("Address to set expiry:");
  const days = prompt("Days until expiry:");
  await contract.methods.setExpiry(to, days).send({ from: accounts[0] });
  alert("Expiry set for " + days + " days");
}
