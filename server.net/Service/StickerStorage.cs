namespace Stickers.Service
{
    using Dapper;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.Data.SqlClient;
    using Stickers.Entities;
    using System.Security.Cryptography;

    public class StickerStorage
    {
        private DapperContext context = null;

        public StickerStorage(DapperContext context)
        {
            this.context = context;
        }
        public async Task<List<Sticker>>  getUserStickers(string userid)
        {
            var query = $"SELECT * FROM {ENV.SQL_TABEL_NAME} where userId = @userId order by weight desc ";
            using (var connection = context.CreateConnection())
            {
                var companies = await connection.QueryAsync<Sticker>(query, new { userId = userid });
                return companies.ToList();
            }
        }
        public async Task<bool> deleteUserSticker(string userId, string stickerId)
        {
            var query = $"delete FROM {ENV.SQL_TABEL_NAME} where userId = @userId and Id=@Id";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, Id = stickerId });
                return ItemCount > 0;
            }
        }

        public async Task<bool> updateStickerName(string userId, string stickerId, string name)
        {
            var query = $"update {ENV.SQL_TABEL_NAME} set name = @name where userId = @userId and Id=@Id";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, Id = stickerId, Name=name });
                return ItemCount > 0;
            }
        }
        public async Task<List<Sticker>> addUserStickers(string userId, List<Sticker> stickers)
        {
            var oldstickers = await this.getUserStickers(userId);
            List<Sticker> result = new List<Sticker>();
            using (var connection = context.CreateConnection())
            {
                if (oldstickers != null && oldstickers.Count > 0)
                {
                   var needUpdate = stickers.FindAll(o => oldstickers.Exists(s => s.src == o.src));
                   foreach (var item in needUpdate)
                   {
                        //update and remove from list
                        var updateItem = new
                        {
                            id = item.id,
                            name = item.name,
                            src = item.src,
                            userId = userId,
                            weight = DateTime.Now.Ticks,
                        };
                        string sql = $"update {ENV.SQL_TABEL_NAME} set weight = @weight where userId = @userId and Id=@Id";
                        await connection.ExecuteAsync(sql, updateItem);
                        stickers.Remove(item);
                        result.Add(item);
                    }
                }
           
                foreach (var item in stickers)
                {
                    var newItem = new
                    {
                        id = Guid.NewGuid(),
                        name = item.name,
                        src =item.src,
                        userId= userId,
                        weight = DateTime.Now.Ticks,
                    };
                    string sql = $"INSERT\r\nINTO {ENV.SQL_TABEL_NAME} (id,userId,src,name,weight)\r\nVALUES (@id,@userId,@src,@name,@weight)";
                    await connection.ExecuteAsync(sql, newItem);
                    result.Add(item);
                }
            }
            return result;


        }
    }
}
