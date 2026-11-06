package br.com.conectacidadao.application.services;
import java.time.LocalDate;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;
import br.com.conectacidadao.application.validators.EventValidator;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;
import br.com.conectacidadao.domain.repositories.EventRepository;

@Service
public class EventService 
{
    private final EventRepository eventRepository;
    private final EventValidator eventValidator;

    public EventService(EventRepository eventRepository) 
    {
        this.eventRepository = eventRepository;
        this.eventValidator = new EventValidator();
    }

    public List<Event> findByFilters(
            String municipality,
            EventCategory category,
            LocalDate startDate,
            LocalDate endDate,
            String search) {

        List<Event> events = eventRepository
                .findByMunicipalityOrderByDateAscStartTimeAsc(municipality);

        if (category != null) {
            events = events.stream()
                    .filter(event -> event.getCategory() == category)
                    .toList();
        }

        if (startDate != null && endDate != null) {
            events = events.stream()
                    .filter(event -> event.getDate() != null
                            && !event.getDate().isBefore(startDate)
                            && !event.getDate().isAfter(endDate))
                    .toList();
        }

        if (search != null && !search.isBlank()) {
            String term = search.trim().toLowerCase(Locale.ROOT);

            events = events.stream()
                    .filter(event ->
                            contains(event.getTitle(), term)
                            || contains(event.getDescShort(), term)
                            || contains(event.getDescFull(), term)
                            || (event.getCategory() != null
                                    && contains(event.getCategory().name(), term)))
                    .toList();
        }

        return events;
    }

    private boolean contains(String value, String term) {
        return value != null
                && value.toLowerCase(Locale.ROOT).contains(term);
    }

    public Event findById(String id) 
    {
        return eventRepository.findById(id).orElse(null);
    }

    public Event save(Event event) 
    {
        eventValidator.validate(event);
        return eventRepository.save(event);
    }

    public void delete(String id) 
    {
        eventRepository.deleteById(id);
    }
}