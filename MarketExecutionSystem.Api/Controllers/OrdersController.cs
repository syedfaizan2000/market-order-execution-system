using MarketExecutionSystem.Api.Data;
using MarketExecutionSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketExecutionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(AppDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        return await _context.Orders
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync();
    }

    [HttpGet("{id:long}")]
    public async Task<ActionResult<Order>> GetOrder(long id)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();
        return order;
    }

    public record PlaceOrderRequest(string Symbol, string OrderType, int Quantity, decimal Price);

    [HttpPost]
    public async Task<ActionResult<Order>> PlaceOrder([FromBody] PlaceOrderRequest request)
    {
        if (!new[] { "Buy", "Sell" }.Contains(request.OrderType, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest("OrderType must be 'Buy' or 'Sell'.");
        }

        var order = new Order
        {
            Symbol = request.Symbol,
            OrderType = request.OrderType,
            Quantity = request.Quantity,
            Price = request.Price,
            Status = "Pending",
            CreatedAt = DateTime.UtcNow
        };

        _context.Orders.Add(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Placed {OrderType} order {OrderId} for {Symbol} at {Price}",
            order.OrderType, order.OrderId, order.Symbol, order.Price);

        return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, order);
    }
}