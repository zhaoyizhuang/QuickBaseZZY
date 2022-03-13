import React, {useState} from "react";
import './Button.css'

/**
 * Submit Button component that can be reused
 * @param type type of the button
 * @param words words on the button
 * @param event OnclickEventHandler
 * @param state Loading status
 * @return {JSX.Element} button element
 */
export const SubmitButton = ({type, words, event, state}) => {
    return (
        <span>
            {
                state ? (
                    <div className="loader"/>
                ) : (
                    <button type={type}
                            className={'submit-btn'}
                            id={'submit-btn'}
                            onClick={() => {
                                event();
                            }}>
                        {words}
                    </button>
                )
            }
        </span>
    )
}