import React from 'react'
import { IconProps } from '../../types'

const Import: React.FC<IconProps> = ({ className, fill, size = 21 }) => {
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
            <path d="M14 3v4a1 1 0 001 1h4"></path>
            <path d="M5 13V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2h-5.5M2 19h7m-3-3l3 3-3 3"></path>
        </svg>
    )
}

export default Import
