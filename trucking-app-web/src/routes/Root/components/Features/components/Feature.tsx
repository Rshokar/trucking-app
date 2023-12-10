import React, { useState, ReactNode, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { Container } from '../../../../../components/shared'
import { Typography } from '@mui/material'
import { device } from '../../../../../components/devices'
import { useMediaQuery } from 'react-responsive';
import { FeatureContainer, FeatureArguments, FeatureArgument, FeatureHeader, TwoLineTitle } from './styles'
import { useTheme } from '@mui/material';
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
    const theme = useTheme()
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
                threshold: 0.01
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
                child.style.opacity = inView ? "1" : "0";
                child.style.transform = inView ? "translateY(0)" : "translateY(-30)";

            });
        }
    }, [inView]);

    return (
        <FeatureContainer ref={featureRef}>
            <Typography variant='h3' textAlign='left'>
                {props.title}
            </Typography>
            <FeatureArguments>
                {
                    props.breakDown.map((dP: BreakDown, index: number) => (
                        <FeatureArgument
                            data-breakdown-item
                            key={index}
                            color={theme.palette.primary.main}
                            titleBorder={theme.palette.secondary.main}
                            borderColor={theme.palette.primary.light}
                        >
                            <Typography variant='h6'>
                                {dP.title}
                            </Typography>
                            <Typography variant='body1'>
                                {dP.blurb}
                            </Typography>
                        </FeatureArgument>
                    ))
                }
            </FeatureArguments>
        </FeatureContainer>
    )
}

export default Feature;