

/**
 * scriptFormacion
 * @module scriptFormacion
 */



var formacionAcademica = [];
var persona = {};
var ruta = "";
var archivos = [];
var indices = [];
var statusRegistro = false;
var formacionPost = []
var indice = 0;
var idPersonas = 0;
var banderaPersonas = 0;


var formAcademic = {

    nivelEsc: '',
    universidad: '',
    titulo: '',
    fechaGraduacion: '',
    opEstudio: '',
    formFile: '',
    switchCheck: '',
    numTarjeta: '',
    seccional: '',
    expedicion: ''

}


/**
 * Inicia todo lo que contenga la función al cargar la página en el navegador.
 * @function iniciar
 */
window.onload = function iniciar() {

    //comprueba si se diligencio previamente y trae los datos
    google.script.run.withSuccessHandler(filedForm).findDataRegistro2('Formación')
    google.script.run.withSuccessHandler(perfil).ShowValues()


}

/**
 * Carga el nombre del usuario logueado y lo muestra en la etiqueta con id perfil.
 * @function perfil
 * @param {object} user Trae los valores almacenados en la memoria cache.
 */
perfil = (user) => {

    const per = document.getElementById("perfil")
    per.innerHTML = user.name

}



/**
 * Cuando carga la página muesta la tabla con información enviada desde la base de datos 
 * @function filedForm
 * @param {string} info Es un objeto convertido a string que se muestra cuando retorna la función findDataRegistro2('Formación').
 * 
 */
const filedForm = (info) => {

    info = JSON.parse(info)
    console.log(info.datos)


    if (!Object.keys(info).length == 0) {


        //Valida si el objeto info trae la opción Formación
        if (info.global == "Formación") {

            persona.cedula = info.datos[0][1]


            //Ingresa los datos de la tabla formación
            for (i = 0; i < info.datos.length; i++) {

                formacionAcademica.push({

                    fecha: info.datos[i][0],
                    cedula: info.datos[i][1],
                    nivelEsc: info.datos[i][2],
                    universidad: info.datos[i][3],
                    titulo: info.datos[i][4],
                    estado: info.datos[i][5],
                    fechaGraduacion: info.datos[i][6],
                    adjunto: info.datos[i][7],
                    tarjeta: info.datos[i][8],
                    numTarjeta: info.datos[i][9],
                    seccional: info.datos[i][10],
                    expedicion: info.datos[i][11]

                })
                idPersonas = info.datos[i][12]

                const valor = 100
                barraProgreso(valor)
                var status = document.getElementById("estadoForm")
                status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'
            }

            tablaVinculados()

        } else if (info.global == "Registro") {

            persona.cedula = info.datos[3]

        }

    } else {

        var msn = `<div class="alert alert-warning alert-dismissible fade show" role="alert">
                           <strong>No se encuntra registrado!</strong> Por favor realice previamente su registro antes de agregar formación academica.
                           <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>`;

        var noRegistro = document.getElementById('noRegistro')
        noRegistro.innerHTML = msn;
        console.log('Esta vacio')
    }

}



//Get the button subir
let mybutton = document.getElementById("btn-back-to-top");
// When the user clicks on the button, scroll to the top of the document
mybutton.addEventListener("click", backToTop);

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction();
};

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


function backToTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


/**
 * Agrega el valor de avance en la barra de progreso
 * @param {number} valor valor que sera cargado en la barra de progreso
 */
function barraProgreso(valor) {
    const barra = document.querySelector('.progress-bar')
    barra.setAttribute("style", `width: ${valor}%`)
    barra.setAttribute("aria-valuenow", valor)
    barra.innerHTML = `${valor}%`
}




/**
 * calcula el progreso
 * @function progreso
 * @returns {number} Retorna el valor total de los campos validadados.
*/
const progreso = () => {

    let activos = 0
    let validos = 0


    for (item in formAcademic) {
        const campo = document.getElementById(item)

        if (!campo.hasAttribute('disabled')) {
            activos += 1
        }
        if (campo.checkValidity() && !campo.hasAttribute('disabled')) {
            validos += 1
        }

    }
    let valor = Math.round(validos * 100 / activos)

    console.log('este es el vaor ' + valor)
    return valor

}



/**
 * Valida si el estado esta en curso o finalizado.
 * @function validacionEstudios
 * @param {boolean} check Si el valor es verdadero deshabilita los inputs, si es falso los habilita.
*/
const validacionEstudios = (check) => {



    if (check) {
        document.getElementById("fechaGraduacion").disabled = true;
        document.getElementById("fechaGraduacion").value = "";

    } else {

        document.getElementById("fechaGraduacion").disabled = false;

    }
}

