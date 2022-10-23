namespace Stickers.Service;

using Dapper;
using Stickers.Entities;
using Stickers.Utils;

public class StickerDatabase
{
    private readonly DapperContext context;
    private const string UserTableName = ENV.SQL_TABEL_NAME;

    private const string TenantTableName = ENV.ADMINSQL_TABEL_NAME;

    private const string UserIdFieldName = "userId";
    private const string TenantIdFielddName = "tenantId";

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

    public async Task<List<Sticker>> getStickerList(bool isTenant, Guid filterId)
    {
        var (tableName, fieldName) = GetTableAndFiled(isTenant);
        var query = $"SELECT * FROM {tableName} WHERE {fieldName} = @filterId ORDER BY weight DESC";
        using var connection = this.context.CreateConnection();
        var companies = await connection.QueryAsync<Sticker>(query, new { filterId });
        return companies.ToList();
    }

    public async Task<bool> deleteSticker(bool isTenant, Guid filterId, string stickerId)
    {
        var (tableName, fieldName) = GetTableAndFiled(isTenant);
        var query = $"DELETE FROM {tableName} WHERE id=@id AND {fieldName}=@filterId";
        using var connection = this.context.CreateConnection();
        var ItemCount = await connection.ExecuteAsync(query, new { id = stickerId, filterId });
        return ItemCount > 0;
    }

    public async Task<bool> updateSticker(
        bool isTenant,
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
        var (tableName, fieldName) = GetTableAndFiled(isTenant);
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
            $"UPDATE {tableName} SET {updateQuery} updateAt = GETDATE() WHERE id=@id AND {fieldName} = @filterId";
        using var connection = this.context.CreateConnection();
        var ItemCount = await connection.ExecuteAsync(
            query,
            new { id = stickerId, name, filterId, weight }
        );
        return ItemCount > 0;
    }

    public async Task<bool> InsertSticker(bool isTenant, Guid filterId, Sticker sticker)
    {
        var (tableName, fieldName) = GetTableAndFiled(isTenant);
        string sql =
            $"INSERT INTO {tableName} (id,{fieldName},src,name,weight) VALUES (@id,@filterId,@src,@name,@weight)";
        using var connection = this.context.CreateConnection();
        var ItemCount = await connection.ExecuteAsync(
            sql,
            new { sticker.id, filterId, sticker.src, sticker.name, weight = GetNewWeight(), }
        );
        return ItemCount > 0;
    }

    private static (string tableName, string fieldName) GetTableAndFiled(bool isTenant)
    {
        return isTenant ? (TenantTableName, TenantIdFielddName) : (UserTableName, UserIdFieldName);
    }
}
