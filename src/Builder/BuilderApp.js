import React, {useState} from "react";
import {SubmitButton} from "./SubmitButton";

const MAX_CHOICES = 2;
const Order = [
    {value: "NONE", option: "None", _id: '1'},
    {value: 'ALPHA', option: 'Display in Alphabetical', _id: '2'},
    {value: 'LENGTH', option: 'Display in Length', _id: '3'}
]

const Builder = () => {
    const [choices, setChoices] = useState([{Choice: "", _id: 'PLACEHOLDER'}]);
    const [newChoice, setNewChoice] = useState("");
    const [over50Warning, set50Warning] = useState("hidden")
    const [label, setLabel] = useState("")
    const handleSubmit = (e) => {
        e.preventDefault();
        if (label === "") {
            alert("Label field is required");
            return;
        }
        console.log("submitted");
    }
    const addNewChoice = () => {
        if (newChoice === "") {
            alert("choice cannot be empty");
            return;
        }
        for (const c of choices) {
            if (c.Choice === newChoice) {
                alert("duplicate choice");
                return;
            }
        }
        if (choices.length > MAX_CHOICES) {
            set50Warning('visible');
            return;
        } else {
            set50Warning('hidden');
        }
        const randomId = (new Date()).getTime() + "";
        const choice = {
            Choice: newChoice, _id: randomId
        }
        setChoices([...choices, choice]);
        setNewChoice('');
    }
    return(
        <div>
            <div className="title">Field Builder</div>
            <form className={'form'} onSubmit={handleSubmit}>
                <div className="form-control">
                    <label htmlFor="label">Label </label>
                    <input type="text"
                           id={'label'}
                           name={'label'}
                           placeholder={'Required Field'}
                           onChange={(e) =>
                               setLabel(e.target.value)}/>
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
                    <input type="text"
                           id={'default-value'}
                           name={'default-value'}
                           placeholder={choices[0].Choice}/>
                </div>
                <div className="form-control">
                    <label htmlFor="choices">Choices </label>
                    <select id={'choices'} name={'choices'}>
                        {
                            choices.map(
                                choice =>
                                {
                                    if (choice._id !== 'PLACEHOLDER') {
                                        return (
                                            <option key={choice._id}>{choice.Choice}</option>
                                               )
                                    }
                                }

                            )
                        }
                    </select>
                </div>
                <div className="form-control">
                    <div/>
                    <span className={'over-max-choice'}
                          style={{visibility: over50Warning}}>Over Max {MAX_CHOICES} Choices!</span>
                </div>
                <div className="form-control">
                    <div/>
                    <span>
                        <input type="text"
                               onChange={(e) =>
                                   setNewChoice(e.target.value)}
                               value={newChoice}/>
                        <span className={'add-new-btn'}
                              onClick={addNewChoice}>+</span>
                    </span>
                </div>
                <div className="form-control">
                    <label htmlFor="order">Order </label>
                    <select id={'order'} name={'order'}>
                        {
                            Order.map(
                                order =>
                                    <option value={order.value}
                                            key={order._id}>{order.option}</option>
                            )
                        }
                    </select>
                </div>

                <div className="form-control">
                    <div/>
                    <div className={'save'}>
                        {<SubmitButton type={'submit'} words={'Save changes'}/>}
                        <span> Or <span className={'cancel'}> Cancel </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Builder;