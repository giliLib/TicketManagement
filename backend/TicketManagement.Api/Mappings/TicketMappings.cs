
using TicketManagement.Api.DTOs;
using TicketManagement.Domain.Entities;

namespace TicketManagement.Api.Mappings;

public static class TicketMappings
{
    public static TicketResponse ToResponse(this Ticket ticket)
    {
        return new TicketResponse(
            ticket.Id,
            ticket.Title,
            ticket.Description,
            ticket.Priority,
            ticket.Status,
            ticket.CreatedAt
        );
    }
}
