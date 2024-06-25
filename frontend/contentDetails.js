console.clear()

let id = location.search.split('?')[1]
console.log(id)

// if(document.cookie.indexOf(',counter=')>=0)
// {
//     let counter = document.cookie.split(',')[1].split('=')[1]
//     document.getElementById("badge").innerHTML = counter
// }

// function dynamicContentDetails(ob)
// {
//     let mainContainer = document.createElement('div')
//     mainContainer.id = 'containerD'
//     document.getElementById('containerBatteryNFT').appendChild(mainContainer);

//     let imageSectionDiv = document.createElement('div')
//     imageSectionDiv.id = 'imageSection'

//     let imgTag = document.createElement('img')
//      imgTag.id = 'imgDetails'
//      //imgTag.id = ob.photos
//      imgTag.src = ob.preview

//     imageSectionDiv.appendChild(imgTag)

//     let batteryNFTAttributes = document.createElement('div')
//     batteryNFTAttributes.id = 'batteryNFTAttributes'

//     // console.log(batteryNFTAttributes);

//     let h1 = document.createElement('h1')
//     let h1Text = document.createTextNode(ob.name)
//     h1.appendChild(h1Text)

//     let h4 = document.createElement('h4')
//     let h4Text = document.createTextNode(ob.brand)
//     h4.appendChild(h4Text)
//     console.log(h4);

//     let detailsDiv = document.createElement('div')
//     detailsDiv.id = 'details'

//     let h3DetailsDiv = document.createElement('h3')
//     let h3DetailsText = document.createTextNode('Rs ' + ob.price)
//     h3DetailsDiv.appendChild(h3DetailsText)

//     let h3 = document.createElement('h3')
//     let h3Text = document.createTextNode('Description')
//     h3.appendChild(h3Text)

//     let para = document.createElement('p')
//     let paraText = document.createTextNode(ob.description)
//     para.appendChild(paraText)

//     let productPreviewDiv = document.createElement('div')
//     productPreviewDiv.id = 'productPreview'

//     let h3ProductPreviewDiv = document.createElement('h3')
//     let h3ProductPreviewText = document.createTextNode('Product Preview')
//     h3ProductPreviewDiv.appendChild(h3ProductPreviewText)
//     productPreviewDiv.appendChild(h3ProductPreviewDiv)

//     let i;
//     for(i=0; i<ob.photos.length; i++)
//     {
//         let imgTagProductPreviewDiv = document.createElement('img')
//         imgTagProductPreviewDiv.id = 'previewImg'
//         imgTagProductPreviewDiv.src = ob.photos[i]
//         imgTagProductPreviewDiv.onclick = function(event)
//         {
//             console.log("clicked" + this.src)
//             imgTag.src = ob.photos[i]
//             document.getElementById("imgDetails").src = this.src 
            
//         }
//         productPreviewDiv.appendChild(imgTagProductPreviewDiv)
//     }

//     let buttonDiv = document.createElement('div')
//     buttonDiv.id = 'button'

//     let buttonTag = document.createElement('button')
//     buttonDiv.appendChild(buttonTag)

//     buttonText = document.createTextNode('Add to Cart')
//     buttonTag.onclick  =   function()
//     {
//         let order = id+" "
//         let counter = 1
//         if(document.cookie.indexOf(',counter=')>=0)
//         {
//             order = id + " " + document.cookie.split(',')[0].split('=')[1]
//             counter = Number(document.cookie.split(',')[1].split('=')[1]) + 1
//         }
//         document.cookie = "orderId=" + order + ",counter=" + counter
//         document.getElementById("badge").innerHTML = counter
//         console.log(document.cookie)
//     }
//     buttonTag.appendChild(buttonText)


//     console.log(mainContainer.appendChild(imageSectionDiv));
//     mainContainer.appendChild(imageSectionDiv)
//     mainContainer.appendChild(batteryNFTAttributes)
//     batteryNFTAttributes.appendChild(h1)
//     batteryNFTAttributes.appendChild(h4)
//     batteryNFTAttributes.appendChild(detailsDiv)
//     detailsDiv.appendChild(h3DetailsDiv)
//     detailsDiv.appendChild(h3)
//     detailsDiv.appendChild(para)
//     batteryNFTAttributes.appendChild(productPreviewDiv)
    
    
//     batteryNFTAttributes.appendChild(buttonDiv)


//     return mainContainer
// }

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

    let h4_attributes = document.createElement('div');
    let text = 
    `Token ID: ${batteryNFT.batteryInfo.token_id}\n`+
    `Battery Category: ${batteryNFT.batteryInfo.battery_category}\n`+
    `Battery Weight: ${batteryNFT.batteryInfo.battery_weight}\n`+
    `Rated Capacity: ${batteryNFT.batteryInfo.rated_capacity}\n`+
    `Nominal Voltage': ${batteryNFT.batteryInfo.nominal_voltage}\n`

    let preElement = document.createElement('pre');
    preElement.textContent = text; // Set the text content of preElement
    h4_attributes.appendChild(preElement);

    // battery properties section
    let batteryNFTPropertiesDiv=document.createElement('div')
    batteryNFTPropertiesDiv.id = 'batteryNFTProperties'

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
    batteryNFTAttributesDiv.appendChild(h3_attributes)
    batteryNFTAttributesDiv.appendChild(h4_attributes)
    batteryNFTAttributesDiv.appendChild(h3_properties)
    h4_attributes.appendChild(preElement)

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
