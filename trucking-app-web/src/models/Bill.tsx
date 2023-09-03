import { RFO } from './RFO';
// import * as ImagePicker from 'expo-image-picker';


export class Bill {

    bill_id?: number;
    // file?: ImagePicker.ImagePickerAsset;
    rfo_id?: number;
    ticket_number?: string;
    image_id?: number;
    rfo?: RFO;
}
