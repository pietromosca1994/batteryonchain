import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createSignerFromKeypair, signerIdentity} from '@metaplex-foundation/umi'
import { BatteryInfo, createBatteryNFT, updateBatteryNFT, BatteryProperties} from "./blockchain"

(async () => {

    const wallet = require('../solana_client/wallet.json');

    const cluster = "devnet"
    const umi = createUmi(`https://api.${cluster}.solana.com`, "finalized")
    let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
    const myKeypairSigner = createSignerFromKeypair(umi, keypair);
    umi.use(signerIdentity(myKeypairSigner));

    // populate collection
    for (let i=0; i<5; i++){
        const batteryInfo: BatteryInfo = {
            token_id: "123",
            battery_category: "test_battery_category",
            battery_weight: "test_battery_weight",
            rated_capacity: "test_rated_capacity",
            nominal_voltage: "test_nominal_voltage"
        }

        const batteryProperties: BatteryProperties = {
            SOH: Math.floor(Math.random() * 100).toString(),
            RUL: Math.floor(Math.random() * 100).toString()
        }

        const collection = '7DXH8Py3woz5yrQvvRjdf45XgNu4i2ApTT53eKKyfFmQ'

        const mint = await createBatteryNFT(umi, batteryInfo, collection);

        updateBatteryNFT(umi, mint, batteryProperties, collection)
    }

})()