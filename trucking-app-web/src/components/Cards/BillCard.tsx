import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Button, useTheme } from '@mui/material'
import { Bill } from '../../models/Bill';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 10px
`;

const StyledTitle = styled.p`
  font-size: 20px;
  font-weight: bold;
  text-align: center;
  margin: 10px;
  padding: 10px;
  background-color: black;
  color: white;
`;

interface BillCardProps extends Bill {
    onClose: () => void;
    accessToken: string;
}

const BillCard: React.FC<BillCardProps> = (props) => {
    const [url, setUrl] = useState<string>();
    const [images, setImages] = useState<{ url: string }[]>([{ url: '' }]);
    const theme = useTheme();


    const getImage = async () => {
        try {

            const res = await fetch(`${process.env.REACT_APP_API_URL}/v1/billing_ticket/operator/image/${props.bill_id}`, {
                method: 'GET',
                headers: {
                    "Authorization-Fake-X": `Bearer ${props.accessToken}`
                }
            })

            if (res.status !== 200) throw Error(await res.text())

            const { data } = await res.json();

            console.log("RETURNED URL", data)
            images[0].url = data;
            setImages([...images]);
            setUrl(data);
        } catch (err: any) {
            console.error('Error fetching image: ', err);
        }
    };

    useEffect(() => {
        setImages([]);
        getImage();
    }, []);

    const close = () => {
        props.onClose();
    };

    console.log(images);

    return (
        <StyledContainer>
            <StyledTitle>Ticket Number: {props.ticket_number}</StyledTitle>
            {
                images.length > 0 && <img
                    style={{
                        width: '90%',
                        maxWidth: '500px'
                    }}
                    src={images[0].url} alt="Ticket"
                />}
            <Button
                style={{
                    background: theme.palette.primary.main,
                    width: '200px',
                    color: 'white'
                }}
                onClick={close}
            >Close</Button>
        </StyledContainer>
    );
};

export default BillCard;
