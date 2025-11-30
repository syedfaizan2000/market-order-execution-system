using System.ComponentModel.DataAnnotations;

namespace MarketExecutionSystem.Api.Models;

public class Order
{
    [Key]
    public long OrderId { get; set; }

    [Required, MaxLength(20)]
    public string Symbol { get; set; } = string.Empty;

    [Required, MaxLength(10)]
    public string OrderType { get; set; } = "Buy"; // Buy / Sell

    [Range(1, int.MaxValue)]
    public int Quantity { get; set; }

    [Range(0.01, double.MaxValue)]
    public decimal Price { get; set; }

    [MaxLength(20)]
    public string Status { get; set; } = "Pending"; // Pending / Executed / Failed

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TradeLog> TradeLogs { get; set; } = new List<TradeLog>();
}