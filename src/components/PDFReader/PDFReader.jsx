import React, {useCallback, useEffect, useRef, useState} from "react";
import {Document, Page, pdfjs} from "react-pdf";
import {ControlPanel} from "../ControlPanel/ControlPanel";
import {accuracy, canvasHelper} from "../../utils/helpers/canvasHelper";
import {useFetch} from "../../utils/hooks/useFetch";
import {pdfApi} from "../../api/api";
import testjson from "../../test.json";
import testpdf from "../../test.pdf";
import {findCanvasWord} from "../../utils/helpers/findCanvasWord";
import {Menu} from "../Menu/Menu";
import {highlightText} from "../../utils/helpers/highlightText";
import classes from "./PDFReader.module.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import {clearContextHighlight} from "../../utils/helpers/clearContextHighlight";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRefText = useRef()

    const [pdf, setPdf] = useState(testpdf)
    const [json, setJson] = useState(testjson)
    const [scale, setScale] = useState(1.5)
    const [canvasSize, setCanvasSize] = useState({height: 0, width: 0})
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [words, setWords] = useState([])
    const [selectedWord, setSelectedWord] = useState(null)
    const [contextText, setContextText] = useState(null)
    const [clickPosition, setClickPosition] = useState({x: 0, y: 0})
    const [fetch] = useFetch(async (pdf) => {
        const response = await pdfApi.sendPdf(pdf)
        setJson(response)
    })

    const [positionMouse, setPositionMouse] = useState({x: 0, y: 0})

    //установка canvas для текста
    useEffect(() => {
        const ctx = canvasRefText?.current?.getContext('2d')
        setContextText(ctx)
    }, [])

    //выделяем нужно нам слово
    useEffect(() => {
        const word = findCanvasWord("find",words, clickPosition, scale)
        if (word) {
            setSelectedWord(word)
        }
    }, [clickPosition, words, scale])

    //выделение текста при нажатии на слово
    useEffect(() => {
        if (contextText && selectedWord) {
            highlightText(contextText, "rgba(13,117,204,0.4)", selectedWord, scale)
        }
    }, [contextText, selectedWord, scale, clickPosition])

    //очистка canvas после перехода на следующую страницу
    useEffect(() => {
        if (contextText) {
            contextText.clearRect(0, 0, canvasSize.width, canvasSize.height)
            setSelectedWord(null)
        }
    }, [pageNumber, canvasSize])

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
    const loadPdf = useCallback(async (file) => {
        if (file) {
            setPdf(file)
            fetch(file)
        }
    }, [])


    //определение положения клика для поиска словад
    const selectWord = (e) => {
        if (!selectedWord) {
            let parent = e.currentTarget.getBoundingClientRect()
            let x = e.clientX - parent.left
            let y = e.clientY - parent.top
            setClickPosition({x: x, y: y})
        } else {
            clearContextHighlight(contextText, selectedWord, scale)
            setSelectedWord(null)
        }
    }

    const onMouseMove = (e) => {
        let parent = e.currentTarget.getBoundingClientRect()
        let x = e.clientX - parent.left
        let y = e.clientY - parent.top
        setPositionMouse({x: x, y: y})
    }

    const isTextPointer = findCanvasWord("find",words, positionMouse, scale)

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
            <canvas height={canvasSize.height / scale} width={canvasSize.width / scale} ref={canvasRefText}
                    className={isTextPointer ? classes.canvasTextCursor : classes.canvasText} onMouseUp={selectWord}
                    onMouseMove={onMouseMove}/>
            {selectedWord &&
            <Menu context={contextText} word={selectedWord} scale={scale} clearSelectedWord={setSelectedWord}/>}
        </div>
    );
}
