-- ==========================================================================
-- Conecta Cidadão - schema H2 (fallback local compatível com PostgreSQL)
-- ==========================================================================

create table if not exists events (
    id              uuid default random_uuid() primary key,
    municipality    varchar(100) not null,
    category        varchar(50) not null
                    check (category in ('Cultura', 'EsporteELazer', 'Oficinas', 'ParaFamilias')),
    title           varchar(255) not null,
    desc_short      clob,
    desc_full       clob not null,
    event_date      date not null,
    start_time      time not null,
    end_time        time not null,
    location_short  varchar(255),
    location_full   varchar(255) not null,
    audience        varchar(255) not null,
    before_text     clob,
    constraint events_time_order check (end_time > start_time)
);

create index if not exists events_municipality_date_idx
    on events (municipality, event_date, start_time);

create table if not exists health_units (
    id            uuid default random_uuid() primary key,
    name          varchar(255) not null,
    municipality  varchar(100) not null,
    badge         varchar(100),
    badge_class   varchar(100),
    type          varchar(255),
    address       varchar(255),
    phone         varchar(100)
);

create index if not exists health_units_municipality_idx on health_units (municipality);

create table if not exists health_appointments (
    id            uuid default random_uuid() primary key,
    municipality  varchar(100) not null,
    status        varchar(100),
    sus_card      varchar(100),
    type          varchar(100)
                  check (type in ('ConsultaMedica', 'ConsultaOdontologica', 'Exame', 'Vacinacao', 'Outro')),
    professional  varchar(255),
    date_time     varchar(100),
    location      varchar(255),
    action_label  varchar(100),
    instructions  clob
);

create index if not exists health_appointments_municipality_idx on health_appointments (municipality);

create table if not exists vaccine_campaigns (
    id               uuid default random_uuid() primary key,
    name             varchar(255) not null,
    target_audience  varchar(255),
    municipality     varchar(100) not null,
    note             clob
);

create index if not exists vaccine_campaigns_municipality_idx on vaccine_campaigns (municipality);

create table if not exists occurrences (
    id               uuid default random_uuid() primary key,
    protocol         varchar(100),
    title            varchar(255),
    description      clob,
    category         varchar(100)
                     check (category in ('IluminacaoPublica', 'AsfaltoBuracos', 'LimpezaEntulho',
                                         'EsgotoBueiro', 'PodaArvore', 'SinalizacaoTransito')),
    status           varchar(50) not null default 'Recebido'
                     check (status in ('Recebido', 'EmAnalise', 'EquipeEnviada', 'Concluida')),
    municipality     varchar(100),
    street           varchar(255),
    street_number    varchar(50),
    neighborhood     varchar(255),
    reference_point  varchar(255),
    photo_url        clob,
    created_at       timestamp not null default current_timestamp
);

create index if not exists occurrences_municipality_idx on occurrences (municipality);

create table if not exists occurrence_complements (
    id             uuid default random_uuid() primary key,
    occurrence_id  uuid not null references occurrences (id) on delete cascade,
    description    clob not null,
    created_at     timestamp not null default current_timestamp
);

create index if not exists occurrence_complements_occurrence_idx
    on occurrence_complements (occurrence_id);