/**
 * Valida si tiene tarjeta profesional o no.
 * @function validacionTarjeta
 * @param {boolean} check Si el valor es verdadero habilita los inputs, si es falso los deshabilita.
*/
const validacionTarjeta = (check) => {

    if (check) {

        document.getElementById("numTarjeta").disabled = false;
        document.getElementById("seccional").disabled = false;
        document.getElementById("expedicion").disabled = false;
        document.querySelector('#numTarjeta').required = true;
        document.querySelector('#seccional').required = true;
        document.querySelector('#expedicion').required = true;
        document.getElementById("numTarjeta").focus()
        console.log('ingreso en true')

    } else {

        document.getElementById("numTarjeta").disabled = true;
        document.getElementById("numTarjeta").value = "";
        document.getElementById("seccional").disabled = true;
        document.getElementById("seccional").value = "";
        document.getElementById("expedicion").disabled = true;
        document.getElementById("expedicion").value = "";
        document.querySelector('#numTarjeta').required = false;
        document.querySelector('#seccional').required = false;
        document.querySelector('#expedicion').required = false;
        console.log('ingreso en false')
    }

}


/**
 * Limpia los inputs del formulario.
 * @function limpiarForm
*/
const limpiarForm = () => {

    //document.getElementById('formFormacion').classList.remove("was-validated");
    const formsA = document.getElementById('formFormacion')
    const status = document.getElementById("estadoForm")

    formsA.reset()

    document.getElementById("fechaGraduacion").disabled = false;
    document.getElementById("fechaGraduacion").value = '';
    document.getElementById("opEstudio").checked = false;
    document.getElementById("switchCheck").checked = false;


    document.getElementById("numTarjeta").disabled = true;
    document.getElementById("seccional").disabled = true;
    document.getElementById("expedicion").disabled = true;

    status.innerHTML = "";
    $("#progress").css("display", "none");
    $("#btnCargar").css("display", "none");
    ruta = ""

}

/**
 * Valida la información del formulario y alimenta el array que genera la tabla.
 * @function datosPersonas
*/
const datosPersonas = () => {

    const nivelEsc = document.getElementById("nivelEsc");
    const universidad = document.getElementById("universidad");
    const titulo = document.getElementById("titulo");
    const opEstudio = document.getElementById("opEstudio").checked;
    const opTarjeta1 = document.getElementById("switchCheck").checked;
    const fechaGraduacion = document.getElementById("fechaGraduacion");
    const numTarjeta = document.getElementById("numTarjeta");
    const seccional = document.getElementById("seccional");
    const expedicion = document.getElementById("expedicion");

    if (opTarjeta1) {

        var opTarjeta = "Si";
    } else {

        var opTarjeta = "No";
    }

    if (opEstudio) {
        var opEst = "En curso"
    } else {
        var opEst = "Finalizado"
    }

    const fecha = (new Date(Date.now())).toLocaleDateString()

    formacionAcademica.push({
        fecha: fecha || "",
        cedula: persona.cedula || "",
        nivelEsc: nivelEsc.value || "",
        universidad: universidad.value || "",
        titulo: titulo.value || "",
        estado: opEst || "",
        fechaGraduacion: fechaGraduacion.value || "",
        adjunto: ruta || "",
        tarjeta: opTarjeta || "",
        numTarjeta: numTarjeta.value || "",
        seccional: seccional.value || "",
        expedicion: expedicion.value || ""

    })

    formacionAcademica.forEach(element => console.log(element));

    //Generamos la tabla
    tablaVinculados()


}

/**
 * Envia la información al back para luego ser enviada a la base de datos
 * @function guardarInfo
 */
const guardarInfo = () => {


    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'

    //Agregamos la fecha 
    const fecha = (new Date(Date.now())).toLocaleDateString()
    formacionAcademica.fecha = fecha

    //Agregamos el id y transformamos los objetos en arrays
    idPersonas += 1
    for (i = 0; i < formacionAcademica.length; i++) {
        formacionAcademica[i].id = idPersonas

        formacionPost.push(Object.values(formacionAcademica[i]))
    }

    google.script.run.postInDB2(Object.values(formacionPost), "Formación", 1, false);


    formacionPost = []

    var toastMsn = {
        bg: "bg-success",
        title: "Guardado",
        msn: "Se a guardado correctamente",
        icon: "fas fa-check"
    }
    alertaMsn(toastMsn)

}


/**
 * Crea la tabla con los datos de la formación académica 
 * @function tablaVinculados
 * @returns {string} Retorna el html de la tabla.
 */
