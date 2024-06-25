import axios from 'axios';

interface PolygonscanResponse {
    status: string;
    message: string;
    result: string;
}

/**
 * Fetches the ABI of a smart contract from Polygonscan.
 * 
 * @param contractAddress - The address of the smart contract.
 * @param apiKey - Your Polygonscan API key.
 * @returns The ABI of the smart contract.
 */
export async function getContractABI(contractAddress: string, apiKey: string): Promise<any> {
    const url = `https://api.polygonscan.com/api?module=contract&action=getabi&address=${contractAddress}&apikey=${apiKey}`;

    try {
        const response = await axios.get<PolygonscanResponse>(url);
        const data = response.data;

        if (data.status === '1') {
            const abi = JSON.parse(data.result);
            return abi;
        } else {
            console.error('Error:', data.message);
            throw new Error(data.message);
        }
    } catch (error) {
        console.error('Error fetching ABI:', error);
        throw error;
    }
}
