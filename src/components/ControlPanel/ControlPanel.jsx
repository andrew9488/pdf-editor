import React from "react";
import {LoadPDF} from "../LoadPDF/LoadPDF";
import classes from "./ControlPanel.module.css"

export const ControlPanel = React.memo(props => {
    const {pageNumber, numPages, setPageNumber, scale, setScale, loadPdf} = props

    const isFirstPage = pageNumber === 1
    const isLastPage = pageNumber === numPages

    const isMinZoom = scale < 0.6
    const isMaxZoom = scale >= 2.0

    const goToPreviousPage = () => {
        if (!isFirstPage) setPageNumber(pageNumber - 1)
    }
    const goToNextPage = () => {
        if (!isLastPage) setPageNumber(pageNumber + 1)
    }

    const zoomOut = () => {
        if (!isMinZoom) setScale(scale - 0.1)
    }

    const zoomIn = () => {
        if (!isMaxZoom) setScale(scale + 0.1)
    }

    return (
        <div className={classes.panelContainer}>
            <div className={classes.panelBlock}>
                <button onClick={goToPreviousPage} disabled={isFirstPage}>
                    <i className={`fas fa-backward mx-3`}/></button>
                <span>
          Page{pageNumber} of {numPages}
        </span>
                <button onClick={goToNextPage} disabled={isLastPage}>
                    <i className={`fas fa-forward mx-3`}/></button>
            </div>
            <div className={classes.panelBlock}>
                <button onClick={zoomOut} disabled={isMinZoom}>
                    <i className={`fas fa-search-minus mx-3`}/>
                </button>
                <span>{(scale * 100).toFixed()}%</span>
                <button onClick={zoomIn} disabled={isMaxZoom}>
                    <i className={`fas fa-search-plus mx-3`}/>
                </button>
            </div>
            <LoadPDF loadPdf={loadPdf}/>
        </div>
    );
})
