import * as React from "react"
import { SVGProps } from "react"
const EmailConfirmedSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 0 24 24"
        {...props}
    >
        <path
            stroke={props.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 9.667 11.385 11 14.5 8M3.028 10l7.197 4.817c.641.427.962.641 1.309.724a2 2 0 0 0 .932 0c.346-.083.667-.297 1.309-.724L20.97 10M10.298 4.07l-5.8 3.642c-.547.344-.82.516-1.019.748a2 2 0 0 0-.388.702C3 9.453 3 9.775 3 10.421v6.38c0 1.12 0 1.68.218 2.107a2 2 0 0 0 .874.874C4.52 20 5.08 20 6.2 20h11.6c1.12 0 1.68 0 2.108-.218a2 2 0 0 0 .874-.874C21 18.48 21 17.92 21 16.8v-6.379c0-.646 0-.968-.091-1.26a2 2 0 0 0-.388-.702c-.199-.232-.472-.404-1.02-.748l-5.8-3.642c-.616-.388-.925-.582-1.256-.657a2 2 0 0 0-.89 0c-.331.075-.64.27-1.257.657Z"
        />
    </svg>
)
export default EmailConfirmedSVG
