import React, {useEffect, useState} from "react";
import ContentState, {Editor, EditorState, Modifier, RichUtils} from 'draft-js';
import Draft from "draft-js";


export const ChoiceInput = ({newChoice, setNewChoice, MaxLength, editor, setEditor}) => {
    const EditorState = Draft.EditorState;
    const ContentState = Draft.ContentState;

    const checkLength = (e) => {
        const selection = e.getSelection();
        //Make sure that select all wound not change the color.
        if (!selection.isCollapsed()) return;

        // Allow one color at a time. Turn off all active colors.
        const nextContentState = Object.keys(colorStyleMap)
            .reduce((contentState, color) => {
                return Modifier.removeInlineStyle(contentState, selection, color)
            }, e.getCurrentContent());

        let nextEditorState = EditorState.push(
            e,
            nextContentState,
            'change-inline-style'
        );

        const currentStyle = e.getCurrentInlineStyle();

        // Unset style override for current color.
        if (selection.isCollapsed()) {
            nextEditorState = currentStyle.reduce((state, color) => {
                return RichUtils.toggleInlineStyle(state, color);
            }, nextEditorState);
        }

        if (e.getCurrentContent()
            .getPlainText('\u0001').length >= MaxLength) {
            nextEditorState = RichUtils.toggleInlineStyle(
                nextEditorState,
                'red'
            );
        }

        setEditor(nextEditorState);
    }
    return (
        <Editor editorState={editor}
                className={'choice-input'}
                customStyleMap={colorStyleMap}
                onChange={(e) => {
                    setEditor(e);
                    setNewChoice(e.getCurrentContent()
                                     .getPlainText('\u0001').substr(0, MaxLength));
                    checkLength(e);
                }}/>
    )
}

const colorStyleMap = {
    red: {
        color: 'rgba(255, 0, 0, 1.0)',
    },
    black: {
        color: 'rgb(0,0,0)',
    }
}


export default ChoiceInput;