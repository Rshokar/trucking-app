import * as React from "react"
import { SVGProps } from "react"
const DownloadSVG = (props: SVGProps<SVGSVGElement>) => (
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
            strokeWidth={1}
            d="M8 22h8c2.828 0 4.243 0 5.121-.878C22 20.242 22 18.829 22 16v-1c0-2.828 0-4.242-.879-5.121-.768-.768-1.946-.865-4.121-.877m-10 0c-2.175.012-3.353.109-4.121.877C2 10.758 2 12.172 2 15v1c0 2.829 0 4.243.879 5.122.3.3.662.497 1.121.627"
        />
        <path
            stroke={props.stroke}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M12 2v13m0 0-3-3.5m3 3.5 3-3.5"
        />
    </svg>
)
export default DownloadSVG
