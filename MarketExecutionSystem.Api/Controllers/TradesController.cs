using MarketExecutionSystem.Api.Data;
using MarketExecutionSystem.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MarketExecutionSystem.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TradesController : ControllerBase
{
    private readonly AppDbContext _context;

    public TradesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TradeLog>>> GetTrades()
    {
        return await _context.TradeLogs
            .OrderByDescending(t => t.TimeExecuted)
            .Take(200)
            .ToListAsync();
    }
}