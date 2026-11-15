-- ==========================================================================
-- V3 (H2): Metadados de origem para sincronização automática do mural de eventos
-- ==========================================================================

alter table events
    add column if not exists source_type varchar(50) not null default 'MANUAL';

alter table events
    add column if not exists source_url varchar(1000);

