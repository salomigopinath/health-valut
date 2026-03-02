# 🚀 Deployment Guide for MedChain

If you've never deployed a smart contract before, don't worry! Follow these simple steps to get your MedChain project running on the **Sepolia Testnet**.

### 1. Get Free Sepolia ETH
To deploy a contract, you need "test money" (gas).
*   Go to [Sepolia Faucet](https://sepoliafaucet.com/) or [Google Cloud Faucet](https://cloud.google.com/application/web3/faucet/ethereum/sepolia).
*   Enter your MetaMask wallet address and click "Send Me ETH".

### 2. Open Remix IDE
Remix is a web-based tool for writing and deploying Ethereum contracts.
*   Go to [remix.ethereum.org](https://remix.ethereum.org/).
*   In the file explorer (left side), create a new file named `MedChain.sol`.
*   Copy the entire code from your local [MedChain.sol](file:///c:/Users/salom/Downloads/health_vault/MedChain.sol) and paste it into Remix.

### 3. Compile the Contract
*   On the left sidebar, click the **Solidity Compiler** icon (looks like a letter 'S').
*   Click the big blue button: **Compile MedChain.sol**.
*   Wait for the green checkmark to appear.

### 4. Deploy to Sepolia
*   Click the **Deploy & Run Transactions** icon below the compiler.
*   In the **Environment** dropdown, select **Injected Provider - MetaMask**.
*   A MetaMask popup will appear; make sure you are on the **Sepolia Network** and click "Connect".
*   Click the orange **Deploy** button.
*   **Confirm** the transaction in your MetaMask popup.

### 5. Final Step: Link it to your Website
*   Once the transaction succeeds, you will see your contract under **Deployed Contracts** at the bottom of the Remix sidebar.
*   Click the **Copy icon** next to your contract address.
*   Open your local [**contract.js**](file:///c:/Users/salom/Downloads/health_vault/contract.js) file.
*   Paste your address inside the quotes:
    ```javascript
    const CONTRACT_ADDRESS = "PASTE_YOUR_ADDRESS_HERE";
    ```
*   Save the file.

---
### 🎉 You're Done!
Refresh your [**index.html**](file:///c:/Users/salom/Downloads/health_vault/index.html) page, click "Connect Wallet", and you are now officially running a blockchain-powered healthcare app!
