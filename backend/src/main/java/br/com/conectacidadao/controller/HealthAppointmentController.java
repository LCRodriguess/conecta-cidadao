package br.com.conectacidadao.controller;

import java.util.UUID;
import br.com.conectacidadao.application.services.HealthAppointmentService;
import br.com.conectacidadao.domain.entities.HealthAppointment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/health/appointments")
@CrossOrigin(origins = "*")
public class HealthAppointmentController 
{
    private final HealthAppointmentService healthAppointmentService;

    public HealthAppointmentController(HealthAppointmentService healthAppointmentService) 
    {
        this.healthAppointmentService = healthAppointmentService;
    }

    @GetMapping("/{municipality}")
    public ResponseEntity<List<HealthAppointment>> findByMunicipality(
            @PathVariable String municipality) {

        return ResponseEntity.ok(
                healthAppointmentService.findByMunicipality(municipality)
        );
    }

    @PostMapping
    public ResponseEntity<HealthAppointment> save(
            @RequestBody HealthAppointment appointment) {

        return ResponseEntity.ok(
                healthAppointmentService.save(appointment)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) 
    {
        healthAppointmentService.delete(id);
        return ResponseEntity.noContent().build();
    }
}