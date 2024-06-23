import React from 'react'
import { IconProps } from '../../types'

const Cancel: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
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
            <path d="M18 6L6 18M6 6l12 12"></path>
        </svg>
    )
}

export default Cancel
