import React from "react";

/**
 * Submit Button component that can be reused
 * @param type type of the button
 * @param words words on the button
 * @param event OnclickEventHandler
 * @return {JSX.Element} button element
 */
export const SubmitButton = ({type, words, event}) => {
    return (
        <button type={type}
                className={'submit-btn'}
                id={'submit-btn'}
                onClick={() => event()}>
            {words}
        </button>
    )
}