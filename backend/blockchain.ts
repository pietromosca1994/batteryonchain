// https://developers.metaplex.com/core/create-asset
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, createSignerFromKeypair, signerIdentity, percentAmount, PublicKey, createGenericFile, KeypairSigner, Umi, Pda } from '@metaplex-foundation/umi'
import { createV2, transferV1, mplCore, addPluginV1, createPluginV2, pluginAuthority, fetchAsset, updatePlugin, Attribute, AssetV1, createCollection} from '@metaplex-foundation/mpl-core'
import { irysUploader} from "@metaplex-foundation/umi-uploader-irys";
import {createAndMint, TokenStandard, mintV1, createNft, createFungibleAsset, mplTokenMetadata, fetchDigitalAsset} from "@metaplex-foundation/mpl-token-metadata"
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';
import { readFile } from "fs/promises";

const wallet = require('wallet.json');

const cluster = "devnet"
const umi = createUmi(`https://api.${cluster}.solana.com`, "finalized").use(mplCore())
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(myKeypairSigner));
umi.use(mplTokenMetadata())
umi.use(irysUploader());

export interface CollectionInfo {
  collection_id: string
}

export interface BatteryInfo {
  token_id?: string,
  battery_category?: string,
  battery_weight?: string;
  rated_capacity?: string,
  nominal_voltage?: string
}

export interface BatteryProperties {
  SOH: string,
  RUL: string
}

export interface BatteryNFT {
  address: string,
  image: string,
  description: string,
  batteryInfo: BatteryInfo,
  batteryProperties: BatteryProperties
}

interface Trait {
  trait_type: string;
  value: string;
}

interface File {
  uri: string;
  type: string;
  cdn?: boolean;
}

interface Property {
  [key: string]: any;
}

interface Uri {
  name: string;
  description: string;
  image: string;
  animation_url: string;
  external_url: string;
  attributes: Trait[];
  properties: Property;
  files: File[];
  category: string;
}

export async function createBatteryNFTCollection(umi: Umi, collectionInfo: CollectionInfo): Promise<string>{
  // initialize umi
  umi.use(mplCore())
  umi.use(irysUploader());

  // create metadata
  const image = await readFile('./battery_pack.jpeg');
  const imageFile = createGenericFile(image, "battery_pack")

  const imageUri = await umi.uploader.upload([imageFile], {
      onProgress: (percent) => {
          console.log(`${percent * 100}% uploaded...`);
      },
  })

  // https://developers.metaplex.com/core/what-is-an-asset
  const uri = await umi.uploader.uploadJson({
  name: `Battery Pack Collection ID ${collectionInfo.collection_id}`,
  description: `Battery Pack Collection ID ${collectionInfo.collection_id}`,
  image: imageUri[0],
  // animation_url
  // external_url
  // attributes
  // TODO rewrite arcoded array
  "attributes": [
    {
      "trait_type": "collection_id",
      "value": collectionInfo.collection_id
    }
  ]
  // properties
  })

  // create mint address
  const mint = generateSigner(umi);

  await createCollection(umi, {
    collection: mint,
    name: `Battery Pack Collection ID ${collectionInfo.collection_id}`,
    uri: uri,
    updateAuthority: umi.identity.publicKey,
  }).sendAndConfirm(umi)

  console.log(`Mint address:      ${mint.publicKey}`)
  console.log(`Solana Explorer:   https://explorer.solana.com/address/${mint.publicKey}?cluster=${cluster}`)
  console.log(`Solscan:           https://solscan.io/token/${mint.publicKey}?cluster=${cluster}`)

  return mint.publicKey

}

