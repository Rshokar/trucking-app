import { RFO } from './RFO';
import { Model, Query } from './Model'
import * as ImagePicker from 'expo-image-picker';


export class Bill implements Model {
    getId(): number {
        throw new Error('Method not implemented.');
    }

    bill_id?: number;
    file?: ImagePicker.ImagePickerAsset;
    rfo_id?: number;
    ticket_number?: string;
    image_id?: number;
    rfo?: RFO;
}


export class BillQuery implements Query {
    bill_id?: number;
    rfo_id?: string;
    ticket_number?: number;
    image_id?: number;
    page?: number = 0;
    limit?: number = 10;
}