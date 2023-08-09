import React, { useState, useEffect } from 'react';
import { Image, Dimensions, View } from 'react-native';
import { Avatar, Button, Card, Text } from 'react-native-paper';
import { Bill } from '../../models/Bill';
import { BillController } from '../../controllers/BillController';
import { ActivityIndicator } from 'react-native-paper';

const BillCard: React.FC<Bill> = (props) => {
    const [url, setUrl] = useState<string>();
    const [imageHeight, setImageHeight] = useState<number>(100); // default height

    const getImage = async () => {
        try {
            const bC = new BillController();
            const res: any = await bC.getImageUrl(props.bill_id + "");
            setUrl(res["data"]);

            Image.getSize(res["data"], (width, height) => {
                const screenWidth = Dimensions.get('window').width;
                const scaleFactor = width / screenWidth;
                const imageHeight = height / scaleFactor;
                setImageHeight(imageHeight);
            });
        } catch (err: any) {
            console.error("Error fetching image: ", err);
        }
    }

    useEffect(() => {
        setUrl(undefined)
        getImage()
    }, [])

    return (
        <Card style={{ width: '90%' }}>
            <Card.Content>
                {!url ? <ActivityIndicator />
                    :
                    <Image
                        source={{ uri: url }}
                        style={{ width: "100%", height: imageHeight }}
                    />
                }
            </Card.Content>
            <Card.Title title={<Text style={{ fontWeight: 'bold' }} variant='titleLarge'>
                Ticket Number: {props.ticket_number + ""}
            </Text>} />
        </Card>
    );
};

export default BillCard;
