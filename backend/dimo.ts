import { Web3 } from 'web3';
import {getContractABI} from './utils'
import axios from 'axios';

export const DIMO_VEHICLE_TOKEN_ADDRESS='0xbA5738a18d83D41847dfFbDC6101d37C69c9B0cF'
export const DIMO_VEHICLE_TOKEN_PROXY_ADDRESS='0xA95F69F7D84E10ec9e77Da34b1E4253DD91B0265'

require('dotenv').config();
const polygonApiKey = process.env.POLYGONSCAN_API_KEY as string;

interface VehicleInfo {
    name: string;
    description: string;
    image: string;
    attributes: VehicleAttribute[];
}

interface VehicleAttribute {
    trait_type: string;
    value: string;
}

/**
 * Fetches vehicle information from the given URI.
 * 
 * @param uri - uri of the vehicle
 * @returns The information of the vehicle.
 */
export async function getVehicleInfo(uri: string): Promise<VehicleInfo> {
    try {
        const response = await axios.get<VehicleInfo>(uri);
        const vehicleInfo = response.data;
        return vehicleInfo;
    } catch (error) {
        console.error('Error fetching vehicle info:', error);
        throw error;
    }
}

/**
 * Fetches vehicle information from the given URI.
 * 
 * @param uri - URI of the vehicle.
 * @returns The information of the vehicle.
 */
export async function getVehicles(web3: Web3){
    const abi= await getContractABI(DIMO_VEHICLE_TOKEN_PROXY_ADDRESS, polygonApiKey);

    const dimoVehicleTokenContract = new web3.eth.Contract(abi,  DIMO_VEHICLE_TOKEN_ADDRESS)
    
    // get token uri
    const uri = await dimoVehicleTokenContract.methods.tokenURI('84304').call() as string;
    const vehicleInfo = await getVehicleInfo(uri);
    console.log(vehicleInfo)

    try{
        // get past events 
        // Define event name and filter options
        const eventName: string = 'Transfer'; // Replace with the name of your event
        
        let filterOptions={
            filter: {
                    from: '0x0000000000000000000000000000000000000000', // consider only the mint 
            },
            // fromBlock: 57232501-10, // Start block number
            // toBlock: 57235010, // End block number (or 'latest' for the latest block)
            // fromBlock: 'latest',
            // toBlock: 'latest'
            // fromBlock: 0
        }

        // // Get past events
        // dimoVehicleTokenContract.getPastEvents(eventName, filterOptions)
        //     .then((events: any[]) => {
        //         // Process retrieved events
        //         console.log('Retrieved events:', events);
        //     })
        //     .catch((error: Error) => {
        //         console.error('Error retrieving events:', error);
        //     });

        // subscribe to events
        // const eventEmitter = dimoVehicleTokenContract.events[eventName](filterOptions);
        const eventEmitter = dimoVehicleTokenContract.events.Transfer(filterOptions);

        eventEmitter.on("connected", function(subscriptionId){
            console.log(subscriptionId);
          });
          
          eventEmitter.on('data', function(event){
            console.log(event); // same results as the optional callback above
          });
          
          eventEmitter.on('changed', function(event){
            // remove event from local database
          })
        
        // Optionally handle stopping the listener
        // You might use this to stop listening after a certain condition
        // Keep the function running indefinitely
        while (true) {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Sleep for 1 second
        }

    } catch (error) {
        console.error('Failed to listen for events:', error);
    }

}