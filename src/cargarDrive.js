/**
 * cargarDrive(gs)
 * @module cargarDrive
 */

/**
 * Crea el archivo blob y lo guarda en la carpeta definida en el drive.
 * @function saveFile
 * @param {object} e Valores del archivo adjunto.
 * @param {string} idFolder Id de la carpeta donde se almacenaran los archivos.
 * @param {number} index Indice de la base de datos donde se guardara la url del archivo adjunto.
 * @returns {object} Contiene el estado la url y el indice de la tabla.
 */
function saveFile(e, idFolder, index) {

    var fecha = new Date();
    var tiempo = Utilities.formatDate(fecha, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'ddMMyyyy');
    var registro = "Registro" + tiempo;
  
    var estadoBlob = false;
  
    try {
      var folder = DriveApp.getFolderById(idFolder);
  
      var blob = Utilities.newBlob(e.bytes, e.mimeType, e.filename);
      estadoBlob = true;
  
      var file = folder.createFile(blob);
  
      var urlFile = file.getUrl();
  
      return [estadoBlob, urlFile,index];
  
    } catch (error) {
  
      Logger.log("Mensaje de error " + error.toString())
      return [estadoBlob, urlFile, index];
    }
  }
  
  
  
  
  function saveFile2(e, cedula, id) {
  
   
  var folder = DriveApp.getFolderById(id);
       
   
  
    var estadoBlob = false;
    var fName = e.filename +"_"+cedula;
  
    try {
  
      //Se crea carpeta anidada 
      //var foldernsert = folder.createFolder(registro);
  
  
  
      var blob = Utilities.newBlob(e.bytes, e.mimeType, fName);
      //  DriveApp.createFile(blob);
  
  
      estadoBlob = true;
  
      var file = folder.createFile(blob);
  
      // Utilities.sleep(9000)//pausa en milisegundos
      var urlFile = file.getUrl();
      //Logger.log("Esta es la url " + urlFile);
  
      return [estadoBlob, urlFile];
  
    } catch (error) {
  
      Logger.log("Mensaje de error " + error.toString())
      return [estadoBlob, urlFile];
    }
  }
  
  
  
  