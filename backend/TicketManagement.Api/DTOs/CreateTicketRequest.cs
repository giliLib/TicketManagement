
using System.ComponentModel.DataAnnotations;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Api.DTOs;

public sealed class CreateTicketRequest
{
    [Required]
    [StringLength(200, MinimumLength = 1)]
    [RegularExpression(@".*\S.*",
        ErrorMessage = "Title cannot be empty.")]
    public string Title { get; init; } = string.Empty;

    [Required]
    [StringLength(2000, MinimumLength = 1)]
    [RegularExpression(@"[\s\S]*\S[\s\S]*",
        ErrorMessage = "Description cannot be empty.")]
    public string Description { get; init; } = string.Empty;

    [Required]
    [EnumDataType(typeof(TicketPriority))]
    public TicketPriority? Priority { get; init; }
}
