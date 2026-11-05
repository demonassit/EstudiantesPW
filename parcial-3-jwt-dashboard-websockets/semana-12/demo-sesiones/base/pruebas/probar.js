// Pruebas automáticas de la demo:  npm run probar
// Comprueban, sin navegador, lo mismo que se ve en clase. Cada "navegador" es un frasco de cookies.
// Usan su propia base (demo_sesiones_pruebas), que crean desde cero: no tocan tus datos.
const { crearApp, NOMBRE_COOKIE } = require('../app');
const { crearPool } = require('../db');
const { crearBaseDeDatos } = require('../bd/crear-bd');
const configBase = require('../config');

const BD_PRUEBAS = 'demo_sesiones_pruebas';
let pool;

let total = 0;
let pasaron = 0;

async function prueba(nombre, fn) {
  total += 1;
  try {
    const ok = await fn();
    if (ok) pasaron += 1;
    console.log(`${ok ? '✔' : '✘'} ${nombre}`);
  } catch (error) {
    console.log(`✘ ${nombre} (${error.message})`);
  }
}

// Arranca la app con una configuración y regresa su URL y una función para apagarla.
function arrancar(cambios = {}) {
  const app = crearApp({ ...configBase, almacen: 'mysql', ...cambios }, pool);
  return new Promise((resolve) => {
    const servidor = app.listen(0, () => {
      resolve({ url: `http://127.0.0.1:${servidor.address().port}`, cerrar: () => servidor.close() });
    });
  });
}

// Un "navegador": guarda la cookie de sesión y la manda en cada petición.
function navegador(url) {
  const nav = {
    cookie: null,
    ultimoSetCookie: null,
    async pedir(metodo, ruta, cuerpo) {
      const headers = {};
      if (nav.cookie) headers.Cookie = nav.cookie;
      if (cuerpo) headers['Content-Type'] = 'application/json';
      const r = await fetch(url + ruta, { method: metodo, headers, body: cuerpo ? JSON.stringify(cuerpo) : undefined });
      const setCookie = r.headers.get('set-cookie');
      if (setCookie) {
        nav.ultimoSetCookie = setCookie;
        const valor = setCookie.split(';')[0];
        // clearCookie manda la cookie vacía con fecha pasada: el navegador la borra.
        nav.cookie = /Expires=Thu, 01 Jan 1970/i.test(setCookie) ? null : valor;
      }
      let datos = null;
      try { datos = await r.json(); } catch { datos = null; }
      return { status: r.status, datos };
    },
  };
  return nav;
}

const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// Cuántas filas de la tabla sessions tienen a ese usuario.
async function filasDeSesion(usuario) {
  const [filas] = await pool.query('SELECT data FROM sessions');
  return filas.filter((f) => JSON.parse(f.data).usuario?.usuario === usuario).length;
}

