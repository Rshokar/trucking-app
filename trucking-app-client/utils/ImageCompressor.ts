import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';

export default class MyImageCompressor {

    static estimateCompression(originalSize: number): number {
        const targetSize = 200000; // 200KB
        let estimatedCompression = targetSize / originalSize;

        // Clamp the compression value between 0.1 and 1
        return Math.min(Math.max(estimatedCompression, 0.1), 1);
    }

    static async compressImage(file: ImagePicker.ImagePickerAsset): Promise<string> {
        if (!file.uri) {
            throw new Error("Image URI is missing.");
        }

        // Get the original image size
        const fileInfo = await FileSystem.getInfoAsync(file.uri);

        if (!fileInfo.exists) throw new Error("File does not exist at the given URI");

        const compressionRatio = this.estimateCompression(fileInfo.size);

        const { uri } = await ImageManipulator.manipulateAsync(
            file.uri,
            [],
            {
                format: ImageManipulator.SaveFormat.JPEG, // Changed to JPEG for better compression
                compress: compressionRatio,
            }
        );

        return uri;
    }
}
