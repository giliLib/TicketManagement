
import { useState } from 'react';
import { useTickets } from '../hooks/useTickets';
import { useDebounce } from '../hooks/useDebounce';
import TicketForm from '../components/TicketForm';
import TicketFilters from '../components/TicketFilters';
import TicketTable from '../components/TicketTable';
import DeleteConfirmModal from '../components/DeleteConfirmModal';

import type {
  TicketFilters as TicketFiltersType,
  TicketStatus,
} from '../types/ticket';

export default function TicketsPage() {
  const [filters, setFilters] = useState<TicketFiltersType>({
    search: '',
  });

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const debouncedSearch = useDebounce(filters.search ?? '', 300);

  const {
    tickets,
    isLoading,
    isCreating,
    savingTicketId,
    loadError,
    actionError,
    refresh,
    createTicket,
    updateStatus,
    deleteTicket,
  } = useTickets({
    ...filters,
    search: debouncedSearch,
  });

  // Open the confirmation modal instead of deleting immediately
  const handleDelete = async (id: number): Promise<void> => {
    setTicketToDelete(id);
  };

  // Delete only after the user confirms
  const confirmDelete = async (): Promise<void> => {
    if (ticketToDelete === null || isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTicket(ticketToDelete);
      setTicketToDelete(null);
    } catch {
      // The error is displayed by useTickets.
      setTicketToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusChange = async (
    id: number,
    status: TicketStatus
  ): Promise<void> => {
    await updateStatus(id, status);
  };

  return (
    <main>
      <header className="page-header">
        <div>
          <h1>Ticket Management</h1>
          <p>Manage and track support tickets.</p>
        </div>

        <button
          type="button"
          className="create-button"
          onClick={() => setShowCreateForm(true)}
          disabled={showCreateForm}
        >
          + New Ticket
        </button>
      </header>

      {showCreateForm && (
        <TicketForm
          isSaving={isCreating}
          onCancel={() => setShowCreateForm(false)}
          onSubmit={async (data) => {
            await createTicket(data);
            setShowCreateForm(false);
          }}
        />
      )}

      <TicketFilters
        filters={filters}
        onChange={setFilters}
      />

      {actionError && (
        <p role="alert" className="error-message">
          {actionError}
        </p>
      )}

      {loadError && (
        <div className="error-message" role="alert">
          <p>{loadError}</p>
          <button
            type="button"
            onClick={() => void refresh()}
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && (
        <p role="status">Loading tickets...</p>
      )}

      {!isLoading && !loadError && tickets.length === 0 && (
        <p className="empty-state">
          No tickets found.
        </p>
      )}

      {tickets.length > 0 && (
        <TicketTable
          tickets={tickets}
          savingTicketId={savingTicketId}
          onStatusChange={handleStatusChange}
          onDelete={handleDelete}
        />
      )}

      {ticketToDelete !== null && (
        <DeleteConfirmModal
          onConfirm={confirmDelete}
          onCancel={() => {
            if (!isDeleting) {
              setTicketToDelete(null);
            }
          }}
          isDeleting={isDeleting}
        />
      )}
    </main>
  );
}
