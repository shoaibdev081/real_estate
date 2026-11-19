import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineArrowSmallRight } from "react-icons/hi2";

function PrimaryButton({ text, className, href }) {
    const buttonContent = (
        <>
            {text}
            <HiOutlineArrowSmallRight className='bg-(--brand-camel) p-1 rounded-full -rotate-45' size={30} />
        </>
    );

    if (href) {
        return (
            <Link to={href} className={`px-4 py-2 border border-white rounded-3xl flex gap-2 items-center font-bold ${className}`}>
                {buttonContent}
            </Link>
        );
    }

    return (
        <div className={`px-4 py-2 border border-white rounded-3xl flex gap-2 items-center font-bold ${className}`}>
            {buttonContent}
        </div>
    )
}

export default PrimaryButton