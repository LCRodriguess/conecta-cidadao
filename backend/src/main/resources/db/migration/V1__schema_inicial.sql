-- ==========================================================================
-- Conecta Cidadão - schema inicial (migração do MongoDB para Supabase/Postgres)
-- Cada coleção Mongo virou uma tabela; os ids passam a ser UUID.
-- O backend conecta como role `postgres` (ignora RLS). O RLS fica habilitado
-- sem policies para que a Data API do Supabase (anon/authenticated) NÃO
-- exponha estas tabelas por engano.
-- ==========================================================================

create table public.events (
    id              uuid primary key default gen_random_uuid(),
    municipality    text not null,
    category        text not null
                    check (category in ('Cultura', 'EsporteELazer', 'Oficinas', 'ParaFamilias')),
    title           text not null,
    desc_short      text,
    desc_full       text not null,
    event_date      date not null,
    start_time      time not null,
    end_time        time not null,
    location_short  text,
    location_full   text not null,
    audience        text not null,
    before_text     text,
    constraint events_time_order check (end_time > start_time)
);

create index events_municipality_date_idx
    on public.events (municipality, event_date, start_time);

create table public.health_units (
    id            uuid primary key default gen_random_uuid(),
    name          text not null,
    municipality  text not null,
    badge         text,
    badge_class   text,
    type          text,
    address       text,
    phone         text
);

create index health_units_municipality_idx on public.health_units (municipality);

create table public.health_appointments (
    id            uuid primary key default gen_random_uuid(),
    municipality  text not null,
    status        text,
    sus_card      text,
    type          text
                  check (type in ('ConsultaMedica', 'ConsultaOdontologica', 'Exame', 'Vacinacao', 'Outro')),
    professional  text,
    date_time     text,
    location      text,
    action_label  text,
    instructions  text
);

create index health_appointments_municipality_idx on public.health_appointments (municipality);

create table public.vaccine_campaigns (
    id               uuid primary key default gen_random_uuid(),
    name             text not null,
    target_audience  text,
    municipality     text not null,
    note             text
);

create index vaccine_campaigns_municipality_idx on public.vaccine_campaigns (municipality);

create table public.occurrences (
    id               uuid primary key default gen_random_uuid(),
    protocol         text,
    title            text,
    description      text,
    category         text
                     check (category in ('IluminacaoPublica', 'AsfaltoBuracos', 'LimpezaEntulho',
                                         'EsgotoBueiro', 'PodaArvore', 'SinalizacaoTransito')),
    status           text not null default 'Recebido'
                     check (status in ('Recebido', 'EmAnalise', 'EquipeEnviada', 'Concluida')),
    municipality     text,
    street           text,
    street_number    text,
    neighborhood     text,
    reference_point  text,
    photo_url        text,
    created_at       timestamp not null default now()
);

create index occurrences_municipality_idx on public.occurrences (municipality);

create table public.occurrence_complements (
    id             uuid primary key default gen_random_uuid(),
    occurrence_id  uuid not null references public.occurrences (id) on delete cascade,
    description    text not null,
    created_at     timestamp not null default now()
);

create index occurrence_complements_occurrence_idx
    on public.occurrence_complements (occurrence_id);

-- RLS habilitado em todas as tabelas da aplicação (sem policies = acesso negado para anon/authenticated)
alter table public.events                  enable row level security;
alter table public.health_units            enable row level security;
alter table public.health_appointments     enable row level security;
alter table public.vaccine_campaigns       enable row level security;
alter table public.occurrences             enable row level security;
alter table public.occurrence_complements  enable row level security;

