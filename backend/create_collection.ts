import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity} from '@metaplex-foundation/umi'
import { irysUploader} from "@metaplex-foundation/umi-uploader-irys";
import { mplCore} from '@metaplex-foundation/mpl-core'
import { CollectionInfo, createBatteryNFTCollection, getAllMintsForCollection} from "./blockchain"

import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

(async () => {

    const wallet = require('../solana_client/wallet.json');

    const cluster = "devnet"
    const umi = createUmi(`https://api.${cluster}.solana.com`, "finalized")
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));

    // // create collection
    // const collectionInfo: CollectionInfo = {
    //     collection_id: "123",
    // }

    // const mint = await createBatteryNFTCollection(umi, collectionInfo);


    const collection='7DXH8Py3woz5yrQvvRjdf45XgNu4i2ApTT53eKKyfFmQ'
    const assetList= await getAllMintsForCollection(umi, collection)
    console.log(assetList)


})()