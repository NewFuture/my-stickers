using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;

namespace Stickers.Utils;

public static class IssuerValidatorHelper
{
    private static string[] ValiadIssuers = new string[]
    {
        "https://login.microsoftonline.com/{tenantid}/v2.0",
        "https://sts.windows.net/{tenantid}/",
    };

    public static string ValidateIssuerWithPlaceholder(
        string issuer,
        SecurityToken token,
        TokenValidationParameters parameters
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
