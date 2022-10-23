namespace Stickers.Service;

using Dapper;
using Stickers.Entities;
using Stickers.Utils;

public class StickerDatabase
{
    private DapperContext context;
    private const string userTableName = ENV.SQL_TABEL_NAME;

    private const string tenantTableName = ENV.ADMINSQL_TABEL_NAME;

    private const string userIdFieldName = "userId";
    private const string tenantIdFielddName = "tenantId";

    public static readonly long baseTicks = new DateTime(
        2019,
        11,
        20,
        11,
        0,
        0,
        DateTimeKind.Utc
    ).Ticks;

    // use seconds relative to 2019-11-20 11:00 as default weight
    public static long GetNewWeight() => (DateTime.UtcNow.Ticks - baseTicks) / 10000;

    public StickerDatabase(DapperContext context)
    {
        this.context = context;
    }

    public async Task<List<Sticker>> getStickerList(Boolean isTenant, Guid filterId)
    {
        var tableInfo = GetTableAndFiled(isTenant);
        var query =
            $"SELECT * FROM {tableInfo.tableName} WHERE {tableInfo.fieldName} = @filterId ORDER BY weight DESC";
        using (var connection = context.CreateConnection())
        {
            var companies = await connection.QueryAsync<Sticker>(query, new { filterId });
            return companies.ToList();
        }
    }

    public async Task<bool> deleteSticker(Boolean isTenant, Guid filterId, string stickerId)
    {
        var tableInfo = GetTableAndFiled(isTenant);
        var query =
            $"DELETE FROM {tableInfo.tableName} WHERE id=@id AND {tableInfo.fieldName}=@filterId";
        using (var connection = this.context.CreateConnection())
        {
            var ItemCount = await connection.ExecuteAsync(query, new { id = stickerId, filterId });
            return ItemCount > 0;
        }
    }

    public async Task<bool> updateSticker(
        Boolean isTenant,
        Guid filterId,
        string stickerId,
        string? name,
        long? weight
    )
    {
        var hasName = !string.IsNullOrWhiteSpace(name);
        var hasWeight = weight.HasValue;
        if (!hasName && !hasWeight)
        {
            return false;
        }
        var tableInfo = GetTableAndFiled(isTenant);
        var updateQuery = "";
        if (hasName)
        {
            updateQuery += "name=@name,";
        }
        if (hasWeight)
        {
            updateQuery += "weight=@weight,";
        }
        var query =
            $"UPDATE {tableInfo.tableName} SET {updateQuery} updateAt = GETDATE() WHERE id=@id AND {tableInfo.fieldName} = @filterId";
        using (var connection = context.CreateConnection())
        {
            var ItemCount = await connection.ExecuteAsync(
                query,
                new { id = stickerId, name, filterId, weight }
            );
            return ItemCount > 0;
        }
    }

    public async Task<Boolean> InsertSticker(Boolean isTenant, Guid filterId, Sticker sticker)
    {
        var tableInfo = GetTableAndFiled(isTenant);
        string sql =
            $"INSERT INTO {tableInfo.tableName} (id,{tableInfo.fieldName},src,name,weight) VALUES (@id,@filterId,@src,@name,@weight)";
        using (var connection = context.CreateConnection())
        {
            var ItemCount = await connection.ExecuteAsync(
                sql,
                new
                {
                    id = sticker.id,
                    filterId,
                    src = sticker.src,
                    name = sticker.name,
                    weight = GetNewWeight(),
                }
            );
            return ItemCount > 0;
        }
    }

    private static (string tableName, string fieldName) GetTableAndFiled(bool isTenant)
    {
        return isTenant ? (tenantTableName, tenantIdFielddName) : (userTableName, userIdFieldName);
    }
}
