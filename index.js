const express = require("express");
const path = require("path");
const fs = require("fs");
const PDFDocument = require('pdfkit');

const app = express();

const PORT = 2800;

app.use(express.json());

app.post("/certificate", (req,res) => {
    return res.status(200).json({
        message: "Certificate PDF Generated Successfully !!"
    });
})

app.use('/public', express.static(path.join(__dirname, 'public')));

app.listen(PORT, () => {
    console.log(`Server Started at PORT :- ${PORT}`);
});