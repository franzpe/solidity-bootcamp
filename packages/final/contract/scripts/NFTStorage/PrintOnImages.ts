import * as path from 'path';
import * as Jimp from 'jimp';

async function printTextOnImage(baseImageSrc: string, newImageSrc: string, imageDisclaimerText: string, imageText: string) {
    const printDisclaimerFont: any = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const printTextFont: any = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    Jimp.read(path.join(__dirname, baseImageSrc), (err, _image) => {
        if (err) throw err;

        const imageWidth: number = _image.bitmap.width;
        const imageHeight: number = _image.bitmap.height;

        _image.print(
            printDisclaimerFont,
            imageWidth  * 0.02,
            imageHeight * 0.9,
            {
                text: imageDisclaimerText,
                alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                alignmentY: Jimp.VERTICAL_ALIGN_TOP
            },
            imageWidth * 0.95,
            (err, resultedImage) => {
                if (err) {
                    console.log("ERR (printing on image):", err);
                } else {
                    _image.print(
                        printTextFont,
                        0.5*imageWidth,
                        0.0*imageHeight,
                        imageText,
                        0, 0
                    );
                    resultedImage.write(path.join(__dirname, newImageSrc));
                    console.log("written into:", path.join(__dirname, newImageSrc));
                }
            }
        );
    });

    return newImageSrc;
}

export async function printTextOnImageAndReturnBuffer(baseImageSrc: string, imageDisclaimerText: string, imageText: string) {
    const printDisclaimerFont: any = await Jimp.loadFont(Jimp.FONT_SANS_16_BLACK);
    const printTextFont: any = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
    var imageBlob: Blob;

    var _image = await Jimp.read(path.join(__dirname, baseImageSrc));
    const imageWidth: number = _image.bitmap.width;
    const imageHeight: number = _image.bitmap.height;
    _image.print(
        printDisclaimerFont,
        imageWidth  * 0.02,
        imageHeight * 0.9,
        {
            text: imageDisclaimerText,
            alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
            alignmentY: Jimp.VERTICAL_ALIGN_TOP
        },
        imageWidth * 0.95,
    );
    _image.print(
        printTextFont,
        0.5*imageWidth,
        0.0*imageHeight,
        imageText,
        0, 0
    );
    const buffer = await _image.getBufferAsync(Jimp.MIME_JPEG);

    return buffer;
}

/**
 * The main entry point for the script that checks the command line arguments and
 * calls storeNFT.
 * 
 * To simplify the example, we don't do any fancy command line parsing. Just three
 * positional arguments for imagePath, name, and description
 */
async function main() {
    const DisclaimerStr: string = "Disclaimer: only for use by Team 8 as a Solidity Encode Club Bootcamp (Early, 2023) Final Project";
    // let Attributes: string[] = ["head", "chest", "legs", "weapon"];
    // let Ids: string[] = ["1", "2"];
    let Attributes: string[] = ["chest"];
    let Ids: string[] = ["1"];
    for(let i=0; i < Attributes.length; i++){
        for(let j=0; j < Ids.length; j++){
            let baseImageSrc: string = "./images/" + Attributes[i] + "/base.jpg";
            let newImageSrc: string = "./images/" + Attributes[i] + "/" + Attributes[i] + "_" + String(j+1) + ".jpg";
            let TextStr: string = String(j+1);
            await printTextOnImage(baseImageSrc, newImageSrc, DisclaimerStr, TextStr);
        }
    }
}

// // Don't forget to actually call the main function!
// // We can't `await` things at the top level, so this adds
// // a .catch() to grab any errors and print them to the console.
// main().catch(err => {
//     console.error(err)
//     process.exit(1)
// })