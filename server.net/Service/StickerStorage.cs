namespace Stickers.Service
{
    using Dapper;
    using Microsoft.AspNetCore.Http.Features;
    using Microsoft.Data.SqlClient;
    using Stickers.Entities;
    using System.Diagnostics.Metrics;
    using System.Security.Cryptography;

    public class StickerStorage
    {
        private DapperContext context = null;
        private string tableName = ENV.SQL_TABEL_NAME;

        public void SetAdmin()
        {
            tableName = ENV.ADMINSQL_TABEL_NAME;
        }
        public StickerStorage(DapperContext context)
        {
            this.context = context;
        }
        public async Task<List<Sticker>>  getUserStickers(Guid userId)
        {
            var query = $"SELECT * FROM {this.tableName} where userId = @userId order by weight desc ";
            using (var connection = context.CreateConnection())
            {
                var companies = await connection.QueryAsync<Sticker>(query, new { userId });
                return companies.ToList();
            }
        }

        public async Task<List<Sticker>> search(string keyword)
        {
            var query = $"SELECT * FROM {this.tableName} where name like CONCAT('%',@keyword,'%') order by weight desc";
            using (var connection = context.CreateConnection())
            {
                var companies = await connection.QueryAsync<Sticker>(query, new { keyword });
                return companies.ToList();
            }
        }

        public async Task<bool> deleteUserSticker(Guid userId, string stickerId)
        {
            var query = $"delete FROM {this.tableName} where userId = @userId and Id=@Id";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, Id = stickerId });
                return ItemCount > 0;
            }
        }

        public async Task<bool> updateStickerName(Guid userId, string stickerId, string name)
        {
            var query = $"update {this.tableName} set name = @name where userId = @userId and Id=@Id";
            using (var connection = context.CreateConnection())
            {
                var ItemCount = await connection.ExecuteAsync(query, new { userId = userId, Id = stickerId, Name=name });
                return ItemCount > 0;
            }
        }
        public async Task<List<Sticker>> addUserStickers(Guid userId, List<Sticker> stickers)
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
                        string sql = $"update {this.tableName} set weight = @weight where userId = @userId and Id=@Id";
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
                    string sql = $"INSERT\r\nINTO {this.tableName} (id,userId,src,name,weight)\r\nVALUES (@id,@userId,@src,@name,@weight)";
                    await connection.ExecuteAsync(sql, newItem);
                    result.Add(item);
                }
            }
            return result;


        }
    }
}
