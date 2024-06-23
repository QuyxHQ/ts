import React from 'react'
import { IconProps } from '../../types'

const Disconnect: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            stroke={fill || 'currentColor'}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            className={className}
            viewBox="0 0 24 24"
        >
            <path stroke="none" d="M0 0h24v24H0z"></path>
            <path d="M13.55 17.733a5.806 5.806 0 01-7.356-4.052 5.81 5.81 0 011.537-5.627L9.785 6l7.165 7.165M4 20l3.5-3.5M15 4l-3.5 3.5M20 9l-3.5 3.5M16 16l4 4M20 16l-4 4"></path>
        </svg>
    )
}

export default Disconnect
