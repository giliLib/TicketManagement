
namespace TicketManagement.Application.Exceptions;

public sealed class TicketNotFoundException : Exception
{
    public TicketNotFoundException(int ticketId)
        : base($"Ticket with ID {ticketId} was not found.")
    {
    }
}
