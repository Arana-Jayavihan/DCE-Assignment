using Microsoft.EntityFrameworkCore;
using Monty_Hall_API.Models.Domain;

namespace Monty_Hall_API.Data
{
    public class ApiContext : DbContext
    {
        
        public ApiContext(DbContextOptions<ApiContext> options) : base(options) 
        {
        }
        public DbSet<MontyHall> MontyHallInstances { get; set; }
    }
}
