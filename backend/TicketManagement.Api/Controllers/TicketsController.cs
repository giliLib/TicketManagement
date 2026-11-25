
using Microsoft.AspNetCore.Mvc;
using TicketManagement.Api.DTOs;
using TicketManagement.Api.Mappings;
using TicketManagement.Application.Interfaces;
using TicketManagement.Application.Models;

namespace TicketManagement.Api.Controllers;

[ApiController]
[Route("api/tickets")]
public sealed class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TicketResponse>>> GetAll(
        [FromQuery] TicketFilterRequest request,
        CancellationToken cancellationToken)
    {
        var filter = new TicketFilter(
            request.Status,
            request.Priority,
            request.Search);

        var tickets = await _ticketService.GetAllAsync(
            filter, cancellationToken);

        return Ok(tickets.Select(t => t.ToResponse()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TicketResponse>> GetById(
        int id,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketService.GetByIdAsync(
            id, cancellationToken);

        return Ok(ticket.ToResponse());
    }

    [HttpPost]
    public async Task<ActionResult<TicketResponse>> Create(
        [FromBody] CreateTicketRequest request,
        CancellationToken cancellationToken)
    {
        var ticket = await _ticketService.CreateAsync(
            request.Title,
            request.Description,
            request.Priority!.Value,
            cancellationToken);

        var response = ticket.ToResponse();

        return CreatedAtAction(
            nameof(GetById),
            new { id = response.Id },
            response);
    }

    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] UpdateTicketStatusRequest request,
        CancellationToken cancellationToken)
    {
        await _ticketService.UpdateStatusAsync(
            id,
            request.Status!.Value,
            cancellationToken);

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        int id,
        CancellationToken cancellationToken)
    {
        await _ticketService.DeleteAsync(
            id, cancellationToken);

        return NoContent();
    }
}
