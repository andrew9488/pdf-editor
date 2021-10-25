import React, {useCallback, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "../ControlPanel/ControlPanel";
import {Menu} from "../Menu/Menu";
import {
    clearSessionStorage,
    getEffectFromSessionStorageForSelectedWord,
    getEffectsFromSessionStorage
} from "../../utils/helpers/sessionStorageHelper";
import {underlineTextDecoration} from "../../utils/helpers/underlineTextDecoration";
import {lineThroughTextDecoration} from "../../utils/helpers/lineThroughTextDecoration";
import {findCanvasWord} from "../../utils/helpers/findCanvasWord";
import {highlightText} from "../../utils/helpers/highlightText";
import {clearContextHighlight} from "../../utils/helpers/clearContextHighlight";
import {getCoordinates} from "../../utils/helpers/getCoordinates";
import {canvasHelper} from "../../utils/helpers/canvasHelper";
import {fixWordCoordinates} from "../../utils/helpers/fixWordCoordinates";
import {useFetch} from "../../utils/hooks/useFetch";
import {pdfApi} from "../../api/api";
import classes from "./PDFReader.module.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRefText = useRef()

    const [pdf, setPdf] = useState(null)
    const [json, setJson] = useState(null)
    const [scale, setScale] = useState(1.0)
    const [canvasSize, setCanvasSize] = useState({height: 0, width: 0})
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [words, setWords] = useState([])
    const [selectedWord, setSelectedWord] = useState(null)
    const [contextText, setContextText] = useState(null)
    const [clickPosition, setClickPosition] = useState({x: 0, y: 0})
    const [positionMouse, setPositionMouse] = useState({x: 0, y: 0})
    const [fetch, error] = useFetch(async (file) => {
        const response = await pdfApi.sendPdf(file)
        setJson(response)
    })

    //set canvas for rendering text
    useEffect(() => {
        if (!contextText) {
            const ctx = canvasRefText?.current?.getContext('2d')
            setContextText(ctx)
        }
    }, [contextText])

    // set selected word
    useEffect(() => {
        if (words) {
            const word = findCanvasWord('find', words, clickPosition)
            setSelectedWord(word)
        }
    }, [clickPosition, words])

    //highlight selected word by blue color
    useEffect(() => {
        if (contextText && selectedWord) {
            clearContextHighlight(contextText, selectedWord.coordinates, scale)
            highlightText(contextText, "rgba(22,135,231,0.4)", selectedWord.coordinates, scale)
        }
    }, [contextText, selectedWord, scale, clickPosition])

    //clear canvas after go to the next page and apply canvas effects for need
    useEffect(() => {
        if (contextText) {
            contextText.clearRect(0, 0, canvasSize.width, canvasSize.height)
            setSelectedWord(null)
            setClickPosition({x: 0, y: 0})
            const effects = getEffectsFromSessionStorage(pageNumber)
            effects && effects.forEach(e => {
                if (e.type === "underline") {
                    underlineTextDecoration(contextText, e.color, e.coordinates, scale)
                } else if (e.type === "highlight") {
                    highlightText(contextText, e.color, e.coordinates, scale)
                } else {
                    lineThroughTextDecoration(contextText, e.color, e.coordinates, scale)
                }
            })
        }
    }, [pageNumber, canvasSize, scale])

    //filter json file and take words for current page and convert coordinates into px
    useEffect(() => {
        if (canvasSize && json) {
            let currentWords = json.filter(j => j.page === pageNumber).map(w => ({
                ...w,
                coordinates: fixWordCoordinates(w.coordinates, canvasSize)
            }))
            setWords(currentWords)
        }
    }, [pageNumber, json, canvasSize])

    useEffect(() => {
        if (words) {
            words.forEach(w => canvasHelper(contextText, w))
        }
    }, [words])

    //function set numbers of pages
    const onDocumentLoadSuccess = useCallback(({numPages}) => {
        setNumPages(numPages)
    }, [])

    //set canvas size and render canvas with needed words after pdf file rendering
    const onRenderSuccess = useCallback(() => {
        setCanvasSize({
            height: docRef.current.clientHeight,
            width: docRef.current.clientWidth
        })
    }, [])

    //download pdf file, request to server for get json file and clear session storage
    const loadPdf = useCallback((file) => {
        if (file) {
            setPdf(file)
            fetch(file)
            clearSessionStorage()
        }
    }, [])

    // identify position click mouse for find word and apply needed effect if it required
    const onMouseAction = (e) => {
        let parent = e.currentTarget.getBoundingClientRect()
        if (e._reactName === 'onMouseMove') {
            getCoordinates(e, parent, setPositionMouse)
        } else if (e._reactName === 'onMouseUp') {
            if (!selectedWord) {
                getCoordinates(e, parent, setClickPosition)
            } else {
                clearContextHighlight(contextText, selectedWord.coordinates, scale)
                const effect = getEffectFromSessionStorageForSelectedWord(selectedWord, pageNumber)
                if (effect) {
                    if (effect.type === "underline") {
                        underlineTextDecoration(contextText, effect.color, effect.coordinates, scale)
                    } else if (effect.type === "highlight") {
                        highlightText(contextText, effect.color, effect.coordinates, scale)
                    } else {
                        lineThroughTextDecoration(contextText, effect.color, effect.coordinates, scale)
                    }
                }
                setSelectedWord(null)
            }
        }
    }

    const isTextPointer = findCanvasWord('some', words, positionMouse)

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
            {error
                ? <h1>{error}</h1>
                : <>
                    <Document
                        inputRef={docRef}
                        file={pdf}
                        onLoadSuccess={onDocumentLoadSuccess}
                    >
                        <Page pageNumber={pageNumber} scale={scale} onRenderSuccess={onRenderSuccess}/>
                    </Document>
                    <canvas height={canvasSize.height / scale} width={canvasSize.width / scale} ref={canvasRefText}
                            className={isTextPointer ? classes.canvasTextCursor : classes.canvasText}
                            onMouseUp={onMouseAction}
                            onMouseMove={onMouseAction}/>
                    {selectedWord &&
                    <Menu context={contextText} word={selectedWord} scale={scale} clearSelectedWord={setSelectedWord}/>}
                </>
            }
        </div>
    );
}
