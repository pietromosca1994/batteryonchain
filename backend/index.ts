import { Web3 } from 'web3';
import {getContractABI} from './utils'
import {
    getVehicles
} from './dimo'
import{ 
    createBatteryNFT, BatteryInfo
} from './blockchain'

require('dotenv').config();

const polygonApiKey = process.env.POLYGONSCAN_API_KEY as string;
const web3 = new Web3(`https://polygon-rpc.com`); 

async function main(){
    console.log('runnning')
    getVehicles(web3);

}

main();