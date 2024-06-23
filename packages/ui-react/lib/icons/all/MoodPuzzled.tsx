import React from 'react'
import { IconProps } from '../../types'

const MoodPuzzled: React.FC<IconProps> = ({ className, fill, size = 24 }) => {
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
            <path d="M14.986 3.51A9 9 0 1016.5 19.794c2.489-1.437 4.181-3.978 4.5-6.794M10 10h.01M14 8h.01M12 15c1-1.333 2-2 3-2M20 9v.01M20 6a2.003 2.003 0 00.914-3.782 1.98 1.98 0 00-2.414.483"></path>
        </svg>
    )
}

export default MoodPuzzled
