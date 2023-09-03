import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Typography, Box, useTheme } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';

const StyledMessageView = styled(Box)`
    display: flex; 
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center; 
    max-width: 90%; 
    height: 350px; 
    width: 400px;  
    border-radius: 10px;
    box-sizing: border-box;
    padding: 30px;   
    box-shadow: 2px 2px 2px 2px grey;
`;

type MessageViewProps = {
    title: string;
    subtitle: string;
    icon: ReactNode;
    message: string;
    children?: ReactNode
}

const MessageView: React.FC<MessageViewProps> = (props) => {
    const theme = useTheme()
    const { title, subtitle, icon, message } = props;

    return (
        <StyledMessageView style={{ backgroundColor: theme.palette.secondary.main }}>
            <div style={{
                display: 'flex',
                gap: '10px',
                flexDirection: 'column',
            }}>
                <Typography variant='h5' style={{ color: 'white' }}>
                    {title}
                </Typography>
                <Typography variant='body2' style={{ color: 'white' }}>
                    {subtitle}
                </Typography>
            </div>
            {
                props.children ?
                    props.children
                    :
                    <Box sx={{
                        display: 'flex',
                        backgroundColor: 'white',
                        width: '60px',
                        height: '60px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '10px'
                    }}>
                        {icon}
                    </Box>
            }
            <Typography variant='caption' style={{ color: 'white' }}>
                {message}
            </Typography>
        </StyledMessageView>
    )
}

export default MessageView;
