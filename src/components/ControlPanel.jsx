import React from "react";
import classes from "./ControlPanel.module.css"

export const ControlPanel = (props) => {
    const { pageNumber, numPages, setPageNumber, scale, setScale } = props

    const isFirstPage = pageNumber === 1
    const isLastPage = pageNumber === numPages

    const firstPageClass = isFirstPage ? classes.disabled : classes.clickable
    const lastPageClass = isLastPage ? classes.disabled : classes.clickable

    const goToPreviousPage = () => {
        if (!isFirstPage) setPageNumber(pageNumber - 1)
    }
    const goToNextPage = () => {
        if (!isLastPage) setPageNumber(pageNumber + 1)
    }

    const isMinZoom = scale < 0.6
    const isMaxZoom = scale >= 2.0

    const zoomOutClass = isMinZoom ? classes.disabled : classes.clickable
    const zoomInClass = isMaxZoom ? classes.disabled : classes.clickable

    const zoomOut = () => {
        if (!isMinZoom) setScale(scale - 0.1)
    }

    const zoomIn = () => {
        if (!isMaxZoom) setScale(scale + 0.1)
    }

    return (
        <div className={classes.panelContainer}>
            <div className={classes.panelBlock}>
                <i
                    className={`fas fa-backward mx-3 ${firstPageClass}`}
                    onClick={goToPreviousPage}
                />
                <span>
          Page{pageNumber} of {numPages}
        </span>
                <i
                    className={`fas fa-forward mx-3 ${lastPageClass}`}
                    onClick={goToNextPage}
                />
            </div>
            <div className={classes.panelBlock}>
                <i
                    className={`fas fa-search-minus mx-3 ${zoomOutClass}`}
                    onClick={zoomOut}
                />
                <span>{(scale * 100).toFixed()}%</span>
                <i
                    className={`fas fa-search-plus mx-3 ${zoomInClass}`}
                    onClick={zoomIn}
                />
            </div>
        </div>
    );
}
