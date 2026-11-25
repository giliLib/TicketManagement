
import type {
  Ticket,
  TicketStatus,
} from '../types/ticket';
import StatusBadge from './StatusBadge';

interface TicketTableProps {
  tickets: Ticket[];
  savingTicketId: number | null;
  onStatusChange: (
    id: number,
    status: TicketStatus
  ) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

const statuses: TicketStatus[] = [
  'Open',
  'InProgress',
  'Closed',
];

export default function TicketTable({
  tickets,
  savingTicketId,
  onStatusChange,
  onDelete,
}: TicketTableProps) {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Priority</th>
            <th scope="col">Status</th>
            <th scope="col">Created</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>

        <tbody>
          {tickets.map((ticket) => {
            const isRowSaving = savingTicketId === ticket.id;

            return (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.description}</td>

                <td>
                  <span
                    className={`priority-badge priority-${ticket.priority.toLowerCase()}`}
                  >
                    {ticket.priority}
                  </span>
                </td>

                <td>
                  <div className="status-cell">
                    <StatusBadge status={ticket.status} />

                    <select
                      aria-label={`Change status for ${ticket.title}`}
                      value={ticket.status}
                      disabled={isRowSaving}
                      onChange={(event) => {
                        void onStatusChange(
                          ticket.id,
                          event.target.value as TicketStatus
                        ).catch(() => {
                          // Error is handled by useTickets.
                        });
                      }}
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status === 'InProgress'
                            ? 'In Progress'
                            : status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>

                <td>
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    type="button"
                    className="delete-button"
                    disabled={isRowSaving}
                    aria-label={`Delete ${ticket.title}`}
                    onClick={() => {
                      void onDelete(ticket.id).catch(() => {
                        // Error is handled by useTickets.
                      });
                    }}
                  >
                    {isRowSaving ? 'Saving...' : 'Delete'}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
