
import { useState, type FormEvent } from 'react';
import type {
  CreateTicketRequest,
  TicketPriority,
} from '../types/ticket';

interface TicketFormProps {
  onSubmit: (data: CreateTicketRequest) => Promise<void>;
  onCancel: () => void;
  isSaving: boolean;
}

interface FormErrors {
  title?: string;
  description?: string;
}

export default function TicketForm({
  onSubmit,
  onCancel,
  isSaving,
}: TicketFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TicketPriority>('Medium');

  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    const newErrors: FormErrors = {};

    if (!trimmedTitle) {
      newErrors.title = 'Title is required.';
    }

    if (!trimmedDescription) {
      newErrors.description = 'Description is required.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setSubmitError(null);

    try {
      await onSubmit({
        title: trimmedTitle,
        description: trimmedDescription,
        priority,
      });
    } catch {
      setSubmitError('Failed to create ticket. Please try again.');
    }
  };

  return (
    <form
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      <h2>Create New Ticket</h2>

      {submitError && (
        <p role="alert" className="field-error">
          {submitError}
        </p>
      )}

      <div className="form-field">
        <label htmlFor="ticket-title">Title</label>

        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(event) => {
            const value = event.target.value;
            setTitle(value);

            if (value.trim()) {
              setErrors((prev) => ({
                ...prev,
                title: undefined,
              }));
            }
          }}
          maxLength={200}
          disabled={isSaving}
          aria-invalid={Boolean(errors.title)}
          aria-describedby={
            errors.title ? 'title-error' : undefined
          }
        />

        {errors.title && (
          <span
            id="title-error"
            className="field-error"
            role="alert"
          >
            {errors.title}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="ticket-description">
          Description
        </label>

        <textarea
          id="ticket-description"
          value={description}
          onChange={(event) => {
            const value = event.target.value;
            setDescription(value);

            if (value.trim()) {
              setErrors((prev) => ({
                ...prev,
                description: undefined,
              }));
            }
          }}
          maxLength={2000}
          disabled={isSaving}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description
              ? 'description-error'
              : undefined
          }
        />

        {errors.description && (
          <span
            id="description-error"
            className="field-error"
            role="alert"
          >
            {errors.description}
          </span>
        )}
      </div>

      <div className="form-field">
        <label htmlFor="ticket-priority">
          Priority
        </label>

        <select
          id="ticket-priority"
          value={priority}
          onChange={(event) =>
            setPriority(event.target.value as TicketPriority)
          }
          disabled={isSaving}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>

        <button type="submit" disabled={isSaving}>
          {isSaving ? 'Creating...' : 'Create Ticket'}
        </button>
      </div>
    </form>
  );
}
