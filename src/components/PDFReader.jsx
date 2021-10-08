import React, {useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "./ControlPanel";
import classes from "./PDFReader.module.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {
    const [scale, setScale] = useState(1.0)
    const [position, setPosition] = useState({
        x: "", y: ""
    })
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const onDocumentLoadSuccess = ({numPages}) => {
        setNumPages(numPages)
    }

    const handleMouseMove = (event) => {
        setPosition({
            x: event.clientX,
            y: event.clientY
        })
    }

    return (
        <div>
            <section
                id="pdf-section"
                className={classes.pdfSection}
                onMouseUp={handleMouseMove}
            >
                <ControlPanel
                    scale={scale}
                    setScale={setScale}
                    numPages={numPages}
                    pageNumber={pageNumber}
                    setPageNumber={setPageNumber}
                    position={position}
                />
                <Document
                    file="/assets/docs/document.pdf"
                    onLoadSuccess={onDocumentLoadSuccess}
                >
                    <Page pageNumber={pageNumber} scale={scale}/>
                </Document>
            </section>
        </div>
    );
}
