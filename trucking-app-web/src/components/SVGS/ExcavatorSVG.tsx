import * as React from "react"
import { SVGProps } from "react"
const ExcavatorSVG = (props: SVGProps<SVGSVGElement>) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlSpace="preserve"
        id="Icons"
        viewBox="0 0 32 32"
        {...props}
    >
        <style>
            {
                `.st0{fill:${props.fill};stroke:${props.stroke};stroke-width:${props.strokeWidth};stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10}`
            }
        </style>
        <path
            d="M18 29H6c-1.6 0-3-1.3-3-3v0c0-1.6 1.3-3 3-3h12c1.6 0 3 1.3 3 3v0c0 1.7-1.3 3-3 3zM15 11h-4v5H8c-2.2 0-4 1.8-4 4v0h15v-4l-4-5zM7 26h0M17 26h0M12 26h0M22 16l7-2-.5 2.6C28.2 18 27 19 25.6 19h0c-1 0-1.9-.5-2.5-1.3L22 16z"
            className="st0"
        />
        <path
            d="M29 14 24 3h-7l-6 8h4l2-8M26 14 21 3M22 14v2M11 14h2.7c.5 1.2 1.7 2 2.9 2H19"
            className="st0"
        />
    </svg>
)
export default ExcavatorSVG
