import { useEffect, useRef } from "react";

interface RowActionsMenuProps {
  open: boolean;
  onToggle: () => void;
  onVerDetalle: () => void;
  onEditar: () => void;
  onCambiarEstado: () => void;
  onEliminar: () => void;
}

function RowActionsMenu({
  open,
  onToggle,
  onVerDetalle,
  onEditar,
  onCambiarEstado,
  onEliminar,
}: RowActionsMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onToggle();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, onToggle]);

  return (
    <div className="row-actions" ref={containerRef}>
      <button
        type="button"
        className="row-actions-trigger"
        onClick={onToggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Abrir acciones"
      >
        ⋮
      </button>

      {open && (
        <div className="row-actions-menu" role="menu">
          <button type="button" role="menuitem" onClick={onVerDetalle}>
            Ver detalle
          </button>

          <button type="button" role="menuitem" onClick={onEditar}>
            Editar
          </button>

          <button type="button" role="menuitem" onClick={onCambiarEstado}>
            Cambiar estado
          </button>

          <button
            type="button"
            role="menuitem"
            className="row-actions-danger"
            onClick={onEliminar}
          >
            Eliminar
          </button>
        </div>
      )}
    </div>
  );
}

export default RowActionsMenu;
