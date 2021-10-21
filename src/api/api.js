import axios from "axios";

const instance = axios.create({
    baseURL: 'https://linkedin-parser.fir.by/api/v1/',
    withCredentials: false,
    headers: {
        'Content-Type': 'multipart/form-data; boundary=file',
        'Accept': '*/*',
    }
})

export const pdfApi = {
    sendPdf(file) {
        return instance.post('converter/convertation-pdf-to-json/', {file})
            .then(response => response.data)
    }
}