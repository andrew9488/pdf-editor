import React from "react";
import {highlightText} from "../../utils/helpers/highlightText";
import {underlineTextDecoration} from "../../utils/helpers/underlineTextDecoration";
import {accuracy} from "../../utils/helpers/canvasHelper";
import boldIcon from "../../assets/bold.png";
import underlineIcon from "../../assets/underline.png";
import lineThroughIcon from "../../assets/line-through.png";
import classes from "./Menu.module.css";
import {lineThroughTextDecoration} from "../../utils/helpers/lineThroughTextDecoration";

export const Menu = React.memo(({context, word, scale, clearSelectedWord}) => {

    const underline = () => {
        underlineTextDecoration(context, word, scale)
        clearSelectedWord(null)
    }

    const highlight = () => {
        highlightText(context, "rgb(250,204,5)", word, scale)
        clearSelectedWord(null)
    }

    const lineThrough = () => {
        lineThroughTextDecoration(context, word, scale)
        clearSelectedWord(null)
    }

    const style = {
        display: "flex",
        alignItems: "center",
        position: "absolute",
        border: "1px solid black",
        background: "black",
        padding: "1px",
        borderRadius: "3px",
        top: `${(accuracy - word.coordinates[3] + 25) * scale}px`,
        left: `${(word.coordinates[2] + word.coordinates[0]) * scale / 2}px`
    }

    return (
        <div style={style}>
            <button onClick={highlight} title="Выделение текста" aria-label='Выделение текста'
                    className={classes.button}>
                <img src={boldIcon} alt="выделить"/>
            </button>
            <button onClick={underline} title="Подчеркнуть текста" aria-label='Подчеркнуть текста'
                    className={classes.button}>
                <img src={underlineIcon} alt="подчеркнуть"/>
            </button>
            <button onClick={lineThrough} title="Зачеркнуть текста" aria-label='Зачеркнуть текста'
                    className={classes.button}>
                <img src={lineThroughIcon} alt="зачеркнуть"/>
            </button>

        </div>
    );
})