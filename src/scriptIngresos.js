/**
 * scriptIngresos
 * @module scriptIngresos
 */

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.formIngresos')
    var enviar = document.getElementById('enviar')
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

    //Si existen modificaciones genera una alerta y cambia el status de registro para guardar la modificacion
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {

                statusIngresos = false
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'

                //Modificamos la barra de progreso constantemente
                const valor = progreso()
                barraProgreso(valor)

            }, false)
        })
})()

//funciones que se ejecutaran cuando la pagina carge
window.onload = function () {
    //comprueba si se diligencio previamente y trae los datos
    google.script.run.withSuccessHandler(filedForm).findData('ingresos')
    google.script.run.withSuccessHandler(cedulaIngresos).userDatos()
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
 * Agrega la cédula al objeto Ingresos
 * @param {object} info Contiene información asociada a la sesión activa
 */
function cedulaIngresos(info) {
    ingresos.cedula = info.cedula
}

/**
 * Permite rellenar el formulario con la información de los ingresos
 * @param {Array} info Contiene información de ingresos proveniente de la base de datos para el usuario activo
 */
function filedForm(info) {
    info = JSON.parse(info)
    statusIngresos = info.status
    var i = 0

    //Si se realizo un registro previamente se carga la información
    if (statusIngresos == true) {
        for (item in ingresos) {
            try {
                document.getElementById(item).value = info.datos[0][i];
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
    }
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
 * Almacena toda la información del formulario de ingresos
 * @type {object} 
 * */
var ingresos = {
    cedula: '',
    ingresos: '',
    gasto: '',
    deudas: '',
    tipoDeuda: ''
}

var statusIngresos = false

/**
 * Obtiene los datos de los ingresos y los almacena en el objeto {@link ingresos}
 * */
function datosPerfil() {
    for (item in ingresos) {
        try {
            const dato = document.getElementById(item).value;
            ingresos[item] = dato
        }
        catch {
            /* console.log("error") */
        }
    }

    const valor = progreso()
    barraProgreso(valor)


    //Si se completa el progreso y no se ha registrado se lleva a la base de datos
    if (valor == 100) {
        postData()
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
    let activos = 0
    let validos = 0

    //Contamos los campos activos y los validos
    for (item in ingresos) {
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
 * Permite llevar la información de el objeto ingresos a la base de datos
 */
function postData() {
    if (statusIngresos == false) {
        //Cambiamos el estado de registro
        statusIngresos = true
        var status = document.getElementById("estadoForm")
        status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'


        //LLevamos la información a la función del lado del servidor
        google.script.run.postInDB(Object.values(ingresos), "Ingresos", 0, true);
    }
}
