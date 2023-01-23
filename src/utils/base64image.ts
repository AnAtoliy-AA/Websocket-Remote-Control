import Jimp from "jimp";

export async function imageToBase64(filePath: string): Promise<string | undefined> {
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
