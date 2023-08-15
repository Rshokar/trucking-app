import React from 'react'
import styled from 'styled-components'
import { Typography } from '@mui/material'
import { Container } from '../../components/shared'

const View = styled(Container)`
    height: 100vh;
    width: 100vw;
`
type Props = {}

const ValidateOperatorEmailPage = (props: Props) => {
    return <View>
        <Typography>
            Hello worlds
        </Typography>
    </View>
}

export default ValidateOperatorEmailPage