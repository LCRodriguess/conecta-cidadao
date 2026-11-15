package br.com.conectacidadao.application.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;
import br.com.conectacidadao.domain.repositories.EventRepository;
import tools.jackson.databind.JsonNode;

@Service
public class EventSyncService {

    private static final Logger log = LoggerFactory.getLogger(EventSyncService.class);

    private static final Map<String, PortalSource> PORTAL_SOURCES = Map.of(
        "rio-das-ostras", new PortalSource(
            "rio-das-ostras",
            "Portal Prefeitura de Rio das Ostras",
            "https://www.riodasostras.rj.gov.br/wp-json/wp/v2/posts?per_page=20",
            "Rio das Ostras · RJ"
        ),
        "sapucaia", new PortalSource(
            "sapucaia",
            "Portal Prefeitura de Sapucaia do Sul",
            "https://www.sapucaiadosul.rs.gov.br/wp-json/wp/v2/posts?per_page=20",
            "Sapucaia do Sul · RS"
        )
    );

    private static final List<String> EVENT_KEYWORDS = List.of(
        "evento", "festival", "feira", "oficina", "curso", "esporte",
        "corrida", "campeonato", "teatro", "show", "cultura", "agenda",
        "programacao", "programação", "mutirao", "mutirão", "vacinacao",
        "vacinação", "campanha", "lazer", "infantil", "familia", "família",
        "exposicao", "exposição", "praca", "praça", "parque", "auditorio",
        "auditório", "encontro", "inscricoes", "inscrições"
    );

    private static final Pattern FULL_DATE_PATTERN = Pattern.compile("\\b(\\d{1,2})/(\\d{1,2})/(\\d{4})\\b");
    private static final Pattern SHORT_DATE_PATTERN = Pattern.compile("\\b(\\d{1,2})/(\\d{1,2})\\b");
    private static final Pattern TIME_PATTERN = Pattern.compile("\\b([01]?\\d|2[0-3])(?:h|:)([0-5]\\d)?\\b");

    private final EventRepository eventRepository;
    private final EventService eventService;
    private final RestClient restClient;

    public EventSyncService(EventRepository eventRepository, EventService eventService) {
        this.eventRepository = eventRepository;
        this.eventService = eventService;

        SimpleClientHttpRequestFactory requestFactory = new SimpleClientHttpRequestFactory();
        requestFactory.setConnectTimeout(6000);
        requestFactory.setReadTimeout(8000);

        this.restClient = RestClient.builder()
            .requestFactory(requestFactory)
            .build();
    }

    @Scheduled(initialDelay = 15000, fixedDelay = 21600000)
    public void scheduledSync() {
        List<SyncResult> results = syncAll();
        for (SyncResult result : results) {
            log.info("Sync automático [{}]: {} importados, {} ignorados ({})",
                result.municipality(), result.imported(), result.skipped(), result.status());
        }
    }

    public List<SyncResult> syncAll() {
        List<SyncResult> results = new ArrayList<>();
        for (String key : PORTAL_SOURCES.keySet()) {
            results.add(syncMunicipality(key));
        }
        return results;
    }

    public SyncResult syncMunicipality(String municipality) {
        PortalSource source = PORTAL_SOURCES.get(municipality);
        if (source == null) {
            throw new IllegalArgumentException("Município não suportado para sincronização: " + municipality);
        }

        int imported = 0;
        int skipped = 0;
        int offsetDays = 1;

        try {
            JsonNode posts = restClient
                .get()
                .uri(source.wpApiUrl())
                .header("User-Agent", "ConectaCidadao/1.0")
                .retrieve()
                .body(JsonNode.class);

            if (posts == null || !posts.isArray()) {
                return new SyncResult(
                    municipality,
                    source.label(),
                    0,
                    0,
                    "EMPTY",
                    "O portal não retornou lista de publicações."
                );
            }

            for (JsonNode post : posts) {
                String link = post.path("link").asString("");
                String rawTitle = post.path("title").path("rendered").asString("");
                String rawExcerpt = post.path("excerpt").path("rendered").asString("");
                String rawContent = post.path("content").path("rendered").asString("");

                String title = cleanText(rawTitle);
                String excerpt = cleanText(rawExcerpt);
                String fullText = cleanText(rawContent);

                if (title.isBlank() || link.isBlank()) {
                    skipped++;
                    continue;
                }

                String combinedLower = (title + " " + excerpt).toLowerCase(Locale.ROOT);
                if (!looksLikeCivicEvent(combinedLower)) {
                    skipped++;
                    continue;
                }

                if (eventRepository.existsByMunicipalityAndSourceUrl(municipality, link)) {
                    skipped++;
                    continue;
                }

                LocalDate eventDate = extractEventDate(title + " " + excerpt + " " + fullText, offsetDays);
                if (eventRepository.existsByMunicipalityAndTitleAndDate(municipality, truncate(title, 180), eventDate)) {
                    skipped++;
                    continue;
                }

                LocalTime[] times = extractTimes(title + " " + excerpt + " " + fullText);
                EventCategory category = classifyCategory(combinedLower);

                String descShort = excerpt.isBlank()
                    ? truncate(fullText, 160)
                    : truncate(excerpt, 160);

                String descFull = fullText.isBlank()
                    ? (excerpt.isBlank() ? title : excerpt)
                    : truncate(fullText, 650);

                Event event = new Event();
                event.setMunicipality(municipality);
                event.setCategory(category);
                event.setTitle(truncate(title, 180));
                event.setDescShort(descShort);
                event.setDescFull(descFull);
                event.setDate(eventDate);
                event.setStartTime(times[0]);
                event.setEndTime(times[1]);
                event.setLocationShort(source.cityLabel());
                event.setLocationFull("Programação oficial — " + source.cityLabel());
                event.setAudience("Aberto à população");
                event.setBefore("Publicação importada automaticamente do portal oficial da prefeitura. Confira detalhes no link oficial.");
                event.setSourceType("AUTO_PORTAL");
                event.setSourceUrl(link);

                eventService.save(event);
                imported++;
                offsetDays = Math.min(offsetDays + 2, 25);
            }

            return new SyncResult(
                municipality,
                source.label(),
                imported,
                skipped,
                "OK",
                imported > 0
                    ? imported + " evento(s) importado(s) do portal oficial."
                    : "Agenda já está atualizada com as publicações do portal."
            );
        } catch (Exception ex) {
            log.warn("Falha ao sincronizar eventos de {}: {}", municipality, ex.getMessage());
            return new SyncResult(
                municipality,
                source.label(),
                imported,
                skipped,
                "OFFLINE_OR_BLOCKED",
                "Não foi possível conectar ao portal oficial agora. Os eventos já salvos continuam disponíveis."
            );
        }
    }

