package br.com.conectacidadao.controller;

import java.util.UUID;
import br.com.conectacidadao.application.services.VaccineCampaignService;
import br.com.conectacidadao.domain.entities.VaccineCampaign;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/health/campaigns")
@CrossOrigin(origins = "*")
public class VaccineCampaignController {

    private final VaccineCampaignService vaccineCampaignService;

    public VaccineCampaignController(VaccineCampaignService vaccineCampaignService) 
    {
        this.vaccineCampaignService = vaccineCampaignService;
    }

    @GetMapping("/{municipality}")
    public ResponseEntity<List<VaccineCampaign>> findByMunicipality(
            @PathVariable String municipality) {

        return ResponseEntity.ok(
                vaccineCampaignService.findByMunicipality(municipality)
        );
    }

    @PostMapping
    public ResponseEntity<VaccineCampaign> save(
            @RequestBody VaccineCampaign campaign) {

        return ResponseEntity.ok(vaccineCampaignService.save(campaign));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        vaccineCampaignService.delete(id);
        return ResponseEntity.noContent().build();
    }
}