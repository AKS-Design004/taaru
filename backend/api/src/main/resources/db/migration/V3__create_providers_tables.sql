CREATE TABLE categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            VARCHAR(100) NOT NULL UNIQUE,
    description     TEXT,
    parent_id       UUID REFERENCES categories(id),
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE providers (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    business_name   VARCHAR(255) NOT NULL,
    category_id     UUID NOT NULL REFERENCES categories(id),
    subcategory     VARCHAR(100),
    description     TEXT,
    city            VARCHAR(100) NOT NULL,
    district        VARCHAR(100),
    address         VARCHAR(255),
    phone           VARCHAR(20),
    whatsapp        VARCHAR(20),
    website         VARCHAR(255),
    social_links    JSONB DEFAULT '{}',
    pricing         JSONB DEFAULT '{}',
    latitude        DECIMAL(10, 7),
    longitude       DECIMAL(10, 7),
    status          VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    logo_url        VARCHAR(500),
    featured        BOOLEAN NOT NULL DEFAULT FALSE,
    visit_count     INTEGER NOT NULL DEFAULT 0,
    rating          DECIMAL(2, 1) NOT NULL DEFAULT 0.0,
    review_count    INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_photos (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    url             VARCHAR(500) NOT NULL,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE provider_business_hours (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    day_of_week     VARCHAR(10) NOT NULL,
    open_time       TIME,
    close_time      TIME,
    is_closed       BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE contact_messages (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider_id     UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    sender_name     VARCHAR(100) NOT NULL,
    sender_email    VARCHAR(255) NOT NULL,
    message         TEXT NOT NULL,
    read            BOOLEAN NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_providers_category ON providers (category_id);
CREATE INDEX idx_providers_city ON providers (city);
CREATE INDEX idx_providers_status ON providers (status);
CREATE INDEX idx_providers_featured ON providers (featured) WHERE featured = TRUE;
CREATE INDEX idx_provider_photos_provider ON provider_photos (provider_id, display_order);
CREATE INDEX idx_contact_messages_provider ON contact_messages (provider_id);

INSERT INTO categories (name, slug, description, display_order) VALUES
    ('Mode', 'mode', 'Stylistes, créateurs, marques et boutiques de mode', 1),
    ('Couture', 'couture', 'Couturiers, ateliers de confection, broderie et retouches', 2),
    ('Beauté', 'beaute', 'Salons de coiffure, instituts de beauté, maquilleurs et onglerie', 3),
    ('Événementiel', 'evenementiel', 'Wedding planners, décorateurs, photographes et traiteurs', 4);
