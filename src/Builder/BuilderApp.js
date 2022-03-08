import React, {useState} from "react";

const Builder = () => {
    const alert = () => {
        console.log("alert");
    }
    return(
        <div>
            <div className="title">
                Field Builder
            </div>
            <form className={'form'}>
                <div className="form-control">
                    <label htmlFor="label">Label </label>
                    <input type="text"
                           id={'label'}
                           name={'label'}
                           placeholder={'Sales Region'}/>
                </div>
                <div className="form-control">
                    <span>Type</span>
                    <span>Multi-select
                        <input type="checkbox"
                               id={'multi-select'}
                               name={'multi-select'}/>
                        A Value is required
                    </span>
                </div>
                <div className="form-control">
                    <label htmlFor="default-value">Default Value </label>
                    <input type="text" id={'default-value'} name={'default-value'}/>
                </div>
                <div className="form-control">
                    <label htmlFor="choices">Order </label>
                    <select id={'choices'} name={'choices'}>
                        <option value="Australia">Australia</option>
                    </select>
                </div>
                <div className="form-control">
                    <label htmlFor="order">Order </label>
                    <select id={'order'} name={'order'}>
                        <option value="empty"/>
                        <option value="alpha">Display in Alphabetical</option>
                        <option value="length">Display in Length</option>
                    </select>
                </div>

                <div className="form-control">
                    <div/>
                    <div className={'save'}>
                        <button className={'btn'} id={'btn'}>
                            Save changes
                        </button>
                        <span> Or <span className={'cancel'}
                                        onClick={() => alert()}> Cancel </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Builder;