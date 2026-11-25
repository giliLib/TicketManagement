
using TicketManagement.Application.Exceptions;
using TicketManagement.Application.Interfaces;
using TicketManagement.Application.Models;
using TicketManagement.Domain.Entities;
using TicketManagement.Domain.Enums;

namespace TicketManagement.Application.Services;

public sealed class TicketService : ITicketService
{
    private readonly ITicketRepository _repository;

    public TicketService(ITicketRepository repository)
    {
        _repository = repository;
    }

    public Task<IReadOnlyList<Ticket>> GetAllAsync(
        TicketFilter filter,
        CancellationToken cancellationToken = default)
    {
        ArgumentNullException.ThrowIfNull(filter);

        return _repository.GetAllAsync(
            filter,
            cancellationToken);
    }

    public async Task<Ticket> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var ticket = await _repository.GetByIdAsync(
            id,
            cancellationToken);

        return ticket ?? throw new TicketNotFoundException(id);
    }

    public async Task<Ticket> CreateAsync(
        string title,
        string description,
        TicketPriority priority,
        CancellationToken cancellationToken = default)
    {
        var ticket = new Ticket(
            title,
            description,
            priority);

        await _repository.AddAsync(
            ticket,
            cancellationToken);

        await _repository.SaveChangesAsync(cancellationToken);

        return ticket;
    }

    public async Task UpdateStatusAsync(
        int id,
        TicketStatus status,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetByIdAsync(
            id,
            cancellationToken);

        ticket.UpdateStatus(status);

        await _repository.SaveChangesAsync(cancellationToken);
    }

    public async Task DeleteAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        var ticket = await GetByIdAsync(
            id,
            cancellationToken);

        _repository.Remove(ticket);

        await _repository.SaveChangesAsync(cancellationToken);
    }
}