export async function createBatteryNFT(umi: Umi, batteryInfo: BatteryInfo, collection?: string): Promise<string>{
  // initialize umi
  umi.use(mplCore())
  umi.use(irysUploader());

  // create metadata
  const image = await readFile('./battery_pack.jpeg');
  const imageFile = createGenericFile(image, "battery_pack")

  const imageUri = await umi.uploader.upload([imageFile], {
      onProgress: (percent) => {
          console.log(`${percent * 100}% uploaded...`);
      },
  })

  // https://developers.metaplex.com/core/what-is-an-asset
  const uri = await umi.uploader.uploadJson({
  name: `Battery Pack ID ${batteryInfo.token_id}`,
  description: `Battery Pack ID ${batteryInfo.token_id}`,
  image: imageUri[0],
  // animation_url
  // external_url
  // attributes
  // TODO rewrite arcoded array
  "attributes": [
    {
      "trait_type": "token_id",
      "value": batteryInfo.token_id
    },
    {
      "trait_type": "battery_category",
      "value": batteryInfo.battery_category
    },
    {
      "trait_type": "battery_weight",
      "value": batteryInfo.battery_weight
    },
    {
      "trait_type": "rated_capacity",
      "value": batteryInfo.rated_capacity
    },
    {
      "trait_type": "nominal_voltage",
      "value": batteryInfo.nominal_voltage
    },
  ]
  // properties
  })

  // create mint address
  const mint = generateSigner(umi);

  // create asset
  await createV2(umi, {
    asset: mint,
    name: `Battery Pack ID ${batteryInfo.token_id}`,
    uri: uri,
    collection: collection as PublicKey,
    // updateAuthority: umi.identity.publicKey, // Cannot specify both an update authority and collection on an asset
    payer: umi.identity,
    owner: umi.identity.publicKey,
    authority: umi.identity,
    // plugins: [
    //   {
    //     plugin: {
    //       __kind: "Attributes",
    //       fields: [
    //         {
    //           attributeList: [
    //             { key: "SOH", value: "value1" },
    //             { key: "RUL", value: "value2" }
    //           ]
    //         }
    //       ]
    //     },
    //     authority: {
    //       __kind: 'UpdateAuthority'
    //     }
    //   }
    // ]
    plugins: [
      {
        plugin: createPluginV2({
          type: 'Attributes',
          attributeList: [{ key: 'SOH', value: 'NA' },
                          { key: 'RUL', value: 'NA' }
          ],
        }),
        authority: pluginAuthority('UpdateAuthority'),
      },
    ]
  }).sendAndConfirm(umi)

  // // from mpl-token-metadata
  // await createV1(umi, {
  //   mint,
  //   authority: umi.identity,
  //   name: 'My NFT',
  //   uri,
  //   sellerFeeBasisPoints: percentAmount(0),
  //   tokenStandard: TokenStandard.NonFungible,
  // }).sendAndConfirm(umi)

  // await addPluginV1(umi, {
  //   asset: mint.publicKey,
  //   plugin: {
  //     __kind: 'Attributes',
  //     fields: [
  //       {
  //         attributeList: [
  //           { key: "SOH", value: "value1" },
  //           { key: "RUL", value: "value2" }
  //         ]
  //       }
  //     ]
  //   }
  // }).sendAndConfirm(umi);

  // await mintV1(umi, {
  //   mint: mint.publicKey,
  //   authority: umi.identity,
  //   amount: 1,
  //   tokenOwner: umi.identity.publicKey,
  //   tokenStandard: TokenStandard.NonFungible,
  // }).sendAndConfirm(umi)

  // await createAndMint(umi, {
  //   mint,
  //   name: `Battery Pack ID ${batteryInfo.token_id}`,
  //   symbol: "BTT",
  //   uri: uri,
  //   // creators: [umi.payer.publicKey]
  //   sellerFeeBasisPoints: percentAmount(0),
  //   amount: 1,
  //   tokenOwner: umi.payer.publicKey,
  //   tokenStandard: TokenStandard.NonFungible
  // }).sendAndConfirm(umi)

  console.log(`Mint address:      ${mint.publicKey}`)
  console.log(`Solana Explorer:   https://explorer.solana.com/address/${mint.publicKey}?cluster=${cluster}`)
  console.log(`Solscan:           https://solscan.io/token/${mint.publicKey}?cluster=${cluster}`)

  return mint.publicKey
}

export async function fetchBatteryNFT(assetAddress: string | PublicKey): Promise<AssetV1>{
  // fetch asset
  // might be changed for getAsset from https://github.com/metaplex-foundation/digital-asset-standard-api
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  const uri = await fetchUri(asset.uri)

  // display fields
  console.log(`name:      ${asset.name}`)
  console.log(`owner:     ${asset.owner}`)
  console.log(`uri:       ${asset.uri}`)

  // display attributes
  for (const trait of uri.attributes ?? []) {// Check if the property is a direct property of the object
    console.log(`trait: ${trait.trait_type}:     ${trait.value}`);
    // console.log(trait)
  }

  for (const attribute of asset.attributes?.attributeList ?? []) {
    console.log(`attribute ${attribute.key}:      ${attribute.value}`)
  }

  // return asset
  return asset
}

async function fetchUri(uri: string): Promise<Uri> {
  try {
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const data = await response.json();

    // Type assertion to cast data to Uri type
    return data as Uri;
  } catch (error) {
    console.error('Failed to fetch data:', error);
    throw error;
  }
}

