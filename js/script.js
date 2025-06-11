// 🎯  SISTEMA DE VALIDACIÓN AVANZADA

const formulario = document.getElementById('formularioAvanzado');
const campos = formulario.querySelectorAll('input, textarea, select');
const btnEnviar = document.getElementById('btnEnviar');

// Estado de validación de cada campo
let estadoValidacion = {};

// Inicializar estado de todos los campos
campos.forEach((campo) => {
  estadoValidacion[campo.name] = false;
});

// 🎯 VALIDACIONES ESPECÍFICAS POR CAMPO

// Validación del nombre
document.getElementById('nombreCompleto').addEventListener('input', function () {
  const valor = this.value.trim();
  const nombres = valor.split(' ').filter((nombre) => nombre.length > 0);

  if (valor.length < 3) {
    mostrarError('errorNombre', 'El nombre debe tener al menos 3 caracteres');
    marcarCampo(this, false);
  } else if (nombres.length < 2) {
    mostrarError('errorNombre', 'Ingresa al menos 2 nombres');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoNombre', '✓ Nombre válido');
    marcarCampo(this, true);
  }
});

// Validación del email
document.getElementById('correo').addEventListener('input', function () {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.value)) {
    mostrarError('errorCorreo', 'Formato de email inválido');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoCorreo', '✓ Email válido');
    marcarCampo(this, true);
  }
});

// Validación de contraseña con indicador de fortaleza
document.getElementById('password').addEventListener('input', function () {
  const password = this.value;
  const fortaleza = calcularFortalezaPassword(password);

  actualizarBarraFortaleza(fortaleza);

  if (password.length < 8) {
    mostrarError('errorPassword', 'La contraseña debe tener al menos 8 caracteres');
    marcarCampo(this, false);
  } else if (fortaleza.nivel < 2) {
    mostrarError('errorPassword', 'Contraseña muy débil. Añade números y símbolos');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoPassword', `✓ Contraseña ${fortaleza.texto}`);
    marcarCampo(this, true);
  }
});

// Confirmación de correo electrónico (en lugar de confirmación de contraseña)
document.getElementById('confirmarPassword').addEventListener('input', function () {
  const correo = document.getElementById('correo').value;
  if (this.value !== correo) {
    mostrarError('errorConfirmar', 'Los correos no coinciden');
    marcarCampo(this, false);
  } else if (this.value.length > 0) {
    mostrarExito('exitoConfirmar', '✓ Correos coinciden');
    marcarCampo(this, true);
  }
});
document.getElementById('confirmarPassword').addEventListener('paste', (e) => {
  e.preventDefault();
  alert('Pegar texto no está permitido en este campo.');
});

// Teléfono
document.getElementById('telefono').addEventListener('input', function () {
  let valor = this.value.replace(/\D/g, '');
  if (valor.length >= 6) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3, 6) + '-' + valor.substring(6, 10);
  } else if (valor.length >= 3) {
    valor = valor.substring(0, 3) + '-' + valor.substring(3);
  }
  this.value = valor;

  const telefonoRegex = /^[0-9]{3}-[0-9]{3}-[0-9]{4}$/;
  if (!telefonoRegex.test(valor)) {
    mostrarError('errorTelefono', 'Formato: 300-123-4567');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoTelefono', '✓ Teléfono válido');
    marcarCampo(this, true);
  }
});

