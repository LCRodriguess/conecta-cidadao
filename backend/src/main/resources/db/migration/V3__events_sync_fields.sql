-- ==========================================================================
-- V3: Metadados de origem para sincronização automática do mural de eventos
-- ==========================================================================

alter table public.events
    add column if not exists source_type text not null default 'MANUAL',
    add column if not exists source_url text;

create unique index if not exists events_municipality_source_url_uidx
    on public.events (municipality, source_url)
    where source_url is not null;

