import Jimp from "jimp";
import { Image } from '@nut-tree/nut-js';

export async function imageToBase64(image: Image): Promise<string | undefined> {
    try {
        const jimpImage = new Jimp(image.width, image.height);
        let pos = 0;
        jimpImage.scan(
          0,
          0,
          jimpImage.bitmap.width,
          jimpImage.bitmap.height,
          (_, __, idx) => {
            jimpImage.bitmap.data[idx + 2] = image.data.readUInt8(pos++);
            jimpImage.bitmap.data[idx + 1] = image.data.readUInt8(pos++);
            jimpImage.bitmap.data[idx + 0] = image.data.readUInt8(pos++);
            jimpImage.bitmap.data[idx + 3] = image.data.readUInt8(pos++);
          }
        );
        const tempImage = await jimpImage.getBase64Async(Jimp.MIME_PNG);

        return tempImage
    } catch (err_1) {
        console.error(err_1);
    }
}

export async function imageFromFileToBase64(filePath: string): Promise<string | undefined> {
    try {
        const image = await Jimp.read(filePath);
        
        return await image.getBase64Async(Jimp.MIME_PNG)
            .then((base64: any) => {
                return base64;
            })
            .catch((err: any) => {
                console.error(err);
            });
    } catch (err_1) {
        console.error(err_1);
    }
}
