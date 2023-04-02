// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage';
// import { filesFromPaths } from 'files-from-path';
import { Web3Storage, filesFromPath } from 'web3.storage';
// import print function
import { printTextOnImageAndReturnBuffer } from './PrintOnImages';

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from 'mime';
// import * as mime from "mime-types";

// The 'fs' builtin module on Node.js provides access to the file system
// import fs from 'fs';
import * as fs from "fs";

// The 'path' module provides helpers for manipulating filesystem paths
// import path from 'path';
import * as path from "path";

import * as dotenv from "dotenv";
dotenv.config();

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY: any = process.env.NFT_STORAGE_KEY
const endpoint: URL = new URL('https://api.nft.storage') // the default

type Attributes = {
    head: number[];
    chest: number[];
    legs: number[];
    weapon: number[];
}

function generateRange(start: number, end: number): number[] {
    const range: number[] = [];
  
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
  
    return range;
}

async function storeNFTdir(attrs: Attributes) {
    const DisclaimerStr: string = "Disclaimer: only for use by Team 8 as a Solidity Encode Club Bootcamp (Early, 2023) Final Project";

    var files = []
    for (let attr in attrs) {
        var ids: number[] = attrs[attr as keyof Attributes];
        for(let i=0; i < ids.length; i++){
            let baseImageSrc: string = "./images/" + attr + "/base.jpg";
            let TextStr: string = String(ids[i]);
            var buffer = await printTextOnImageAndReturnBuffer(baseImageSrc, DisclaimerStr, TextStr);
            var file = new File([buffer], "images/"+attr+"/"+path.basename(String(ids[i])+".jpg"));
            files.push(file);
        }
    }

    const client = new NFTStorage({ token: NFT_STORAGE_KEY, endpoint:  endpoint});
    const cid = await client.storeDirectory(files);
    const status = await client.status(cid);
    console.log("status:", status);

    return {"CID": cid, "images": attrs};
}

async function storeJSONNFTdir(attrs: Attributes) {
    const dir = "./scripts/NFTStorage/";
    const jsonFileName = dir + "JSONs/NftStorageFilesDir.json";
    const NftStorageDirDataJSON = await fs.promises.readFile(jsonFileName);
    const jsonParsed = JSON.parse(NftStorageDirDataJSON.toString());
    const CIDdir = jsonParsed["CID"];

    var files = []
    for (let attr in attrs) {
        var ids: number[] = attrs[attr as keyof Attributes];
        for(let i=0; i < ids.length; i++){
            var attrName = attr + " #" + String(ids[i])
            var content = {
                "name": "NFT - " + attrName,
                "description": attrName + " is a part of " + attr + " NFT collection with randomly generate strength parameter",
                "image": "ipfs://"+CIDdir+"/images/"+attr+"/"+String(ids[i])+".jpg",
                "strength": String(Math.floor(Math.random() * 10)),
            };
            var file = new File([JSON.stringify(content)], "metadata/"+attr+"/"+String(ids[i]), { type: "application/json" });
            files.push(file);
        }
    }
    const client = new NFTStorage({ token: NFT_STORAGE_KEY });
    const cid = await client.storeDirectory(files);
    const status = await client.status(cid);
    console.log("status:", status);

    return {"CID": cid, "metadata": attrs};
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 * 
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
async function main() {
    let attributes: Attributes = {
        "head": generateRange(1,10),
        "chest": generateRange(1,10),
        "legs": generateRange(1,10),
        "weapon": generateRange(1,10)
    };
    console.log("Attributes:", attributes);

    // for (let attr in attributes) {
    //     // FILES IN A DIRECTORY:
    //     const JsonStoreNFTdir: any = await storeNFTdir(attr, attributes[attr as keyof Attributes]);
    //     console.log("NFT.Storage Files Directory CID:", JsonStoreNFTdir.CID);
    //     fs.writeFileSync("./scripts/NFTStorage/JSONs/NftStorageFilesDir.json", JSON.stringify(JsonStoreNFTdir));

    //     // JSON IN A DIRECTORY:
    //     const JsonStoreJSONNFTdir: any = await storeJSONNFTdir(attr, attributes[attr as keyof Attributes]);
    //     console.log("NFT.Storage Files Metadata CID:", JsonStoreJSONNFTdir.CID);
    //     fs.writeFileSync("./scripts/NFTStorage/JSONs/NftStorageMetadataDir.json", JSON.stringify(JsonStoreJSONNFTdir));
    // }

    // FILES IN A DIRECTORY:
    const JsonStoreNFTdir: any = await storeNFTdir(attributes);
    console.log("NFT.Storage Files Directory CID:", JsonStoreNFTdir.CID);
    fs.writeFileSync("./scripts/NFTStorage/JSONs/NftStorageFilesDir.json", JSON.stringify(JsonStoreNFTdir));

    // JSON IN A DIRECTORY:
    const JsonStoreJSONNFTdir: any = await storeJSONNFTdir(attributes);
    console.log("NFT.Storage Files Metadata CID:", JsonStoreJSONNFTdir.CID);
    fs.writeFileSync("./scripts/NFTStorage/JSONs/NftStorageMetadataDir.json", JSON.stringify(JsonStoreJSONNFTdir));

}

// Don't forget to actually call the main function!
// We can't `await` things at the top level, so this adds
// a .catch() to grab any errors and print them to the console.
main().catch(err => {
    console.error(err)
    process.exit(1)
})