export function fetchConToken(url, opciones = {}) {
  const token = localStorage.getItem('token');
  return fetch(url, {
    ...opciones,
    headers: {
      ...opciones.headers,
      Authorization: `Bearer ${token}`,
    },
  });
}
