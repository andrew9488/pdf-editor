import axios from "axios";

const instance = axios.create({
    baseURL: 'https://linkedin-parser.fir.by/api/v1/',
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
})

export const pdfApi = {
    sendPdf(file) {
        return instance.post('converter/convertation-pdf-to-json/', {file})
            .then(response => response.data)
    }
}