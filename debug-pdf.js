
const pdfNode = require('pdf-parse/node');
console.log('--- REQUIRE(pdf-parse/node) ---');
console.log('Type:', typeof pdfNode);
console.log('Value:', pdfNode);
if (typeof pdfNode === 'object') {
    console.log('Keys:', Object.keys(pdfNode));
    if (pdfNode.default) {
        console.log('--- pdfNode.default ---');
        console.log('Type:', typeof pdfNode.default);
        console.log('Value:', pdfNode.default);
    }
}

try {
    const pdfMain = require('pdf-parse');
    console.log('\n--- REQUIRE(pdf-parse) ---');
    console.log('Type:', typeof pdfMain);
    console.log('Value:', pdfMain);
} catch (e) {
    console.log('require("pdf-parse") failed:', e.message);
}
