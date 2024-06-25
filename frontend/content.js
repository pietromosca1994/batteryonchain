// console.clear();

const network='devnet';

let contentTitle;

console.log(document.cookie);

function dynamicBatterySection(batteryNFT) {
  let boxDiv = document.createElement("div");
  boxDiv.id = "box";

  //TODO update contentDetails
  let boxLink = document.createElement("a");
  boxLink.href = "/contentDetails.html?" + batteryNFT.address;
  console.log("/contentDetails.html?" + batteryNFT.address)

  let imgTag = document.createElement("img");
  imgTag.src = batteryNFT.image;

  let detailsDiv = document.createElement("div");
  detailsDiv.id = "details";

  let h3 = document.createElement("h3");
  let h3Text = document.createTextNode(batteryNFT.batteryInfo.token_id);
  h3.appendChild(h3Text);

  // let h4 = document.createElement("h4");
  // let text=`
  // address: ${batteryNFT.address}\
  // `
  // let h4Text = document.createTextNode(text);
  // h4.appendChild(h4Text);


  let link = document.createElement("a");
  link.href = `https://explorer.solana.com/address/${batteryNFT.address}?cluster=${network}`;
  link.textContent = "View on Solana Explorer";
  link.target = "_blank";
  // h4.appendChild(link);

  boxDiv.appendChild(boxLink);
  boxLink.appendChild(imgTag);
  boxLink.appendChild(detailsDiv);
  detailsDiv.appendChild(h3);
  detailsDiv.appendChild(link);

  return boxDiv;

}

//  TO SHOW THE RENDERED CODE IN CONSOLE
// console.log(dynamicClothingSection());

// console.log(boxDiv)

let mainContainer = document.getElementById("mainContainer");
let containerBatteryNFT = document.getElementById("containerBatteryNFT");

// BACKEND CALLING

let httpRequest = new XMLHttpRequest();

httpRequest.onreadystatechange = function() {
  if (this.readyState === 4) {
    if (this.status == 200) {
      // console.log('call successful');
      contentTitle = JSON.parse(this.responseText);
      
      if (document.cookie.indexOf(",counter=") >= 0) {
        var counter = document.cookie.split(",")[1].split("=")[1];
        document.getElementById("badge").innerHTML = counter;
      }

      for (let i = 0; i < contentTitle.length; i++) {
        console.log(contentTitle[i]);
        containerBatteryNFT.appendChild(
          dynamicBatterySection(contentTitle[i])
        );
      }

    } else {
      console.log("call failed!");
    }
  }
};
httpRequest.open(
  "GET",
  "http://localhost:3000/api/batteryNFTCollection/7DXH8Py3woz5yrQvvRjdf45XgNu4i2ApTT53eKKyfFmQ",
  true
);
httpRequest.send();
