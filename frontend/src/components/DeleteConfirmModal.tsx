
import { useEffect, useRef } from 'react';

interface DeleteConfirmModalProps {
  onConfirm: () => Promise<void>;
  onCancel: () => void;
  isDeleting: boolean;
}

export default function DeleteConfirmModal({
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteConfirmModalProps) {
  const cancelButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    cancelButtonRef.current?.focus();
  }, []);

  return (
    <div className="modal-overlay">
      <div
        className="confirm-modal"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
        onKeyDown={(event) => {
          if (event.key === 'Escape' && !isDeleting) {
            onCancel();
          }
        }}
      >
        <div className="modal-icon" aria-hidden="true">
          🗑
        </div>

        <h2 id="delete-modal-title">Delete ticket?</h2>

        <p id="delete-modal-description">
          Are you sure you want to delete this ticket?
          This action cannot be undone.
        </p>

        <div className="modal-actions">
          <button
            ref={cancelButtonRef}
            type="button"
            className="modal-cancel"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-delete"
            onClick={() => void onConfirm()}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete ticket'}
          </button>
        </div>
      </div>
    </div>
  );
}
