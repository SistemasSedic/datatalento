/**
 * scriptRegistro
 * @module scriptRegistro
 */

/** Esta función permite evaluar los formularios a partir de los campos obligatorios*/
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.formSocioDemografico')
    var formsPersonas = document.querySelectorAll('.formPersonasACargo')
    var formsHijos = document.querySelectorAll('.formHijos')
    var formH = document.getElementById("formHijos");
    var enviar = document.getElementById('enviar')
    var enviarPersonas = document.getElementById('enviarPersonas')
    var enviarHijos = document.getElementById('enviarHijos')
    var status = document.getElementById("estadoForm")

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            enviar.addEventListener('click', function (event) {
                event.preventDefault()
                datosPerfil()
                form.classList.add('was-validated')
            }, false)
        })

    // Loop over them and prevent submission form 2
    Array.prototype.slice.call(formsPersonas)
        .forEach(function (formP) {
            enviarPersonas.addEventListener('click', function (event) {
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
                if (!formP.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    formP.classList.add('was-validated')
                }
                else {
                    event.preventDefault()
                    datosPersonas()
                }
            }, false)
        })

    // Loop over them and prevent submission form 3
    Array.prototype.slice.call(formsHijos)
        .forEach(function (formH) {
            enviarHijos.addEventListener('click', function (event) {
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
                if (!formH.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    formH.classList.add('was-validated')
                }
                else {
                    event.preventDefault()
                    datosHijos()
                }
            }, false)
        })

    //Si existen modificaciones genera una alerta y cambia el status de registro para guardar la modificacion
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {
                statusRegistro = false
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'


                //Control personas a cargo
                const nPersonas = document.getElementById("nPersonasACargo").value
                if (nPersonas > 0) {
                    botonAddPersonas(true)
                    banderaPersonas = 1
                    validarPersonas()
                } else {
                    botonAddPersonas(false)
                    personas = []
                    document.getElementById("tablaPersonas").innerHTML = ""
                    banderaPersonas = 0
                    banderaTabla = 0
                }

                //Control Hijos
                const nHijos = document.getElementById("hijos").value
                if (nHijos > 0) {
                    tercerForm = true
                    formH.hidden = false
                    banderaHijos = 1
                    validarHijos()
                } else {
                    tercerForm = false
                    formH.hidden = true
                    hijos = []
                    document.getElementById("tablaHijos").innerHTML = ""
                    banderaHijos = 0
                    banderaTablaH = 0
                }

                //Modificamos la barra de progreso constantemente
                const valor = progreso()
                barraProgreso(valor)

            }, false)
        })


})()

/** 
 * funciones que se ejecutaran cuando la pagina carge 
 * */
