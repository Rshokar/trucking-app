import styled from "styled-components";

export const Container = styled.div`
    display: flex;
    align-items: center; 
    justify-content: center;
`

export const Section = styled(Container)`
    box-sizing: border-box; 
    padding: 40px 5% 40px 5%;
`

export const SectionContents = styled(Container)`
    max-width: 1400px;
`