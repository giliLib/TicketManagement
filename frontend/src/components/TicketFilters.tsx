
import type {
  TicketFilters as TicketFiltersType,
  TicketPriority,
  TicketStatus,
} from '../types/ticket';

interface TicketFiltersProps {
  filters: TicketFiltersType;
  onChange: (filters: TicketFiltersType) => void;
}

const statuses: TicketStatus[] = [
  'Open',
  'InProgress',
  'Closed',
];

const priorities: TicketPriority[] = [
  'Low',
  'Medium',
  'High',
];

export default function TicketFilters({
  filters,
  onChange,
}: TicketFiltersProps) {
  return (
    <section
      className="ticket-filters"
      aria-label="Ticket filters"
    >
      <input
        type="search"
        aria-label="Search tickets"
        placeholder="Search by title..."
        value={filters.search ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            search: event.target.value,
          })
        }
      />

      <select
        aria-label="Filter by status"
        value={filters.status ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            status: event.target.value
              ? (event.target.value as TicketStatus)
              : undefined,
          })
        }
      >
        <option value="">All statuses</option>
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status === 'InProgress' ? 'In Progress' : status}
          </option>
        ))}
      </select>

      <select
        aria-label="Filter by priority"
        value={filters.priority ?? ''}
        onChange={(event) =>
          onChange({
            ...filters,
            priority: event.target.value
              ? (event.target.value as TicketPriority)
              : undefined,
          })
        }
      >
        <option value="">All priorities</option>
        {priorities.map((priority) => (
          <option key={priority} value={priority}>
            {priority}
          </option>
        ))}
      </select>
    </section>
  );
}
