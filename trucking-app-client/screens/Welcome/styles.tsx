import styled from "styled-components/native";
import { colors } from "../../components/colors";
import { Container } from "../../components/shared";

export const WelcomContainer = styled(Container)`
    background-color: ${colors.secondary};
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    height: 100%;
`


export const TopSection = styled.View`
    width: 100%;
    flex: 1;
    max-height: 55%;
`

export const TopImage = styled.Image`
    width: 100%; 
    height: 100%; 
    resize-mode: stretch;
`

export const BottomSection = styled.View`
    width: 100%; 
    padding: 25px;
    padding-bottom: 60px;
    flex: 1;
    justify-content: flex-end;
`

