import { Connection, clusterApiUrl, PublicKey, VersionedMessage, VersionedTransactionResponse } from '@solana/web3.js';

const connection = new Connection(clusterApiUrl('devnet'), 'confirmed'); // Use 'devnet' or 'testnet' if needed

interface KeyValue {
    key: string;
    value: string;
  }

async function getTokenTransactionSignatures(tokenMintAddress: PublicKey) {
  try {
    const signatures = await connection.getSignaturesForAddress(tokenMintAddress);
    return signatures;
  } catch (error) {
    console.error('Error fetching signatures:', error);
    return [];
  }
}

async function getTransactionDetails(signatures: any[]): Promise<VersionedTransactionResponse[]> {
    const transactions: VersionedTransactionResponse[] = []; // Correctly typed array
    
    for (const signature of signatures) {
      try {
        const transaction = await connection.getTransaction(signature.signature, {commitment: 'finalized', maxSupportedTransactionVersion: 0}) as VersionedTransactionResponse; // Cast the result to the correct type
        if (transaction) {
          transactions.push(transaction);
        }
        
      } catch (error) {
        console.error(`Error fetching transaction details for ${signature.signature}:`, error);
      }
    }
    return transactions
}

  
function decodeBuffer(buffer: Uint8Array): KeyValue[] {
    const keyValues: KeyValue[] = [];
    let offset = 6; // Adjusted to skip the first 6 bytes of metadata
    
    while (offset < buffer.length) {
      // Read key length (4 bytes)
      const keyLength = readUInt32LE(buffer, offset);
      offset += 4;
  
      // Read key
      const key = buffer.slice(offset, offset + keyLength).toString();
      offset += keyLength;
  
      // Read value length (4 bytes)
      const valueLength = readUInt32LE(buffer, offset);
      offset += 4;
  
      // Read value
      const value = buffer.slice(offset, offset + valueLength).toString();
      offset += valueLength;
  
      // Store the key-value pair
      keyValues.push({ key, value });
    }
  
    return keyValues;
  }
  
  // Helper function to read unsigned 32-bit little-endian integer from Uint8Array
  function readUInt32LE(buffer: Uint8Array, offset: number): number {
    return buffer[offset] | (buffer[offset + 1] << 8) | (buffer[offset + 2] << 16) | (buffer[offset + 3] << 24);
  }

async function main() {
    const tokenMintAddress = new PublicKey('CPYrV1Sb9vGcMLF222S7KNKAN4bDG7HyiFNv9sAqbwLD'); // Replace with the actual token mint address

    const signatures = await getTokenTransactionSignatures(tokenMintAddress);
    const transactions = await getTransactionDetails(signatures);

    for (const transaction of transactions){
        console.log(transaction)
    }

    // for (const transaction of transactions){
    //     console.log(`slot ${transaction.slot}`)
    //     // for (const innerInstruction of transaction.meta?.innerInstructions?? []){
    //     //     for (const instruction of innerInstruction ?? []){

    //     //     }
    //     // }
    //     for (const innerInstruction of transaction.transaction.message.compiledInstructions ?? []){
    //         console.log(innerInstruction.data.toString())
    //     }
    // }

//     const encodedData = new Uint8Array([0x06, 0x06, 0x02, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x6b, 0x65, 0x79, 0x31, 0x0e, 0x00, 0x00, 0x00, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x31, 0x5f, 0x75, 0x70, 0x64, 0x61, 0x74, 0x65, 0x64, 0x04, 0x00, 0x00, 0x00, 0x6b, 0x65, 0x79, 0x32, 0x0e, 0x00, 0x00, 0x00, 0x76, 0x61, 0x6c, 0x75, 0x65, 0x32]);
// const decoded = decodeBuffer(encodedData);
// console.log(decoded);
    
}

main();