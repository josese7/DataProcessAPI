async function compararPlanillas() {
    var planillaUno = document.getElementById('file1').files[0];
    var planillaDos = document.getElementById('file2').files[0];
    if (!planillaUno || !planillaDos) {
        alert("Por favor, seleccione ambas planillas.");
        return;
    }
    var workbookUno = await leerPlanilla(planillaUno);
    var workbookDos = await leerPlanilla(planillaDos);
    var numerosFinales = obtenerNumerosFinales(workbookUno, workbookDos);
    console.log('Numeros finales Array3: ', numerosFinales);
    exportarAExcel(numerosFinales);
}
function leerPlanilla(file) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var data = new Uint8Array(e.target.result); var workbook = XLSX.read(data, { type: 'array' });
            resolve(workbook);
        };
        reader.readAsArrayBuffer(file);
    });
}
function obtenerNumerosFinales(workbookUno, workbookDos) {
    var numerosSetUno = new Set();
    var numerosSetDos = new Set();
    // Obtener números de teléfono únicos de la planillaUno    var hojaUno = workbookUno.Sheets[workbookUno.SheetNames[0]];
    XLSX.utils.sheet_to_json(hojaUno, { header: 1 }).forEach(row => {
        var numero = row[0]; // En este caso, no hay cabecera
        numerosSetUno.add(numero);
    });
    // Obtener números de teléfono únicos de la planillaDos
    var hojaDos = workbookDos.Sheets[workbookDos.SheetNames[0]]; XLSX.utils.sheet_to_json(hojaDos, { header: 1 }).forEach(row => {
        var numero = row[0]; // En este caso, no hay cabecera        numerosSetDos.add(numero);
    });
    // Identificar números que no se repiten en ambas planillas    for (let numero of numerosSetDos) {
    if (!numerosSetUno.has(numero)) {
        numerosSetUno.add(numero);
    }
    return Array.from(numerosSetUno); // Convertir a Array para obtener valores únicos
}
    

function exportarAExcel(data) {
    var ws = XLSX.utils.aoa_to_sheet([["NUMERO"]].concat(data.map(numero => [numero]))); var wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "NumerosFinales");
    // Descargar el archivo
    XLSX.writeFile(wb, "NumerosFinales.xlsx");
}