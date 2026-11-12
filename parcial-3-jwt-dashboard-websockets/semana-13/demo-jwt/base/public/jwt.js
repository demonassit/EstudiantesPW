// Página de JWT. A diferencia de demo.js (semana 12), aquí el navegador NO manda nada solo:
// este código guarda el token en localStorage y lo pone en el encabezado Authorization de cada petición.
const $ = (id) => document.getElementById(id);
const CLAVE = 'token';

// ---------- Guardar el token en el navegador ----------

function leerToken() {
  try { return localStorage.getItem(CLAVE); } catch { return null; }
}
function guardarToken(token) {
  try { localStorage.setItem(CLAVE, token); } catch { /* sin localStorage: no se guarda */ }
  pintarToken();
}
function borrarToken() {
  try { localStorage.removeItem(CLAVE); } catch { /* nada que borrar */ }
  pintarToken();
}

// ---------- Leer un JWT (sin la clave: el payload NO va cifrado, solo codificado en base64url) ----------

function base64urlATexto(parte) {
  const base64 = parte.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parte.length / 4) * 4, '=');
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}
function textoABase64url(texto) {
  const bytes = new TextEncoder().encode(texto);
  let binario = '';
  bytes.forEach((b) => { binario += String.fromCharCode(b); });
  return btoa(binario).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function decodificar(token) {
  const partes = (token || '').split('.');
  if (partes.length !== 3) return null;
  try {
    return { partes, cabecera: JSON.parse(base64urlATexto(partes[0])), carga: JSON.parse(base64urlATexto(partes[1])) };
  } catch {
    return null;
  }
}

// ---------- Hablar con la API ----------

async function llamar(metodo, url, { cuerpo, sinToken = false } = {}) {
  const headers = {};
  const token = leerToken();
  if (token && !sinToken) headers.Authorization = `Bearer ${token}`;
  if (cuerpo) headers['Content-Type'] = 'application/json';
  const respuesta = await fetch(url, { method: metodo, headers, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
  let datos = null;
  try { datos = await respuesta.json(); } catch { datos = null; }
  return { status: respuesta.status, datos, mandoToken: Boolean(headers.Authorization) };
}

function anotar(metodo, url, status, datos, mandoToken) {
  const li = document.createElement('li');
  const clase = status < 300 ? 'ok' : status === 401 ? 'e401' : status === 403 ? 'e403' : 'error';
  const codigo = document.createElement('span');
  codigo.className = `codigo ${clase}`;
  codigo.textContent = status;
  const linea = document.createElement('code');
  linea.textContent = ` ${metodo} ${url} ${mandoToken ? '· con Bearer' : '· SIN token'}`;
  const cuerpo = document.createElement('pre');
  cuerpo.textContent = JSON.stringify(datos, null, 2);
  li.append(codigo, linea, cuerpo);
  $('bitacora').prepend(li);
}

// ---------- Pintar ----------

function pintarToken() {
  const token = leerToken();
  $('token').value = token || '';
  $('ls-js').textContent = token || '(vacío)';
  $('cookie-js').textContent = document.cookie || '(vacío)';

  const jwt = decodificar(token);
  const partes = $('partes');
  partes.textContent = '';
  if (!jwt) {
    partes.textContent = token ? '(no es un JWT: deben ser 3 partes separadas por puntos)' : '—';
    $('cabecera').textContent = '—';
    $('carga').textContent = '—';
  } else {
    ['jwt-cabecera', 'jwt-carga', 'jwt-firma'].forEach((clase, i) => {
      if (i > 0) partes.append('.');
      const span = document.createElement('span');
      span.className = clase;
      span.textContent = jwt.partes[i];
      partes.append(span);
    });
    $('cabecera').textContent = JSON.stringify(jwt.cabecera, null, 2);
    const carga = { ...jwt.carga };
    if (carga.iat) carga.iat = `${carga.iat}  (${new Date(carga.iat * 1000).toLocaleTimeString()})`;
    if (carga.exp) carga.exp = `${carga.exp}  (${new Date(carga.exp * 1000).toLocaleTimeString()})`;
    $('carga').textContent = JSON.stringify(carga, null, 2);
  }
  pintarEstado();
}

// El reloj del NAVEGADOR: solo informa. Quien decide si el token sirve es el servidor.
function pintarEstado() {
  const jwt = decodificar(leerToken());
  const estado = $('estado');
  if (!jwt) {
    estado.textContent = 'Sin token: para el servidor eres anónimo (401)';
    estado.className = 'estado sin-sesion';
    return;
  }
  const faltan = jwt.carga.exp - Math.floor(Date.now() / 1000);
  if (faltan > 0) {
    estado.textContent = `Token de ${jwt.carga.usuario} · rol ${jwt.carga.rol} · vence en ${faltan} s (según el reloj del navegador)`;
    estado.className = 'estado con-sesion';
  } else {
    estado.textContent = `Token de ${jwt.carga.usuario} VENCIDO hace ${-faltan} s`;
    estado.className = 'estado sin-sesion';
  }
}

async function refrescarServidor() {
  const { datos } = await llamar('GET', '/api/diagnostico/jwt', { sinToken: true });
  if (!datos) return;
  $('sesiones-mysql').textContent = `Filas en la tabla sessions: ${datos.sesionesEnMySQL}. Con JWT el servidor no crea ninguna.`;
  const cuerpo = $('tabla-revocados');
  cuerpo.textContent = '';
  if (datos.revocados.length === 0) {
    const fila = cuerpo.insertRow();
    const celda = fila.insertCell();
    celda.colSpan = 3;
    celda.textContent = '(vacía)';
    return;
  }
  for (const t of datos.revocados) {
    const fila = cuerpo.insertRow();
    for (const valor of [t.jti, t.usuario, new Date(t.expira).toLocaleTimeString()]) {
      fila.insertCell().textContent = valor;
    }
  }
}

// ---------- Eventos ----------

$('usuario').addEventListener('change', () => {
  $('contrasena').value = `${$('usuario').value}12345`;
});

$('form-login').addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const cuerpo = { usuario: $('usuario').value, contrasena: $('contrasena').value };
  const { status, datos } = await llamar('POST', '/api/jwt/login', { cuerpo, sinToken: true });
  anotar('POST', '/api/jwt/login', status, datos, false);
  if (status === 200 && datos && datos.token) guardarToken(datos.token);
  await refrescarServidor();
});

for (const boton of document.querySelectorAll('[data-url]')) {
  boton.addEventListener('click', async () => {
    const { metodo, url } = boton.dataset;
    const sinToken = boton.dataset.sinToken === 'si';
    const { status, datos, mandoToken } = await llamar(metodo, url, { sinToken });
    anotar(metodo, url, status, datos, mandoToken);
    if (url === '/api/jwt/refresh' && status === 200 && datos.token) guardarToken(datos.token);
    if (url === '/api/jwt/logout') borrarToken(); // del lado del navegador, cerrar sesión = olvidar el token
    await refrescarServidor();
  });
}

$('btn-usar').addEventListener('click', () => {
  const token = $('token').value.trim();
  if (token) guardarToken(token); else borrarToken();
});

// Cambia el rol DENTRO del payload y deja la firma original. ¿Lo aceptará el servidor?
$('btn-alterar').addEventListener('click', () => {
  const jwt = decodificar(leerToken());
  if (!jwt) return;
  const carga = { ...jwt.carga, rol: 'admin' };
  guardarToken(`${jwt.partes[0]}.${textoABase64url(JSON.stringify(carga))}.${jwt.partes[2]}`);
});

$('btn-borrar').addEventListener('click', borrarToken);
$('btn-servidor').addEventListener('click', refrescarServidor);

llamar('GET', '/api/config', { sinToken: true }).then(({ datos }) => {
  $('config').textContent = JSON.stringify(datos, null, 2);
});
pintarToken();
refrescarServidor();
setInterval(pintarEstado, 1000);
