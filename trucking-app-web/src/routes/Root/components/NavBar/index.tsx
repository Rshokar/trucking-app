import React from 'react'
import MobileNavBar from './Mobile'
import { useMediaQuery } from 'react-responsive'
import { device } from '../../../../components/devices'
export const FEATURES_ID = "features";
export const GET_STARTED_ID = "get_started";
export const PRICING_ID = "pricing";
export const DOWNLOAD_ID = "download";
export const CONTACT_ID = "contact";
export const SUMMARY_ID = 'summary';

type Props = {}

const NavBar = (props: Props) => {
    const isTablet = useMediaQuery({ query: device.tablet });
    return <>
        {isTablet ? <MobileNavBar /> : <div>NavBar</div>}
    </>
}

export default NavBar