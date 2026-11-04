package br.com.conectacidadao.controller;
import br.com.conectacidadao.domain.entities.Occurrence;
import br.com.conectacidadao.services.OccurrenceService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/occurrences")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class OccurrenceController 
{
    private final OccurrenceService occurrenceService;

    public OccurrenceController(OccurrenceService occurrenceService) 
    {
        this.occurrenceService = occurrenceService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Occurrence create(@RequestBody Occurrence occurrence) 
    {
        return occurrenceService.create(occurrence);
    }

    @GetMapping
    public List<Occurrence> findAll() 
    {
        return occurrenceService.findAll();
    }
   
    @GetMapping("/{id}")
    public Occurrence findById(@PathVariable UUID id) 
    {
        return occurrenceService.findById(id);
    }

    @PutMapping("/{id}")
    public Occurrence update(
            @PathVariable UUID id,
            @RequestBody Occurrence occurrence) 
            {
        return occurrenceService.update(id, occurrence);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) 
    {
        occurrenceService.delete(id);
    }
}