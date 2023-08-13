import styled from "styled-components/native";
import { Text } from 'react-native-paper'
import { colors } from "../colors";

export const InputBox = styled.View`
    padding-bottom: 20px;
    gap: 10;
`

export const ErrorText = styled(Text)`
    color: ${colors.red}

`