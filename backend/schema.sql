-- Disable automatic transaction for DDL statements (optional, but good for script execution)
-- \set AUTOCOMMIT off

-- Drop tables if they already exist (for clean re-creation, use with caution in production)
-- CASCADE ensures dependent objects (like foreign keys) are also dropped
DROP TABLE IF EXISTS ratings CASCADE;
DROP TABLE IF EXISTS stores CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Create users table
-- Stores user information, including roles.
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(60) NOT NULL CHECK (LENGTH(name) >= 20 AND LENGTH(name) <= 60), -- Name validation (Min 20, Max 60 chars)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email must be unique
    password VARCHAR(255) NOT NULL, -- Storing hashed password
    address VARCHAR(400) CHECK (LENGTH(address) <= 400), -- Address validation (Max 400 chars)
    role VARCHAR(50) NOT NULL CHECK (role IN ('System Administrator', 'Normal User', 'Store Owner')), -- Enforced roles
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create stores table
-- Stores information about each registered store.
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL, -- Assuming store email should also be unique
    address VARCHAR(400) NOT NULL,
    owner_id INTEGER UNIQUE, -- Foreign key to users table. A user can own only one store.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_owner -- Foreign key constraint to link store to its owner
        FOREIGN KEY (owner_id)
        REFERENCES users (id)
        ON DELETE SET NULL -- If the owning user is deleted, set owner_id to NULL
);

-- 3. Create ratings table
-- Stores user ratings for stores.
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    store_id INTEGER NOT NULL, -- Foreign key to the stores table
    user_id INTEGER NOT NULL, -- Foreign key to the users table (Normal User role)
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5), -- Rating must be between 1 and 5
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_store -- Foreign key constraint to link rating to a store
        FOREIGN KEY (store_id)
        REFERENCES stores (id)
        ON DELETE CASCADE, -- If a store is deleted, delete its associated ratings
    CONSTRAINT fk_user -- Foreign key constraint to link rating to a user
        FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE, -- If a user is deleted, delete their associated ratings
    CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id) -- Ensures a user can only submit one rating per store
);

-- Function to automatically update the 'updated_at' timestamp on row modification
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to your tables
CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_stores_timestamp
BEFORE UPDATE ON stores
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_ratings_timestamp
BEFORE UPDATE ON ratings
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

