
using TicketManagement.Domain.Enums;

namespace TicketManagement.Api.DTOs;

public sealed record TicketResponse(
    int Id,
    string Title,
    string Description,
    TicketPriority Priority,
    TicketStatus Status,
    DateTime CreatedAt
);
