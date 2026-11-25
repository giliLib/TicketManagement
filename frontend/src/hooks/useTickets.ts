
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { ticketsApi } from '../api/ticketsApi';

import type {
  Ticket,
  TicketFilters,
  CreateTicketRequest,
  TicketStatus,
} from '../types/ticket';

export function useTickets(filters: TicketFilters) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [savingTicketId, setSavingTicketId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { status, priority, search } = filters;

  const activeController = useRef<AbortController | null>(null);
  const requestVersion = useRef(0);
  const mutationVersion = useRef(0);
  const filtersRef = useRef(filters);
  filtersRef.current = filters;

  const matchesFilters = (ticket: Ticket) => {
    const current = filtersRef.current;

    return (
      (!current.status || ticket.status === current.status) &&
      (!current.priority || ticket.priority === current.priority) &&
      (!current.search?.trim() ||
        ticket.title.toLowerCase().includes(
          current.search.trim().toLowerCase()
        ))
    );
  };

  const loadTickets = useCallback(async () => {
    activeController.current?.abort();

    const controller = new AbortController();
    activeController.current = controller;

    const version = ++requestVersion.current;
    const currentMutation = mutationVersion.current;

    setIsLoading(true);
    setLoadError(null);

    try {
      const data = await ticketsApi.getAll(
        { status, priority, search },
        controller.signal
      );

      if (
        !controller.signal.aborted &&
        version === requestVersion.current &&
        currentMutation === mutationVersion.current
      ) {
        setTickets(data);
      }
    } catch (error) {
      if (
        !controller.signal.aborted &&
        version === requestVersion.current
      ) {
        setLoadError(
          error instanceof Error
            ? error.message
            : 'Failed to load tickets.'
        );
      }
    } finally {
      if (
        !controller.signal.aborted &&
        version === requestVersion.current
      ) {
        setIsLoading(false);
      }
    }
  }, [status, priority, search]);

  useEffect(() => {
    void loadTickets();

    return () => {
      activeController.current?.abort();
    };
  }, [loadTickets]);

  const createTicket = async (
    data: CreateTicketRequest
  ) => {
    setIsCreating(true);
    setActionError(null);

    try {
      const created = await ticketsApi.create(data);

      mutationVersion.current++;
activeController.current?.abort();

      if (matchesFilters(created)) {
        setTickets((prev) => [created, ...prev]);
      }

      return created;
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to create ticket.'
      );
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateStatus = async (
    id: number,
    newStatus: TicketStatus
  ) => {
    setSavingTicketId(id);
    setActionError(null);

    try {
      await ticketsApi.updateStatus(id, {
        status: newStatus,
      });

      mutationVersion.current++;
activeController.current?.abort();

      setTickets((prev) =>
        prev
          .map((ticket) =>
            ticket.id === id
              ? { ...ticket, status: newStatus }
              : ticket
          )
          .filter(matchesFilters)
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to update ticket.'
      );
      throw error;
    } finally {
      setSavingTicketId(null);
    }
  };

  const deleteTicket = async (id: number) => {
    setSavingTicketId(id);
    setActionError(null);

    try {
      await ticketsApi.delete(id);

      mutationVersion.current++;
activeController.current?.abort();

      setTickets((prev) =>
        prev.filter((ticket) => ticket.id !== id)
      );
    } catch (error) {
      setActionError(
        error instanceof Error
          ? error.message
          : 'Failed to delete ticket.'
      );
      throw error;
    } finally {
      setSavingTicketId(null);
    }
  };

  return {
    tickets,
    isLoading,
    isCreating,
    savingTicketId,
    loadError,
    actionError,
    refresh: loadTickets,
    createTicket,
    updateStatus,
    deleteTicket,
  };
}
