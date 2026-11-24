
using Microsoft.EntityFrameworkCore;
using TicketManagement.Application.Interfaces;
using TicketManagement.Application.Models;
using TicketManagement.Domain.Entities;
using TicketManagement.Infrastructure.Data;

namespace TicketManagement.Infrastructure.Repositories;

public sealed class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _context;

    public TicketRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IReadOnlyList<Ticket>> GetAllAsync(
        TicketFilter filter,
        CancellationToken cancellationToken = default)
    {
        IQueryable<Ticket> query = _context.Tickets
            .AsNoTracking();

        if (filter.Status.HasValue)
        {
            query = query.Where(
                t => t.Status == filter.Status.Value);
        }

        if (filter.Priority.HasValue)
        {
            query = query.Where(
                t => t.Priority == filter.Priority.Value);
        }

        if (!string.IsNullOrWhiteSpace(filter.Search))
        {
            var search = filter.Search.Trim();

            query = query.Where(
                t => t.Title.Contains(search));
        }

        return await query
            .OrderByDescending(t => t.CreatedAt)
            .ThenByDescending(t => t.Id)
            .ToListAsync(cancellationToken);
    }

    public Task<Ticket?> GetByIdAsync(
        int id,
        CancellationToken cancellationToken = default)
    {
        return _context.Tickets
            .FirstOrDefaultAsync(
                t => t.Id == id,
                cancellationToken);
    }

    public async Task AddAsync(
        Ticket ticket,
        CancellationToken cancellationToken = default)
    {
        await _context.Tickets.AddAsync(
            ticket,
            cancellationToken);
    }

    public void Remove(Ticket ticket)
    {
        _context.Tickets.Remove(ticket);
    }

    public async Task SaveChangesAsync(
        CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
