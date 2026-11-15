package br.com.conectacidadao.controller;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import br.com.conectacidadao.application.services.EventService;
import br.com.conectacidadao.application.services.EventSyncService;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*")
public class EventController 
{
    private final EventService eventService;
    private final EventSyncService eventSyncService;

    public EventController(EventService eventService, EventSyncService eventSyncService) 
    {
        this.eventService = eventService;
        this.eventSyncService = eventSyncService;
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

        if (startDate != null && endDate != null
                && endDate.isBefore(startDate)) {
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
    public ResponseEntity<Event> findById(@PathVariable UUID id) 
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
    public ResponseEntity<Void> delete(@PathVariable UUID id) 
    {
        eventService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/sync")
    public ResponseEntity<List<EventSyncService.SyncResult>> syncAll()
    {
        return ResponseEntity.ok(eventSyncService.syncAll());
    }

    @PostMapping("/sync/{municipality}")
    public ResponseEntity<?> syncMunicipality(@PathVariable String municipality)
    {
        try {
            return ResponseEntity.ok(eventSyncService.syncMunicipality(municipality));
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(exception.getMessage());
        }
    }
}