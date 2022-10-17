-- covert to v1 seconds
Update [dbo].[stickers]
SET weight = weight / 10000 - 63709844400000
WHERE weight > 6370984440000000

Update [dbo].[tstickers]
SET weight = weight / 10000 - 63709844400000
WHERE weight > 6370984440000000
