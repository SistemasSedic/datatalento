/**
 * scriptInfoLab
 * @module scriptInfoLab
 */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.formInfoLab')
    var enviar = document.getElementById('enviar')
    var status = document.getElementById("estadoForm")
    var addConocimiento = document.getElementById("addInfoLab")

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
                    datosInfoLab()
                }
            }, false)
        })

    //Si existen modificaciones genera una alerta y cambia el status de registro para guardar la modificacion
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {
                statusInfoLab = false
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
    google.script.run.withSuccessHandler(filedForm).findData2('Información Laboral')
    google.script.run.withSuccessHandler(cedulaInfoLab).userDatos()
    google.script.run.withSuccessHandler(especialidadList).listas("especialidad")
    google.script.run.withSuccessHandler(tipoList).listas("tipo");
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
 * Contruye una lista con las especiliadades consignadas en la base de datos
 * @param {Array} data Contiene las diferentes especialidades
 */
function especialidadList(data) {

    //Innicializamos la variable que ira en el HTML con el valor inicial "Seleccione"
    var lista = '<option selected disabled value=""></option>';
    var select = document.getElementById("especialidad");

    //Construimos la lista con cada valor
    for (i = 0; i < data.length; i++) {
        var lista = lista + "<option>" + data[i] + "</option>"
    }
    select.innerHTML = lista;
}

/**
 * Contruye una lista con los tipos de especiliadades consignadas en la base de datos
 * @param {Array} data Contiene los diferentes tipos de especialidades
 */
function tipoList(data) {

    //Innicializamos la variable que ira en el HTML con el valor inicial "Seleccione"
    var lista = '<option selected disabled value=""></option>';
    var select = document.getElementById("tipo");

    //Construimos la lista con cada valor
    for (i = 0; i < data.length; i++) {
        var lista = lista + "<option>" + data[i] + "</option>"
    }
    select.innerHTML = lista;
}


/**
 * Agrega la información personal al array infoLab
 * @param {object} info Contiene información asociada a la sesión activa
 */
function cedulaInfoLab(info) {
    infoGeneral = info
}

/**
 * Permite rellenar el formulario con la información laboral
 * @param {Array} info Contiene información de ingresos proveniente de la base de datos para el usuario activo
 */
function filedForm(info) {
    info = JSON.parse(info)

    var i = 0

    //Construimos la de especialidades en caso de ser necesartio
    if (info.status == true) {

        //modificamos el array personas
        for (i = 0; i < info.datos.length; i++) {
            infoLab.push({
                cedula: info.datos[i][0],
                general: info.datos[i][1],
                especialidad: info.datos[i][2],
                tipo: info.datos[i][3],
                aExp: info.datos[i][4],
                documento: info.datos[i][5],
                status: true
            })
            idInfoLab = info.datos[i][6]
        }
        tablaEspecialidad()

        //Colocamos la información de la experiencia general
        const general = document.getElementById("general");
        general.value = info.datos[0][1]
    }

    const valor = progreso()
    barraProgreso(valor)
    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
}


/**
 * Botón para realizar scroll automático a la zona superior de la página
 * @type {Array} 
 * */
let mybutton = document.getElementById("btn-back-to-top");


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
 * Almacena toda la información del formulario de información laboral
 * @type {Array} 
 * */
var infoLab = []
var infoLabPost = []

var infoGeneral = {}
var statusInfoLab = false
var idInfoLab = 0
var docFile = {}

var docsDisponibles = 0
var docsCargados = 0

/**
 * Obtiene los datos de la información laboral y los almacena en el array {@link infoLab}
 * */
function datosInfoLab() {
    //agregamos los valores al array
    const general = document.getElementById("general");
    const especialidad = document.getElementById("especialidad");
    const tipo = document.getElementById("tipo");
    const aExp = document.getElementById("aExp");
    const form = document.getElementById('formInfoLab');
    const documento = document.getElementById("documento");
    var upload = false

    //Si no se carga ningun archivo el status es true para que no intente subirlo
    if (documento.value == '') {
        upload = true
        docFile = ''
    }

    infoLab.push({
        cedula: infoGeneral.cedula,
        general: general.value,
        especialidad: especialidad.value,
        tipo: tipo.value,
        aExp: aExp.value,
        documento: docFile,
        status: upload
    })

    //limpiamos los imputs
    form.reset()
    form.classList.remove('was-validated');
    general.value = infoLab[0].general

    //Generamos la tabla
    tablaEspecialidad()
    statusInfoLab = false

    //calcula el progreso
    const valor = progreso()
    barraProgreso(valor)
}

/**
 *Genera la tabla con todos las especialidades ingresados
 */
function tablaEspecialidad() {

    var tabla =
        `<table class="table table-hover mb-4 text-center">
          <thead class="bg-dark text-white">
            <tr>
              <th scope="col">Especialidad</th>
              <th scope="col">Tipo</th>
              <th scope="col">Años de Experiencia</th>
              <th scope="col">Documento</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
          ${infoLab.map(function (especialidad, index) {
            return (
                `<tr>
                  <td>${especialidad.especialidad}</td>
                  <td>${especialidad.tipo}</td>
                  <td>${especialidad.aExp}</td>
                  <td>${especialidad.status ? especialidad.documento != '' ?
                    `<a href=${especialidad.documento} target="_blank"><span><i class="far fa-eye"></i></i>
                      </span></a>` :
                    `<span><i class="far fa-eye-slash"></i></i></i>
                      </span></a>` :
                    statusInfoLab ?
                        `<div>${especialidad.documento.name} <div class="spinner-border spinner-border-sm 
                      text-success" role="status">
                      </div></div>`: especialidad.documento.name
                }
                  </td>
                  <td><span onclick="deleteConocimiento(${index})"><i class="fas fa-trash"></i></i></span></td>
                </tr>`
            )
        }).join(" ")
        }
          </tbody>
        </table>`

    document.getElementById("tablaEspecialidad").innerHTML = tabla
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

/**
 * Permite eliminar una especialidad del array
 * @param {number} index Indice del conocimiento en el array 
 */
function deleteConocimiento(index) {
    if (infoLab.length > 1) {
        infoLab.splice(index, 1)
        tablaEspecialidad()
    } else {
        infoLab = []
        document.getElementById("tablaEspecialidad").innerHTML = ""
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
            descripcion: "Por favor agregue al menos una especialidad para continuar"
        })
    }
}

