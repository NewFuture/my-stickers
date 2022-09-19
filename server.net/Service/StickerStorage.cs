namespace Stickers.Service
{
    using Dapper;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.Data.SqlClient;
    using Stickers.Entities;

    public class StickerStorage
    {
        private DapperContext context = null;

        public StickerStorage(DapperContext context)
        {
            this.context = context;
        }
        public async Task<List<Sticker>>  getUserStickers(string id)
        {
            var query = "SELECT * FROM Stickers where userId = @userId";
            using (var connection = context.CreateConnection())
            {
                var companies = await connection.QueryAsync<Sticker>(query, id);
                return companies.ToList();
            }
        }
        public async Task<bool> deleteUserSticker(string userId, string stickerId)
        {
            var query = "delete FROM Stickers where userId = @userId and stickerId=@stickerId";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, stickerId = stickerId });
                return ItemCount > 0;
            }
        }

        public async Task<bool> updateStickerName(string userId, string stickerId, string name)
        {
            var query = "update Stickers set name = @name where userId = @userId and stickerId=@stickerId";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, stickerId = stickerId, Name=name });
                return ItemCount > 0;
            }
        }
        public async Task<bool> addUserStickers(string userId, List<string> ids)
        {
            throw new NotImplementedException();
        }
    }
}
