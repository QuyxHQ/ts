import React from 'react'
import { IconProps } from '../../types'

const Copy: React.FC<IconProps> = ({ className, fill, size = 20, handleClick }) => {
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
            onClick={handleClick}
        >
            <path stroke="none" d="M0 0h24v24H0z"></path>
            <path d="M7 9.667A2.667 2.667 0 019.667 7h8.666A2.667 2.667 0 0121 9.667v8.666A2.667 2.667 0 0118.333 21H9.667A2.667 2.667 0 017 18.333z"></path>
            <path d="M4.012 16.737A2.005 2.005 0 013 15V5c0-1.1.9-2 2-2h10c.75 0 1.158.385 1.5 1"></path>
        </svg>
    )
}

export default Copy
