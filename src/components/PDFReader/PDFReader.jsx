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
import {useFetch} from "../../utils/hooks/useFetch";
import {pdfApi} from "../../api/api";
import classes from "./PDFReader.module.css";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import testJSON from "../../test.json"
import testPDF from "../../test.pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRefText = useRef()

    const [pdf, setPdf] = useState(testPDF)
    const [json, setJson] = useState(testJSON)
    const [scale, setScale] = useState(1.5)
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

    //установка canvas для текста
    useEffect(() => {
        if (!contextText) {
            const ctx = canvasRefText?.current?.getContext('2d')
            setContextText(ctx)
        }
    }, [contextText])

    //выделяем нужно нам слово
    useEffect(() => {
        const word = findCanvasWord('find', words, clickPosition, scale)
        if (word) {
            setSelectedWord(word)
        }
    }, [clickPosition, words, scale])

    //выделение текста при нажатии на слово
    useEffect(() => {
        if (contextText && selectedWord) {
            highlightText(contextText, "rgba(22,135,231,0.4)", selectedWord.coordinates, scale)
        }
    }, [contextText, selectedWord, scale, clickPosition])

    //очистка canvas после перехода на следующую страницу
    useEffect(() => {
        if (contextText) {
            contextText.clearRect(0, 0, canvasSize.width, canvasSize.height)
            setSelectedWord(null)
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

    //берет из json нужные слова определенной страницы для отрисовки
    useEffect(() => {
        if (json) {
            let currentWords = json.filter(j => j.page === pageNumber)
            setWords(currentWords)
        }
    }, [pageNumber, json])

    //функция которая устанавливает кол-во страниц
    const onDocumentLoadSuccess = useCallback(({numPages}) => {
        setNumPages(numPages)
    }, [])

    //заполнение canvas словами для определенной страницы после того, как отрендерится pdf файл
    const onRenderSuccess = useCallback(() => {
        setCanvasSize({
            height: docRef.current.clientHeight * scale,
            width: docRef.current.clientWidth * scale
        })
        words.forEach(w => canvasHelper(contextText, w, scale))
    }, [scale, words])

    //загрузка pdf пользователем и отправка на сервер для получения json
    const loadPdf = useCallback((file) => {
        if (file) {
            setPdf(file)
            fetch(file)
            clearSessionStorage()
        }
    }, [])

    //определение положения клика для поиска словад и положения мыши
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

    const isTextPointer = findCanvasWord('some', words, positionMouse, scale)

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
