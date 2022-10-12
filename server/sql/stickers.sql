-- Drop the table 'stickers'
DROP TABLE IF EXISTS stickers

CREATE TABLE stickers
(
    id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
    userId UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(64),
    src VARCHAR(4096),
    weight BIGINT DEFAULT 0,
    creatAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
);

CREATE NONCLUSTERED INDEX stickers_userId_index ON stickers(userId);
CREATE INDEX stickers_weight_index ON stickers(weight);

-- Drop the table 'tstickers' tenant stickers
DROP TABLE IF EXISTS tstickers

CREATE TABLE tstickers
(
    id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
    tenantId UNIQUEIDENTIFIER NOT NULL,
    name NVARCHAR(64),
    src VARCHAR(4096),
    weight BIGINT DEFAULT 0,
    creatAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
);

CREATE NONCLUSTERED INDEX tstickers_tenantId_index ON tstickers(tenantId);
CREATE INDEX tstickers_weight_index ON tstickers(weight);