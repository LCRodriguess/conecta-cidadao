-- ==========================================================================
-- V2: Dados iniciais para demonstração e desenvolvimento (Rio das Ostras & Sapucaia do Sul)
-- ==========================================================================

-- 1. Unidades de Saúde (`badge_class`: 'badge-open-hours' | 'badge-open-24h' conforme js/health.js)
insert into public.health_units (name, municipality, badge, badge_class, type, address, phone) values
  ('UPA 24h Parque Âncora (Valmir Hespanhol)', 'rio-das-ostras', 'Plantão 24h', 'badge-open-24h', 'Unidade de Pronto Atendimento · Urgência e Emergência 24h', 'Rua das Acácias, s/n (próx. ao nº 615) - Parque Âncora · CEP 28899-422', '(22) 2771-3045 · SAMU 192'),
  ('Hospital Municipal Dra. Naelma Monteiro da Silva', 'rio-das-ostras', 'Plantão 24h', 'badge-open-24h', 'Hospital Geral Municipal e Maternidade 24h', 'Rua Nildon Lustosa, s/n - Parque Zabulão · CEP 28893-800', '(22) 2771-3050 · SAMU 192'),
  ('Pronto-Socorro Municipal de Rio das Ostras', 'rio-das-ostras', 'Plantão 24h', 'badge-open-24h', 'Pronto Atendimento Clínico e Ortopédico 24h', 'Rua Laércio Lúcio de Carvalho, 1075 - Parque Zabulão · CEP 28893-392', '(22) 2771-3115 · SAMU 192'),
  ('UBS Jardim Mariléa', 'rio-das-ostras', '07h às 17h', 'badge-open-hours', 'Unidade Básica de Saúde · Vacinação e Clínico Geral', 'Rua Nova Friburgo, 21 - Jardim Mariléa · CEP 28896-049', '(22) 2771-4120'),
  ('Centro de Saúde Dona Edméia (Nova Esperança)', 'rio-das-ostras', '07h às 17h', 'badge-open-hours', 'Atenção Básica, Vacinação, Odontologia e Exames SUS', 'Avenida Linda, s/n - Nova Esperança · CEP 28893-260', '(22) 2771-4010'),
  ('ESF Cláudio Ribeiro (Âncora)', 'rio-das-ostras', '08h às 17h', 'badge-open-hours', 'Estratégia Saúde da Família e Imunização', 'Rua Peperônia, s/n - Cláudio Ribeiro / Âncora · CEP 28899-422', '(22) 2771-4280'),
  ('UPA 24h Sapucaia do Sul', 'sapucaia', 'Plantão 24h', 'badge-open-24h', 'Unidade de Pronto Atendimento 24 Horas', 'Rodovia ERS-118, nº 4400 (esq. Rua Ursa Maior) - Nova Sapucaia · CEP 93226-312', '(51) 3450-3082 · SAMU 192'),
  ('Hospital Municipal Getúlio Vargas (HMGV)', 'sapucaia', 'Plantão 24h', 'badge-open-24h', 'Hospital Geral e Pronto-Socorro 24h', 'Rua Pinheiro Machado, 331 - Bairro Diehl · CEP 93210-180', '(51) 3451-8200 · SAMU 192'),
  ('UBS Centro de Sapucaia do Sul', 'sapucaia', '07h às 18h', 'badge-open-hours', 'Unidade Básica de Saúde · Clínico Geral, Vacinação e Pediatria', 'Rua Nossa Senhora da Conceição esq. Rua Justino Camboim - Centro · CEP 93210-240', '(51) 3451-8000'),
  ('Centro de Especialidades e UBS Bairro Vargas', 'sapucaia', '08h às 17h', 'badge-open-hours', 'Cardiologia, Pediatria, Vacinação e Exames SUS', 'Rua Santa Catarina, 512 - Bairro Vargas · CEP 93222-180', '(51) 3474-2840');

-- 2. Campanhas de Vacinação
insert into public.vaccine_campaigns (name, target_audience, municipality, note) values
  ('Campanha Nacional de Multivacinação 2026', 'Crianças e adolescentes menores de 15 anos', 'rio-das-ostras', 'Disponível em todas as UBS de segunda a sexta, das 8h às 16h30.'),
  ('Imunização contra Influenza (Gripe)', 'Idosos 60+, gestantes e profissionais da saúde', 'rio-das-ostras', 'Levar documento oficial com foto e caderneta de vacinação.'),
  ('Campanha de Atualização da Caderneta Infantil', 'Crianças de 6 meses a 14 anos', 'sapucaia', 'Atendimento nas UBS do município das 8h às 17h.'),
  ('Dose de Reforço — Gripe e Covid-19', 'Idosos 60+ e grupos prioritários', 'sapucaia', 'Levar Cartão SUS e documento com foto.');

-- 3. Agendamentos de Saúde (`date_time` em formato ISO YYYY-MM-DDTHH:mm conforme js/health.js)
insert into public.health_appointments (municipality, status, sus_card, type, professional, date_time, location, action_label, instructions) values
  ('rio-das-ostras', 'Confirmado', '898001234567891', 'ConsultaMedica', 'Dra. Mariana Vasconcellos · Clínico Geral', to_char(current_date + 4, 'YYYY-MM-DD') || 'T09:30', 'UBS Central — Av. das Flores, 80 · Rio das Ostras', 'Ver orientações', 'Chegar com 15 minutos de antecedência munido de documento com foto e Cartão SUS.'),
  ('sapucaia', 'Confirmado', '898009876543210', 'ConsultaOdontologica', 'Dr. Rafael Nogueira · Odontologia', to_char(current_date + 6, 'YYYY-MM-DD') || 'T14:00', 'UBS Centro — Rua Tiradentes, 340 · Sapucaia do Sul', 'Ver orientações', 'Apresentar documento oficial com foto, Cartão SUS e comprovante de residência.');

