import * as React from "react"
import { SVGProps } from "react"
const NothingFoundSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        fill="none"
        viewBox="0 -0.5 25 25"
        {...props}
    >
        <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M5.5 11.493a6.5 6.5 0 1 1 13 .015 6.5 6.5 0 0 1-13-.015Z"
            clipRule="evenodd"
        />
        <path
            stroke="#000"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="m16.062 16.568 3.438 3.425"
        />
        <path
            fill="#000"
            d="M10.53 8.963a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm.94 3.06a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm1.06-1.06a.75.75 0 1 0-1.06 1.06l1.06-1.06Zm.94 3.06a.75.75 0 1 0 1.06-1.06l-1.06 1.06Zm-.94-2a.75.75 0 0 0-1.06-1.06l1.06 1.06Zm-3.06.94a.75.75 0 0 0 1.06 1.06l-1.06-1.06Zm2-2a.75.75 0 0 0 1.06 1.06l-1.06-1.06Zm3.06-.94a.75.75 0 0 0-1.06-1.06l1.06 1.06Zm-5.06 0 2 2 1.06-1.06-2-2-1.06 1.06Zm2 2 2 2 1.06-1.06-2-2-1.06 1.06Zm0-1.06-2 2 1.06 1.06 2-2-1.06-1.06Zm1.06 1.06 2-2-1.06-1.06-2 2 1.06 1.06Z"
        />
    </svg>
)
export default NothingFoundSVG 
