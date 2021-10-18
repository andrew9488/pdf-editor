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
import {findSelectedWord} from "../../utils/helpers/findSelectedWord";
import {Menu} from "../Menu/Menu";
import {highlightText} from "../../utils/helpers/highlightText";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export const PDFReader = () => {

    const docRef = useRef(null)
    const canvasRefText = useRef()
    const canvasRefEffects = useRef()

    const [pdf, setPdf] = useState(testpdf)
    const [json, setJson] = useState(testjson)
    const [scale, setScale] = useState(1.3)
    const [canvasSize, setCanvasSize] = useState({height: 0, width: 0})
    const [numPages, setNumPages] = useState(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [words, setWords] = useState([])
    const [selectedWord, setSelectedWord] = useState()
    const [contextText, setContextText] = useState(null)
    const [contextEffects, setContextEffects] = useState(null)
    const [clickPosition, setClickPosition] = useState({x: 0, y: 0})
    const [fetch] = useFetch(async (pdf) => {
        const response = await pdfApi.sendPdf(pdf)
        setJson(response)
    })

    //очистка canvas после перехода на следующую страницу
    useEffect(() => {
        clearContext(json, pageNumber, contextText, setWords, canvasSize)
    }, [pageNumber, json, contextText])

    //установка canvas для текста
    useEffect(() => {
        const ctx = canvasRefText?.current?.getContext('2d')
        setContextText(ctx)
    }, [])

    //установка canvas для эффектов
    useEffect(() => {
        const ctx = canvasRefEffects?.current?.getContext('2d')
        setContextEffects(ctx)
    }, [])

    //фильтрует слова из json для определенной страницы
    useEffect(() => {
        const word = findSelectedWord(words, clickPosition, scale)
        if (word) {
            setSelectedWord(word)
        }
    }, [clickPosition, words, scale])

    useEffect(() => {
        if (contextText && selectedWord) {
            highlightText(contextText, "rgba(13,117,204)", selectedWord, scale, clickPosition)
        }
    }, [contextText, selectedWord, scale, clickPosition])

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


    //определение положения клика для поиска слова
    const selectWord = (e) => {
        let parent = e.currentTarget.getBoundingClientRect()
        let x = e.clientX - parent.left
        let y = e.clientY - parent.top
        setClickPosition({x: x, y: y})
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
            <canvas height={canvasSize.height / scale} width={canvasSize.width / scale} ref={canvasRefText}
                    className={classes.canvasText} onMouseUp={selectWord}/>
            <canvas height={canvasSize.height / scale} width={canvasSize.width / scale} ref={canvasRefEffects}/>
            {selectedWord &&
            <Menu context={contextText} word={selectedWord} scale={scale} clearSelectedWord={setSelectedWord}/>}
        </div>
    );
}
