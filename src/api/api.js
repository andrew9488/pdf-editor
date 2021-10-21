import axios from "axios";

const instance = axios.create({
    baseURL: 'https://linkedin-parser.fir.by/api/v1/',
    withCredentials: false,
    headers: {
        'Content-Type': 'multipart/form-data',
        'Accept': '*/*',
    }
})

export const pdfApi = {
    sendPdf(file) {
        const formData = new FormData()
        formData.append(`file`, file)
        return instance.post('converter/convertation-pdf-to-json/', formData)
            .then(response => response.data)
    }
}