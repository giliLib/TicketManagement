
using TicketManagement.Application.Models;
using TicketManagement.Domain.Entities;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Application.Interfaces;

public interface ITicketService
{
    Task<IReadOnlyList<Ticket>> GetAllAsync(
        TicketFilter filter,
        CancellationToken cancellationToken = default);

    Task<Ticket> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task<Ticket> CreateAsync(
        string title,
        string description,
        TicketPriority priority,
        CancellationToken cancellationToken = default);

    Task UpdateStatusAsync(
        int id,
        TicketStatus status,
        CancellationToken cancellationToken = default);

    Task DeleteAsync(
        int id,
        CancellationToken cancellationToken = default);
}
