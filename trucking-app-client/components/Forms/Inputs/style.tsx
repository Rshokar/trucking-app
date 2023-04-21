import styled from "styled-components/native";

import { colors } from "../../colors";


export const StyledInputeView = styled.View`
  width: 100%;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid ${colors.gray};
`;

export const StyledErrorView = styled.Text`
  width: 90%
  color: red
`