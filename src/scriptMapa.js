/**
 * scriptMapa
 * @module scriptMapa
 */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.formMapa')
    var enviar = document.getElementById('enviar')
    var status = document.getElementById("estadoForm")
    var addConocimiento = document.getElementById("addConocimiento")

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            addConocimiento.addEventListener('click', function (event) {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    form.classList.add('was-validated')
                }
                else {
                    event.preventDefault()
                    event.stopPropagation()
                    datosMapa()
                }
            }, false)
        })

    //Si existen modificaciones genera una alerta y cambia el status de registro para guardar la modificacion
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {
                statusMapa = false
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
            }, false)
        })

    //Cuando damos en enviar guarda la info
    enviar.addEventListener('click', function (event) {
        event.preventDefault()
        event.stopPropagation()
        post()
    }, false)
})()

//funciones que se ejecutaran cuando la pagina carge
window.onload = function () {
    //comprueba si se diligencio previamente y trae los datos
    google.script.run.withSuccessHandler(filedForm).findData2('Mapa de Conocimiento')
    google.script.run.withSuccessHandler(cedulaMapa).userDatos()
    google.script.run.withSuccessHandler(perfil).ShowValues()
};

/**
 * Inserta el nombre de usuario dentro de la barra lateral
 * @param {object} user Objeto con los datos del usuario
 */
perfil = (user) => {
    const per = document.getElementById("perfil")
    per.innerHTML = user.name

}

/**
 * Agrega la información personal al array Mapa
 * @param {object} info Contiene información asociada a la sesión activa
 */
function cedulaMapa(info) {
    infoGeneral = info
}


/**
 * Permite rellenar el formulario con la información del mapa de conocimiento
 * @param {Array} info Contiene información de ingresos proveniente de la base de datos para el usuario activo
 */
function filedForm(info) {
    info = JSON.parse(info)

    var i = 0

    //Contruimos la tabla de personas en caso de que sea necesario
    if (info.status == true) {

        //modificamos el array personas
        for (i = 0; i < info.datos.length; i++) {
            mapa.push({
                cedula: info.datos[i][0],
                tipo: info.datos[i][1],
                conocimiento: info.datos[i][2],
                nivel: info.datos[i][3],
                documento: info.datos[i][4],
                status: true
            })
            idMapa = info.datos[i][5]
        }
        tablaConocimientos()
    }

    const valor = progreso()
    barraProgreso(valor)
    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
}


/**
 * Botón para realizar scroll automático a la zona superior de la página
 * @type {HTMLObjectElement} 
 * */
let mybutton = document.getElementById("btn-back-to-top");

/**
 * Activa la función 
 * @function window.onscroll
 * */
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

/**
 * Cuando se hace scroll vertical de 20px activa el botón que permite hacer scroll automático
 * @function scrollFunction
 */
function scrollFunction() {
    if (
        document.body.scrollTop > 20 ||
        document.documentElement.scrollTop > 20
    ) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

/**
 * Permite subir automaticamente a la zona superior de la página
 * @function backToTop
 */
function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

//Variables globales
/**
 * Almacena toda la información del formulario de mapa de conocimiento
 * @type {Array} 
 * */
var mapa = []
var mapaPost = []

var infoGeneral = {}
var statusMapa = false
var idMapa = 0
var docFile = {}

var docsDisponibles = 0
var docsCargados = 0

/**
 * Obtiene los datos del mapa de conocimiento y los almacena en el array {@link mapa}
 * */
function datosMapa() {
    //agregamos los valores al array
    const tipo = document.getElementById("tipo");
    const conocimiento = document.getElementById("conocimiento");
    const nivel = document.getElementById("nivel");
    const documento = document.getElementById("documento");
    const form = document.getElementById('formMapa');
    var upload = false

    //Si no se carga ningun archivo el status es true para que no intente subirlo
    if (documento.value == '') {
        upload = true
        docFile = ''
    }

    mapa.push({
        cedula: infoGeneral.cedula,
        tipo: tipo.value,
        conocimiento: conocimiento.value,
        nivel: nivel.value,
        documento: docFile,
        status: upload
    })

    //limpiamos los imputs
    form.reset()
    form.classList.remove('was-validated');

    //Generamos la tabla
    tablaConocimientos()
    statusMapa = false

    //calcula el progreso
    const valor = progreso()
    barraProgreso(valor)
}

/**
 *Genera la tabla con todos los conocimientos ingresados
 */
function tablaConocimientos() {

    var tabla =
        `<table class="table table-hover mb-4 text-center">
          <thead class="bg-dark text-white">
            <tr>
              <th scope="col">Tipo</th>
              <th scope="col">Conocimiento</th>
              <th scope="col">Nivel</th>
              <th scope="col">Documento</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
          ${mapa.map(function (conocimiento, index) {
            return (
                `<tr>
                  <td>${conocimiento.tipo}</td>
                  <td>${conocimiento.conocimiento}</td>
                  <td>${conocimiento.nivel}</td>
                  <td>${conocimiento.status ? conocimiento.documento ?
                    `<a href=${conocimiento.documento} target="_blank"><span><i class="far fa-eye"></i></i>
                      </span></a>` :
                    `<span><i class="far fa-eye-slash"></i></i></i>
                      </span></a>` : statusMapa ?
                    `<div>${conocimiento.documento.name} <div class="spinner-border spinner-border-sm 
                      text-success" role="status">
                      </div></div>`: conocimiento.documento.name
                }
                  </td>
                  <td><span onclick="deleteConocimiento(${index})"><i class="fas fa-trash"></i></i></span></td>
                </tr>`
            )
        }).join(" ")
        }
          </tbody>
        </table>`

    document.getElementById("tablaConocimientos").innerHTML = tabla
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

//Permite eliminar un conocimiento del array
/**
 * Permite eliminar un conocimiento del array
 * @param {number} index Indice del conocimiento en el array 
 */
function deleteConocimiento(index) {
    if (mapa.length > 1) {
        mapa.splice(index, 1)
        tablaConocimientos()
    } else {
        mapa = []
        document.getElementById("tablaConocimientos").innerHTML = ""
        const valor = progreso()
        barraProgreso(valor)
    }

    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
    statusRegistro = false
}

/**
 * Verifica el formulario para llevar la información a la base de datos
 */
function post() {

    const valor = progreso()
    barraProgreso(valor)

    //Si se completa el progreso y no se ha registrado se lleva a la base de datos
    if (valor == 100) {
        postData()
    }
    else {
        alertaError({
            titulo: "Información faltante",
            descripcion: "Por favor agregue al menos un conocimiento para continuar"
        })
    }
}

/**
 * Calcula el progreso general del formulario
 * @returns Porcentaje de llenado del formulario
 */
function progreso() {
    if (mapa.length > 0) {
        var valor = 100
    } else {
        valor = 0
    }
    return valor
}

/**
 * Modifica la barra de progreso mostrando el porcentaje de progreso
 * @param {number} valor Porcentaje de avance general del formulario
 */
function barraProgreso(valor) {
    const barra = document.querySelector('.progress-bar')
    barra.setAttribute("style", `width: ${valor}%`)
    barra.setAttribute("aria-valuenow", valor)
    barra.innerHTML = `${valor}%`
}

/**
 * Genera una alerta de error (toast)
 * @param {string} info Texto que se mostrará en la alerta
 */
function alertaError(info) {
    var option = {
        animation: true,
        delay: 2000,
    }

    var toastBody =
        `<div class="toast-container position-fixed bottom-0 end-0 p-3">

            <div class="toast text-white" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-danger text-white">
                    <i class="fas fa-exclamation-triangle rounded me-2"></i>
                    <strong class="me-auto">${info.titulo}</strong>
                    <small class="text-white">Ahora</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-danger">
                    ${info.descripcion}
                </div>
            </div>
        </div>`

    const noti = document.getElementById('notificaciones').innerHTML = toastBody

    var toastElList = [].slice.call(document.querySelectorAll('.toast'))
    var toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl, option)
    })

    toastList.map(function (toast) {
        toast.show()
    })
}

