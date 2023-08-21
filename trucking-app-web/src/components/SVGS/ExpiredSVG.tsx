import * as React from "react"
import { SVGProps } from "react"
const ExpiredSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={800}
        height={800}
        viewBox="0 0 48 48"
        {...props}
    >
        <title>{"expire-solid"}</title>
        <g data-name="Layer 2">
            <g data-name="icons Q2">
                <path fill="none" d="M0 0h48v48H0z" />
                <path d="M14.2 31.9a2 2 0 0 0-.9-2.9 11.8 11.8 0 0 1-7.2-12.2A12 12 0 0 1 16.9 6a12.1 12.1 0 0 1 11.2 5.6 2.3 2.3 0 0 0 2.3.9 2 2 0 0 0 1.1-3 15.8 15.8 0 0 0-15-7.4 16 16 0 0 0-4.8 30.6 2 2 0 0 0 2.5-.8Z" />
                <path d="M16.5 11.5v5h-5a2 2 0 0 0 0 4h9v-9a2 2 0 0 0-4 0ZM45.7 43l-15-26a2 2 0 0 0-3.4 0l-15 26a2 2 0 0 0 1.7 3h30a2 2 0 0 0 1.7-3ZM29 42a2 2 0 1 1 2-2 2 2 0 0 1-2 2Zm2-8a2 2 0 0 1-4 0v-8a2 2 0 0 1 4 0Z" />
            </g>
        </g>
    </svg>
)
export default ExpiredSVG
