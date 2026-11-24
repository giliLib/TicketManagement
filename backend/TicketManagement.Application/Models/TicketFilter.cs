
using TicketManagement.Domain.Enums;

namespace TicketManagement.Application.Models;

public sealed record TicketFilter(
    TicketStatus? Status = null,
    TicketPriority? Priority = null,
    string? Search = null
);
