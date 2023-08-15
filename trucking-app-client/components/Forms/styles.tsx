import styled from "styled-components/native";
import { Text } from 'react-native-paper'
import { colors } from "../colors";

export const InputBox = styled.View`
    width: 100%;
    padding-bottom: 0px;
    gap: 5px;
`

export const ErrorText = styled(Text)`
    color: ${colors.red}
`

export const DualInput = styled.View`
    width: 100%; 
    flex-direction: row; 
    gap: 10px; 
`