package br.com.conectacidadao.application.services;
import java.text.Normalizer;
import java.text.NumberFormat;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.UriComponentsBuilder;

import tools.jackson.databind.JsonNode;

@Service
public class JoonowJobService {

    private static final String API_URL = "https://www.joonow.com/api/v1/jobs";
    private static final Duration CACHE_DURATION = Duration.ofHours(1);

    private static final Map<String, Municipality> MUNICIPALITIES = Map.of(
        "rio-das-ostras", new Municipality("Rio das Ostras", "RJ"),
        "sapucaia", new Municipality("Sapucaia do Sul", "RS")
    );

    private final RestClient restClient;
    private final Map<String, CachedResponse> cache = new ConcurrentHashMap<>();

    public JoonowJobService() {
        this.restClient = RestClient.create();
    }

    public JobResponse getJobs(String municipalityKey) {
        Municipality municipality = MUNICIPALITIES.get(municipalityKey);

        if (municipality == null) {
            throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Município não permitido."
            );
        }

        CachedResponse cached = cache.get(municipalityKey);

        if (cached != null && Instant.now().isBefore(cached.expiresAt())) {
            return cached.response();
        }

        JobResponse response = fetchJobs(municipality);

        cache.put(
            municipalityKey,
            new CachedResponse(response, Instant.now().plus(CACHE_DURATION))
        );

        return response;
    }

    private JobResponse fetchJobs(Municipality municipality) {
        var uri = UriComponentsBuilder
            .fromUriString(API_URL)
            .queryParam("l", municipality.name())
            .queryParam("country", "BR")
            .queryParam("lang", "pt")
            .queryParam("limit", 50)
            .build()
            .encode()
            .toUri();

        try {
            JsonNode root = restClient
                .get()
                .uri(uri)
                .retrieve()
                .body(JsonNode.class);

            if (root == null || !root.path("data").isArray()) {
                throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    "A Joonow retornou uma resposta inválida."
                );
            }

            List<JobDto> jobs = new ArrayList<>();

            for (JsonNode item : root.path("data")) {
                JsonNode location = item.path("location");

                String city = text(location, "city");
                String region = text(location, "region");
                String country = text(location, "country");

                boolean correctCity = normalize(city).equals(normalize(municipality.name()));
                boolean correctRegion = region.equalsIgnoreCase(municipality.state());
                boolean correctCountry = country.equalsIgnoreCase("BR");

                if (correctCity && correctRegion && correctCountry) {
                    jobs.add(mapJob(item, municipality));
                }
            }

            JsonNode attribution = root.path("attribution");

            return new JobResponse(
                municipality.name(),
                municipality.state(),
                jobs.size(),
                jobs,
                text(attribution, "text"),
                text(attribution, "url")
            );

        } catch (RestClientException exception) {
            throw new ResponseStatusException(
                HttpStatus.BAD_GATEWAY,
                "Não foi possível consultar as vagas da Joonow no momento.",
                exception
            );
        }
    }

    private JobDto mapJob(JsonNode item, Municipality municipality) {
        JsonNode company = item.path("company");
        JsonNode salary = item.path("salary");

        return new JobDto(
            text(item, "id"),
            text(item, "title"),
            text(company, "name"),
            municipality.name(),
            municipality.state(),
            text(item, "workModel"),
            text(item, "employmentType"),
            text(item, "seniority"),
            formatSalary(salary),
            text(item, "postedAt"),
            text(item, "validThrough"),
            text(item, "url"),
            text(item, "description")
        );
    }

    private String formatSalary(JsonNode salary) {
        if (salary == null || salary.isMissingNode() || salary.isNull()) {
            return "Não informado";
        }

        JsonNode min = salary.path("min");
        JsonNode max = salary.path("max");
        String currency = text(salary, "currency");
        String period = text(salary, "period");

        if (!min.isNumber() && !max.isNumber()) {
            return "Não informado";
        }

        if (!"BRL".equalsIgnoreCase(currency)) {
            return "Valor informado pela fonte";
        }

        NumberFormat formatter = NumberFormat.getCurrencyInstance(
            Locale.forLanguageTag("pt-BR")
        );

        String value;

        if (min.isNumber() && max.isNumber()) {
            value = formatter.format(min.doubleValue())
                + " a "
                + formatter.format(max.doubleValue());
        } else if (min.isNumber()) {
            value = "A partir de " + formatter.format(min.doubleValue());
        } else {
            value = "Até " + formatter.format(max.doubleValue());
        }

        if ("Month".equalsIgnoreCase(period)) {
            value += " / mês";
        } else if ("Year".equalsIgnoreCase(period)) {
            value += " / ano";
        } else if ("Hour".equalsIgnoreCase(period)) {
            value += " / hora";
        }

        return value;
    }

    private String text(JsonNode node, String field) {
        JsonNode value = node.path(field);

        if (value.isMissingNode() || value.isNull()) {
            return "";
        }

        return value.asText("");
    }

    private String normalize(String value) {
        return Normalizer.normalize(value == null ? "" : value, Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "")
            .toLowerCase(Locale.ROOT)
            .trim();
    }

    private record Municipality(String name, String state) {}

    private record CachedResponse(JobResponse response, Instant expiresAt) {}

    public record JobResponse(
        String municipality,
        String state,
        int total,
        List<JobDto> jobs,
        String attributionText,
        String attributionUrl
    ) {}

    public record JobDto(
        String id,
        String title,
        String companyName,
        String city,
        String region,
        String workModel,
        String employmentType,
        String seniority,
        String salary,
        String postedAt,
        String validThrough,
        String url,
        String description
    ) {}
}