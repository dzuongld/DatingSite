using DatingSite.API.Models;
using Microsoft.EntityFrameworkCore;

namespace DatingSite.API.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Like> Likes { get; set; }

        // define what OnModelCreating will do to create Like entity
        protected override void OnModelCreating(ModelBuilder builder)
        {
            // id is combination of liker and likee id
            builder.Entity<Like>()
                .HasKey(k => new { k.LikerId, k.LikeeId });

            // one user can like many and be liked by many
            builder.Entity<Like>()
                .HasOne(u => u.Likee)
                .WithMany(u => u.Likers)
                .HasForeignKey(u => u.LikeeId)
                .OnDelete(DeleteBehavior.Restrict); // not remove user when removing a like
        }
    }

}


