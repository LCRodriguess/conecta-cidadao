package br.com.conectacidadao.controller;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.conectacidadao.application.services.EventService;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class EventController 
{
    private final EventService eventService;

    public EventController(EventService eventService) 
    {
        this.eventService = eventService;
    }

    @GetMapping("/{municipality}")
    public ResponseEntity<List<Event>> findByFilters(
            @PathVariable String municipality,
            @RequestParam(required = false) EventCategory category,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search) {

        if ((startDate == null) != (endDate == null)) {
            return ResponseEntity.badRequest().build();
        }

        if (startDate != null && endDate.isBefore(startDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<Event> events = eventService.findByFilters(
                municipality,
                category,
                startDate,
                endDate,
                search
        );

        return ResponseEntity.ok(events);
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<Event> findById(@PathVariable String id) 
    {
        Event event = eventService.findById(id);

        if (event == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(event);
    }

    @PostMapping
    public ResponseEntity<?> save(@RequestBody Event event) 
    {
        try {
            Event savedEvent = eventService.save(event);

            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(savedEvent);

        } catch (IllegalArgumentException exception) 
        {
            return ResponseEntity
                    .badRequest()
                    .body(exception.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) 
    {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }
}