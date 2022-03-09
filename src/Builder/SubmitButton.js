import React from "react";

/**
 * Submit Button component that can be reused
 * @param words words on the button
 * @return {JSX.Element} button element
 */
export const SubmitButton = ({type, words}) => {
    return (
        <button type={type}
                className={'submit-btn'}
                id={'submit-btn'}>
            {words}
        </button>
    )
}