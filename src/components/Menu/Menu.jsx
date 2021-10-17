import React from "react";
import {highlightText} from "../../utils/helpers/highlightText";
import {textDecoration} from "../../utils/helpers/textDecoration";
import {accuracy} from "../../utils/helpers/canvasHelper";

export const Menu = React.memo(({context, word, scale, clearSelectedWord}) => {

    const underline = () => {
        textDecoration(context, word, scale)
        clearSelectedWord(null)
    }

    const highlight = () => {
        highlightText(context, "rgb(250,204,5)", word, scale)
        clearSelectedWord(null)
    }

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            position: "absolute",
            top: `${(accuracy - word.coordinates[3]+32)*scale}px`,
            left: `${(word.coordinates[2] + word.coordinates[0]) * scale / 2}px`
        }}>
            <button onClick={underline}><i className={`fas fa-pen mx-3`}/></button>
            {/*<button>{word.word}</button>*/}
            <button onClick={highlight}><i className={`fas fa-paint-brush mx-3`}/></button>
        </div>
    );
})