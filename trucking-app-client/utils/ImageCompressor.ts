import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

const TARGET_SIZE = 200000
export default class MyImageCompressor {

    static estimateCompression(originalSize: number): number {
        let estimatedCompression = TARGET_SIZE / originalSize;
        // Clamp the compression value between 0.1 and 1
        return Math.min(Math.max(estimatedCompression, 0.1), 1);
    }


    static async compressImage(file: ImagePicker.ImagePickerAsset): Promise<string> {
        if (!file.uri) {
            throw new Error("Image URI is missing.");
        }

        // Get the original image size
        let fileInfo = await FileSystem.getInfoAsync(file.uri);

        if (!fileInfo.exists) throw new Error("File does not exist at the given URI");

        const compressionRatio = this.estimateCompression(fileInfo.size);

        const { uri } = await ImageManipulator.manipulateAsync(
            fileInfo.uri,
            [],
            {
                format: ImageManipulator.SaveFormat.JPEG,
                compress: compressionRatio,
            }
        );

        fileInfo = await FileSystem.getInfoAsync(uri);

        return fileInfo.uri;
    }


}
