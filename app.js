const CONTRACT_ADDRESS = "0x8C43FCA6385e1D2714f2546188cEC628D981644b";

const CONTRACT_ABI = [ /* <-- your full ABI pasted here */ ];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (window.ethereum) {
        try {
            provider = new ethers.providers.Web3Provider(window.ethereum);
            await provider.send("eth_requestAccounts", []);
            signer = provider.getSigner();
            contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
            const address = await signer.getAddress();
            document.getElementById("connectWallet").innerText = "Connected: " + address.slice(0, 6) + "..." + address.slice(-4);
        } catch (err) {
            alert("Wallet connection failed: " + err.message);
        }
    } else {
        alert("MetaMask not detected");
    }
}

async function mintTokens() {
    const amount = document.getElementById("mintAmount").value;
    if (!amount) return alert("Enter mint amount");
    try {
        const tx = await contract.mint(await signer.getAddress(), ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        alert("Minted successfully");
    } catch (err) {
        alert("Mint failed: " + err.message);
    }
}

async function transferTokens() {
    const to = document.getElementById("transferTo").value;
    const amount = document.getElementById("transferAmount").value;
    if (!to || !amount) return alert("Enter recipient and amount");
    try {
        const tx = await contract.transfer(to, ethers.utils.parseUnits(amount, 6));
        await tx.wait();
        alert("Transfer successful");
    } catch (err) {
        alert("Transfer failed: " + err.message);
    }
}

async function setExpiry() {
    const user = document.getElementById("expiryUser").value;
    const days = document.getElementById("expiryDays").value;
    if (!user || !days) return alert("Enter user and expiry days");
    const seconds = parseInt(days) * 86400;
    const expiryTime = Math.floor(Date.now() / 1000) + seconds;
    try {
        const tx = await contract.setExpiry(user, expiryTime);
        await tx.wait();
        alert("Expiry set successfully");
    } catch (err) {
        alert("Expiry failed: " + err.message);
    }
}

document.getElementById("connectWallet").addEventListener("click", connectWallet);
document.getElementById("mintBtn").addEventListener("click", mintTokens);
document.getElementById("transferBtn").addEventListener("click", transferTokens);
document.getElementById("expiryBtn").addEventListener("click", setExpiry);
