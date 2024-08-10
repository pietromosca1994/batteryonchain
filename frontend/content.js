// console.clear();
const network='devnet';
let contentTitle;

console.log(document.cookie);

// let mainContainer = document.getElementById("mainContainer");
let containerBatteryNFT = document.getElementById("containerBatteryNFT");

function dynamicBatterySection(batteryNFT) {
    let boxDiv = document.createElement("div");
    boxDiv.id = "box";

    let boxLink = document.createElement("a");
    boxLink.href = "/contentDetails.html?" + batteryNFT.address;

    let imgTag = document.createElement("img");
    imgTag.src = batteryNFT.image;
    imgTag.className = "image";

    let detailsDiv = document.createElement("div");
    detailsDiv.id = "details";

    let h3 = document.createElement("h3");
    let h3Text = document.createTextNode(`Battery Pack ID ${batteryNFT.batteryInfo.token_id}`);
    h3.appendChild(h3Text);

    let link = document.createElement("a");
    link.href = `https://explorer.solana.com/address/${batteryNFT.address}?cluster=${network}`;
    link.textContent = "View on Solana Explorer";
    link.target = "_blank";

    boxDiv.appendChild(boxLink);
    boxLink.appendChild(imgTag);
    boxLink.appendChild(detailsDiv);
    detailsDiv.appendChild(h3);
    detailsDiv.appendChild(link);

    return boxDiv;
}

document.addEventListener('DOMContentLoaded', (event) => {
    console.log(window)
    const searchBox = document.getElementById('input');
    const containerBatteryNFT = document.getElementById('containerBatteryNFT');

    searchBox.addEventListener('input', function() {
        const query = searchBox.value;
        const httpRequest = new XMLHttpRequest();
        
        httpRequest.onreadystatechange = function() {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    const contentTitle = JSON.parse(this.responseText);

                    // Update counter if exists in cookie
                    const counterCookie = document.cookie.split(";").find(cookie => cookie.trim().startsWith("counter="));
                    if (counterCookie) {
                        const counter = counterCookie.split("=")[1];
                        document.getElementById("badge").innerHTML = counter;
                    }

                    // Clear previous results
                    containerBatteryNFT.innerHTML = '';

                    // Append new results
                    for (let i = 0; i < contentTitle.length; i++) {
                        console.log(contentTitle[i]);
                        containerBatteryNFT.appendChild(dynamicBatterySection(contentTitle[i]));
                    }

                    searchBox.value=''
                } else {
                    console.log("call failed!");
                }
            }
        };

        httpRequest.open(
            "GET",
            `http://localhost:3000/api/batteryNFTCollection/${query}`,
            true
        );
        httpRequest.send();
    });

    const connectButton = document.getElementById('connect-button');
    const disconnectButton = document.getElementById('disconnect-button');
    const walletStatus = document.getElementById('wallet-status');
    const walletNetwork = document.getElementById('wallet-network');
    const walletAddress = document.getElementById('wallet-address');
    const walletBalance = document.getElementById('wallet-balance');
    let walletHandler = null;
    
    connectButton.addEventListener('click', async () => {
        try {
            // Check if Phantom wallet is installed
            if (window.solana && window.solana.isPhantom) {
                console.log('Phantom wallet found');
                console.log(solanaWeb3)

                // Connect to the wallet
                const response = await window.solana.connect();
                console.log('Wallet connected');
                walletHandler = response;
                console.log('Connected with public key:', walletHandler.publicKey.toString());

                // Update the UI with the wallet information
                walletStatus.textContent = 'Status: Connected';
                walletNetwork.textContent = `Network: ${network}`
                walletAddress.textContent = `Address: ${walletHandler.publicKey.toString()}`;

                // Fetch the wallet balance
                const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('devnet'));
                const balance = await connection.getBalance(walletHandler.publicKey)
                walletBalance.textContent = `Balance: ${balance / 1000000000} SOL`;

                // Toggle buttons
                connectButton.style.display = 'none';
                disconnectButton.style.display = 'inline-block';
            } else {
                alert('Phantom wallet not found. Please install it from https://phantom.app');
            }
        } catch (error) {
            console.error('Error connecting to Phantom wallet:', error);
            alert('Error connecting to Phantom wallet. Please try again.');
        }
    });

    disconnectButton.addEventListener('click', async () => {        
        if (walletHandler) {
            // Clearing the walletHandler to "disconnect" the wallet
            walletHandler = null;
            console.log('Wallet disconnected');
            // Update UI accordingly (e.g., hide wallet info, show connect button again, etc.)
        } else {
            alert('No wallet connected');
        }

        walletStatus.textContent = 'Status: Not connected';
        walletAddress.textContent = 'Address: N/A';
        walletBalance.textContent = 'Balance: N/A';
        connectButton.style.display = 'inline-block';
        disconnectButton.style.display = 'none';
    });
});


// 7DXH8Py3woz5yrQvvRjdf45XgNu4i2ApTT53eKKyfFmQ