// Fecha de nacimiento
document.getElementById('fechaNacimiento').addEventListener('change', function () {
  const fechaNacimiento = new Date(this.value);
  const hoy = new Date();
  let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
  const m = hoy.getMonth() - fechaNacimiento.getMonth();

  if (m < 0 || (m === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
    edad--;
  }

  if (edad < 18) {
    mostrarError('errorFecha', 'Debes ser mayor de 18 años');
    marcarCampo(this, false);
  } else if (edad > 100) {
    mostrarError('errorFecha', 'Fecha no válida');
    marcarCampo(this, false);
  } else {
    mostrarExito('exitoFecha', `✓ Edad: ${edad} años`);
    marcarCampo(this, true);
  }
});

// Comentarios
document.getElementById('comentarios').addEventListener('input', function () {
  const contador = document.getElementById('contadorComentarios');
  contador.textContent = this.value.length;

  if (this.value.length > 450) {
    contador.style.color = '#dc3545';
  } else if (this.value.length > 400) {
    contador.style.color = '#ffc107';
  } else {
    contador.style.color = '#666';
  }
  marcarCampo(this, true);
});

// Términos y condiciones
document.getElementById('terminos').addEventListener('change', function () {
  if (!this.checked) {
    mostrarError('errorTerminos', 'Debes aceptar los términos y condiciones');
    marcarCampo(this, false);
  } else {
    ocultarMensaje('errorTerminos');
    marcarCampo(this, true);
  }
});

// 🎯 FUNCIONES AUXILIARES

function mostrarError(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('error', 'exito'));
}

function mostrarExito(idElemento, mensaje) {
  const elemento = document.getElementById(idElemento);
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  ocultarMensaje(idElemento.replace('exito', 'error'));
}

function ocultarMensaje(idElemento) {
  const elemento = document.getElementById(idElemento);
  if (elemento) elemento.style.display = 'none';
}

function marcarCampo(campo, esValido) {
  estadoValidacion[campo.name] = esValido;
  campo.classList.toggle('valido', esValido);
  campo.classList.toggle('invalido', !esValido);
  actualizarProgreso();
  actualizarBotonEnvio();
}

function calcularFortalezaPassword(password) {
  let puntos = 0;
  if (password.length >= 8) puntos++;
  if (password.length >= 12) puntos++;
  if (/[a-z]/.test(password)) puntos++;
  if (/[A-Z]/.test(password)) puntos++;
  if (/[0-9]/.test(password)) puntos++;
  if (/[^A-Za-z0-9]/.test(password)) puntos++;

  const niveles = ['muy débil', 'débil', 'media', 'fuerte', 'muy fuerte'];
  const nivel = Math.min(Math.floor(puntos / 1.2), 4);
  return { nivel, texto: niveles[nivel], puntos };
}

function actualizarBarraFortaleza(fortaleza) {
  const barra = document.getElementById('strengthBar');
  const clases = ['strength-weak', 'strength-weak', 'strength-medium', 'strength-strong', 'strength-very-strong'];
  barra.className = 'password-strength ' + clases[fortaleza.nivel];
}

function actualizarProgreso() {
  const total = Object.keys(estadoValidacion).length;
  const validados = Object.values(estadoValidacion).filter(Boolean).length;
  const porcentaje = Math.round((validados / total) * 100);
  document.getElementById('barraProgreso').style.width = porcentaje + '%';
  document.getElementById('porcentajeProgreso').textContent = porcentaje + '%';
}

function actualizarBotonEnvio() {
  const todosValidos = Object.values(estadoValidacion).every((v) => v);
  btnEnviar.disabled = !todosValidos;
}

// Envío del formulario
formulario.addEventListener('submit', function (e) {
  e.preventDefault();
  const datos = new FormData(this);
  let resumen = '';

  for (let [campo, valor] of datos.entries()) {
    if (valor && valor.trim() !== '') {
      const nombreCampo = obtenerNombreCampo(campo);
      resumen += `<div class="dato-resumen"><span class="etiqueta-resumen">${nombreCampo}:</span> ${valor}</div>`;
    }
  }

  document.getElementById('contenidoResumen').innerHTML = resumen;
  document.getElementById('resumenDatos').style.display = 'block';
  document.getElementById('resumenDatos').scrollIntoView({ behavior: 'smooth' });
  console.log('📊 Datos enviados:', Object.fromEntries(datos));
});

function obtenerNombreCampo(campo) {
  const nombres = {
    nombreCompleto: 'Nombre completo',
    correo: 'Correo electrónico',
    password: 'Contraseña',
    confirmarPassword: 'Confirmar correo electrónico',
    telefono: 'Teléfono',
    fechaNacimiento: 'Fecha de nacimiento',
    comentarios: 'Comentarios',
    terminos: 'Términos y condiciones',
  };
  return nombres[campo] || campo;
}