(async () => {
  try {
    await crearBaseDeDatos(BD_PRUEBAS);
  } catch (error) {
    console.error('No se pudo crear la base de pruebas:', error.message);
    console.error('Revisa que MySQL esté encendido y tu archivo .env');
    process.exit(1);
  }
  pool = crearPool(BD_PRUEBAS);
  const { url, cerrar } = await arrancar();

  await prueba('Los usuarios vienen de MySQL: luis (solo existe en la tabla) puede entrar', async () => {
    const nav = navegador(url);
    const r = await nav.pedir('POST', '/api/login', { usuario: 'luis', contrasena: 'luis12345' });
    return r.status === 200 && r.datos.usuario.nombre === 'Luis Pérez' && r.datos.usuario.contrasena_hash === undefined;
  });

  await prueba('Usuario que no existe en la tabla: 401', async () => {
    const nav = navegador(url);
    const r = await nav.pedir('POST', '/api/login', { usuario: 'pepe', contrasena: 'pepe12345' });
    return r.status === 401;
  });

  await prueba('MySQL: al iniciar sesión aparece una fila en la tabla sessions, y al cerrar sesión se borra', async () => {
    const nav = navegador(url);
    await pool.query('DELETE FROM sessions');
    await nav.pedir('POST', '/api/login', { usuario: 'admin', contrasena: 'admin12345' });
    const antes = await filasDeSesion('admin');
    await nav.pedir('POST', '/api/logout');
    const despues = await filasDeSesion('admin');
    return antes === 1 && despues === 0;
  });

  await prueba('Sin sesión: /api/perfil responde 401 y no se crea cookie', async () => {
    const nav = navegador(url);
    const r = await nav.pedir('GET', '/api/perfil');
    return r.status === 401 && nav.cookie === null;
  });

  await prueba('Contraseña incorrecta: 401 y sin cookie', async () => {
    const nav = navegador(url);
    const r = await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'mala' });
    return r.status === 401 && nav.cookie === null;
  });

  await prueba('Login correcto: Set-Cookie con HttpOnly, SameSite=Lax y Expires', async () => {
    const nav = navegador(url);
    const r = await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const sc = nav.ultimoSetCookie || '';
    return r.status === 200 && sc.startsWith(`${NOMBRE_COOKIE}=`) && /HttpOnly/i.test(sc) && /SameSite=Lax/i.test(sc) && /Expires=/i.test(sc);
  });

  await prueba('La cookie solo lleva el id firmado, no los datos del usuario', async () => {
    const nav = navegador(url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const valor = decodeURIComponent(nav.cookie.split('=')[1]);
    return valor.startsWith('s:') && !/ana|alumno/i.test(valor);
  });

  await prueba('Con sesión: /api/perfil responde 200 y cuenta visitas en el servidor', async () => {
    const nav = navegador(url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    await nav.pedir('GET', '/api/perfil');
    const r = await nav.pedir('GET', '/api/perfil');
    return r.status === 200 && r.datos.visitas === 2;
  });

  await prueba('Alumno en ruta de admin: 403 (sé quién eres, pero no puedes)', async () => {
    const nav = navegador(url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const r = await nav.pedir('GET', '/api/admin/reporte');
    return r.status === 403;
  });

  await prueba('Admin en ruta de admin: 200', async () => {
    const nav = navegador(url);
    await nav.pedir('POST', '/api/login', { usuario: 'admin', contrasena: 'admin12345' });
    const r = await nav.pedir('GET', '/api/admin/reporte');
    return r.status === 200;
  });

  await prueba('Secuestro: otro navegador con la cookie copiada entra sin contraseña', async () => {
    const victima = navegador(url);
    await victima.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const atacante = navegador(url);
    atacante.cookie = victima.cookie; // "copiar y pegar" la cookie
    const r = await atacante.pedir('GET', '/api/perfil');
    return r.status === 200 && r.datos.mensaje.includes('Ana');
  });

  await prueba('Logout destruye la sesión en el servidor: la cookie copiada ya no sirve', async () => {
    const victima = navegador(url);
    await victima.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const atacante = navegador(url);
    atacante.cookie = victima.cookie;
    await victima.pedir('POST', '/api/logout');
    const r = await atacante.pedir('GET', '/api/perfil');
    return victima.cookie === null && r.status === 401;
  });

  await prueba('regenerarAlEntrar=true: el id de sesión cambia al iniciar sesión', async () => {
    const nav = navegador(url);
    const v = await nav.pedir('POST', '/api/visita');
    const r = await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    return v.datos.sesion === r.datos.sesionAntes && r.datos.sesionAntes !== r.datos.sesionDespues;
  });

  await prueba('regenerarAlEntrar=true: la cookie "plantada" por el atacante no queda con sesión', async () => {
    const atacante = navegador(url);
    await atacante.pedir('POST', '/api/visita');
    const victima = navegador(url);
    victima.cookie = atacante.cookie; // el atacante le planta su cookie
    await victima.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const r = await atacante.pedir('GET', '/api/perfil');
    return r.status === 401;
  });

  cerrar();

  // ----- Configuraciones distintas -----

  const sinRegenerar = await arrancar({ regenerarAlEntrar: false });
  await prueba('regenerarAlEntrar=false: fijación de sesión, el atacante queda dentro', async () => {
    const atacante = navegador(sinRegenerar.url);
    await atacante.pedir('POST', '/api/visita');
    const victima = navegador(sinRegenerar.url);
    victima.cookie = atacante.cookie;
    await victima.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const r = await atacante.pedir('GET', '/api/perfil');
    return r.status === 200;
  });
  sinRegenerar.cerrar();

  const sinHttpOnly = await arrancar({ httpOnly: false });
  await prueba('httpOnly=false: la cookie ya no trae HttpOnly (el JavaScript la puede leer)', async () => {
    const nav = navegador(sinHttpOnly.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    return !/HttpOnly/i.test(nav.ultimoSetCookie);
  });
  sinHttpOnly.cerrar();

  const corta = await arrancar({ maxAgeMs: 400 });
  await prueba('Expiración: con maxAge de 400 ms, al esperar 700 ms responde 401', async () => {
    const nav = navegador(corta.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    const antes = await nav.pedir('GET', '/api/perfil');
    await esperar(700);
    const despues = await nav.pedir('GET', '/api/perfil');
    return antes.status === 200 && despues.status === 401;
  });
  corta.cerrar();

  const fija = await arrancar({ maxAgeMs: 800, rolling: false });
  await prueba('rolling=false: aunque la uses (incluso con la cookie copiada), la sesión vence a la hora fija', async () => {
    const nav = navegador(fija.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    for (let i = 0; i < 4; i += 1) { await esperar(250); await nav.pedir('GET', '/api/sesion'); }
    const r = await nav.pedir('GET', '/api/perfil');
    return r.status === 401;
  });
  fija.cerrar();

  const rolling = await arrancar({ maxAgeMs: 800, rolling: true });
  await prueba('rolling=true: mientras la uses, la sesión no vence', async () => {
    const nav = navegador(rolling.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    for (let i = 0; i < 4; i += 1) { await esperar(250); await nav.pedir('GET', '/api/sesion'); }
    const r = await nav.pedir('GET', '/api/perfil');
    return r.status === 200;
  });
  rolling.cerrar();

  const enMemoria1 = await arrancar({ almacen: 'memoria' });
  await prueba('Reinicio con almacen "memoria": la cookie sigue en el navegador, pero la sesión se perdió (401)', async () => {
    const nav = navegador(enMemoria1.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    enMemoria1.cerrar();
    const enMemoria2 = await arrancar({ almacen: 'memoria' }); // "npm start" otra vez: memoria vacía
    const r = await fetch(`${enMemoria2.url}/api/perfil`, { headers: { Cookie: nav.cookie } });
    enMemoria2.cerrar();
    return nav.cookie !== null && r.status === 401;
  });

  const enMysql1 = await arrancar({ almacen: 'mysql' });
  await prueba('Reinicio con almacen "mysql": la sesión sobrevive (200), estaba en la tabla sessions', async () => {
    const nav = navegador(enMysql1.url);
    await nav.pedir('POST', '/api/login', { usuario: 'ana', contrasena: 'ana12345' });
    enMysql1.cerrar();
    const enMysql2 = await arrancar({ almacen: 'mysql' });
    const r = await fetch(`${enMysql2.url}/api/perfil`, { headers: { Cookie: nav.cookie } });
    enMysql2.cerrar();
    return r.status === 200;
  });

  await pool.end();

  console.log(`\n${pasaron} de ${total} pruebas pasaron.`);
  process.exit(pasaron === total ? 0 : 1);
})();
