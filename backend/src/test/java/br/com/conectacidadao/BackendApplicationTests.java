package br.com.conectacidadao;

import br.com.conectacidadao.application.services.EventService;
import br.com.conectacidadao.application.services.OccurrenceComplementService;
import br.com.conectacidadao.application.services.OccurrenceService;
import br.com.conectacidadao.application.validators.EventValidator;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.Occurrence;
import br.com.conectacidadao.domain.entities.OccurrenceComplement;
import br.com.conectacidadao.domain.entities.enums.EventCategory;
import br.com.conectacidadao.domain.entities.enums.OccurrenceCategory;
import br.com.conectacidadao.domain.entities.enums.OccurrenceStatus;
import br.com.conectacidadao.domain.repositories.EventRepository;
import br.com.conectacidadao.domain.repositories.OccurrenceComplementRepository;
import br.com.conectacidadao.domain.repositories.OccurrenceRepository;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class BackendApplicationTests {

    @Test
    void deveValidarEventoValidoParaRioDasOstrasESapucaia() {
        EventValidator validator = new EventValidator();

        Event event = new Event();
        event.setMunicipality("rio-das-ostras");
        event.setCategory(EventCategory.Cultura);
        event.setTitle("Festival Cultural na Orla");
        event.setDescFull("Apresentações gratuitas de música e gastronomia local.");
        event.setDate(LocalDate.of(2026, 11, 20));
        event.setStartTime(LocalTime.of(14, 0));
        event.setEndTime(LocalTime.of(20, 0));
        event.setLocationFull("Praia do Bosque - Rio das Ostras");
        event.setAudience("Livre para todas as idades");

        assertDoesNotThrow(() -> validator.validate(event));

        event.setMunicipality("sapucaia");
        assertDoesNotThrow(() -> validator.validate(event));
    }

    @Test
    void deveRejeitarEventoComMunicipioOuHorarioInvalido() {
        EventValidator validator = new EventValidator();

        Event event = new Event();
        event.setMunicipality("municipio-inexistente");
        event.setCategory(EventCategory.Oficinas);
        event.setTitle("Oficina");
        event.setDescFull("Descrição completa");
        event.setDate(LocalDate.of(2026, 11, 20));
        event.setStartTime(LocalTime.of(16, 0));
        event.setEndTime(LocalTime.of(14, 0));
        event.setLocationFull("Centro");
        event.setAudience("Jovens");

        assertThrows(IllegalArgumentException.class, () -> validator.validate(event));

        event.setMunicipality("rio-das-ostras");
        assertThrows(IllegalArgumentException.class, () -> validator.validate(event));
    }

    @Test
    void deveCriarOcorrenciaComStatusRecebidoEProtocoloAutomatico() {
        OccurrenceRepository repository = Mockito.mock(OccurrenceRepository.class);
        when(repository.count()).thenReturn(41L);
        when(repository.save(any(Occurrence.class))).thenAnswer(inv -> inv.getArgument(0));

        OccurrenceService service = new OccurrenceService(repository);

        Occurrence nova = new Occurrence();
        nova.setTitle("Poste apagado na rua principal");
        nova.setCategory(OccurrenceCategory.IluminacaoPublica);
        nova.setMunicipality("Rio das Ostras");

        Occurrence salva = service.create(nova);

        assertEquals(OccurrenceStatus.Recebido, salva.getStatus());
        assertNotNull(salva.getCreatedAt());
        assertNotNull(salva.getProtocol());
        assertTrue(salva.getProtocol().endsWith("-0042"));
    }

    @Test
    void deveRegistrarComplementoEmOcorrenciaExistente() {
        OccurrenceRepository occRepo = Mockito.mock(OccurrenceRepository.class);
        OccurrenceComplementRepository compRepo = Mockito.mock(OccurrenceComplementRepository.class);

        UUID occId = UUID.randomUUID();
        Occurrence existente = new Occurrence();
        existente.setId(occId);

        when(occRepo.findById(occId)).thenReturn(Optional.of(existente));
        when(compRepo.save(any(OccurrenceComplement.class))).thenAnswer(inv -> inv.getArgument(0));

        OccurrenceComplementService service = new OccurrenceComplementService(compRepo, occRepo);

        OccurrenceComplement comp = service.create(occId, "Equipe técnica agendou vistoria.");

        assertEquals(occId, comp.getOccurrenceId());
        assertEquals("Equipe técnica agendou vistoria.", comp.getDescription());
        assertNotNull(comp.getCreatedAt());
    }

    @Test
    void deveFiltrarEventosPorCategoriaEBuscaTextual() {
        EventRepository eventRepo = Mockito.mock(EventRepository.class);

        Event e1 = new Event();
        e1.setMunicipality("rio-das-ostras");
        e1.setCategory(EventCategory.Cultura);
        e1.setTitle("Jazz e Frutos do Mar");
        e1.setDescFull("Música instrumental");
        e1.setDate(LocalDate.of(2026, 11, 22));

        Event e2 = new Event();
        e2.setMunicipality("rio-das-ostras");
        e2.setCategory(EventCategory.EsporteELazer);
        e2.setTitle("Corrida Rústica Costazul");
        e2.setDescFull("Atletismo na orla");
        e2.setDate(LocalDate.of(2026, 11, 25));

        when(eventRepo.findByMunicipalityOrderByDateAscStartTimeAsc("rio-das-ostras"))
                .thenReturn(List.of(e1, e2));

        EventService service = new EventService(eventRepo);

        List<Event> filtrados = service.findByFilters(
                "rio-das-ostras",
                EventCategory.Cultura,
                null,
                null,
                "jazz"
        );

        assertEquals(1, filtrados.size());
        assertEquals("Jazz e Frutos do Mar", filtrados.get(0).getTitle());
    }
}
