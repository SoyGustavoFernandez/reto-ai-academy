-- 1. Tabla de miembros del squad
CREATE TABLE squad_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    on_vacation BOOLEAN DEFAULT FALSE,
    vacation_start_date DATE,
    vacation_end_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabla de configuraciones de clientes y canales
CREATE TABLE client_configs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,                     -- UASL, SOLGAS, COSMOS, DyC
    project_key VARCHAR(20) UNIQUE NOT NULL,                -- PEUAS100, PESOL120, PECMO120, PEDYC600
    teams_webhook_url TEXT,                                 -- URL del Webhook de Teams para este cliente o grupo
    confluence_space_key VARCHAR(20),                       -- Espacio de confluence asociado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla de log de tickets procesados (Auditoría)
CREATE TABLE ticket_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    ticket_key VARCHAR(50) NOT NULL,                        -- PEUAS100-1078
    title VARCHAR(255) NOT NULL,
    client_key VARCHAR(20) REFERENCES client_configs(project_key),
    diagnostic_output TEXT,
    teams_sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- DATOS INICIALES (MOCK DATA)
-- =========================================================================

-- Insertar miembros del squad de soporte
INSERT INTO squad_members (name, email, on_vacation) VALUES
('Gustavo Fernandez', 'gufernandez@baufest.com', FALSE),
('Yareli Gomez', 'yisabel@baufest.com', FALSE),
('Alejandra Sandoval', 'alsandoval@baufest.com', FALSE),
('Jorge Galindo', 'jgalindo@baufest.com', FALSE),
('Rony Zapana', 'rzapana@baufest.com', FALSE);

-- Insertar configuraciones de clientes
-- UASL, SOLGAS y DyC comparten la misma webhook de "SOPORTE Squad" por ahora.
-- Cosmos tendrá su propia Webhook (puedes actualizarla después).
INSERT INTO client_configs (client_name, project_key, confluence_space_key, teams_webhook_url) VALUES
('UASL', 'PEUAS100', 'PEUAS100', 'https://mock-teams-webhook.powerplatform.com/workflows/mock-uasl/invoke?sig=MOCK_SIG'),
('SOLGAS', 'PESOL120', 'PESOL120', 'https://mock-teams-webhook.powerplatform.com/workflows/mock-solgas/invoke?sig=MOCK_SIG'),
('DyC', 'PEDYC600', 'PEDYC600', 'https://mock-teams-webhook.powerplatform.com/workflows/mock-dyc/invoke?sig=MOCK_SIG'),
('COSMOS', 'PECMO120', 'PECMO120', 'https://mock-teams-webhook.powerplatform.com/workflows/mock-cosmos/invoke?sig=MOCK_SIG');

