using MarketExecutionSystem.Api.Data;
using MarketExecutionSystem.Api.Hubs;
using MarketExecutionSystem.Api.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// ======================
// CORS (Allow React App)
// ======================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy.WithOrigins("http://localhost:5173")
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials());
});

// ======================
// ⭐ In-Memory Database
// ======================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseInMemoryDatabase("MarketExecutionDb"));   // ← .NET 8 valid!

// ======================
// Services + Hosted Jobs
// ======================
builder.Services.AddControllers();
builder.Services.AddSignalR();   // Register Hub support
builder.Services.AddHostedService<MarketPriceSimulator>();
builder.Services.AddScoped<OrderExecutionService>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ======================
// Dev tools
// ======================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ======================
// Pipeline
// ======================
app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();
app.MapHub<MarketHub>("/marketHub");

app.Run();
