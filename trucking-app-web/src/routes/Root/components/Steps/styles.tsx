import styled from "styled-components";
import { Section, SectionContents } from "../../../../components/shared";
export const StepsSection = styled(Section)`
  flex-direction: column;
`;

export const StepsSectionContents = styled(SectionContents)`


    >div:first-child {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 20px 30px;
    }
`
