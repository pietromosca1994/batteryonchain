import express from 'express';
import cors from 'cors';

import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity} from '@metaplex-foundation/umi'
import {getBatteryNFTInfo, BatteryNFT, getAllMintsForCollection} from './blockchain';

// umi initialization
const cluster = "devnet"
const wallet = require('../solana_client/wallet.json');
const umi = createUmi(`https://api.${cluster}.solana.com`, "finalized")
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));

// app initialization
const app = express();
const port = 3000;

// Enable CORS for all routes
app.use(cors());

app.get('/api/batteryNFT/:batteryNFTAddress', async (req, res) => {
    // Extract the productId from the URL params
    const batteryNFTAddress = req.params.batteryNFTAddress;
    
    const batteryNFT = await getBatteryNFTInfo(umi, batteryNFTAddress)

    // // Find the product from the products array based on productId
    // const product = products.find(p => p.id === parseInt(productId));
  
    // // Check if product exists
    // if (!product) {
    //   return res.status(404).json({ error: 'Product not found' });
    // }
  
    // If found, return the product
    res.json(batteryNFT);
});

app.get('/api/batteryNFTCollection/:batteryNFTCollectionAddress', async (req, res) => {
    const batteryNFTCollectionAddress = req.params.batteryNFTCollectionAddress;
    
    // get addresses of the NFT in the collection
    const batteryNFTAddressList = await getAllMintsForCollection(umi, batteryNFTCollectionAddress)

    // create list of batteryNFT
    let batteryNFTList: BatteryNFT[]=[];
    
    for (const batteryNFTAddress of batteryNFTAddressList ?? []) {
        const batteryNFT = await getBatteryNFTInfo(umi, batteryNFTAddress)
        batteryNFTList.push(batteryNFT)
    }

    res.json(batteryNFTList);
})

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
