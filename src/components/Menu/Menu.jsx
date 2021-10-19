import React from "react";
import {highlightText} from "../../utils/helpers/highlightText";
import {underlineTextDecoration} from "../../utils/helpers/underlineTextDecoration";
import {lineThroughTextDecoration} from "../../utils/helpers/lineThroughTextDecoration";
import {clearContextHighlight} from "../../utils/helpers/clearContextHighlight";
import boldIcon from "../../assets/bold.png";
import underlineIcon from "../../assets/underline.png";
import lineThroughIcon from "../../assets/line-through.png";
import classes from "./Menu.module.css";
import {setEffectsToSessionStorage} from "../../utils/helpers/sessionStorageHelper";

export const Menu = React.memo(({context, word, scale, clearSelectedWord}) => {

    const underline = () => {
        clearContextHighlight(context, word.coordinates, scale)
        underlineTextDecoration(context, "rgb(17,17,17)", word.coordinates, scale)
        setEffectsToSessionStorage(word, "rgb(17,17,17)", "underline")
        clearSelectedWord(null)
    }

    const highlight = () => {
        clearContextHighlight(context, word.coordinates, scale)
        highlightText(context, "rgba(234,231,9,0.6)", word.coordinates, scale)
        setEffectsToSessionStorage(word, "rgba(234,231,9,0.6)", "highlight")
        clearSelectedWord(null)
    }

    const lineThrough = () => {
        clearContextHighlight(context, word.coordinates, scale)
        lineThroughTextDecoration(context, "rgb(255,0,11)", word.coordinates, scale)
        setEffectsToSessionStorage(word, "rgb(255,0,11)", "lineThrough")
        clearSelectedWord(null)
    }

    return (
        <div className={classes.buttonBlock}>
            <button onClick={highlight} title='Выделение текста' aria-label='Выделение текста'
                    className={classes.button}>
                <img src={boldIcon} alt='выделить'/>
            </button>
            <button onClick={underline} title='Подчеркнуть текста' aria-label='Подчеркнуть текста'
                    className={classes.button}>
                <img src={underlineIcon} alt='подчеркнуть'/>
            </button>
            <button onClick={lineThrough} title='Зачеркнуть текста' aria-label='Зачеркнуть текста'
                    className={classes.button}>
                <img src={lineThroughIcon} alt='зачеркнуть'/>
            </button>
        </div>
    );
})