import React, {useCallback, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "../ControlPanel/ControlPanel";
import {canvasHelper} from "../../utils/helpers/canvasHelper";
import {clearContext} from "../../utils/helpers/clearContext";
import classes from "./PDFReader.module.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRef = useRef()

    const [pdf, setPdf] = useState(null)
    const [json, setJson] = useState(null)
    const [scale, setScale] = useState(1.0)
    const [canvasSize, setCanvasSize] = useState({height: 0, width: 0})
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [words, setWords] = useState([])
    const [context, setContext] = useState(null)

    useEffect(() => {
        clearContext(json, pageNumber, context, setWords, canvasSize)
    }, [pageNumber, json, context])

    useEffect(() => {
        let ctx = canvasRef?.current?.getContext('2d');
        setContext(ctx)
    }, [])

    const onDocumentLoadSuccess = useCallback(({numPages}) => {
        setNumPages(numPages)

    }, [])

    const onRenderSuccess = useCallback(() => {
        setCanvasSize({
            height: docRef.current.clientHeight * scale,
            width: docRef.current.clientWidth * scale
        })
        words.forEach(w => canvasHelper(context, w, scale))
    }, [scale, words])

    const loadPdf = useCallback((file) => {
        setPdf(file)
    }, [])

    return (
        <div className={classes.pdfSection}>
            <ControlPanel
                scale={scale}
                setScale={setScale}
                numPages={numPages}
                pageNumber={pageNumber}
                setPageNumber={setPageNumber}
                loadPdf={loadPdf}
            />
            <Document
                inputRef={docRef}
                file={pdf}
                onLoadSuccess={onDocumentLoadSuccess}
            >
                <Page pageNumber={pageNumber} scale={scale} onRenderSuccess={onRenderSuccess}/>
            </Document>
            <canvas height={canvasSize.height} width={canvasSize.width} ref={canvasRef} className={classes.canvas}/>
        </div>
    );
}


// const handleMouse = () => {
//     let parent = docRef.current.parentNode.getBoundingClientRect()
//     document.onmouseup = () => {
//         let select = getSelection()
//         if (select.type !== "None") {
//             let sel = select.getRangeAt(0).getBoundingClientRect()
//             const x = sel.left - parent.left;
//             const y = sel.top - height - parent.top;
//             setPosition({
//                 x: x.toFixed(0),
//                 y: y.toFixed(0)
//             })
//         }
//     }
// }
// const [position, setPosition] = useState({
//     x: 0, y: 0
// })
