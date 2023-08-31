import React, { useState, ReactNode, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { Typography } from '@mui/material'
import { device } from '../../../../../components/devices'
import { useMediaQuery } from 'react-responsive';

const FeatureHeader = styled(Container)`
    justify-content: space-between;
    width: 100%;
    padding-bottom: 30px;
    gap: 10px;
`

// const FeatureSummary = styled(Container) <{ show: boolean }>`
//     opacity: ${props => props.show ? '1' : '0'};
//     max-height: ${props => props.show ? '1000px' : '0px'};
//     overflow: hidden;
//     transition: max-height .75s ease-in-out, opacity .75s ease-in-out;
// `;

const FeatureBreakDown = styled(Container)`
    overflow: hidden;
    transition: max-height .75s ease-in-out, opacity .75s ease-in-out;
    flex-direction: column; 
    gap: 20px;
    padding-bottom: 20px;
`;

const FeatureBreakDownLine = styled(Container)`
    flex-direction: column; 
    align-items: flex-start;
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.5s, transform 0.5s;
    will-change: opacity, transform;
`



// Move this outside the Feature component
const FeatureContainer = styled(Container) <{ color: string, inView: boolean }>`
    width: 90%; 
    max-width: 500px;
    min-height: 350px;
    background-color: ${props => props.color}; 
    flex-direction: column;
    transition: background-color 0.5s ease-in-out; // added transition for color change
    padding: 15px; 
    box-sizing: border-box;
    transform: ${props => props.inView ? 'translateX(0vw)' : 'translateX(-20vw)'};
    opacity: ${props => props.inView ? '1' : '0'};
    transition: opacity 0.5s, transform 0.5s;
    will-change: opacity, transform;
`;

const TwoLineTitle = styled(Typography)`
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: white; 
    width: 100%;

    @media(${device.tablet}) {
        width: 75%
    }
`;


interface BreakDown {
    title: string, blurb: string
}

type Props = {
    title: string;
    svg: ReactNode;
    breakDown: BreakDown[]
    color: string
}

const Feature = (props: Props) => {
    const [inView, setInView] = useState(false);
    const featureRef = useRef<any>(null);
    const isLaptop = useMediaQuery({ query: device.laptop });

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            {
                root: null,
                rootMargin: '0px',
                threshold: 0.1
            }
        );

        if (featureRef.current) {
            observer.observe(featureRef.current);
        }

        return () => {
            if (featureRef.current) {
                observer.unobserve(featureRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (featureRef.current) {
            let delay = 0;
            const children = Array.from(featureRef.current.querySelectorAll('[data-breakdown-item]'));

            children.forEach((child: any) => {
                setTimeout(() => {
                    child.style.opacity = inView ? "1" : "0";
                    child.style.transform = inView ? "translateY(0)" : "translateY(-30)";
                }, delay);
                delay += 450; // Adjust this delay as necessary.
            });
        }
    }, [inView]);

    return (
        <FeatureContainer color={props.color} ref={featureRef} inView={inView}>
            <FeatureHeader>
                <TwoLineTitle variant='h5' textAlign='left' fontWeight='bold'>
                    {props.title}
                </TwoLineTitle>
                <div>
                    {props.svg}
                </div>
            </FeatureHeader>

            <FeatureBreakDown>
                {
                    props.breakDown.map((dP: BreakDown, index: number) => (
                        <FeatureBreakDownLine data-breakdown-item key={index}>
                            <Typography color={'white'} variant='subtitle1' fontWeight={'bold'}>
                                {dP.title}
                            </Typography>
                            <Typography color={'white'} variant='body2'>
                                {dP.blurb}
                            </Typography>
                        </FeatureBreakDownLine>
                    ))
                }
            </FeatureBreakDown>
        </FeatureContainer>
    )
}

export default Feature;