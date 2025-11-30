# MarketExecutionSystem Demo (.NET 8 + SQL Server)

This is a demo **Real-Time Market Order Execution System** built with **ASP.NET Core 8 Web API** and **Entity Framework Core (SQL Server)**.

## Features

- Place Buy/Sell orders via REST API
- Background market price simulator
- Automatic order execution when price conditions match
- Trade logs stored in SQL Server
- Swagger UI enabled

## How to Run

1. Update your connection string in `appsettings.json`:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=.;Database=MarketExecutionDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

2. From the `MarketExecutionSystem.Api` folder, run:

```bash
dotnet restore
dotnet ef migrations add InitialCreate
dotnet ef database update
dotnet run
```

3. Open Swagger UI in browser:

```
https://localhost:5001/swagger
```

4. Place an order:

- `POST /api/orders`
- Body:

```json
{
  "symbol": "PSX-OGDC",
  "orderType": "Buy",
  "quantity": 100,
  "price": 110
}
```

5. Watch the logs. When the simulated market price hits your condition,
   the order will be executed and a record will be added to `TradeLogs` table.

## Project Structure

- `Models/Order.cs` — order entity
- `Models/TradeLog.cs` — trade log entity
- `Data/AppDbContext.cs` — EF Core DB context
- `Services/MarketPriceSimulator.cs` — background hosted service generating ticks
- `Services/OrderExecutionService.cs` — executes pending orders
- `Controllers/OrdersController.cs` — REST API to place & view orders
- `Controllers/TradesController.cs` — REST API to view trade logs