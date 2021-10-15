import axios from "axios";

const instance = axios.create({
    baseURL: 'http://0.0.0.0:8000/api/v1/converter/convertation-pdf-to-json',
    headers: {
        'Access-Control-Allow-Origin' : '*',
        'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    }
})

export const pdfApi = {
    sendPdf(pdf) {
        return instance.post(`/`, {pdf}).then(response => response.data)
    }
}