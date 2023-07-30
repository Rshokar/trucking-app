import React, { FC } from 'react';
import { Modal, Portal, Text } from 'react-native-paper';
import styled from 'styled-components/native';

const ModalContainer = styled.View`
  background-color: white;
  padding: 20px;
  margin: 20px;
  border-radius: 10px;
`;

const ModalTitle = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 20px;
`;

type ModalProps = {
    visible: boolean;
    onDismiss: () => void;
    title: string;
    children: React.ReactNode;
    containerStyle?: object;
};

const MyModal: FC<ModalProps> = ({ visible, onDismiss, title, children, containerStyle }) => {
    return (
        <Portal>
            <Modal visible={visible} onDismiss={onDismiss} contentContainerStyle={containerStyle}>
                <ModalContainer>
                    <ModalTitle>{title}</ModalTitle>
                    {children}
                </ModalContainer>
            </Modal>
        </Portal>
    );
};

export default MyModal;
