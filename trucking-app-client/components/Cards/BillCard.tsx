
import React, { useState, useEffect } from 'react';
import { Image, Dimensions, View, Modal, StyleSheet } from 'react-native';
import { Avatar, Button, Card, Text, useTheme } from 'react-native-paper';
import { Bill } from '../../models/Bill';
import { BillController } from '../../controllers/BillController';
import { ActivityIndicator } from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';
import styled from 'styled-components/native';

const ImageView = styled.TouchableOpacity`
`

const styles = StyleSheet.create({
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        margin: 10,
        padding: 10,
        backgroundColor: 'black',
        color: 'white'
    },
});

interface BillCardProps extends Bill {
    onClose: () => any;
}

const BillCard: React.FC<BillCardProps> = (props) => {
    const [url, setUrl] = useState<string>();
    const [imageHeight, setImageHeight] = useState<number>(100); // default height
    const [modalVisible, setModalVisible] = useState(false);
    const [images, setImages] = useState<{ url: string }[]>([{ url: '' }])

    const theme = useTheme()

    const getImage = async () => {
        try {
            const bC = new BillController();
            const res: any = await bC.getImageUrl(props.bill_id + "");
            images[0].url = res["data"];
            setImages([...images]);
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
        setImages([])
        getImage()
    }, [])



    const close = () => {
        setModalVisible(false)
        props.onClose();
    }


    return (
        <View style={{
            width: '100%',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <Text style={styles.modalTitle}

            >
                Ticket Number: {props.ticket_number}
            </Text>
            {
                images.length > 0 && <ImageViewer
                    loadingRender={() => <ActivityIndicator size={45} />}
                    enableSwipeDown
                    imageUrls={images}
                    style={{ width: '100%' }}
                    renderIndicator={(currentIndex) => <Text>Ticket Number: {props.ticket_number}</Text>}
                />
            }
            <Button style={{ backgroundColor: theme.colors.secondary, width: 200, marginVertical: 20 }} onPress={close}>
                <Text style={{ color: 'white' }}>
                    Close
                </Text>
            </Button>
        </View>

    );
};

export default BillCard;