const tablaVinculados = () => {

    var table = `<div class="container table-responsive">
          
          <table class="table table-hover mb-4 text-center">
            <thead class="bg-dark text-white">
              <tr>
                <th scope="col">Nivel Escolar</th>
                <th scope="col">Universidad</th>
                <th scope="col">Título</th>
                <th scope="col">Estado</th>
                <th scope="col">Tarjeta Profesional</th>
                <th scope="col">Documento</th>
                <th scope="col">Borrar</th>
                <th scope="col">Editar</th>
             </tr>
            </thead>
            <tbody>
            ${formacionAcademica.map(function (form, index) {
        return (


            `<tr>
                   <td>${form.nivelEsc}</td>
                    <td>${form.universidad}</td>
                    <td>${form.titulo}</td>
                    <td>${form.estado}</td>
                    <td>${form.tarjeta}</td>
                     <td>${form.adjunto != '' ?
                `<a href=${form.adjunto} target="_blank"><span><i class="far fa-eye"></i></i>
                      </span></a>` :
                `<span><i class="far fa-eye-slash"></i></i></i>
                      </span></a>`

            }
                  </td>
                   

                    <td>
                         <button class="btn " onclick="deleteFormacion(${index})">
                         <i class="fas fa-trash"></i></button>
                    </td>
                      
                     <td>
                        <button onclick="editarFormacion(${index})" type="button"
                        class="btn " data-bs-toggle="modal" data-bs-target="#exampleModal">
                        <i class="fas fa-edit"></i>
                        </button>
                    </td>
            </tr>`
        )
    }).join(" ")
        }
            </tbody>
            
          </table>
          
  </div>`

    document.getElementById("tablaPersonas").innerHTML = table
    document.documentElement.scrollTop = document.documentElement.scrollHeight;

}



/**
* Permite eliminar un valor de un array.
* @function deleteFormacion 
* @param {number} index Indice de la tabla de la función {@link tablaVinculados}
*/
const deleteFormacion = (index) => {


    var toastMsn = {
        bg: "bg-warning",
        title: "Eliminado",
        msn: "Se a eliminado el registro correctamente",
        icon: "fas fa-exclamation-triangle"
    }
    alertaMsn(toastMsn)

    if (formacionAcademica.length > 0) {

        formacionAcademica.splice(index, 1)
        console.log('este es el index ' + index)
        tablaVinculados()

    } else {
        formacionAcademica = []
        document.getElementById("tablaConocimientos").innerHTML = ""

    }

    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
    statusRegistro = false
}


/**
 * Permite ditar un valor de un array.
 * @function editarFormacion 
 * @param {number} index Indice de la tabla de la función {@link tablaVinculados}
 */
const editarFormacion = (index) => {

    //Enviamos el valor de index a una variable global
    indice = index;

    //Creamos el boton para aplicar cambios en la edición
    const buttonApply = `<button onclick="aplicarFormacion()"id="addFormacion" type="button" class="btn btn-primary">Aplicar  Cambios</button>`

    const bntAplicar = document.getElementById('bntAplicar')
    bntAplicar.innerHTML = buttonApply;

    const nivelEsc = document.getElementById("nivelEsc")
    const universidad = document.getElementById("universidad")
    const titulo = document.getElementById("titulo")

    const opEstudio = document.getElementById("opEstudio")
    const opTarjeta1 = document.getElementById("switchCheck")
    const fechaGraduacion = document.getElementById("fechaGraduacion")
    const numTarjeta = document.getElementById("numTarjeta")
    const seccional = document.getElementById("seccional")
    const expedicion = document.getElementById("expedicion")

    const estado = formacionAcademica[index].estado;
    const tarjeta = formacionAcademica[index].tarjeta;

    if (estado == 'En curso') {

        validacionEstudios(true)
        opEstudio.checked = true

    } else {
        validacionEstudios(false)
        opEstudio.checked = false
    }


    if (tarjeta == 'Si') {
        opTarjeta1.checked = true;
        validacionTarjeta(true)

    } else {
        opTarjeta1.checked = false;
        validacionTarjeta(false)
    }

    formacionAcademica[index].cedula = persona.cedula;
    nivelEsc.value = formacionAcademica[index].nivelEsc
    universidad.value = formacionAcademica[index].universidad
    titulo.value = formacionAcademica[index].titulo
    fechaGraduacion.value = formacionAcademica[index].fechaGraduacion
    numTarjeta.value = formacionAcademica[index].numTarjeta
    seccional.value = formacionAcademica[index].seccional
    expedicion.value = formacionAcademica[index].expedicion

}


/**
 * Permite agregar nuevos registros a la tabla
 * @function agregar
 */
