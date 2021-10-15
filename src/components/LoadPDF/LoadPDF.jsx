import React from 'react';

export const LoadPDF = React.memo(({loadPdf}) => {

    const loadFile = (e) => {
        if (e.target.files.length !== 0) {
            loadPdf(e.target.files[0])
        }
    }

    return (
        <label className='fas fa-desktop' style={{cursor: "pointer"}}>
            <input type='file' onChange={loadFile} style={{display: 'none'}}/>
        </label>
    );
})
