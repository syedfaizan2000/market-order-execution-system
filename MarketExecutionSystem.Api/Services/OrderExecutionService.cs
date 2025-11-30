using MarketExecutionSystem.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace MarketExecutionSystem.Api.Services;

public class OrderExecutionService
{
    private readonly AppDbContext _context;
    private readonly ILogger<OrderExecutionService> _logger;

    public OrderExecutionService(AppDbContext context, ILogger<OrderExecutionService> logger)
    {
        _context = context;
        _logger = logger;
    }

    public async Task ExecutePendingOrdersAsync(string symbol, decimal marketPrice, CancellationToken cancellationToken = default)
    {
        var pendingOrders = await _context.Orders
            .Where(o => o.Symbol == symbol && o.Status == "Pending")
            .ToListAsync(cancellationToken);

        if (!pendingOrders.Any())
            return;

        foreach (var order in pendingOrders)
        {
            bool shouldExecute =
                (order.OrderType.Equals("Buy", StringComparison.OrdinalIgnoreCase) && order.Price >= marketPrice) ||
                (order.OrderType.Equals("Sell", StringComparison.OrdinalIgnoreCase) && order.Price <= marketPrice);

            if (!shouldExecute)
                continue;

            order.Status = "Executed";

            _context.TradeLogs.Add(new Models.TradeLog
            {
                OrderId = order.OrderId,
                Symbol = order.Symbol,
                ExecutedPrice = marketPrice,
                Quantity = order.Quantity,
                TimeExecuted = DateTime.UtcNow
            });

            _logger.LogInformation("Executed {OrderType} order {OrderId} for {Symbol} at {Price}",
                order.OrderType, order.OrderId, order.Symbol, marketPrice);
        }

        await _context.SaveChangesAsync(cancellationToken);
    }
}