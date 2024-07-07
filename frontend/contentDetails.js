console.clear()

let id = location.search.split('?')[1]
console.log(id)

const network='devnet'

function dynamicContentDetails(batteryNFT){
    let mainContainer = document.createElement('div')
    mainContainer.id = 'containerD'
    document.getElementById('containerBatteryNFT').appendChild(mainContainer);

    let imageSectionDiv = document.createElement('div')
    imageSectionDiv.id = 'imageSection'

    let imgTag = document.createElement('img')
    imgTag.id = 'imgDetails'
    //imgTag.id = ob.photos
    imgTag.src = batteryNFT.image

    imageSectionDiv.appendChild(imgTag)

    // battery attributes section
    let batteryNFTAttributesDiv = document.createElement('div')
    batteryNFTAttributesDiv.id = 'batteryNFTAttributes'

    let h1_attributes = document.createElement('h1')
    let h1Text = document.createTextNode(batteryNFT.description)
    h1_attributes.appendChild(h1Text)

    let link = document.createElement("a");
    link.href = `https://explorer.solana.com/address/${batteryNFT.address}?cluster=${network}`;
    link.textContent = "View on Solana Explorer";
    link.target = "_blank";

    let h4_attributes = document.createElement('div');
    let attributes_text = 
    `Token ID: ${batteryNFT.batteryInfo.token_id}\n`+
    `Battery Category: ${batteryNFT.batteryInfo.battery_category}\n`+
    `Battery Weight: ${batteryNFT.batteryInfo.battery_weight}\n`+
    `Rated Capacity: ${batteryNFT.batteryInfo.rated_capacity}\n`+
    `Nominal Voltage': ${batteryNFT.batteryInfo.nominal_voltage}\n`
    let preElementAttributes = document.createElement('pre');
    preElementAttributes.textContent = attributes_text; // Set the text content of preElement
    h4_attributes.appendChild(preElementAttributes);

    // battery properties section
    let batteryNFTPropertiesDiv=document.createElement('div')
    batteryNFTPropertiesDiv.id = 'batteryNFTProperties'
    let preElementProperties = document.createElement('pre');
    let propertiesText =
    `SOH: ${batteryNFT.batteryProperties.SOH} %\n`+
    `RUL: ${batteryNFT.batteryProperties.RUL} cycles\n`
    preElementProperties.textContent = propertiesText; // Set the text content of preElement
    batteryNFTPropertiesDiv.appendChild(preElementProperties);

    let h3_properties = document.createElement('h3')
    h1Text = document.createTextNode('Properties')
    h3_properties.appendChild(h1Text)

    let h3_attributes = document.createElement('h3')
    h1Text = document.createTextNode('Attributes')
    h3_attributes.appendChild(h1Text)



    // console.log(mainContainer.appendChild(imageSectionDiv));
    mainContainer.appendChild(imageSectionDiv)
    mainContainer.appendChild(batteryNFTAttributesDiv)
    
    // batteryPropertiesSectionDiv.appendChild(batteryNFTAttributesDiv)
    imageSectionDiv.appendChild(batteryNFTPropertiesDiv)

    batteryNFTAttributesDiv.appendChild(h1_attributes)
    batteryNFTAttributesDiv.appendChild(link)
    batteryNFTAttributesDiv.appendChild(h3_attributes)
    batteryNFTAttributesDiv.appendChild(h4_attributes)
    batteryNFTAttributesDiv.appendChild(h3_properties)
    // h4_attributes.appendChild(preElementAttributes)

    batteryNFTAttributesDiv.appendChild(preElementProperties)

    // batteryNFTPropertiesDiv.appendChild(h3_properties)
    // batteryNFTAttributes.appendChild(h4)
    // batteryNFTAttributes.appendChild(detailsDiv)
    // detailsDiv.appendChild(h3DetailsDiv)
    // detailsDiv.appendChild(h3)
    // detailsDiv.appendChild(para)
    // batteryNFTAttributes.appendChild(productPreviewDiv)
}

// BACKEND CALLING
let httpRequest = new XMLHttpRequest()
{
    httpRequest.onreadystatechange = function()
    {
        if(this.readyState === 4 && this.status == 200)
        {
            console.log('connected!!');
            let contentDetails = JSON.parse(this.responseText)
            {
                console.log(contentDetails);
                dynamicContentDetails(contentDetails)
            }
        }
        else
        {
            console.log('not connected!');
        }
    }
}

httpRequest.open('GET', 'http://localhost:3000/api/batteryNFT/'+id, true)
httpRequest.send()  
