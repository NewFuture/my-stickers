namespace Stickers.Utils;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;

public static class IssuerValidatorHelper
{
    private static readonly string[] ValiadIssuers = new string[]
    {
        "https://login.microsoftonline.com/{tenantid}/v2.0",
        "https://sts.windows.net/{tenantid}/",
    };

    public static string ValidateIssuerWithPlaceholder(
        string issuer,
        SecurityToken token
    )
    {
        // Accepts any issuer of the form "https://login.microsoftonline.com/{tenantid}/v2.0",
        // where tenantid is the tid from the token.

        if (token is JwtSecurityToken jwt)
        {
            if (jwt.Payload.TryGetValue("tid", out var value) && value is string tokenTenantId)
            {
                if (ValiadIssuers.Any(i => i.Replace("{tenantid}", tokenTenantId) == issuer))
                    return issuer;
            }
        }

        // Recreate the exception that is thrown by default
        // when issuer validation fails
        string errorMessage = FormattableString.Invariant(
            $"IDX10205: Issuer validation failed. Issuer: '{issuer}'."
        );
        throw new SecurityTokenInvalidIssuerException(errorMessage) { InvalidIssuer = issuer };
    }
}
