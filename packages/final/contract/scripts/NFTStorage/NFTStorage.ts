// Import the NFTStorage class and File constructor from the 'nft.storage' package
import { NFTStorage, File } from 'nft.storage'
import { getFilesFromPath } from 'files-from-path'

// The 'mime' npm package helps us set the correct file type on our File objects
import mime from 'mime'

// The 'fs' builtin module on Node.js provides access to the file system
import fs from 'fs'

// The 'path' module provides helpers for manipulating filesystem paths
import path from 'path'

import * as dotenv from "dotenv";
dotenv.config();

// Paste your NFT.Storage API key into the quotes:
const NFT_STORAGE_KEY = process.env.NFT_STORAGE_KEY

async function storeNFTdir() {
    const endpoint = 'https://api.nft.storage' // the default
    const token = NFT_STORAGE_KEY // your API key from https://nft.storage/manage

    var files = []
    var filenameIds = []
    for (let i = 1; i <= 150; i++) {
        var filePath = "store/"+String(i)+".png";
        var content = await fs.promises.readFile(filePath);
        var type = mime.getType(filePath);
        files.push(new File([content], path.basename(filePath), { type }));
        filenameIds.push(i);
        console.log(i);
    }
    const storage = new NFTStorage({ endpoint, token })
    const cid = await storage.storeDirectory(files)

    return {"CID": cid, "filenameIds": filenameIds};
}

async function storeJSONNFTdir() {
    const endpoint = 'https://api.nft.storage' // the default
    const token = NFT_STORAGE_KEY // your API key from https://nft.storage/manage
    const jsonDir = await fs.promises.readFile("output/SaveUkraineNftStorageDirData.json")
    const jsonParsed = JSON.parse(jsonDir)
    const CIDdir = jsonParsed["CID"]
    console.log("CIDdir", CIDdir)
    const type = mime.getType("output/SaveUkraineNftStorageDirData.json");
    console.log("type", type);

    for (let i = 1; i <= 150; i++) {
        var content = {
            "name":"Masha Zeltsman - NFT #"+String(i),
            "description":"Ukraine Art Collective - direct donation to causes supporting Ukranian people's dreams of building a free, prosperous, and independent European nation",
            "image":"ipfs://"+CIDdir+"/"+String(i)+".png"
        };
        fs.writeFileSync("metadata/"+String(i), JSON.stringify(content));
        console.log(i);
    }
    const path = ["metadata"]
    const files = await getFilesFromPath(path)

    const storage = new NFTStorage({ token: NFT_STORAGE_KEY })
  
    console.log(`storing ${files.length} file(s) from ${path}`)
    const cid = await storage.storeDirectory(files, {
        pathPrefix: path // see the note about pathPrefix below
    })
    console.log({ cid })
  
    const status = await storage.status(cid)
    console.log(status)
  
    // return {"CID": cid, "filenameIds": filenameIds};
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 * 
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
async function main() {
    // FILES IN A DIRECTORY:
    const JsonStore: any = await storeNFTdir();
    console.log("CID:", JsonStore.CID);

    fs.writeFileSync("output/SaveUkraineNftStorageDirData.json", JSON.stringify(JsonStore));

    // JSON IN A DIRECTORY:
    await storeJSONNFTdir();
    const JsonStoreJSON: any = await storeJSONNFTdir();
    console.log("CID:", JsonStoreJSON.CID);

    fs.writeFileSync("output/SaveUkraineNftStorageJSONDirData.json", JSON.stringify(JsonStoreJSON));
}

// Don't forget to actually call the main function!
// We can't `await` things at the top level, so this adds
// a .catch() to grab any errors and print them to the console.
main()
  .catch(err => {
      console.error(err)
      process.exit(1)
  })