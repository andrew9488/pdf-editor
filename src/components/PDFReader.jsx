import React, {useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "./ControlPanel";
import classes from "./PDFReader.module.css"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const [scale, setScale] = useState(1.0)
    const [position, setPosition] = useState({
        x: 0, y: 0
    })
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)

    const ref = useRef()

    useEffect(() => {
        let parent = ref.current.parentNode.getBoundingClientRect()
        document.onmouseup = () => {
            let select = getSelection().getRangeAt(0).getBoundingClientRect()
            const x = select.left - parent.left;
            const y = select.top - parent.top;
            setPosition({
                x: x.toFixed(0),
                y: y.toFixed(0)
            })
        };
    })

    const onDocumentLoadSuccess = ({numPages}) => {
        setNumPages(numPages)
    }

    const handleMouse = () => {
        let parent = ref.current.parentNode.getBoundingClientRect()
        document.onmouseup = () => {
            let select = getSelection()
            if (select.type !== "None") {
                let sel = select.getRangeAt(0).getBoundingClientRect()
                const x = sel.left - parent.left;
                const y = sel.top - 56 - parent.top;
                setPosition({
                    x: x.toFixed(0),
                    y: y.toFixed(0)
                })
            }
        }
    }


    return (
        <div>
            <section
                id="pdf-section"
                className={classes.pdfSection}
                onMouseUp={handleMouse}
                // onDoubleClick={handleMouse}
                ref={ref}
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
