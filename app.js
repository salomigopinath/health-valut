// Notification Helper
function showNotification(message, type = 'success') {
    const notify = document.getElementById('notification');
    if (!notify) return;

    notify.innerText = message;
    notify.className = `notification ${type}`;
    notify.style.display = 'block';

    setTimeout(() => {
        notify.style.display = 'none';
        notify.classList.remove(type);
    }, 5000);
}

// Transaction Panel Helper
function displayTxResult(receipt) {
    const panel = document.getElementById('txResult');
    if (!panel) return;

    panel.classList.add('show');
    document.getElementById('txHashDisplay').innerText = `Tx Hash: ${receipt.hash}`;
    document.getElementById('txBlockDisplay').innerText = `Block: ${receipt.blockNumber}`;
    document.getElementById('txGasDisplay').innerText = `Gas Used: ${receipt.gasUsed.toString()}`;

    const link = document.getElementById('txEtherscan');
    link.href = `https://sepolia.etherscan.io/tx/${receipt.hash}`;
}

// Error Handler
function handleBlockchainError(error) {
    console.error(error);
    let msg = "Transaction failed!";

    if (error.code === 'ACTION_REJECTED') msg = "User rejected transaction.";
    else if (error.message.includes("not registered")) msg = "Error: Hospital not registered.";
    else if (error.message.includes("Access denied")) msg = "Error: Access denied to records.";
    else if (error.message.includes("Only owner")) msg = "Error: This action requires Owner role.";
    else if (error.message.includes("Only hospital")) msg = "Error: This action requires Hospital role.";

    showNotification(msg, 'error');
}

// OWNER ACTIONS
async function handleRegisterHospital() {
    try {
        const addr = document.getElementById('hospitalAddress').value;
        const name = document.getElementById('hospitalName').value;

        if (!ethers.isAddress(addr)) return showNotification("Invalid address", "error");

        showNotification("Registering hospital... Please sign the transaction.");
        const tx = await contract.registerHospital(addr, name);
        const receipt = await tx.wait();

        displayTxResult(receipt);
        showNotification("Hospital registered successfully!");
        handleFetchHospitals();
    } catch (err) {
        handleBlockchainError(err);
    }
}

async function handleFetchHospitals() {
    try {
        const listDiv = document.getElementById('hospitalList');
        if (!listDiv) return;

        const count = await contract.getHospitalCount();
        listDiv.innerHTML = "";

        if (count == 0) {
            listDiv.innerHTML = "<p style='padding:1rem;'>No hospitals registered.</p>";
            return;
        }

        for (let i = 0; i < count; i++) {
            const addr = await contract.hospitalAddresses(i);
            const info = await contract.hospitals(addr);
            // info: [name, isRegistered]
            const item = document.createElement('div');
            item.className = 'record-item';
            item.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <strong>${info[0]}</strong><br>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">${addr}</span>
                    </div>
                    <span class="status-badge" style="background: #d1fae5; color: #065f46; padding: 2px 8px; border-radius: 99px; font-size: 0.75rem;">Active</span>
                </div>
            `;
            listDiv.appendChild(item);
        }
    } catch (err) {
        handleBlockchainError(err);
    }
}

// PATIENT ACTIONS
async function handleGrantAccess() {
    try {
        const hospital = document.getElementById('targetHospital').value;
        if (!ethers.isAddress(hospital)) return showNotification("Invalid address", "error");

        showNotification("Granting access... Please sign the transaction.");
        const tx = await contract.grantAccess(hospital);
        const receipt = await tx.wait();

        displayTxResult(receipt);
        showNotification("Access granted successfully!");
    } catch (err) {
        handleBlockchainError(err);
    }
}

async function handleFetchRecords() {
    try {
        const listDiv = document.getElementById('recordList');
        const userAddr = await signer.getAddress();

        const count = await contract.getRecordCount(userAddr);
        listDiv.innerHTML = "";

        if (count == 0) {
            listDiv.innerHTML = "<p style='padding:1rem;'>No records found.</p>";
            return;
        }

        for (let i = 0; i < count; i++) {
            const rec = await contract.getRecord(userAddr, i);
            // rec: [ipfsHash, doctor, d, m, y, hospitalAddr]
            const item = document.createElement('div');
            item.className = 'record-item';
            item.innerHTML = `
                <strong>Diagnosis Hash:</strong> ${rec[0]}<br>
                <div class="record-meta">
                    <span>👨‍⚕️ Dr. ${rec[1]}</span>
                    <span>📅 ${rec[2]}/${rec[3]}/${rec[4]}</span>
                </div>
            `;
            listDiv.appendChild(item);
        }
    } catch (err) {
        handleBlockchainError(err);
    }
}

// HOSPITAL ACTIONS
async function handleAddRecord() {
    try {
        const patient = document.getElementById('patientAddress').value;
        const hash = document.getElementById('recordHash').value;
        const doctor = document.getElementById('doctorName').value;
        const d = document.getElementById('day').value;
        const m = document.getElementById('month').value;
        const y = document.getElementById('year').value;

        if (!ethers.isAddress(patient)) return showNotification("Invalid patient address", "error");

        showNotification("Adding record... Please sign the transaction.");
        const tx = await contract.addRecord(patient, hash, doctor, d, m, y);
        const receipt = await tx.wait();

        displayTxResult(receipt);
        showNotification("Record added successfully!");
    } catch (err) {
        handleBlockchainError(err);
    }
}

// Load initialization
document.addEventListener('DOMContentLoaded', () => {
    // Re-check every 1.5s to ensure everything is initialized
    setTimeout(async () => {
        if (!signer) return;

        const path = window.location.pathname;
        if (path.includes('patient.html')) {
            handleFetchRecords();
        } else if (path.includes('owner.html')) {
            handleFetchHospitals();
        }
    }, 1500);
});
