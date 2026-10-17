import Link from 'next/link';
import { formatearFecha, yaPaso } from '../lib/formato';
import estilos from './TarjetaTaller.module.css';

// PASO 3: tarjeta de un taller. Recibe el objeto tal como lo manda GET /api/talleres.
export default function TarjetaTaller({ taller }) {
  // TODO paso 3: etiqueta Próximo / Ya pasó, nombre, instructor, fecha, cupo y enlace al detalle.
  return (
    <article className={estilos.tarjeta}>
      <h3>{taller.nombre}</h3>
    </article>
  );
}
