import React, { useEffect, useState, useRef } from 'react';
import { Typography } from '@mui/material';
import { useTheme } from '@mui/material';
import { NavBarProps } from '..';
import WhiteLogo from '../../../../../assets/tare-ticketing-icon.png';
import { DesktopNavBarSection, DesktopNavBarSectionContents } from './styles';

const DesktopNavbar = (props: NavBarProps) => {
    const theme = useTheme();
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const observer = useRef<IntersectionObserver | null>(null);
    const [isAtTop, setIsAtTop] = useState<boolean>(false);

    const handleScroll = () => {
        setIsAtTop(window.scrollY < 100);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        }, { threshold: 0.25 }); // Adjust threshold as needed

        // Observing each section
        props.menuItems.forEach(item => {
            const element = document.getElementById(item.url.substring(1)); // Assuming 'url' is like '#sectionId'
            if (element) observer.current && observer.current.observe(element);
        });

        return () => {
            observer.current && observer.current.disconnect();
        };
    }, [props.menuItems]);


    console.log(activeSection)
    return (
        <DesktopNavBarSection>
            <DesktopNavBarSectionContents menuItemColor={theme.palette.secondary.main} showBackground={!isAtTop}>
                <div>
                    <img src={WhiteLogo} height={50} width={50} alt="Logo" />
                    <Typography variant="button">Tare Ticketing</Typography>
                </div>
                <div className='menu-items'>
                    {props.menuItems.map(menuItem => {

                        return <div key={menuItem.label} className={activeSection === menuItem.url.substring(1) ? 'active' : ''}>
                            <a href={menuItem.url}>
                                <Typography variant='button'>
                                    {menuItem.label}
                                </Typography>
                            </a>
                        </div>
                    })}
                </div>
            </DesktopNavBarSectionContents>
        </DesktopNavBarSection>
    );
};

export default DesktopNavbar;
