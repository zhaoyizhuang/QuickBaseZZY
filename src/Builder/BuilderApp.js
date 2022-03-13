import React, {useState} from "react";
import {SubmitButton} from "./SubmitButton";
import {createForm} from "../service/BuilderService";
import './BuilderApp.css'
import {randomID} from "../RandomGenerator/RandomID";

const MAX_CHOICES = 50; //Max Number of Choices
//All Possible Orders
const Order = [
    {value: "NONE", option: "None", _id: '1'},
    {value: 'ALPHA', option: 'Display in Alphabetical', _id: '2'},
    {value: 'LENGTH', option: 'Display in Length', _id: '3'}
]

const Builder = () => {
    const storage = window.localStorage;
    const savedChoices = JSON.parse(storage.getItem('choices'));
    const savedNewChoice = storage.getItem('newChoice');
    const savedDefault = storage.getItem('defaultValue');
    const savedMulti = JSON.parse(storage.getItem('multiSelect'));
    const savedLabel = storage.getItem('label');
    const savedOrder = JSON.parse(storage.getItem('order'));

    const [choices, setChoices]
        = useState(savedChoices === null? [] : savedChoices);
    const [newChoice, setNewChoice]
        = useState(savedNewChoice === null? "" : savedNewChoice);
    const [defaultvalue, setDefaultValue]
        = useState(savedDefault === null? "" : savedDefault);
    const [over50Warning, set50Warning] = useState("hidden");
    const [multiSelect, setMultiSelect]
        = useState(savedMulti === null? false : savedMulti);
    const [order, setOrder]
        = useState(savedOrder === null? 0 : savedOrder);
    const [label, setLabel]
        = useState(savedLabel === null? "" : savedLabel);
    const [submitted, setSubmitted] = useState(false);


    window.onbeforeunload = function()
    {
        if (submitted) {
            setSubmitted(false);
            return;
        }
        storage.setItem('choices', JSON.stringify(choices));
        storage.setItem('newChoice', newChoice);
        storage.setItem('defaultValue', defaultvalue);
        storage.setItem('multiSelect', JSON.stringify(multiSelect));
        storage.setItem('label', label);
        storage.setItem('order',JSON.stringify(order));
    };

    /**
     * Clear/Reset all states
     */
    const handleClear = () => {
        setChoices([]);
        setNewChoice("");
        setDefaultValue("");
        set50Warning("hidden");
        setLabel("");
        setOrder(0);
        setMultiSelect(false);
    }

    /**
     * Submit the form and post it to the API
     */
    const handleSubmit = async (e) => {
        // e.preventDefault();
        if (label === "") {
            alert("Label field is required");
            return;
        }

        let seen = false; //represent if default value is in choices.
        for (const c of choices) {
            if (c.Choice === defaultvalue) {
                seen = true;
                break;
            }
        }

        let realChoices = choices; //represent the choices with possible unseen default value
        if (!seen && defaultvalue !== "") {
            const choice = {
                Choice: defaultvalue, _id: randomID()
            }
            realChoices = [...realChoices, choice];
            if (realChoices.length > MAX_CHOICES) {
                // If choices are more than max value
                alert("default value not in choices");
                return;
            }
            setChoices(realChoices);
            // State updates in React are not applied immediately. Instead,
            // they are placed in a queue and scheduled. In fact,
            // React does not apply the new values to the state until the component is reconciled.
            // Thus, I need realChoices instead of choices to be in the JSON request.
        }


        let form = {
            Label: label,
            multiSelect: multiSelect,
            defaultValue: defaultvalue,
            choices: realChoices,
            order: Order[order].value
        }

        form = JSON.stringify(form);
        const response = await createForm(form);
        window.localStorage.clear();
        //handleClear(); enable it if want to reload all field when submit.
        setSubmitted(true);
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
        if (choices.length >= MAX_CHOICES) {
            set50Warning('visible');
            return;
        } else {
            set50Warning('hidden');
        }
        const choice = {
            Choice: newChoice, _id: randomID()
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
        if (choices.length <= MAX_CHOICES) {
            set50Warning("hidden");
        }
        setChoices(new_choices);
        setNewChoice('');
    }

    return(
        <div>
            <div className="title">Field Builder</div>
            <form className={'form'} onSubmit={handleSubmit}>
                <div className="form-control">
                    <label>Label </label>
                    <input type="text"
                           placeholder={'Required Field'}
                           value={label}
                           onChange={(e) =>
                               setLabel(e.target.value)}/>
                </div>
                <div className="form-control">
                    <label>Type </label>
                    <span>Multi-select
                        <input type="checkbox"
                               className={'check-box'}
                               onChange={(e) =>
                                   setMultiSelect(e.target.checked)}
                               checked={multiSelect}/>
                        A Value is required
                    </span>
                </div>
                <div className="form-control">
                    <label>Default Value </label>
                    <input type="text"
                           value={defaultvalue}
                           onChange={(e) =>
                               setDefaultValue(e.target.value)}/>
                </div>
                <div className="form-control">
                    <label>Choices </label>
                    <select>
                        {
                            choices.map( choice => {
                                return (<option key={choice._id}>{choice.Choice}</option>)
                            })
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
                    <label>Order </label>
                    <select onChange={(e) => setOrder(e.target.selectedIndex)}
                            value={Order[order].value}>
                        {
                            Order.map(
                                o => <option value={o.value}
                                             key={o._id}>{o.option}</option>
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
                        {<SubmitButton type={'button'}
                                       words={'Save changes'}
                                       event={handleSubmit}/>}
                        <span> Or <span className={'cancel'}> Cancel </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Builder;