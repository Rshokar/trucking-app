import React, { FunctionComponent, useState, ReactNode } from 'react'
import { Typography, useTheme } from '@mui/material'
import styled from 'styled-components'
import { IconButton } from '@mui/material'
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';

const TicketRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    margin-bottom: 10px;
    cursor: pointer;
    padding: 5px; 
    box-sizing: border-box;
`

const LeftView = styled.div`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex: 3;
`

const RightView = styled.div`
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
`





export interface TicketItemProps {
    title: string;
    subtitle?: string;
    buttonClickIcon?: ReactNode;
    onButtonClick?: () => any;
    onDelete?: () => Promise<any>;
    onClick?: () => void;
    icon: ReactNode;
}



const TicketItem: FunctionComponent<TicketItemProps> = (props) => {

    const [deleting, setDeleting] = useState(false);
    const theme = useTheme();
    const handleDelete = async () => {
        props.onDelete && await props.onDelete()
        setDeleting(false);
    }

    const IconView = styled.div`
    display: flex; 
    justify-content: center; 
    align-items: center; 
    min-height: 100%;
    background-color: ${deleting ? theme.palette.error.main : theme.palette.primary.main}; 
    border-radius: 5px;
    `

    return (
        <TicketRow onClick={props.onClick}>
            <LeftView>
                <IconView onClick={(e) => {
                    e.stopPropagation();
                    setDeleting(true);
                }}>
                    {props.icon}
                </IconView>
                <div style={{
                    marginLeft: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}>
                    <Typography style={{ fontWeight: 'bold', lineHeight: 1 }} variant='subtitle1'>
                        {props.title}
                    </Typography>
                    {
                        props.subtitle &&
                        <Typography variant='body2'>
                            {props.subtitle}
                        </Typography>
                    }
                </div>
            </LeftView>
            <RightView>
                {(deleting && props.onDelete) && <>
                    <IconButton size="small" onClick={(e) => {
                        e.stopPropagation()
                        setDeleting(false)
                    }}>
                        <CancelIcon style={{ fontSize: '20pt', color: theme.palette.secondary.main, padding: '5px' }} />
                    </IconButton>
                    <IconButton size="small" onClick={(e) => {
                        e.stopPropagation()
                        handleDelete()
                    }}>
                        <DeleteIcon style={{ fontSize: '20pt', color: theme.palette.error.main, padding: '5px' }} />
                    </IconButton>
                </>}
                {(!deleting && props.buttonClickIcon && props.onButtonClick) && <IconButton size="small" onClick={(e) => {
                    e.stopPropagation();
                    props.onButtonClick && props.onButtonClick();
                }}>
                    {props.buttonClickIcon}
                </IconButton>}
            </RightView>
        </TicketRow >
    )
}

export default TicketItem
