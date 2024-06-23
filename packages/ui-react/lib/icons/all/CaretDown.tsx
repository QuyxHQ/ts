import React from 'react'
import { IconProps } from '../../types'

const CaretDown: React.FC<IconProps> = ({ className, fill, size = 18 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            fill="none"
            className={className}
            viewBox="0 0 16 16"
        >
            <path
                fill={fill || 'currentColor'}
                fillRule="evenodd"
                d="M10.212 14.34a.75.75 0 00.129-1.052L6.202 8l4.139-5.288a.75.75 0 10-1.182-.924l-4.5 5.75a.75.75 0 000 .924l4.5 5.75a.75.75 0 001.053.129z"
                clipRule="evenodd"
            ></path>
        </svg>
    )
}

export default CaretDown
