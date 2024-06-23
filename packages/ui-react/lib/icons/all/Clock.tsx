import React from 'react'
import { IconProps } from '../../types'

const Clock: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
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
            <path d="M3 12a9 9 0 1018 0 9 9 0 00-18 0"></path>
            <path d="M12 7v5l3 3"></path>
        </svg>
    )
}

export default Clock
