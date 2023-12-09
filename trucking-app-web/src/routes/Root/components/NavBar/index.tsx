import React from 'react'
import MobileNavBar from './Mobile'
import DesktopNavbar from './Desktop'
import { useMediaQuery } from 'react-responsive'
import { device } from '../../../../components/devices'
export const FEATURES_ID = "features";
export const GET_STARTED_ID = "get_started";
export const PRICING_ID = "pricing";
export const DOWNLOAD_ID = "download";
export const CONTACT_ID = "contact";
export const SUMMARY_ID = 'summary';

export interface MenuItem {
    label: string;
    url: string;
}

export interface NavBarProps {
    menuItems: MenuItem[]
}

type Props = {}

const NavBar = () => {

    const MenuItems: MenuItem[] = [
        { label: 'How It Works', url: GET_STARTED_ID },
        { label: 'Get Started', url: GET_STARTED_ID },
        { label: 'Features', url: FEATURES_ID },
        { label: 'Contact', url: CONTACT_ID },
    ]
    const isTablet = useMediaQuery({ query: device.laptop });
    return <>
        {isTablet ? <MobileNavBar menuItems={MenuItems} /> : <DesktopNavbar menuItems={MenuItems} />}
    </>
}

export default NavBar