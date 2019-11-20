-- Drop the table 'stickers'
DROP TABLE IF EXISTS stickers

CREATE TABLE stickers
(
    id UNIQUEIDENTIFIER PRIMARY KEY NOT NULL,
    userId UNIQUEIDENTIFIER NOT NULL,
    name NCHAR(64),
    src VARCHAR(1024),
    weight BIGINT DEFAULT 0,
    creatAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
    updateAt DATETIME2 DEFAULT CURRENT_TIMESTAMP,
);

CREATE NONCLUSTERED INDEX stickers_userId_index ON stickers(userId);
CREATE NONCLUSTERED INDEX stickers_name_index ON stickers(name);
CREATE INDEX stickers_weight_index ON stickers(weight);
