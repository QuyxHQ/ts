import React from 'react'
import { IconProps } from '../../types'

const Website: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
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
            <path d="M19.5 7A9 9 0 0012 3a8.991 8.991 0 00-7.484 4M11.5 3a16.989 16.989 0 00-1.826 4M12.5 3a16.989 16.989 0 011.828 4M19.5 17a9 9 0 01-7.5 4 8.991 8.991 0 01-7.484-4M11.5 21a16.989 16.989 0 01-1.826-4M12.5 21a16.989 16.989 0 001.828-4M2 10l1 4 1.5-4L6 14l1-4M17 10l1 4 1.5-4 1.5 4 1-4M9.5 10l1 4 1.5-4 1.5 4 1-4"></path>
        </svg>
    )
}

export default Website
