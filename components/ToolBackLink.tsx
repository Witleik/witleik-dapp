import Link from "next/link";

/* Enlace de "volver" reutilizable para todas las páginas de /herramientas/*.
   Colócalo arriba del todo, antes del título de la herramienta. */
export function ToolBackLink() {
  return (
    <Link
      href="/herramientas"
      className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#23e7ff] transition-colors hover:text-[#7af2ff]"
    >
      <span aria-hidden="true">←</span>
      Volver a Herramientas
    </Link>
  );
}