-- 4. Agenda de Eventos (datas futuras em relação a `current_date` para sempre aparecerem no filtro padrão)
insert into public.events (municipality, category, title, desc_short, desc_full, event_date, start_time, end_time, location_short, location_full, audience, before_text) values
  ('rio-das-ostras', 'Cultura', 'Festival de Frutos do Mar e Jazz na Praia do Bosque', 'Música instrumental gratuita à beira-mar e gastronomia caiçara.', 'Dois dias de música instrumental gratuita à beira-mar, feira gastronômica de pescadores locais e espaço kids com oficinas artísticas.', (current_date + 2), '16:00', '22:00', 'Praia do Bosque', 'Orla da Praia do Bosque, Centro - Rio das Ostras', 'Livre para todas as idades', 'Entrada gratuita. Recomenda-se chegar cedo e utilizar transporte coletivo.'),
  ('rio-das-ostras', 'EsporteELazer', 'Circuito Municipal de Futevôlei e Corrida Rústica', 'Competição aberta na Orla de Costazul com premiação e hidratação.', 'Competição aberta com categorias iniciante, intermediário e máster. Premiação para os três primeiros colocados e tendas de hidratação.', (current_date + 5), '08:00', '13:00', 'Orla de Costazul', 'Av. Governador Roberto Silveira, Costazul - Rio das Ostras', 'Jovens e adultos', 'Levar documento com foto, protetor solar e garrafa de água.'),
  ('rio-das-ostras', 'Oficinas', 'Oficina Gratuita de Robótica e Programação Web', 'Aulas práticas no Polo Universitário com certificação municipal.', 'Aulas gratuitas para estudantes e moradores no Polo Universitário, com certificação em lógica de programação e desenvolvimento web.', (current_date + 9), '09:00', '12:00', 'Polo Universitário', 'Rua Jornalista Lúcio Mauro, Jardim Campomar - Rio das Ostras', 'Estudantes a partir de 12 anos', 'Inscrição gratuita no local com 30 minutos de antecedência.'),
  ('sapucaia', 'ParaFamilias', 'Feira de Artesanato e Gastronomia Popular', 'Exposição de artesãos locais, gastronomia e troca solidária de livros.', 'Exposição de mais de 60 artesãos locais, food trucks regionais, apresentações de dança tradicional gaúcha e troca solidária de livros.', (current_date + 3), '09:00', '19:00', 'Praça General Freitas', 'Praça General Freitas, Centro - Sapucaia do Sul', 'Livre para toda a família', 'Acesso livre e gratuito durante todo o dia.'),
  ('sapucaia', 'Cultura', 'Encontro Municipal de Tradições Gaúchas e Tertúlia Musical', 'Apresentações de CTGs, poesia, mateada comunitária e música ao vivo.', 'Apresentações de invernadas artísticas de CTGs, declamação de poesia, mateada comunitária e fandango gratuito aberto ao público.', (current_date + 7), '14:00', '20:00', 'Parque Centenário', 'Parque Municipal Jayme Caetano Braun - Sapucaia do Sul', 'Livre para todas as idades', 'Traga sua cadeira de praia e cuia para a mateada comunitária.');

-- 5. Ocorrências + Complementos (usa nome por extenso do município, conforme js/requests.js)
with occ1 as (
  insert into public.occurrences (protocol, title, description, category, status, municipality, street, street_number, neighborhood, reference_point, photo_url, created_at)
  values ('SIM-2026-0042', 'Iluminação pública apagada', 'Três postes consecutivos apagados há 4 dias, deixando o trecho escuro à noite.', 'IluminacaoPublica', 'EmAnalise', 'Rio das Ostras', 'Rua das Gaivotas', '120', 'Costazul', 'Próximo à praça principal', '', '2026-10-18 19:20:00')
  returning id
),
occ2 as (
  insert into public.occurrences (protocol, title, description, category, status, municipality, street, street_number, neighborhood, reference_point, photo_url, created_at)
  values ('SIM-2026-0031', 'Reparo de buraco na via', 'Buraco profundo na faixa da direita dificultando a passagem de ônibus.', 'AsfaltoBuracos', 'Concluida', 'Rio das Ostras', 'Av. Amazonas', '450', 'Centro', 'Em frente à padaria central', '', '2026-10-10 10:15:00')
  returning id
),
occ3 as (
  insert into public.occurrences (protocol, title, description, category, status, municipality, street, street_number, neighborhood, reference_point, photo_url, created_at)
  values ('SIM-2026-0058', 'Limpeza de bueiro obstruído', 'Bueiro com acúmulo de folhas causando represamento de água em dias de chuva.', 'EsgotoBueiro', 'EquipeEnviada', 'Sapucaia do Sul', 'Av. Sapucaia', '810', 'Centro', 'Esquina com a Rua Sete de Setembro', '', '2026-10-25 14:40:00')
  returning id
)
insert into public.occurrence_complements (occurrence_id, description, created_at)
select id, 'Equipe técnica da Secretaria de Serviços Públicos agendou vistoria noturna no local.', '2026-10-19 15:30:00'::timestamp from occ1
union all
select id, 'Operação tapa-buraco concluída com aplicação de massa asfáltica a quente.', '2026-10-12 16:10:00'::timestamp from occ2
union all
select id, 'Caminhão hidrojato deslocado para desobstrução preventiva da rede pluvial.', '2026-10-26 09:15:00'::timestamp from occ3;
