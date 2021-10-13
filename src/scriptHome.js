/**
 * scriptHome
 * @module scriptHome
 */

/**
 * Configuración del Modal
 * @type {bootstrap}
 */
var myModal = new bootstrap.Modal(document.getElementById('modalPolitica'), {
    keyboard: false
})

window.onload = function () {
    google.script.run.withSuccessHandler(checkPoliticas).checkPoliticas();
}

/**
 *Permite registrar en la base de datos cuando el usuario acepta las politicas
 */
function aceptar() {
    google.script.run.politicas()
}

/**
 * Si no se han aceptado las politicas muestra el modal que las coentiene y habilita el botón para continuar con el formulario
 * @param {Array} data Contiene información sobre la aceptación de las politicas por parte del usuario
 */
function checkPoliticas(data) {
    if (!data[0]) {
        myModal.show()
    }
    /* document.getElementById('comenzar').innerHTML = `<button class="btn btnComenzar"> <a class="nav-link text-dark" href="${data[1]}?p=registro">COMENZAR</a></button>`*/

    document.getElementById('comenzar').innerHTML = `<form action="${data[1]}" method="post">
                             <button class="btn btnComenzar nav-link text-dark" 
                             id="btnLogin" name="btnLogin" type="submit" value="registro">COMENZAR
                             </button>
                             </form>`

}
