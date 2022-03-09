import React, {useState} from "react";
import {SubmitButton} from "./SubmitButton";
import {createForm} from "../service/BuilderService";

const MAX_CHOICES = 50; //Max Number of Choices
//All Possible Orders
const Order = [
    {value: "NONE", option: "None", _id: '1'},
    {value: 'ALPHA', option: 'Display in Alphabetical', _id: '2'},
    {value: 'LENGTH', option: 'Display in Length', _id: '3'}
]

const Builder = () => {
    const [choices, setChoices] = useState([{Choice: "", _id: 'PLACEHOLDER'}]);
    const [newChoice, setNewChoice] = useState("");
    const [defaultvalue, setDefaultValue] = useState("");
    const [over50Warning, set50Warning] = useState("hidden")
    const [multiSelect, setMultiSelect] = useState(false);
    const [order, setOrder] = useState(0)
    const [label, setLabel] = useState("")

    /**
     * Clear/Reset all states
     */
    const handleClear = () => {
        setChoices([{Choice: "", _id: 'PLACEHOLDER'}]);
        setNewChoice("");
        setDefaultValue("");
        set50Warning("hidden");
        setLabel("");
        if(order !== 0) {
            order.selectedIndex = 0;
            setOrder(0);
        }
        setMultiSelect(false);
    }

    /**
     * Submit the form and post it to the API
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        let seen = false;
        for (const c of choices) {
            if (c.Choice === defaultvalue) {
                seen = true;
                break;
            }
        }
        if (!seen) {
            setChoices([...choices, {Choice: defaultvalue, _id: "DEFAULT_VALUE"}]);
            setNewChoice('');
        }
        if (label === "") {
            alert("Label field is required");
            return;
        }

        let choiceOrder = (order === 0) ? "NONE" : order.options[1].value;
        let form = {
            Label: label,
            multiSelect: multiSelect,
            defaultValue: defaultvalue,
            choices: choices,
            order: choiceOrder
        }

        form = JSON.stringify(form);
        const response = await createForm(form);
        console.log(response);
        console.log(form);

    }

    /**
     * Add a new Choice
     */
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

    /**
     * Remove a choice from Choice list
     */
    const remove = () => {
        if (newChoice === "") {
            alert("choice cannot be empty");
            return;
        }
        const originLength = choices.length;
        const new_choices = choices.filter(c => c.Choice !== newChoice);
        if (originLength === new_choices.length) {
            alert("Choice did not find");
            return;
        }
        alert("Choice " + newChoice +" deleted");
        setChoices(new_choices);
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
                           value={label}
                           onChange={(e) =>
                               setLabel(e.target.value)}/>
                </div>
                <div className="form-control">
                    <span>Type</span>
                    <span>Multi-select
                        <input type="checkbox"
                               id={'multi-select'}
                               name={'multi-select'}
                               onChange={(e) =>
                                   setMultiSelect(e.target.checked)}
                               checked={multiSelect}/>
                        A Value is required
                    </span>
                </div>
                <div className="form-control">
                    <label htmlFor="default-value">Default Value </label>
                    <input type="text"
                           id={'default-value'}
                           name={'default-value'}
                           onChange={(e) =>
                               setDefaultValue(e.target.value)}
                           value={defaultvalue}/>
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
                    <label>Add/Remove Choices</label>
                    <span>
                        <input type="text"
                               onChange={(e) =>
                                   setNewChoice(e.target.value)}
                               value={newChoice}/>
                        <span className={'choice-btn'}
                              onClick={addNewChoice}>+</span>
                        <span className={'choice-btn'}
                              onClick={remove}>-</span>
                    </span>
                </div>
                <div className="form-control">
                    <div/>
                    <span className={'over-max-choice'}
                          style={{visibility: over50Warning}}>Over Max {MAX_CHOICES} Choices!</span>
                </div>
                <div className="form-control">
                    <label htmlFor="order">Order </label>
                    <select id={'order'} name={'order'}
                            onChange={(e) => setOrder(e.target)}>
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
                    <button className={'clear-btn'} type={'button'}
                            onClick={() => handleClear()}>
                        Clear
                    </button>
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