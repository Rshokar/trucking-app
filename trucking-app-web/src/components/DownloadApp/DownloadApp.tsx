import React, { CSSProperties } from 'react'
import { ButtonGroup, IconButton, useTheme, } from '@mui/material'
import PlayStoreSVG from '../SVGS/PlayStoreSVG'
import AppStoreSVG from '../SVGS/AppStoreSVG'


type Props = {
    iosButtonStyle?: CSSProperties;
    playStoreButtonStyle?: CSSProperties;
}

const DownloadApp = (props: Props) => {
    const theme = useTheme();

    return (
        <ButtonGroup style={{ gap: '10px ' }}>
            <IconButton style={{
                backgroundColor: theme.palette.secondary.main,
                ...props.playStoreButtonStyle
            }}>
                <PlayStoreSVG height={'40px'} width={'40px'} fill='white' />
            </IconButton>
            <IconButton style={{
                backgroundColor: theme.palette.primary.main,
                ...props.iosButtonStyle
            }}>
                <AppStoreSVG height={'40px'} width={'40px'} fill='white' />
            </IconButton>
        </ButtonGroup>
    )
}


export default DownloadApp