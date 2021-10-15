import axios from "axios";

const instance = axios.create({
    baseURL: 'http://0.0.0.0:8000/api/v1/',
    // headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    // }
})

export const pdfApi = {
    sendPdf(file) {
        return instance.post('converter/convertation-pdf-to-json/', {file})
            .then(response => response.data)
    }
}