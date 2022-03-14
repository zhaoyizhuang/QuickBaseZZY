import React, {useState} from "react";
import {SubmitButton} from "../Button/SubmitButton";
import {createForm} from "../service/BuilderService";
import './BuilderApp.css'
import {randomID} from "../RandomGenerator/RandomID";
import ChoiceInput from "./ChoiceInput";
import Draft from "draft-js";
import axios from "axios";

const MAX_CHOICES = 50; //Max Number of Choices
const MAX_CHOICE_LENGTH = 40; //Max Length of a Choice
//All Possible Orders
const Order = [
    {value: "NONE", option: "None", _id: '1'},
    {value: 'ALPHA', option: 'Display in Alphabetical', _id: '2'},
    {value: 'LENGTH', option: 'Display in Length', _id: '3'}
]

const Builder = () => {
    const controller = new AbortController();
    const EditorState = Draft.EditorState;
    const ContentState = Draft.ContentState;
    const storage = window.localStorage;
    const savedChoices = JSON.parse(storage.getItem('choices'));
    const savedNewChoice = storage.getItem('newChoice');
    const savedDefault = storage.getItem('defaultValue');
    const savedMulti = JSON.parse(storage.getItem('multiSelect'));
    const savedLabel = storage.getItem('label');
    const savedOrder = JSON.parse(storage.getItem('order'));

    const [choices, setChoices]
        = useState(savedChoices === null? [] : savedChoices); // Using [] instead of set
    // because choice is object instead of string adn set does not work well for reference type
    const [newChoice, setNewChoice]
        = useState(savedNewChoice === null? "" : savedNewChoice);
    const [defaultvalue, setDefaultValue]
        = useState(savedDefault === null? "" : savedDefault);
    const [over50Warning, set50Warning] = useState("hidden");
    const [multiSelect, setMultiSelect]
        = useState(savedMulti === null? false : savedMulti);
    const [order, setOrder] //selectedIndex for Order
        = useState(savedOrder === null? 0 : savedOrder);
    const [label, setLabel]
        = useState(savedLabel === null? "" : savedLabel);
    const [editor, setEditor]
        // = useState(EditorState.createEmpty());
        = useState(EditorState.createWithContent(ContentState.createFromText(newChoice)));
    const [submitted, setSubmitted] = useState(false); // If the form is submitted
    const [load, setLoad] = useState(false); // status for loading bar

    window.onbeforeunload = function()
    {
        // if (submitted) {
        //     // do not store data into local storage
        //     setSubmitted(false);
        //     return;
        // }
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
        setEditor(EditorState.push(editor, ContentState.createFromText(''), 'remove-range'));
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
                alert("over " + MAX_CHOICES +" max choices");
                return;
            }
            setChoices(realChoices);
            // State updates in React are not applied immediately. Instead,
            // they are placed in a queue and scheduled. In fact,
            // React does not apply the new values to the state until the component is reconciled.
            // Thus, I need realChoices instead of choices to be in the JSON request.
        }

        setLoad(true); //Loading animation
        let form = {
            Label: label,
            multiSelect: multiSelect,
            defaultValue: defaultvalue,
            choices: realChoices,
            order: Order[order].value
        }

        form = JSON.stringify(form);
        const response = await createForm(form, controller);
        window.localStorage.clear();
        setSubmitted(true);
        console.log(response);
        console.log(form);
        // window.location.reload(); enable to reload the page
        setTimeout(() => {setLoad(false)}, 1000); //set timeout to see the animation
    }

    const cancelRequest = () => {
        controller.abort();
        setLoad(false);
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
        // Not choices.push() because setState()
        // afterwards may replace the mutation. Also, mutate state directly is never a good idea
        // since it may cause some abnormal, break React's idea and slow down the project.
        setNewChoice('');
        setEditor(EditorState.push(editor, ContentState.createFromText(''), 'remove-range'));
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
        const new_choices = choices.filter(c => c.Choice !== newChoice); //filter does not mutate
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
        setEditor(EditorState.push(editor, ContentState.createFromText(''), 'remove-range'));
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
                        {/*<input type="text"*/}
                        {/*       onChange={(e) =>*/}
                        {/*           setNewChoice(e.target.value)}*/}
                        {/*       value={newChoice}/>*/}
                        <ChoiceInput newChoice={newChoice}
                                     setNewChoice={setNewChoice}
                                     MaxLength={MAX_CHOICE_LENGTH} editor={editor} setEditor={setEditor}/>
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
                                       event={handleSubmit}
                                       state={load}/>}
                        <span> Or <span className={'cancel'}
                                        onClick={() => cancelRequest()}> Cancel </span>
                        </span>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Builder;