package br.com.conectacidadao.controller;
import br.com.conectacidadao.domain.entities.OccurrenceComplement;
import br.com.conectacidadao.application.services.OccurrenceComplementService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/occurrences/{occurrenceId}/complements")
@CrossOrigin(origins = "*")
public class OccurrenceComplementController 
{
    private final OccurrenceComplementService complementService;

    public OccurrenceComplementController(
            OccurrenceComplementService complementService) {
        this.complementService = complementService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OccurrenceComplement create(
            @PathVariable UUID occurrenceId,
            @RequestBody ComplementRequest request) {

        return complementService.create(
                occurrenceId,
                request.description()
        );
    }

    @GetMapping
    public List<OccurrenceComplement> findByOccurrenceId(
            @PathVariable UUID occurrenceId) {

        return complementService.findByOccurrenceId(occurrenceId);
    }

    public record ComplementRequest(String description) 
    {
        
    }
}