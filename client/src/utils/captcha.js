export function generarCaptcha() {
    const caracteres = '1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
    let codigo = ''
    for (let i = 0; i < 6; i++) {
      codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length))
    }
    return codigo
  }
  
  export function validarCaptcha(entrada, original) {
    return entrada.trim() === original
  }
  