const express = require("express");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");

const app = express();
const PORT = process.env.PORT || 2800;

app.use(express.json());

const handleGeneratePDF = (pdfData) => {

  const {
    registerId,
    emailId,
    phoneNumber,
    Address,
    country,
    state,
    city,
    pincode,
    certificateHeading,
    certificateSubHeading,
    certificateName,
    certificateDescription,
    gender,
    dob,
    bloodGroup,
  } = pdfData;

  const doc = new PDFDocument({
    size: "A4",
    margin: 50,
    layout: "landscape",
  });

  const fileName = `${certificateName.replace(
    /\s+/g,
    "_"
  )}_${Date.now()}_certificate.pdf`;

  const filePath = path.join(__dirname, "public", fileName);
  const certificateImgPath = path.join(
    __dirname,
    "public",
    "Certified_Logo.png"
  );
  const MSMEImgPath = path.join(__dirname, "public", "MSME_Logo.png");

  doc.pipe(fs.createWriteStream(filePath));

  const distanceMargin = 18;

  doc
    .fillAndStroke("#0e8cc3")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      doc.page.width - distanceMargin * 2,
      doc.page.height - distanceMargin * 2
    )
    .stroke();

  doc
    .fontSize(12)
    .fillColor("#000")
    .text(`Register-Id:- ${registerId}`, { align: "left" });
  doc.fillColor("#000").text(`E-Mail: ${emailId}`, { align: "left" });
  doc.fillColor("#000").text(`Phone No.: ${phoneNumber}`, { align: "left" });

  if (fs.existsSync(MSMEImgPath)) {
    doc.image(MSMEImgPath, doc.page.width / 2 - 50, 40, { width: 80 });
  }

  doc.fillColor("#000").text(Address, { align: "right" });
  doc.fillColor("#000").text(`${city} (${pincode})`, { align: "right" });
  doc.fillColor("#000").text(`(${state}) ${country}`, { align: "right" });

  doc.moveDown(1);

  doc
    .font("Times-Roman")
    .fontSize(24)
    .fillColor("#0056b3")
    .text(certificateHeading, { align: "center", underline: true });
  doc.moveDown(1);

  doc.fontSize(18).text(certificateSubHeading, { align: "center" });
  doc
    .font("Times-Roman")
    .fontSize(24)
    .fillColor("#7B3F00")
    .text(certificateName, { align: "center", bold: true });
  doc.moveDown(1);

  doc
    .fontSize(14)
    .font("Times-Roman")
    .fillColor("#000")
    .text(certificateDescription, {
      align: "center",
      indent: 30,
      lineGap: 5,
    });

  doc.moveDown(2);
  doc
    .fontSize(14)
    .fillColor("#000")
    .text(`Date of Birth: ${dob}`, 50, doc.y)
    .text(`Gender: ${gender}`, { align: "center" })
    .text(`Blood Group: ${bloodGroup}`, doc.page.width - 200, doc.y, {
      align: "right",
    });
  doc.moveDown(1);

  const currentDateTime = new Date().toLocaleString();

  doc
    .fontSize(14)
    .fillColor("#333")
    .text(currentDateTime, 50, doc.page.height - 120)
    .text("_______________________", 50, doc.page.height - 100)
    .text("DATE-TIME", 50, doc.page.height - 85);

  doc
    .fontSize(14)
    .fillColor("#333")
    .text(
      "_______________________",
      doc.page.width - 200,
      doc.page.height - 100,
      { align: "right" }
    )
    .text("SIGNATURE", doc.page.width - 200, doc.page.height - 85, {
      align: "right",
    });

  if (fs.existsSync(certificateImgPath)) {
    doc.image(
      certificateImgPath,
      doc.page.width / 2 - 50,
      doc.page.height - 160,
      { width: 140 }
    );
  }

  doc.end();

  return fileName;
};

const validate = (req,res,next) => {

    const requiredFields = [
        'registerId',
        'emailId',
        'phoneNumber',
        'Address',
        'country',
        'state',
        'city',
        'pincode',
        'certificateHeading',
        'certificateSubHeading',
        'certificateName',
        'certificateDescription',
        'gender',
        'dob',
        'bloodGroup'
    ];

    const missingFields = [];

    requiredFields.forEach(field => {
        if (!req.body[field]) {
            missingFields.push(field);
        }
    });

    if (missingFields.length > 0) {
        return res.status(400).json({
            message: 'All fields are Required !!',
            missingFields: missingFields
        });
    }

    next();
}

app.post("/certificate", validate, (req, res) => {

  const pdfData = req.body;

  const fileName = handleGeneratePDF(pdfData);

  return res.status(200).json({
    message: `Certificate PDF generated Succssfully !!`,
    path: `/public/${fileName}`,
  });
});

app.use("/public", express.static(path.join(__dirname, "public")));

app.listen(PORT, () => {
  console.log(`Server Started at PORT :- ${PORT}`);
});