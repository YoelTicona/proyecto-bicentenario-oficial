// src/utils/validacionesContrasenia.js

export function validarContraseniaSegura(contrasenia) {
    if (!/[a-z]/.test(contrasenia)) return 'Debe tener al menos una minúscula.'
    if (!/[A-Z]/.test(contrasenia)) return 'Debe tener al menos una mayúscula.'
    if (!/\d/.test(contrasenia)) return 'Debe tener al menos un número.'
    if (!/[^a-zA-Z0-9]/.test(contrasenia)) return 'Debe tener un carácter especial.'
    if (contrasenia.length < 8 || contrasenia.length > 15) return 'Debe tener entre 8 y 15 caracteres.'
    return ''
  }
  