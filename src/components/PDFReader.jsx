import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import {ControlPanel} from "./ControlPanel";
import classes from "./PDFReader.module.css"
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {
    const [scale, setScale] = useState(1.0)
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
    }

    return (
        <div>
            <section
                id="pdf-section"
                className={classes.pdfSection}
            >
                <ControlPanel
                    scale={scale}
                    setScale={setScale}
                    numPages={numPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                />
                <Document
                    file="/assets/docs/document.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} scale={scale} />
                </Document>
            </section>
        </div>
    );
}
