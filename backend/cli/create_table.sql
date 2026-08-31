DROP TABLE IF EXISTS tasks CASCADE;

CREATE TABLE
    workspace (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        use
    )
CREATE TABLE
    tasks (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL, -- 👈 Lien sécurisé avec l'utilisateur Better Auth
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) DEFAULT 'pending' NOT NULL,
        priority VARCHAR(50) DEFAULT 'low' NOT NULL,
        category VARCHAR(100) DEFAULT 'général',
        workspace_id VARCHAR(100),
        created_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP
        WITH
            TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

CREATE INDEX idx_tasks_user_id ON tasks (user_id);