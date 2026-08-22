// 01-arreglos.js
// Métodos de arreglo más usados en JS/Node — practícalos sobre esta lista
// de talleres (misma forma que la API real de CECyT9). Completa cada TODO.

const talleres = [
  { nombre: 'Introducción a Python', instructor: 'Ing. María López', cupo: 25, inscritos: 25 },
  { nombre: 'Fundamentos de Redes', instructor: 'Ing. Carlos Ramírez', cupo: 30, inscritos: 18 },
  { nombre: 'Diseño de Bases de Datos', instructor: 'Ing. Ana Torres', cupo: 20, inscritos: 20 },
  { nombre: 'Desarrollo Web con JS', instructor: 'Ing. María López', cupo: 25, inscritos: 10 },
];

// TODO: forEach — imprime "- <nombre> (<inscritos>/<cupo>)" de cada taller

// TODO: map — crea un arreglo `nombres` solo con los nombres de los talleres

// TODO: filter — crea un arreglo `llenos` con los talleres donde inscritos >= cupo

// TODO: find — encuentra el PRIMER taller impartido por 'Ing. María López'

// TODO: reduce — calcula `totalInscritos`, la suma de inscritos de todos los talleres

// TODO: filter + map encadenados — nombres de los talleres que SÍ tienen cupo disponible
