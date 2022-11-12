namespace Stickers.Service;

using Dapper;
using Stickers.Entities;
using Stickers.Utils;

public class StickerDatabase
{
    private const string UserIdFieldName = "userId";
    private const string TenantIdFielddName = "tenantId";

    private readonly DapperContext context;
    private readonly string UserTableName;

    private readonly string TenantTableName;

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

    public StickerDatabase(DapperContext context, IConfiguration config)
    {
        this.context = context;

        var dbPrefix = config[ConfigKeys.DB_PREFIX] ?? "";
        this.UserTableName = dbPrefix + "stickers";
        this.TenantTableName = dbPrefix + "tstickers";
    }

    public async Task<List<Sticker>> getStickerList(bool isTenant, Guid filterId)
    {
        var (tableName, fieldName) = this.GetTableAndFiled(isTenant);
        var query = $"SELECT * FROM {tableName} WHERE {fieldName} = @filterId ORDER BY weight DESC";
        using var connection = this.context.CreateConnection();
        var companies = await connection.QueryAsync<Sticker>(query, new { filterId });
        return companies.ToList();
    }

    public async Task<bool> deleteSticker(bool isTenant, Guid filterId, string stickerId)
    {
        var (tableName, fieldName) = this.GetTableAndFiled(isTenant);
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
        var (tableName, fieldName) = this.GetTableAndFiled(isTenant);
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
        var (tableName, fieldName) = this.GetTableAndFiled(isTenant);
        sticker.weight = GetNewWeight();
        string sql =
            $"INSERT INTO {tableName} (id,{fieldName},src,name,weight) VALUES (@id,@filterId,@src,@name,@weight)";
        using var connection = this.context.CreateConnection();
        var ItemCount = await connection.ExecuteAsync(
            sql,
            new { sticker.id, filterId, sticker.src, sticker.name, sticker.weight, }
        );
        return ItemCount > 0;
    }

    /// <summary>
    /// Drapper use for each for IEnumerable items.
    /// So we wrapper it to on SQL.
    /// </summary>
    /// <param name="isTenant"></param>
    /// <param name="filterId"></param>
    /// <param name="stickers"></param>
    /// <returns></returns>
    public async Task<int> InsertStickers(
        bool isTenant,
        Guid filterId,
        IEnumerable<Sticker> stickers
    )
    {
        var (tableName, fieldName) = this.GetTableAndFiled(isTenant);
        var weight = GetNewWeight() - 1;
        string sql = $"INSERT INTO {tableName} (id,{fieldName},src,name,weight) VALUES";
        var parameters = new DynamicParameters();
        parameters.Add("filterId", filterId);
        var sqlValues = stickers.Select(
            (sticker, index) =>
            {
                sticker.weight = weight++;
                var idKey = "id" + index;
                parameters.Add(idKey, sticker.id);
                var srcKey = "src" + index;
                parameters.Add(srcKey, sticker.src);
                var nameKey = "name" + index;
                parameters.Add(nameKey, sticker.name);
                var weightKey = "weight" + index;
                parameters.Add(weightKey, sticker.weight);
                return $"(@{idKey},@filterId,@{srcKey},@{nameKey},@{weightKey})";
            }
        );
        sql += string.Join(',', sqlValues);
        using var connection = this.context.CreateConnection();
        return await connection.ExecuteAsync(sql, parameters);
    }

    private (string tableName, string fieldName) GetTableAndFiled(bool isTenant)
    {
        return isTenant
            ? (this.TenantTableName, TenantIdFielddName)
            : (this.UserTableName, UserIdFieldName);
    }
}
