
using System.ComponentModel.DataAnnotations;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Api.DTOs;

public sealed class UpdateTicketStatusRequest
{
    [Required]
    [EnumDataType(typeof(TicketStatus))]
    public TicketStatus? Status { get; init; }
}
