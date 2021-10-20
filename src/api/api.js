import axios from "axios";

const instance = axios.create({
    baseURL: 'https://linkedin-parser.fir.by/api/v1/',
    headers: {
        'Access-Control-Allow-Origin': '*',
    }
})

export const pdfApi = {
    sendPdf(file) {
        return instance.post('converter/convertation-pdf-to-json/', {file})
            .then(response => response.data)
    }
}