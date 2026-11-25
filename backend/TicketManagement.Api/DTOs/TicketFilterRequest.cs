
using System.ComponentModel.DataAnnotations;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Api.DTOs;

public sealed class TicketFilterRequest
{
    [EnumDataType(typeof(TicketStatus))]
    public TicketStatus? Status { get; init; }

    [EnumDataType(typeof(TicketPriority))]
    public TicketPriority? Priority { get; init; }

    public string? Search { get; init; }
}