const agregar = () => {

    //limpiamos todo
    limpiarForm()

    //Se crea el boton para agregar registros
    const buttonApply = `<button type="button" id="comprobar" class="btn btn-primary">Guardar Cambios</button>`
    const bntAplicar = document.getElementById('bntAplicar')
    bntAplicar.innerHTML = buttonApply;

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.formFormacion')
    var comprobar = document.getElementById('comprobar')
    var status = document.getElementById("estadoForm")

    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            comprobar.addEventListener('click', function (event) {
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                    form.classList.add('was-validated')
                }
                else {
                    event.preventDefault()
                    datosPersonas()
                    $('#exampleModal').modal('hide');
                    //document.getElementById('formFormacion').reset();
                    document.getElementById('formFormacion').noValidate = false;

                }
            }, false)
        })

    //Si existen modificaciones genera una alerta
    Array.prototype.slice.call(forms)
        .forEach(function (form) {
            form.addEventListener('change', function (event) {
                status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'

                //Modificamos la barra de progreso constantemente
                const valor = progreso()
                if (valor == 100) {
                    status.innerHTML = '<span class="badge bg-success">Completo</span>'
                }
                barraProgreso(valor)

            }, false)
        })


}

/**
 * Aplica los cambios realizados en la función editarFormacion()
 * @function aplicarFormacion
 */
const aplicarFormacion = () => {

    const nivelEsc = document.getElementById("nivelEsc").value
    const universidad = document.getElementById("universidad").value
    const titulo = document.getElementById("titulo").value
    const opEstudio = document.getElementById("opEstudio").checked
    var opEstudio1 = ""

    if (opEstudio) {
        opEstudio1 = "En curso";
    } else {
        opEstudio1 = "Finalizado";
    }

    console.log('este es el valor del indice ' + indice)

    if (formacionAcademica.length > 0) {

        formacionAcademica[indice].cedula = persona.cedula
        formacionAcademica[indice].nivelEsc = nivelEsc
        formacionAcademica[indice].universidad = universidad
        formacionAcademica[indice].titulo = titulo
        formacionAcademica[indice].estado = opEstudio1
        formacionAcademica[indice].adjunto = ruta



        $('#exampleModal').modal('hide');
        document.getElementById('formFormacion').reset();
        tablaVinculados()
    }


}


/**
 * Carga los documentos que se envian al drive.
 * @function saveFile
 * @param {object} file Datos de archivo cargado.
 * @param {string} cedula Número de cedula de la persona a la cual se va a cargar la información.
 */
const saveFile = (file, cedula) => {
    
    const fr = new FileReader();
    var id = '1HCDeqhmUpqQsQmY2y4cGU_t_6vJPWu2x'
    fr.onload = function (e) {
        const obj = {
            filename: file.name,
            mimeType: file.type,
            bytes: [...new Int8Array(e.target.result)]
        };
        google.script.run.withSuccessHandler(validacionAdjunto).saveFile2(obj, cedula, id);
        $("#progress").css("display", "flex");

    };
    fr.readAsArrayBuffer(file);
}


/**
 * Valida que se carguen los archivos
 * @function validacionAdjunto
 * @param {Array} data Trae los datos del archivo que se va a cargar en la base de datos.
 */
const validacionAdjunto = (data) => {

    var e = data[0];
    var url = data[1];
    //Envía la url a una variable global.
    ruta = url;

    if (e) {


        $('#barra').removeClass('progress-bar-striped progress-bar-animated').addClass('bg-success');
        $('#barra').text('Completo');
        $('.archivo').val('');
        archivos = [];


    } else {

        $('#barra').removeClass('progress-bar-striped progress-bar-animated').addClass('bg-danger');
        $('#barra').text('Hubo un error');
        $('#formFile').val('');
        archivos = [];

    }
}



/**
 * Ejecuta el metodo que carga los archivos al drive.
 * @function cargarInfo 
 */
const cargarInfo = () => {

    var f = archivos[0];
    var cedula = persona.cedula;

    saveFile(f, cedula)

}



//Esta funcion carga todos los archivos en un array de objetos y de indices
/**
 * Carga todos los archivos en un array de objetos y de indices
 * @param {object} f Es toda la información del archivo que se esta cargando como onchange desde el html.
 */
const arrayObjetos = (f) => {
   
    var objeto = f[0];
    var file = objeto.files[0];

    archivos.push(file);
    var btnCargar = ` <button type="button" onclick="cargarInfo()" id="btnCargar" class="btn btn-primary mt-2 float-end ">Cargar</button> `;
    var divCargar = document.getElementById("divCargar")
    divCargar.innerHTML = btnCargar;


}

/**
 * Genera alerta apartir de valores enviados.
 * @function alertaMsn
 * @param {object} toastMsn Son los valores enviados para generar el tipo de alerta.
 */
const alertaMsn = (toastMsn) => {



    var option = {
        animation: true,
        delay: 2000,
    }

    var toastBody =
        `<div class="toast-container position-fixed bottom-0 end-0 p-3">

            <div class="toast text-dark" role="alert" aria-live="assertive" aria-atomic="true">
                <div class="toast-header ${toastMsn.bg} text-dark">
                    <i class="${toastMsn.icon} rounded me-2"></i>
                    <strong class="me-auto">${toastMsn.title}</strong>
                    <small class="text-dark">Ahora</small>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body ${toastMsn.bg}">
                ${toastMsn.msn}
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




