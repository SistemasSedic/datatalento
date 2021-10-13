
/**
 * scriptExperiencia
 * @module scriptExperiencia
 */


var experienciaPer = [];
var persona = {};
var ruta = "";
var archivos = [];
var indices = [];
var statusRegistro = false;
var experienciaPost = []
var indice = 0;
var idPersonas = 0;
var banderaPersonas = 0;

var formExper = {

    empresa: '',
    cargo: '',
    fechaIn: '',
    fechaFin: '',
    objeto: '',
    funciones: ''

}

/**
 * Inicia todo lo que contenga la función al cargar la página en el navegador.
 * @function iniciar
 */
window.onload = function iniciar() {

    //comprueba si se diligencio previamente y trae los datos
    google.script.run.withSuccessHandler(filedForm).findDataRegistro2('Experiencia')
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
 */
const filedForm = (info) => {

    info = JSON.parse(info)


    if (!Object.keys(info).length == 0) {


        //Valida si trae el array de Experiencia
        if (info.global == "Experiencia") {

            persona.cedula = info.datos[0][1]

//Ingresa los datos de la tabla Experiencia
            for (i = 0; i < info.datos.length; i++) {

experienciaPer.push({

                    fecha: info.datos[i][0],
                    cedula: info.datos[i][1],
                    empresa: info.datos[i][2],
                    cargo: info.datos[i][3],
                    fechaIn: info.datos[i][4],
                    fechaFin: info.datos[i][5],
                    objeto: info.datos[i][6],
                    funciones: info.datos[i][7],
                    adjunto: info.datos[i][8]


                })
                idPersonas = info.datos[i][9]

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

/**
 * Despliega un boton que permite hacer scroll automatico a la parte superior(top) de la página
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


    for (item in formExper) {
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
 * Valida la información del formulario y alimenta el array que genera la tabla.
 * @function datosPersonas
*/
const datosPersonas = () => {

    const empresa = document.getElementById("empresa");
    const cargo = document.getElementById("cargo");
    const fechaIn = document.getElementById("fechaIn");
    const fechaFin = document.getElementById("fechaFin");
    const objeto = document.getElementById("objeto");
    const funciones = document.getElementById("funciones");


    const fecha = (new Date(Date.now())).toLocaleDateString()




    experienciaPer.push({
        fecha: fecha || "",
        cedula: persona.cedula || "",
        empresa: empresa.value || "",
        cargo: cargo.value || "",
        fechaIn: fechaIn.value,
        fechaFin: fechaFin.value,
        objeto: objeto.value || "",
        funciones: funciones.value || "",
        adjunto: ruta || ""


    })

    //experienciaPer.forEach(element => console.log(element));

    //limpiamos todo
    limpiarForm()


    //Generamos la tabla
    tablaVinculados()
    //cargarInfo()

}


/**
 * Envia la información al back para luego ser enviada a la base de datos
 * @function guardarInfo
 */
const guardarInfo = () => {



    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-success text-white">Guardado</span>'

    //Agregamos la fecha 
    //const fecha = (new Date(Date.now())).toLocaleDateString()
    //experienciaPer.fecha = fecha

    experienciaPer.forEach(element => console.log(element));



    //Agregamos el id y transformamos los objetos en arrays
    idPersonas += 1
    for (i = 0; i < experienciaPer.length; i++) {
        experienciaPer[i].id = idPersonas


        experienciaPost.push(Object.values(experienciaPer[i]))
    }

    google.script.run.postInDB2(Object.values(experienciaPost), "Experiencia", 1, false);


    experienciaPost = []
    var toastMsn = {
        bg: "bg-success",
        title: "Guardado",
        msn: "Se a guardado correctamente",
        icon: "fas fa-check"
    }
    alertaMsn(toastMsn)
    //  limpiarForm()


}








/**
 * Crea la tabla con los datos de la experiencia laboral 
 * @function tablaVinculados
 * @returns {string} Retorna el html de la tabla.
 */
const tablaVinculados = () => {

    var table = `<div class="container table-responsive">
          
          <table class="table table-hover mb-4 text-center">
            <thead class="bg-dark text-white">
              <tr>
                 <th scope="col">Empresa</th>
                <th scope="col">Objeto</th>
                <th scope="col">Cargo</th>
                <th scope="col">Fecha Inicio</th>
                <th scope="col">Fecha Fin</th>
                <th scope="col">Funciones</th>
                <th scope="col">Documento</th>
                <th scope="col">Borrar</th>
                <th scope="col">Editar</th>
               
              </tr>
            </thead>
            <tbody>
            ${experienciaPer.map(function (form, index) {
        return (


            `<tr>
                   <td>${form.empresa}</td>
                    <td>${form.objeto}</td>
                    <td>${form.cargo}</td>
                    <td>${form.fechaIn}</td>
                    <td>${form.fechaFin}</td>
                    <td>${form.funciones}</td>

                     <td>${form.adjunto != '' ?
                `<a href=${form.adjunto} target="_blank"><span><i class="far fa-eye"></i></i>
                      </span></a>` :
                `<span><i class="far fa-eye-slash"></i></i></i>
                      </span></a>`

            }
                  </td>
                   

                     <td>
                     <button class="btn " onclick="deleteExperiencia(${index})">
                    <i class="fas fa-trash"></i></button>
                      </td>
                      
                     <td>
                    <button onclick="editarExperiencia(${index})" type="button"
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

    document.getElementById("tablaPersonas1").innerHTML = table
    document.documentElement.scrollTop = document.documentElement.scrollHeight;


}



/**
* Permite eliminar un valor de un array.
* @function deleteExperiencia 
* @param {number} index Indice de la tabla de la función {@link tablaVinculados}
*/
const deleteExperiencia = (index) => {
    var toastMsn = {
        bg: "bg-warning",
        title: "Eliminado",
        msn: "Se a eliminado el registro correctamente",
        icon: "fas fa-exclamation-triangle"
    }
    alertaMsn(toastMsn)

    if (experienciaPer.length > 0) {

        experienciaPer.splice(index, 1)
        console.log('este es el index ' + index)
        tablaVinculados()

    } else {
        experienciaPer = []
        document.getElementById("tablaConocimientos").innerHTML = ""

    }

    var status = document.getElementById("estadoForm")
    status.innerHTML = '<span class="badge bg-warning text-dark">En progreso</span>'
    statusRegistro = false
}

/**
 * Permite editar un valor de un array.
 * @function editarExperiencia 
 * @param {number} index Indice de la tabla de la función {@link tablaVinculados}
 */
const editarExperiencia = (index) => {

    indice = index;

    //Creamos el boton para aplicar cambios en la edición
    const buttonApply = `<button onclick="aplicarExperiencia()"id="addExperiencia" type="button" class="btn btn-primary">Aplicar Cambios</button>`

    const bntAplicar = document.getElementById('bntAplicar')
    bntAplicar.innerHTML = buttonApply;


    const empresa = document.getElementById("empresa");
    const objeto = document.getElementById("objeto");
    const cargo = document.getElementById("cargo");
    const fechaIn = document.getElementById("fechaIn");
    const fechaFin = document.getElementById("fechaFin");
    const funciones = document.getElementById("funciones");


    empresa.value = experienciaPer[index].empresa
    objeto.value = experienciaPer[index].objeto
    cargo.value = experienciaPer[index].cargo
    fechaIn.value = experienciaPer[index].fechaIn
    fechaFin.value = experienciaPer[index].fechaFin
    funciones.value = experienciaPer[index].funciones




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
    var forms = document.querySelectorAll('.formExperiencia')
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
                    document.getElementById('formFormacion').reset();
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
* Limpia los inputs del formulario.
* @function limpiarForm
*/
const limpiarForm = () => {
    // document.getElementById('formExperiencia').classList.remove("was-validated");
    const formsA = document.getElementById('formExperiencia')
    const status = document.getElementById("estadoForm")

    formsA.reset()

    status.innerHTML = "";
    barraProgreso(0)
    archivos = [];
    $("#progress").css("display", "none");
    $("#btnCargar").css("display", "none");
    ruta = ""

}


/**
 * Aplica los cambios realizados en la función {@link editarExperiencia}
 * @function aplicarFormacion
 */
const aplicarExperiencia = () => {

    const empresa = document.getElementById("empresa").value
    const cargo = document.getElementById("cargo").value
    const fechaIn = document.getElementById("fechaIn").value
    const fechaFin = document.getElementById("fechaFin").value
    const objeto = document.getElementById("objeto").value
    const funciones = document.getElementById("funciones").value


    if (experienciaPer.length > 0) {

        experienciaPer[indice].cedula = persona.cedula
        experienciaPer[indice].empresa = empresa
        experienciaPer[indice].objeto = objeto
        experienciaPer[indice].cargo = cargo
        experienciaPer[indice].fechaIn = fechaIn
        experienciaPer[indice].fechaFin = fechaFin
        experienciaPer[indice].funciones = funciones
        experienciaPer[indice].adjunto = ruta


        $('#exampleModal').modal('hide');
        document.getElementById('formExperiencia').reset();
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
    //const file = f.files[0];
    console.log('archivo ' + file.name)


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

//Valida que se carguen los archivos
const validacionAdjunto = (data) => {

    var e = data[0];
    var url = data[1];

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


//Esta función ejecuta el metodo que carga los archivos al drive
const cargarInfo = () => {

    var f = archivos[0];
    var cedula = persona.cedula;

    saveFile(f, cedula)

}



//Esta funcion carga todos los archivos en un array de objetos y de indices
const arrayObjetos = (f) => {
    //var obj = document.getElementById('formFile').value
    var objeto = f[0];
    var file = objeto.files[0];
    console.log('archivo object ' + file.name)
    // var indice = f[1];
    archivos.push(file);
    var btnCargar = ` <button type="button" onclick="cargarInfo()" id="btnCargar" class="btn btn-primary mt-2 start-end ">Cargar</button> `;
    var divCargar = document.getElementById("divCargar")
    divCargar.innerHTML = btnCargar;


}

//Genera una alerta de error
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



