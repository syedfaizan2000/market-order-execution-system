using MarketExecutionSystem.Api.Hubs;
using MarketExecutionSystem.Api.Services;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

public class MarketPriceSimulator : BackgroundService
{
    private readonly ILogger<MarketPriceSimulator> _logger;
    private readonly IServiceProvider _serviceProvider;
    private readonly IHubContext<MarketHub> _hub;

    private readonly Random _random = new();
    private readonly string[] _symbols = { "PSX-OGDC", "PSX-HBL", "PSX-ENGRO" };

    public MarketPriceSimulator(
        ILogger<MarketPriceSimulator> logger,
        IServiceProvider serviceProvider,
        IHubContext<MarketHub> hub)
    {
        _logger = logger;
        _serviceProvider = serviceProvider;
        _hub = hub;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("🔥 Market Price Simulator Running with WebSocket Feed");

        while (!stoppingToken.IsCancellationRequested)
        {
            var symbol = _symbols[_random.Next(_symbols.Length)];
            var price = Math.Round((decimal)_random.NextDouble() * 100m + 50m, 2);

            var tick = new { symbol, price, time = DateTime.UtcNow };

            // **Send live tick to React**
            await _hub.Clients.All.SendAsync("priceUpdate", tick, stoppingToken);

            // **Execute pending orders when condition meets**
            using var scope = _serviceProvider.CreateScope();
            var executor = scope.ServiceProvider.GetRequiredService<OrderExecutionService>();
            await executor.ExecutePendingOrdersAsync(symbol, price, stoppingToken);

            await Task.Delay(1000, stoppingToken); // live update every second
        }
    }
}
