
using TicketManagement.Domain.Constants;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Domain.Entities;

public class Ticket
{
    public int Id { get; private set; }

    public string Title { get; private set; } = string.Empty;

    public string Description { get; private set; } = string.Empty;

    public TicketPriority Priority { get; private set; }

    public TicketStatus Status { get; private set; }

    public DateTime CreatedAt { get; private set; }

    private Ticket() { }

    public Ticket(
        string title,
        string description,
        TicketPriority priority)
    {
        if (string.IsNullOrWhiteSpace(title))
            throw new ArgumentException(
                ErrorMessages.TitleRequired,
                nameof(title));

        if (string.IsNullOrWhiteSpace(description))
            throw new ArgumentException(
                ErrorMessages.DescriptionRequired,
                nameof(description));

        if (!Enum.IsDefined(priority))
            throw new ArgumentOutOfRangeException(
                nameof(priority),
                ErrorMessages.InvalidPriority);

        Title = title.Trim();
        Description = description.Trim();
        Priority = priority;
        Status = TicketStatus.Open;
        CreatedAt = DateTime.UtcNow;
    }

    public void UpdateStatus(TicketStatus status)
    {
        if (!Enum.IsDefined(status))
            throw new ArgumentOutOfRangeException(
                nameof(status),
                ErrorMessages.InvalidStatus);

        Status = status;
    }
}
