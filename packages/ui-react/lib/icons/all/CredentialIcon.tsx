import React from 'react'
import { IconProps } from '../../types'

const CredentialIcon: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
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
            <path d="M15 21H6a3 3 0 01-3-3v-1h10v2a2 2 0 004 0V5a2 2 0 112 2h-2m2-4H8a3 3 0 00-3 3v11M9 7h4M9 11h4"></path>
        </svg>
    )
}

export default CredentialIcon
