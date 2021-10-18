import React from "react";
import {highlightText} from "../../utils/helpers/highlightText";
import {underlineTextDecoration} from "../../utils/helpers/underlineTextDecoration";
import {lineThroughTextDecoration} from "../../utils/helpers/lineThroughTextDecoration";
import {clearContextHighlight} from "../../utils/helpers/clearContextHighlight";
import boldIcon from "../../assets/bold.png";
import underlineIcon from "../../assets/underline.png";
import lineThroughIcon from "../../assets/line-through.png";
import classes from "./Menu.module.css";

export const Menu = React.memo(({context, word, scale, clearSelectedWord}) => {

    const underline = () => {
        clearContextHighlight(context, word, scale)
        underlineTextDecoration(context, word, scale)
        clearSelectedWord(null)
    }

    const highlight = () => {
        clearContextHighlight(context, word, scale)
        highlightText(context, "rgba(234,231,9,0.6)", word, scale)
        clearSelectedWord(null)
    }

    const lineThrough = () => {
        clearContextHighlight(context, word, scale)
        lineThroughTextDecoration(context, word, scale)
        clearSelectedWord(null)
    }

    // const style = {
    //     display: "flex",
    //     alignItems: "center",
    //     position: "absolute",
    //     border: "1px solid black",
    //     background: "black",
    //     padding: "1px",
    //     borderRadius: "3px",
    //     top: `${(accuracy - word.coordinates[3] + 28) * scale}px`,
    //     left: `${((word.coordinates[2] + word.coordinates[0]) * scale) / 2}px`
    // }

    return (
        <div className={classes.buttonBlock}>
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