/**
 * Permite llevar la información de el objeto vivienda a la base de datos
 */
function postData() {
    if (statusMapa == false) {

        //Cambiamos el estado de registro
        statusMapa = true
        tablaConocimientos()

        //Nos permite si se deben o no subir archivos
        var banderaUpload = false

        //cargamos los archivos en el drive
        for (i = 0; i < mapa.length; i++) {

            var doc = mapa[i].documento
            if (doc != "" && mapa[i].status == false) {
                saveFile(doc, i)
                docsDisponibles += 1
                banderaUpload = true
            }
        }

        //Si no se deben subir archivos no se realiza validación de carga y se guarda directamente
        if (!banderaUpload) {
            //Agregamos el id y transformamos los objetos en arrays
            idMapa += 1
            for (i = 0; i < mapa.length; i++) {
                mapa[i].id = idMapa
                var mapaArray = Object.values(mapa[i])
                mapaArray.splice(5, 1)
                mapaPost.push(mapaArray)
            }
            google.script.run.postInDB(Object.values(mapaPost), "Mapa de Conocimiento", 1, false);

            //cambiamos el estado
            var status = document.getElementById("estadoForm")
            status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
            mapaPost = []
        }
    }
}

/**
 * Permite ingresar la información de los documentos seleccionados dentro de una variable
 * @param {object} file Archivo que se desea cargar
 */
function objeto(file) {
    docFile = file.files[0];
}

/**
 * Permite hacer el llamado a la función en el servidor encargada de subir los documentos a drive
 * @param {object} file Archivo que se desea cargar
 * @param {number} index Indice dentro del array de conocimientos
 */
function saveFile(file, index) {
    const idFolder = '1-MuyhkLbfu1KJfr8tv4OyjBIRZxMiAdH'

    const fr = new FileReader();
    fr.onload = function (e) {
        const obj = {
            filename: file.name,
            mimeType: file.type,
            bytes: [...new Int8Array(e.target.result)]
        };
        google.script.run.withSuccessHandler(validacion).saveFile(obj, idFolder, index);

    };
    fr.readAsArrayBuffer(file);
}


/**
 * Valida cuando el documento se sube
 * @param {Array} data Contiene información sobre el estado de carga del documento, su URL y el indice del mismo en el array de conocimientos
 */
function validacion(data) {

    const [estadoBlob, urlFile, index] = data
    docsCargados += 1

    //cargamos la url
    if (estadoBlob == true) {
        mapa[index].documento = urlFile
        mapa[index].status = true
    }
    tablaConocimientos()

    //Si ya se cargaron todos los documentos llevamos la info a la base de datos
    if (docsCargados == docsDisponibles) {

        //Agregamos el id y transformamos los objetos en arrays
        idMapa += 1
        for (i = 0; i < mapa.length; i++) {
            mapa[i].id = idMapa
            var mapaArray = Object.values(mapa[i])
            mapaArray.splice(5, 1)
            mapaPost.push(mapaArray)
        }
        google.script.run.postInDB(Object.values(mapaPost), "Mapa de Conocimiento", 1, false);

        //cambiamos el estado
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
        mapaPost = []
    }

}