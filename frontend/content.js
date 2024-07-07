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
    const input = document.getElementById('input');
    const containerBatteryNFT = document.getElementById('containerBatteryNFT');

    input.addEventListener('input', function() {
        const query = input.value;
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

                    input.value=''
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
});

document.addEventListener('DOMContentLoaded', (event) => {
  const connectButton = document.getElementById('connect-button');

  connectButton.addEventListener('click', async () => {
      try {
          console.log('push')
          // Check if Phantom wallet is installed
          if (window.solana && window.solana.isPhantom) {
              console.log('Phantom wallet found');

              // Connect to the wallet
              const response = await window.solana.connect();
              console.log('Connected with public key:', response.publicKey.toString());

              // Do something with the wallet connection
              // For example, you can get the wallet address
              const walletAddress = response.publicKey.toString();
              alert(`Connected to wallet: ${walletAddress}`);
          } else {
              alert('Phantom wallet not found. Please install it from https://phantom.app');
          }
      } catch (error) {
          console.error('Error connecting to Phantom wallet:', error);
          alert('Error connecting to Phantom wallet. Please try again.');
      }
  });
});

// 7DXH8Py3woz5yrQvvRjdf45XgNu4i2ApTT53eKKyfFmQ