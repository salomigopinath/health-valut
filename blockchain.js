let provider;
let signer;
let contract;

const SEPOLIA_CHAIN_ID = "0xaa36a7"; // Sepolia Testnet

async function initBlockchain() {
    if (window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum);

        // Listen for account changes
        window.ethereum.on('accountsChanged', (accounts) => {
            console.log('Accounts changed:', accounts);
            updateWalletUI(accounts[0]);
            location.reload(); // Reload to refresh state
        });

        // Listen for network changes
        window.ethereum.on('chainChanged', (chainId) => {
            console.log('Network changed:', chainId);
            location.reload();
        });

        // Check if already connected
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
            await setupSignerAndContract();
            updateWalletUI(accounts[0].address);
        }
    } else {
        alert("MetaMask not detected! Please install MetaMask to use MedChain.");
    }
}

async function setupSignerAndContract() {
    signer = await provider.getSigner();
    contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    console.log("Signer and Contract initialized");
}

async function connectWallet() {
    try {
        if (!window.ethereum) return alert("MetaMask not found");

        // Request Sepolia network
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        if (chainId !== SEPOLIA_CHAIN_ID) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: SEPOLIA_CHAIN_ID }],
                });
            } catch (err) {
                // This error code indicates that the chain has not been added to MetaMask.
                if (err.code === 4902) {
                    alert("Please add Sepolia network to your MetaMask");
                }
            }
        }

        const accounts = await provider.send("eth_requestAccounts", []);
        await setupSignerAndContract();
        updateWalletUI(accounts[0]);
        console.log("Connected to", accounts[0]);
    } catch (error) {
        console.error("Connection failed", error);
    }
}

async function detectRole(address) {
    if (!contract || !address) return;
    try {
        const ownerAddr = await contract.owner();
        const isHosp = await contract.isHospital(address);

        const badge = document.getElementById('roleBadge');
        if (!badge) return;

        badge.classList.add('show');
        if (address.toLowerCase() === ownerAddr.toLowerCase()) {
            badge.innerText = "👑 System Owner";
            badge.style.background = "rgba(245, 158, 11, 0.1)";
            badge.style.color = "#b45309";
        } else if (isHosp) {
            badge.innerText = "🏥 Registered Hospital";
            badge.style.background = "rgba(16, 185, 129, 0.1)";
            badge.style.color = "#047857";
        } else {
            badge.innerText = "👤 Patient";
            badge.style.background = "rgba(14, 165, 233, 0.1)";
            badge.style.color = "#0369a1";
        }
    } catch (e) {
        console.warn("Role detection failed (likely contract not deployed).");
    }
}

function updateWalletUI(address) {
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn && address) {
        const shortAddress = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
        connectBtn.innerText = shortAddress;
        connectBtn.classList.add('connected');
        detectRole(address);
    }
}

window.addEventListener('load', () => {
    initBlockchain();
    const connectBtn = document.getElementById('connectWallet');
    if (connectBtn) {
        connectBtn.addEventListener('click', connectWallet);
    }
});
