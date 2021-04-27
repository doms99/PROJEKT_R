const fs = require('fs');
const PDFDocument = require('./pdfkitTableFunction.js');
const crypto = require('crypto');
const qr = require('qr-image');

function createPdf(lijekovi, ljekarna, kod, ukCijena, res) {
    let doc = new PDFDocument;

    doc.pipe(res);

    const table0 = {
        headers: ['Lijek', 'Kolicina', 'Cijena jednog pakovanja'],
        rows: lijekovi
    };

    doc.fontSize(25).text('Rezervirani lijekovi', { align: 'center' });
    doc.fontSize(14).text('\n\n\nLjekarna : ' + ljekarna + "\n\n\n");

    doc.table(table0, {
        prepareHeader: () => doc.font('Helvetica-Bold'),
        prepareRow: (row, i) => doc.font('Helvetica').fontSize(12)
    });

    doc.text('\nUkupna cijena : ' + ukCijena);

    doc.text('\nKod : ');
    qr_png = qr.imageSync(kod, {type: 'PNG'});
    doc.image(qr_png);

    doc.end();
}

module.exports = createPdf;
