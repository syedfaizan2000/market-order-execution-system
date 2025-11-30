using MarketExecutionSystem.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MarketExecutionSystem.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Order> Orders => Set<Order>();
    public DbSet<TradeLog> TradeLogs => Set<TradeLog>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Order>()
            .HasMany(o => o.TradeLogs)
            .WithOne(t => t.Order!)
            .HasForeignKey(t => t.OrderId);
    }
}