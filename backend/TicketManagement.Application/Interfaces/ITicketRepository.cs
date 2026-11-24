
using TicketManagement.Application.Models;
using TicketManagement.Domain.Entities;

namespace TicketManagement.Application.Interfaces;

public interface ITicketRepository
{
    Task<IReadOnlyList<Ticket>> GetAllAsync(
        TicketFilter filter,
        CancellationToken cancellationToken = default);

    Task<Ticket?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default);

    Task AddAsync(
        Ticket ticket,
        CancellationToken cancellationToken = default);

    void Remove(Ticket ticket);

    Task SaveChangesAsync(
        CancellationToken cancellationToken = default);
}
