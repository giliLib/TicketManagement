
using Moq;
using TicketManagement.Application.Exceptions;
using TicketManagement.Application.Interfaces;
using TicketManagement.Application.Models;
using TicketManagement.Application.Services;
using TicketManagement.Domain.Entities;
using TicketManagement.Domain.Enums;
using Xunit;

namespace TicketManagement.Tests.Services;

public sealed class TicketServiceTests
{
    private readonly Mock<ITicketRepository> _repositoryMock;
    private readonly TicketService _service;

    public TicketServiceTests()
    {
        _repositoryMock = new Mock<ITicketRepository>();
        _service = new TicketService(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ValidData_AddsAndReturnsTicket()
    {
        // Arrange
        const string title = "Login issue";
        const string description = "User cannot log in";

        // Act
        var result = await _service.CreateAsync(
            title,
            description,
            TicketPriority.High);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(title, result.Title);
        Assert.Equal(description, result.Description);
        Assert.Equal(TicketPriority.High, result.Priority);
        Assert.Equal(TicketStatus.Open, result.Status);

        _repositoryMock.Verify(
            repository => repository.AddAsync(
                It.Is<Ticket>(ticket =>
                    ticket.Title == title &&
                    ticket.Priority == TicketPriority.High),
                It.IsAny<CancellationToken>()),
            Times.Once);

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task CreateAsync_EmptyTitle_ThrowsException()
    {
        // Act & Assert
        await Assert.ThrowsAnyAsync<ArgumentException>(
            () => _service.CreateAsync(
                "",
                "Valid description",
                TicketPriority.Medium));

        _repositoryMock.Verify(
            repository => repository.AddAsync(
                It.IsAny<Ticket>(),
                It.IsAny<CancellationToken>()),
            Times.Never);

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task GetByIdAsync_ExistingTicket_ReturnsTicket()
    {
        // Arrange
        var ticket = new Ticket(
            "Login issue",
            "Cannot log in",
            TicketPriority.High);

        _repositoryMock.Setup(
            repository => repository.GetByIdAsync(
                1,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ticket);

        // Act
        var result = await _service.GetByIdAsync(1);

        // Assert
        Assert.Same(ticket, result);
    }

    [Fact]
    public async Task GetByIdAsync_NonExistingTicket_ThrowsNotFound()
    {
        // Arrange
        _repositoryMock.Setup(
            repository => repository.GetByIdAsync(
                999,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync((Ticket?)null);

        // Act & Assert
        await Assert.ThrowsAsync<TicketNotFoundException>(
            () => _service.GetByIdAsync(999));
    }

    [Fact]
    public async Task UpdateStatusAsync_ExistingTicket_UpdatesAndSaves()
    {
        // Arrange
        var ticket = new Ticket(
            "Login issue",
            "Cannot log in",
            TicketPriority.Medium);

        _repositoryMock.Setup(
            repository => repository.GetByIdAsync(
                1,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ticket);

        // Act
        await _service.UpdateStatusAsync(
            1,
            TicketStatus.Closed);

        // Assert
        Assert.Equal(TicketStatus.Closed, ticket.Status);

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task UpdateStatusAsync_NonExistingTicket_ThrowsNotFound()
    {
        // Act & Assert
        await Assert.ThrowsAsync<TicketNotFoundException>(
            () => _service.UpdateStatusAsync(
                999,
                TicketStatus.Closed));

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task DeleteAsync_ExistingTicket_RemovesAndSaves()
    {
        // Arrange
        var ticket = new Ticket(
            "Login issue",
            "Cannot log in",
            TicketPriority.Low);

        _repositoryMock.Setup(
            repository => repository.GetByIdAsync(
                1,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(ticket);

        // Act
        await _service.DeleteAsync(1);

        // Assert
        _repositoryMock.Verify(
            repository => repository.Remove(ticket),
            Times.Once);

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_NonExistingTicket_ThrowsNotFound()
    {
        // Act & Assert
        await Assert.ThrowsAsync<TicketNotFoundException>(
            () => _service.DeleteAsync(999));

        _repositoryMock.Verify(
            repository => repository.Remove(
                It.IsAny<Ticket>()),
            Times.Never);

        _repositoryMock.Verify(
            repository => repository.SaveChangesAsync(
                It.IsAny<CancellationToken>()),
            Times.Never);
    }

    [Fact]
    public async Task GetAllAsync_NullFilter_ThrowsArgumentNullException()
    {
        // Act & Assert
        await Assert.ThrowsAsync<ArgumentNullException>(
            () => _service.GetAllAsync(null!));
    }

    [Fact]
    public async Task GetAllAsync_ValidFilter_CallsRepository()
    {
        // Arrange
        var filter = new TicketFilter();

        IReadOnlyList<Ticket> expected = new List<Ticket>
        {
            new Ticket(
                "Login issue",
                "Cannot log in",
                TicketPriority.High)
        };

        _repositoryMock.Setup(
            repository => repository.GetAllAsync(
                filter,
                It.IsAny<CancellationToken>()))
            .ReturnsAsync(expected);

        // Act
        var result = await _service.GetAllAsync(filter);

        // Assert
        Assert.Same(expected, result);

        _repositoryMock.Verify(
            repository => repository.GetAllAsync(
                filter,
                It.IsAny<CancellationToken>()),
            Times.Once);
    }
}