window.onload = function () {
    //comprueba si se diligencio previamente y trae los datos
    google.script.run.withSuccessHandler(filedForm).findDataRegistro()
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
 * Permite rellenar el formulario con la información previamente almacenada en el registro
 * @param {Array} info Array con la información de registro proveniente de la base de datos para el usuario activo
 */
function filedForm(info) {
    info = JSON.parse(info)
    statusRegistro = info.status
    var i = 0

    //Si se realizo un registro previamente se carga la información
    if (statusRegistro == true) {
        for (item in socioDemografico) {
            try {
                document.getElementById(item).value = info.datos[i];
            }
            catch {
                /* console.log("error") */
            }
            i += 1
        }

        const valor = progreso()
        barraProgreso(valor)
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
        google.script.run.withSuccessHandler(filedFormPersonas).findData2('Personas a cargo')
        google.script.run.withSuccessHandler(filedFormHijos).findData2('Hijos')
    } else {
        alertaYellow({
            titulo: "No se ha realizado un registro",
            descripcion: "Por favor diligencia el perfil sociodemografico para continuar con las siguientes secciones"
        })
    }
}

/**
 * Permite rellenar el formulario con la información previamente almacenada sobre las personas a cargo
 * @param {Array} info Array con la información de registro proveniente de la base de datos para el usuario activo
 */
function filedFormPersonas(info) {
    info = JSON.parse(info)
    var i = 0

    //Contruimos la tabla de personas en caso de que sea necesario
    if (info.status == true) {

        banderaPersonas = 1
        botonAddPersonas(true)

        //modificamos el array personas
        for (i = 0; i < info.datos.length; i++) {
            personas.push({
                cedula: info.datos[i][0],
                nombre: info.datos[i][1],
                parentesco: info.datos[i][2],
            })
            idPersonas = info.datos[i][3]
        }


        tablaVinculados()
        tablaHijos()
        formPersonas()

        const valor = progreso()
        barraProgreso(valor)
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
    }

}

/**
 * Permite rellenar el formulario con la información previamente almacenada sobre los hijos
 * @param {Array} info Array con la información de registro proveniente de la base de datos para el usuario activo
 */
function filedFormHijos(info) {
    info = JSON.parse(info)
    var i = 0
    var formH = document.getElementById("formHijos");

    //Contruimos la tabla de hijos en caso de que sea necesario
    if (info.status == true) {

        banderaHijos = 1

        //modificamos el array Hijos
        for (i = 0; i < info.datos.length; i++) {
            hijos.push({
                cedula: info.datos[i][0],
                nombre: info.datos[i][1],
                fecha: info.datos[i][2],
            })
            idHijos = info.datos[i][3]
        }

        formH.hidden = false
        tablaHijos()

        const valor = progreso()
        barraProgreso(valor)
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
    }
    console.log('hijos')
    console.log(hijos)
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
 * Almacena toda la información del formulario de registro
 * @type {object} 
 * */
var socioDemografico = {
    fecha: '',
    nombre: '',
    correo: '',
    cedula: '',
    cedulaLugar: '',
    cedulaFecha: '',
    rh: '',
    peso: '',
    altura: '',
    genero: '',
    etnia: '',
    estadoCivil: '',
    conyuge: '',
    hijos: '',
    estadoCivil: '',
    nPersonasVive: '',
    cabezaHogar: '',
    nPersonasACargo: '',
    nombreContacto: '',
    parentesco: '',
    telContacto: ''
}

var statusRegistro = false

//Personas a cargo
/**
 * Almacena toda la información sobre las personas a cargo
 * @type {Array} 
 * */
var personas = [];
var personasPost = []
var idPersonas = 0

var banderaPersonas = 0;
var banderaTabla = 0
var modifyPersonas = false

//Hijos
/**
 * Almacena toda la información sobre los hijos
 * @type {Array} 
 * */
var hijos = [];
var hijosPost = []
var idHijos = 0

var banderaHijos = 0;
var banderaTablaH = 0
var modifyHijos = false

//Bandera segundo formulario activo
var segundoForm = false

//bandera tercer formulario (hijos) activo
var tercerForm = false

/**
 * Obtiene los datos del perfil sociodemografico y los almacena en el objeto {@link socioDemografico} 
 * */
function datosPerfil() {
    for (item in socioDemografico) {
        try {
            const dato = document.getElementById(item).value;
            socioDemografico[item] = dato
        }
        catch {
            /* console.log("error") */
        }
    }

    const valor = progreso()
    barraProgreso(valor)


    //Si se completa el progreso y no se ha registrado se lleva a la base de datos, tambien evalua la coherencia de los datos ingresados y si el formulario se lleno completamente para generar alertas.
    if (valor == 100) {
        postData()
    } else if (banderaPersonas == 1 && banderaTabla == 0) {
        alertaError({
            titulo: "Datos no correspondientes",
            descripcion: "Asegurese que el número de personas a cargo correspondan con el número de personas vinculadas en el formulario"
        })
    } else if (banderaHijos == 1 && banderaTablaH == 0) {
        alertaError({
            titulo: "Datos no correspondientes",
            descripcion: "Asegurese que el número de Hijos en la tabla correspondan con el número de hijos en el formulario"
        })
    }
    else {
        alertaError({
            titulo: "Campos faltantes",
            descripcion: "Por favor diligencie todos los campos para continuar"
        })
    }
}

/**
 * Calcula el progreso general del formulario
 * @returns Porcentaje de llenado del formulario
 */
function progreso() {
    let activos = 0 + banderaPersonas + banderaHijos
    let validos = 0 + banderaTabla + banderaTablaH

    //Contamos los campos activos y los validos
    for (item in socioDemografico) {
        try {
            const campo = document.getElementById(item)

            if (!campo.hasAttribute('disabled')) {
                activos += 1
            }
            if (campo.checkValidity() && !campo.hasAttribute('disabled')) {
                validos += 1
            }
        } catch {
            /* console.log("error") */
        }
    }
    let valor = Math.round(validos * 100 / activos)
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
 * Activa o desactiva un input y lo pone como requerido
 * @param {number} id ID 
 * @param {number} valor Valor para la evaluación
 * @param {number} idInput  ID del input
 */
function enableInput(id, valor, idInput) {
    const val = document.getElementById(id).value
    const input = document.getElementById(idInput)
    if (valor == val) {
        input.disabled = false;
        input.required = true;
    }
    else {
        input.disabled = true;
        input.required = false;
        input.value = "";
    }
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
 * Genera una alerta de advertencia (toast) a que tendra como texto el parametro de entrada
 * @param {string} info Texto que se mostrará en la alerta
 */
function alertaYellow(info) {
    var option = {
        animation: true,
    }

    var toastBody =
        `<div class="toast-container position-fixed bottom-0 end-0 p-3">

            <div class="toast text-black" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header bg-warning text-black">
                    <i class="fas fa-exclamation-triangle rounded me-2"></i>
                    <strong class="me-auto">${info.titulo}</strong>
                    <small class="text-black">Ahora</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body bg-warning">
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
 * Permite mostrar el botón que activa el fomulario de vincular personas
 * @param {boolean} status Si es true activa el botón
 */
function botonAddPersonas(status) {
    var boton = document.getElementById("personasBtn")
    var form = document.getElementById("formPersonasACargo")
    boton.hidden = !status

    if (status == false) {
        form.hidden = !status
    }
}

/**
 * perimite mostrar el formulario de vincular personas
 */
function formPersonas() {
    var form = document.getElementById("formPersonasACargo")
    segundoForm = true
    form.hidden = false
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
}

/**
 * valida la información del formulario y alimenta el array que genera la tabla personas
 */
function datosPersonas() {
    //agregamos los valores al array
    const nombre = document.getElementById("nombreP");
    const cedula = document.getElementById("cedula");
    const parentesco = document.getElementById("parentesco");
    const form = document.getElementById('form2')
    personas.push({
        cedula: cedula.value,
        nombre: nombre.value,
        parentesco: parentesco.value
    })
    //limpiamos los imputs
    form.reset()
    form.classList.remove('was-validated');

    //Generamos la tabla
    tablaVinculados()
    modifyPersonas = true
    statusRegistro = false
}

/**
 * valida la información del formulario y alimenta el array que genera la tabla Hijos
 */
function datosHijos() {
    //agregamos los valores al array
    const nombre = document.getElementById("nombreH");
    const cedula = document.getElementById("cedula");
    const fecha = document.getElementById("fechaH");
    const form = document.getElementById('form2')
    hijos.push({
        cedula: cedula.value,
        nombre: nombre.value,
        fecha: fecha.value
    })
    //limpiamos los imputs
    form.reset()
    form.classList.remove('was-validated');

    //Generamos la tabla
    tablaHijos()
    modifyHijos = true
    statusRegistro = false
}

/**
 * genera la tabla con los datos de las personas vinculadas
 */
function tablaVinculados() {

    var tabla =
        `<table class="table table-hover mb-4 text-center">
          <thead class="bg-dark text-white">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Parentesco</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
          ${personas.map(function (persona, index) {
            return (

                `<tr>
                  <td>${persona.nombre}</td>
                  <td>${persona.parentesco}</td>
                  <td><span onclick="deletePersona(${index})"><i class="fas fa-user-times"></i></span></td>
                </tr>`
            )
        }).join(" ")
        }
          </tbody>
        </table>`

    document.getElementById("tablaPersonas").innerHTML = tabla
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    validarPersonas()
}

/**
 * genera la tabla con los datos de Hijos
 */
function tablaHijos() {

    var tabla =
        `<table class="table table-hover mb-4 text-center">
          <thead class="bg-dark text-white">
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Fecha de nacimiento</th>
              <th scope="col">Eliminar</th>
            </tr>
          </thead>
          <tbody>
          ${hijos.map(function (hijo, index) {
            return (

                `<tr>
                  <td>${hijo.nombre}</td>
                  <td>${hijo.fecha}</td>
                  <td><span onclick="deleteHijo(${index})"><i class="fas fa-user-times"></i></span></td>
                </tr>`
            )
        }).join(" ")
        }
          </tbody>
        </table>`

    document.getElementById("tablaHijos").innerHTML = tabla
    document.documentElement.scrollTop = document.documentElement.scrollHeight;
    validarHijos()
}

/**
 * Permite eliminar las personas del array
 * @param {*} index Indica el indice de la persona a eliminar dentro del array
 */
function deletePersona(index) {
    if (personas.length > 1) {
        personas.splice(index, 1)
        tablaVinculados()
    } else {
        personas = []
        validarPersonas()
        document.getElementById("tablaPersonas").innerHTML = ""
    }

    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
    statusRegistro = false
    modifyPersonas = true
}

/**
 * Permite eliminar las Hijos del array
 * @param {*} index Indica el indice del hijo a eliminar dentro del array
 */
function deleteHijo(index) {
    if (hijos.length > 1) {
        hijos.splice(index, 1)
        tablaHijos()
    } else {
        hijos = []
        validarHijos()
        document.getElementById("tablaHijos").innerHTML = ""
    }

    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
    statusRegistro = false
    modifyHijos = true
}

/**
 * Permite llevar la información de el objeto socioDemografico y de los arrays personas e hijos a la base de datos
 */
function postData() {
    if (statusRegistro == false) {
        //Cambiamos el estado de registro
        statusRegistro = true
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'

        //Agregamos la fecha 
        const fecha = (new Date(Date.now())).toLocaleDateString()
        socioDemografico.fecha = fecha

        //LLevamos la información a la función del lado del servidor
        google.script.run.postInDB(Object.values(socioDemografico), "Registro", 3, true);

        //Llevamos la info de las personas
        if (banderaPersonas == 1 && modifyPersonas == true) {
            idPersonas += 1
            //Agregamos el id y transformamos los objetos en arrays
            for (i = 0; i < personas.length; i++) {
                personas[i].id = idPersonas
                personasPost.push(Object.values(personas[i]))

            }
            //Llevamos la info a la bd
            google.script.run.postInDB(personasPost, "Personas a cargo", 1, false)
            modifyPersonas = false
            personasPost = []
        }

        //LLevamos la info de los hijos
        if (banderaHijos == 1 && modifyHijos == true) {
            idHijos += 1
            //Agregamos el id y transformamos los objetos en arrays
            for (i = 0; i < hijos.length; i++) {
                hijos[i].id = idHijos
                hijosPost.push(Object.values(hijos[i]))

            }
            //Llevamos la info a la bd
            google.script.run.postInDB(hijosPost, "Hijos", 1, false)
            modifyHijos = false
            hijosPost = []
        }
    }
}

/**
 * Valida si el numero de personas en la tabla es igual al número de personas en el formulario
 */
function validarPersonas() {
    var nForm = document.getElementById("nPersonasACargo").value
    var nTabla = personas.length

    if (nForm == nTabla) {
        banderaTabla = 1
    } else {
        banderaTabla = 0
    }

    //Modificamos la barra de progreso constantemente
    const valor = progreso()
    barraProgreso(valor)
}

/**
 * Valida si el numero de Hijos en la tabla es igual al número de Hijos en el formulario
 */
function validarHijos() {
    var nForm = document.getElementById("hijos").value
    var nTabla = hijos.length

    if (nForm == nTabla) {
        banderaTablaH = 1
    } else {
        banderaTablaH = 0
    }

    //Modificamos la barra de progreso constantemente
    const valor = progreso()
    barraProgreso(valor)
}