/**
 * Calcula el progreso general del formulario
 * @returns Porcentaje de llenado del formulario
 */
function progreso() {
    if (infoLab.length > 0) {
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
    if (statusInfoLab == false) {

        //Cambiamos el estado de registro
        statusInfoLab = true
        tablaEspecialidad()

        //Nos permite si se deben o no subir archivos
        var banderaUpload = false

        //cargamos los archivos en el drive
        for (i = 0; i < infoLab.length; i++) {

            var doc = infoLab[i].documento
            if (doc != "" && infoLab[i].status == false) {
                saveFile(doc, i)
                docsDisponibles += 1
                banderaUpload = true
            }
        }


        //Si no se deben subir archivos no se realiza validación de carga y se guarda directamente
        if (!banderaUpload) {
            //Agregamos el id y transformamos los objetos en arrays
            idInfoLab += 1
            for (i = 0; i < infoLab.length; i++) {
                infoLab[i].id = idInfoLab
                var infoLabArray = Object.values(infoLab[i])
                infoLabArray.splice(6, 1)
                infoLabPost.push(infoLabArray)
            }
            google.script.run.postInDB(Object.values(infoLabPost), "Información Laboral", 1, false);
            //cambiamos el estado
            var status = document.getElementById("estadoForm")
            status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
            infoLabPost = []
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
    const idFolder = '1xpjb8iTQFBzUFuTLv3ptr66cSBB87vOU'

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
        infoLab[index].documento = urlFile
        infoLab[index].status = true
    }
    tablaEspecialidad()

    //Si ya se cargaron todos los documentos llevamos la info a la base de datos
    if (docsCargados == docsDisponibles) {

        //Agregamos el id y transformamos los objetos en arrays
        idInfoLab += 1
        for (i = 0; i < infoLab.length; i++) {
            infoLab[i].id = idInfoLab
            var infoLabArray = Object.values(infoLab[i])
            infoLabArray.splice(6, 1)
            infoLabPost.push(infoLabArray)
        }
        google.script.run.postInDB(Object.values(infoLabPost), "Información Laboral", 1, false);
        //cambiamos el estado
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
        infoLabPost = []
    }

}