export async function updateBatteryNFT(umi: Umi, assetAddress: string, properties: BatteryProperties, collection: string){

  // initialize umi
  umi.use(mplCore())
  umi.use(irysUploader());

  // change type to list
  const propertiesList=properties2Array(properties)

  // update properties
  await updatePlugin(umi, {
    asset: assetAddress as PublicKey,
    collection: collection as PublicKey,
    plugin: {
      type: 'Attributes',
      attributeList: propertiesList
    },
  }).sendAndConfirm(umi)

  // TODO print updated properties from asset
}

function array2Attributes(uri: Uri): BatteryInfo {
  // initialize to NA
  let batteryInfo: BatteryInfo = {
    token_id: 'NA',
    battery_category: 'NA',
    battery_weight: 'NA',
    rated_capacity: 'NA',
    nominal_voltage: 'NA',
  };

  // Iterate through each attribute in uri.attributes
  if (Array.isArray(uri.attributes)) {
    uri.attributes.forEach((attr) => {
      // Check each trait_type and assign the corresponding property
      switch (attr.trait_type) {
        case 'token_id':
          batteryInfo.token_id = attr.value;
          break;
        case 'battery_category':
          batteryInfo.battery_category = attr.value;
          break;
        case 'battery_weight':
          batteryInfo.battery_weight = attr.value;
          break;
        case 'rated_capacity':
          batteryInfo.rated_capacity = attr.value;
          break;
        case 'nominal_voltage':
          batteryInfo.nominal_voltage = attr.value;
          break;
        // Add more cases if there are additional traits
        default:
          // Handle unknown trait types or ignore them
          break;
      }
    });
  }

  return batteryInfo;
}

const properties2Array = (properties: BatteryProperties): Attribute[] => {
  let propertiesList: Attribute[] = [];

  for (const key in properties) {
      if (properties.hasOwnProperty(key)) {
          propertiesList.push({
              key: key,
              value: properties[key as keyof BatteryProperties] // Properly type the key
          });
      }
  }
  return propertiesList;
};

function array2Properties(asset: AssetV1): BatteryProperties {
  // initialize to NA
  let batteryProperties: BatteryProperties = {
    SOH: 'NA',
    RUL: 'NA'
  };

  // Iterate through each attribute in uri.attributes
  if (Array.isArray(asset.attributes?.attributeList)) {
    asset.attributes?.attributeList.forEach((attr) => {
      // Check each trait_type and assign the corresponding property
      switch (attr.key) {
        case 'SOH':
          batteryProperties.SOH = attr.value;
          break;
        case 'RUL':
          batteryProperties.RUL = attr.value;
          break;
        // Add more cases if there are additional traits
        default:
          // Handle unknown trait types or ignore them
          break;
      }
    });
  }

  return batteryProperties;
}

export async function getBatteryNFTInfo(umi: Umi, assetAddress: string | PublicKey): Promise<BatteryNFT>{
  // get asset
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // get uri
  const uri = await fetchUri(asset.uri)

  const batteryNFT: BatteryNFT = {
    address: assetAddress,
    image: uri.image,
    description: uri.description,
    batteryInfo: array2Attributes(uri),
    batteryProperties: array2Properties(asset)
  }

  return batteryNFT
}

// https://github.com/metaplex-foundation/digital-asset-standard-api
export async function getAllMintsForCollection(umi: Umi, collection: string): Promise<string[]> {
  // initialize umi
  umi.use(dasApi())
  
  const assets = await umi.rpc.getAssetsByGroup({
    groupKey: 'collection',
    groupValue: collection,
  });

  let assetsList: string[] = []
  for (const asset of assets.items ?? []) { 
    assetsList.push(asset.id)
  }

  return assetsList
}

// (async () => {
//   const batteryInfo: BatteryInfo = {
//     token_id: "123",
//     battery_category: "test_battery_category",
//     battery_weight: "test_battery_weight",
//     rated_capacity: "test_rated_capacity",
//     nominal_voltage: "test_nominal_voltage"
//   }

//   // const mint = await createBatteryNFT(batteryInfo);
//   const mint='CPYrV1Sb9vGcMLF222S7KNKAN4bDG7HyiFNv9sAqbwLD'
//   const batteryNFT = await getBatteryNFTInfo(mint)

//   console.log(batteryNFT)

//   // // update attributes
//   // const attributeList : Attribute[] =[
//   //   {key: 'SOH', value: 'value1_updated'},
//   //   {key: 'RUL', value: 'value2_updated'},
//   // ]
//   // updateBatteryNFT(mint.publicKey, attributeList)


// })()


