interface AvisoDialogProps {
  title: string;
  message: string;
  buttonLabel?: string;
  onClose: () => void;
}

function AvisoDialog({
  title,
  message,
  buttonLabel = "Entendido",
  onClose,
}: AvisoDialogProps) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="aviso-dialog-title"
        aria-describedby="aviso-dialog-message"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 id="aviso-dialog-title">{title}</h3>
        <p id="aviso-dialog-message" className="modal-message">
          {message}
        </p>

        <div className="modal-actions">
          <button type="button" className="btn btn-primary" onClick={onClose} autoFocus>
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AvisoDialog;
