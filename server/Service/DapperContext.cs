using System.Data;
using Microsoft.Data.SqlClient;
using Stickers.Utils;

namespace Stickers.Service
{
    public class DapperContext
    {
        private readonly string connectionString;

        public DapperContext(IConfiguration configuration)
        {
            this.connectionString = configuration.GetConnectionString(
                ConfigKeys.SQL_CONNECTION_STRING
            );
        }

        public IDbConnection CreateConnection() => new SqlConnection(this.connectionString);
    }
}
