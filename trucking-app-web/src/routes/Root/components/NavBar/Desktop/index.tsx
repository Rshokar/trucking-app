import React from 'react'
import { DesktopNavBarSection, DesktopNavBarSectionContents } from './styles'
import WhiteLogoSVG from '../../../../../components/SVGS/WhiteLogoSVG'
import WhiteLogo from '../../../../../assets/tare-ticketing-icon.png'
import { Typography } from '@mui/material';
import { NavBarProps } from '..';
import { useTheme } from '@mui/material'
const DesktopNavbar = (props: NavBarProps) => {
    const theme = useTheme()
    return (
        <DesktopNavBarSection>
            <DesktopNavBarSectionContents menuItemColor={theme.palette.secondary.main}>
                <div>
                    <img src={WhiteLogo} height={50} width={50} />
                    <Typography variant="subtitle1">
                        Tare Ticketing
                    </Typography>
                </div>
                <div className='menu-items'>
                    {
                        props.menuItems.map(menuItem => <div className={menuItem.label === 'Get Started' ? 'target' : undefined}>
                            <a href={menuItem.url}>{menuItem.label}</a>
                        </div>)
                    }
                </div>
            </DesktopNavBarSectionContents>
        </DesktopNavBarSection>
    )
}

export default DesktopNavbar