    private boolean looksLikeCivicEvent(String text) {
        for (String keyword : EVENT_KEYWORDS) {
            if (text.contains(keyword)) {
                return true;
            }
        }
        return false;
    }

    private EventCategory classifyCategory(String text) {
        if (text.contains("oficina") || text.contains("curso") || text.contains("capacita") || text.contains("palestra")) {
            return EventCategory.Oficinas;
        }
        if (text.contains("esporte") || text.contains("corrida") || text.contains("campeonato") || text.contains("torneio") || text.contains("lazer")) {
            return EventCategory.EsporteELazer;
        }
        if (text.contains("familia") || text.contains("família") || text.contains("infantil") || text.contains("crianca") || text.contains("criança") || text.contains("vacina")) {
            return EventCategory.ParaFamilias;
        }
        return EventCategory.Cultura;
    }

    private LocalDate extractEventDate(String text, int fallbackOffsetDays) {
        LocalDate today = LocalDate.now();

        Matcher fullMatcher = FULL_DATE_PATTERN.matcher(text);
        while (fullMatcher.find()) {
            try {
                int day = Integer.parseInt(fullMatcher.group(1));
                int month = Integer.parseInt(fullMatcher.group(2));
                int year = Integer.parseInt(fullMatcher.group(3));
                LocalDate parsed = LocalDate.of(year, month, day);
                if (!parsed.isBefore(today)) {
                    return parsed;
                }
            } catch (Exception ignored) {
            }
        }

        Matcher shortMatcher = SHORT_DATE_PATTERN.matcher(text);
        int currentYear = Year.now().getValue();
        while (shortMatcher.find()) {
            try {
                int day = Integer.parseInt(shortMatcher.group(1));
                int month = Integer.parseInt(shortMatcher.group(2));
                LocalDate parsed = LocalDate.of(currentYear, month, day);
                if (!parsed.isBefore(today)) {
                    return parsed;
                }
            } catch (Exception ignored) {
            }
        }

        return today.plusDays(fallbackOffsetDays);
    }

    private LocalTime[] extractTimes(String text) {
        Matcher matcher = TIME_PATTERN.matcher(text);
        LocalTime start = LocalTime.of(9, 0);
        LocalTime end = LocalTime.of(17, 0);

        if (matcher.find()) {
            try {
                int hour = Integer.parseInt(matcher.group(1));
                int min = matcher.group(2) != null ? Integer.parseInt(matcher.group(2)) : 0;
                if (hour >= 6 && hour <= 22) {
                    start = LocalTime.of(hour, min);
                    end = start.plusHours(3);
                    if (!end.isAfter(start)) {
                        end = LocalTime.of(23, 59);
                    }
                }
            } catch (Exception ignored) {
            }
        }

        return new LocalTime[] { start, end };
    }

    private String cleanText(String html) {
        if (html == null || html.isBlank()) {
            return "";
        }
        String noTags = html.replaceAll("<[^>]+>", " ");
        String decoded = noTags
            .replace("&nbsp;", " ")
            .replace("&amp;", "&")
            .replace("&quot;", "\"")
            .replace("&#8211;", "–")
            .replace("&#8212;", "—")
            .replace("&#8216;", "'")
            .replace("&#8217;", "'")
            .replace("&#8220;", "\"")
            .replace("&#8221;", "\"")
            .replace("&lt;", "<")
            .replace("&gt;", ">");
        return decoded.replaceAll("\\s+", " ").trim();
    }

    private String truncate(String value, int maxLen) {
        if (value == null || value.length() <= maxLen) {
            return value;
        }
        return value.substring(0, maxLen - 3).trim() + "...";
    }

    private record PortalSource(String key, String label, String wpApiUrl, String cityLabel) {}

    public record SyncResult(
        String municipality,
        String source,
        int imported,
        int skipped,
        String status,
        String message
    ) {}
}

