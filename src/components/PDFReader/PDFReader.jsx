import React, {useCallback, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "../ControlPanel/ControlPanel";
import {canvasHelper} from "../../utils/helpers/canvasHelper";
import {clearContext} from "../../utils/helpers/clearContext";
import {useFetch} from "../../utils/hooks/useFetch";
import {pdfApi} from "../../api/api";
import classes from "./PDFReader.module.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import testjson from "../../test.json";
import testpdf from "../../test.pdf";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRef = useRef()

    const [pdf, setPdf] = useState(testpdf)
    const [json, setJson] = useState(testjson)
    const [scale, setScale] = useState(1.0)
    const [canvasSize, setCanvasSize] = useState({height: 0, width: 0})
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [words, setWords] = useState([])
    const [context, setContext] = useState(null)
    const [fetch] = useFetch(async (pdf) => {
        const response = await pdfApi.sendPdf(pdf)
        setJson(response)
    })

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

    const loadPdf = useCallback(async (file) => {
        if (file) {
            setPdf(file)
            fetch(file)
        }
    }, [])

    const handleMouse = (e) => {
        let parent = e.currentTarget.getBoundingClientRect()
        console.log(parent)
        console.log(e.clientX - parent.left)
        console.log(e.clientY - parent.top)
        console.log(getWordAtPoint(document.body.querySelector('.react-pdf__Page__textContent'), e.clientX - parent.left, e.clientY - parent.top))
    }


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
            <canvas height={canvasSize.height} width={canvasSize.width} ref={canvasRef}
                    className={classes.canvas} onMouseUp={handleMouse}/>
        </div>
    );
}


function getWordAtPoint(elem, x, y) {
    debugger
    if(elem.nodeType == elem.TEXT_NODE) {
        var range = elem.ownerDocument.createRange();
        range.selectNodeContents(elem);
        var currentPos = 0;
        var endPos = range.endOffset;
        while(currentPos+1 < endPos) {
            range.setStart(elem, currentPos);
            range.setEnd(elem, currentPos+1);
            if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
                range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                // range.expand("word");
                var ret = range.toString();
                range.detach();
                return(ret);
            }
            currentPos += 1;
        }
    } else {
        for(var i = 0; i < elem.childNodes.length; i++) {
            var range = elem.childNodes[i].ownerDocument.createRange();
            range.selectNodeContents(elem.childNodes[i]);
            if(range.getBoundingClientRect().left <= x && range.getBoundingClientRect().right  >= x &&
                range.getBoundingClientRect().top  <= y && range.getBoundingClientRect().bottom >= y) {
                range.detach();
                return(getWordAtPoint(elem.childNodes[i], x, y));
            } else {
                range.detach();
            }
        }
    }
    return(null);
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
