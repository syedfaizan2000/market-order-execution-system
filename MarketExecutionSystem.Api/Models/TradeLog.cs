using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MarketExecutionSystem.Api.Models;

public class TradeLog
{
    [Key]
    public long TradeId { get; set; }

    [ForeignKey(nameof(Order))]
    public long OrderId { get; set; }

    public Order? Order { get; set; }

    [Required, MaxLength(20)]
    public string Symbol { get; set; } = string.Empty;

    public decimal ExecutedPrice { get; set; }

    public int Quantity { get; set; }

    public DateTime TimeExecuted { get; set; } = DateTime.UtcNow;
}