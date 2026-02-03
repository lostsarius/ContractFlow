-- Database setup script for ContractFlow

-- 1. Create the database
CREATE DATABASE IF NOT EXISTS vertraege;
USE vertraege;

-- 2. Create the Contract table
CREATE TABLE IF NOT EXISTS Contract (
    id VARCHAR(191) PRIMARY KEY,
    title VARCHAR(191) NOT NULL,
    description LONGTEXT,
    provider VARCHAR(191) NOT NULL,
    contractNumber VARCHAR(191),
    category VARCHAR(191) NOT NULL,
    status VARCHAR(191) NOT NULL DEFAULT 'active',
    startDate DATETIME(3) NOT NULL,
    endDate DATETIME(3),
    cancellationDeadline DATETIME(3),
    autoRenewal TINYINT(1) NOT NULL DEFAULT 0,
    price DOUBLE NOT NULL,
    currency VARCHAR(191) NOT NULL DEFAULT 'EUR',
    billingCycle VARCHAR(191) NOT NULL DEFAULT 'monthly',
    paymentMethod VARCHAR(191),
    notes LONGTEXT,
    documents LONGTEXT,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
    
    INDEX status_idx (status),
    INDEX category_idx (category),
    INDEX endDate_idx (endDate)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Create the Setting table
CREATE TABLE IF NOT EXISTS Setting (
    id VARCHAR(191) PRIMARY KEY,
    `key` VARCHAR(191) UNIQUE NOT NULL,
    value TEXT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Set up user permissions
GRANT ALL PRIVILEGES ON vertraege.* TO 'contractflow'@'%';
FLUSH PRIVILEGES;

-- 5. Seed initial settings (optional)
-- INSERT INTO Setting (id, `key`, value) VALUES (UUID(), 'app_name', 'ContractFlow');
