using System.Data;
using Microsoft.Data.SqlClient;
using Stickers.Utils;

namespace Stickers.Service
{
    public class DapperContext
    {
        private readonly IConfiguration _configuration;
        private readonly string _connectionString;
        public DapperContext(IConfiguration configuration)
        {
            _configuration = configuration;
            _connectionString = _configuration[ConfigKeys.SQL_CONNECTION_STRING];
        }
        public IDbConnection CreateConnection()
            => new SqlConnection(_connectionString);
    }
}
