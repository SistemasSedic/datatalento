/**
 * codigoGS2(gs)
 * @module codigoGS2
 */


/**
 * Carga los datos de la tabla Registro y luego los datos de la tabla que envié el parametro op.
 * @function findDataRegistro2 
 * @param {string} op Valor de la tabla en que se va a consultar la información.
 */
function findDataRegistro2(op) {
  //var op = "Experiencia"
  var ss = SpreadsheetApp.openById(ssId);
  var db = ss.getSheetByName('Registro');
  var dataRegistro = db.getDataRange().getValues();
  var info2 = {}


  switch (op) {

    case "Formación":
      info2 = findData3(op);
      Logger.log('caso formacion ' + info2.datos)
      break;

    case "Experiencia":
      info2 = findData3(op);
      Logger.log('caso experiencia ' + info2.datos)
      break;
  }


  var user = userDatos()
  var status = false
  var datos = []
  var info = {
    user: user,
    datos: datos,
    status: status
  }

  var keyCol = 0

  //Buscamos en la tabla la columna que lleva la key
  for (i = 0; i < dataRegistro[0].length; i++) {
    if (dataRegistro[0][i] == "Cédula") {

      keyCol = i

      break
    }
  }

  for (i = 1; i < dataRegistro.length; i++) {

    if (dataRegistro[i][keyCol] == user.cedula) {



      status = true
      datos = dataRegistro[i]

      info = {
        datos: datos,
        status: status,

      }
      break
    }
  }

  if (info.status == true && info2.status == true) {

    info2.global = op
    Logger.log('opcion 1')
    return JSON.stringify(info2)


  } else if (info.status == true && info2.status == false) {

    info.global = "Registro"
    Logger.log('opcion 2')
    return JSON.stringify(info)

  } else if (info.status == false) {

    info = {}
    Logger.log('opcion 3')
    return JSON.stringify(info)

  }
}


/**
 * Consulta la información en la tabla que se envia desde la función {@link findDataRegistro2}
 * @function findData3
 * @param {string} tabla contiene el nombre de la tabla en la cual se va a consultar la información.
 * @returns {object} Retorna el valor total de los campos validadados
 */
function findData3(tabla) {
  //tabla = "Formación"
  var ss = SpreadsheetApp.openById(ssId);
  var db = ss.getSheetByName(tabla);
  var dataInfo = db.getDataRange().getValues();
  var user = userDatos()
  var status = false
  var datos = []
  var info = {
    datos: datos,
    status: status
  }
  var nMax = 0
  var keyCol = 0
  var idCol = 0
  var idFecha = []
  var colFecha = []



  //Buscamos en la tabla la columna que lleva la key
  for (i = 0; i < dataInfo[0].length; i++) {
    if (dataInfo[0][i] == "Cédula") {
      keyCol = i
      break
    }
  }

  //Buscamos en la tabla la columna que lleva el id
  for (i = 0; i < dataInfo[0].length; i++) {
    if (dataInfo[0][i] == "Id") {
      idCol = i
      break
    }
  }

  //buscamos el id más grande en la tabla
  for (i = 1; i < dataInfo.length; i++) {
    if (dataInfo[i][keyCol] == user.cedula && dataInfo[i][idCol] > nMax) {
      nMax = dataInfo[i][idCol]
    }
  }


  for (i = 0; i < dataInfo[0].length; i++) {
    var fechaE = dataInfo[0][i].slice(0, 5)
    if (fechaE == "Fecha") {
      //idFecha.push(dataInfo[0][i])
      colFecha.push(i)


    }
  }






  //buscamos las personas relacionados a la cedula
  for (i = 0; i < dataInfo.length; i++) {

    //console.log(fechas(dataInfo[i][colFecha[i]]))

    if (dataInfo[i][keyCol] == user.cedula && dataInfo[i][idCol] == nMax) {
      status = true

      for (j = 0; j < colFecha.length; j++) {

        var fechaC = dataInfo[i][colFecha[j]]
        dataInfo[i][colFecha[j]] = fechas(fechaC)

      }

      datos.push(dataInfo[i])

      info = {
        user: user,
        datos: datos,
        status: status,

      }
    }
  }
  Logger.log(info.datos)
  return info;


}

/**
 * Asigna formato a las fechas tipo date.
 * @function fechas
 * @param {date} fecha Valor de la fecha que a la cual se le dara formato de salida.
 * @returns {date} fechaRes retorna la fecha con el formato definido segun la condición.
 */
function fechas(fecha) {

  if (fecha == "") {
    var fechaRes = "";
    return fechaRes;
  } else {
    var fechaRes = Utilities.formatDate(fecha, SpreadsheetApp.getActive().getSpreadsheetTimeZone(), 'yyyy-MM-dd');

    return fechaRes;
  }
}



/**
 * Envia la información a la base de datos
 * @function postInDB
 * @param {object} dataInfo Datos enviados desde el frontend
 * @param {string} tabla Tabla en la que se guardara la información
 * @param {number} ind Indice del registro
 * @param {boolean} state Estado del registro 
*/

function postInDB2(dataInfo, tabla, ind, state) {


  var ss = SpreadsheetApp.openById(ssId);
  var db = ss.getSheetByName(tabla);
  var dataTable = db.getDataRange().getValues();
  var lr = db.getLastRow() + 1;
  var keyCol = 0
  Logger.log('Estos son los datos enviados ' + dataInfo + ' fila  ' + lr)

  //Buscamos en la tabla la columna que lleva la key
  for (i = 0; i < dataTable[0].length; i++) {
    if (dataTable[0][i] == "Cédula") {
      keyCol = i
      break
    }
  }

  if (state == true) {
    //Buscamos en la tabla si ya se realizo el registro previamente
    for (i = 1; i < dataTable.length; i++) {
      if (dataTable[i][keyCol] == dataInfo[ind]) {
        lr = i + 1
        break
      }
    }
  }




  if (typeof dataInfo[0] != "object") {
    dataInfo = [dataInfo]

  }



  // Logger.log('Esta es la dataInfo '+dataInfo+"  "+lr)
  db.getRange(lr, 1, dataInfo.length, dataInfo[0].length).setValues(dataInfo)


}









