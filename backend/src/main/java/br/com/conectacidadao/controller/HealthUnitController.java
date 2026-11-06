package br.com.conectacidadao.controller;
import br.com.conectacidadao.application.HealthUnitService;
import br.com.conectacidadao.domain.entities.HealthUnit;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/health/units")
@CrossOrigin(origins = "http://127.0.0.1:5500")
public class HealthUnitController {

    private final HealthUnitService healthUnitService;

    public HealthUnitController(HealthUnitService healthUnitService) 
    {
        this.healthUnitService = healthUnitService;
    }

    @GetMapping("/{municipality}")
    public ResponseEntity<List<HealthUnit>> findByMunicipality(
            @PathVariable String municipality) {

        return ResponseEntity.ok(
                healthUnitService.findByMunicipality(municipality)
        );
    }

    @PostMapping
    public ResponseEntity<HealthUnit> save(
            @RequestBody HealthUnit healthUnit) {

        return ResponseEntity.ok(
                healthUnitService.save(healthUnit)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {

        healthUnitService.delete(id);

        return ResponseEntity.noContent().build();
    }
}