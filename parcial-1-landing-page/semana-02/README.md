# Semana 2 (31 ago-4 sep) — Programación Web

**Tipo:** Individual · Práctica oficial 2 (parte 1)

**Tema oficial:** U1·AE2 Redes: topologías y tipos de cableado + Práctica 2 (ponchado de cable UTP).

**Objetivo general:** aplicar las normas de cableado estructurado EIA/TIA-568-A y EIA/TIA-568-B para construir, a partir de 2 metros de cable UTP categoría 5e, dos cables de red funcionales de 1 metro cada uno — un cable directo (straight-through) y un cable cruzado (crossover) — verificando su correcto armado con un probador de continuidad.

**Objetivos específicos:**
- Identificar el código de colores de los 8 hilos del cable UTP según las normas 568-A y 568-B.
- Distinguir cuándo se usa un cable directo y cuándo un cable cruzado dentro de una red.
- Desarrollar la habilidad manual de ponchado (pelar, ordenar, cortar y crimpar) con conector RJ45.
- Verificar la continuidad y el correcto armado de cada cable con un tester.

**Prerrequisitos:** ninguno.

**Marco teórico breve:**
- **Cable directo (straight-through):** ambos extremos siguen la MISMA norma (en esta práctica, 568-B en los dos extremos). Se usa para conectar dispositivos DISTINTOS entre sí: PC-switch, PC-router, switch-router.
- **Cable cruzado (crossover):** un extremo sigue la norma 568-A y el otro la 568-B. Se usa para conectar dispositivos IGUALES de forma directa, sin switch de por medio: PC-PC, switch-switch, router-router. (Las tarjetas de red modernas con Auto-MDI-X corrigen esto automáticamente, pero se sigue enseñando porque es la base para entender el estándar y porque no todo equipo de red lo tiene.)

**Código de colores EIA/TIA-568 (pin por pin):**

| Pin | Norma 568-A | Norma 568-B |
|---|---|---|
| 1 | Verde-Blanco | Naranja-Blanco |
| 2 | Verde | Naranja |
| 3 | Naranja-Blanco | Verde-Blanco |
| 4 | Azul | Azul |
| 5 | Azul-Blanco | Azul-Blanco |
| 6 | Naranja | Verde |
| 7 | Café-Blanco | Café-Blanco |
| 8 | Café | Café |

**Materiales (por estudiante):**
- 1 tramo de cable UTP Categoría 5e de 2 metros (se corta en 2 piezas de 1 metro).
- 4 conectores RJ45 (2 por cable armado; llevar 1-2 de repuesto por si se daña un pin al crimpar).
- 1 pinza crimpadora para RJ45.
- 1 pinza pelacables (o cutter, con cuidado de no cortar los hilos internos).
- 1 tijera.
- 1 probador de cable (tester) de continuidad para RJ45.
- 1 cinta métrica o regla.
- Marcador o etiquetas para identificar cada cable.

**Medidas de seguridad:** usar la crimpadora y el cutter con cuidado (herramientas con filo); trabajar sobre una mesa despejada; no dejar herramientas de corte al alcance de forma insegura.

**Procedimiento:**

1. **Preparar el material.** Del tramo de 2 m de cable UTP Cat 5e, mide y corta 2 piezas de 1 m cada una (con la cinta métrica). Etiqueta una como "Cable 1 – Directo" y la otra como "Cable 2 – Cruzado".

2. **Armar el Cable 1 (Directo, norma 568-B en ambos extremos):**
   - En un extremo, retira con la pinza pelacables ~2-3 cm del forro exterior sin cortar los hilos internos.
   - Destrenza los 4 pares y ordena los 8 hilos según la norma 568-B: Naranja-Blanco, Naranja, Verde-Blanco, Azul, Azul-Blanco, Verde, Café-Blanco, Café.
   - Alinea y aplana los hilos, y corta la punta parejo dejando ~1.2-1.5 cm para que entren completos al conector.
   - Inserta los hilos en el conector RJ45 en ese mismo orden, verificando que cada hilo llegue hasta el fondo y que el forro exterior quede sujeto por la muesca del conector (no solo los hilos pelados).
   - Verifica visualmente el orden de colores contra la tabla antes de crimpar, y crimpa con la pinza (presión firme, un solo movimiento completo).
   - Repite el proceso completo en el otro extremo del mismo cable, usando también la norma 568-B (mismo orden en ambos extremos = cable directo).

3. **Armar el Cable 2 (Cruzado, 568-B en un extremo y 568-A en el otro):**
   - En el primer extremo, repite el proceso con la norma 568-B (igual que el Cable 1).
   - En el segundo extremo, ordena los hilos según la norma 568-A: Verde-Blanco, Verde, Naranja-Blanco, Azul, Azul-Blanco, Naranja, Café-Blanco, Café.
   - Inserta, verifica el orden y crimpa igual que en el paso 2.

4. **Verificar con el tester.** Conecta cada cable terminado al probador de continuidad:
   - Cable 1 (directo): los 8 LEDs deben encender en el mismo orden en ambos módulos del tester (1-1, 2-2, 3-3 ... 8-8).
   - Cable 2 (cruzado): los LEDs deben encender en el patrón cruzado esperado entre 568-A y 568-B (1-3, 2-6, 3-1, 6-2, y 4-4, 5-5, 7-7, 8-8 igual en ambos extremos).
   - Si algún LED no enciende o enciende fuera de orden, corta esa punta y vuelve a ponchar ese extremo.

5. **Documentar evidencia.** Toma fotos de: el cable ya ordenado antes de insertarlo en el conector (para mostrar el orden de colores), el momento del crimpado, y el resultado en el tester con los LEDs encendidos.

**Entregable:** 2 cables UTP funcionales de 1 metro cada uno (Cable 1 directo 568-B/568-B, Cable 2 cruzado 568-A/568-B) + reporte con fotos del proceso de armado y de la prueba de continuidad, indicando qué norma se usó en cada extremo.

---
La rúbrica de esta práctica la tiene tu docente por separado.
