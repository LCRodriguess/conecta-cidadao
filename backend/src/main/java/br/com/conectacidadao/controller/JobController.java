package br.com.conectacidadao.controller;
import br.com.conectacidadao.application.services.JoonowJobService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    private final JoonowJobService joonowJobService;

    public JobController(JoonowJobService joonowJobService) {
        this.joonowJobService = joonowJobService;
    }

    @GetMapping("/{municipality}")
    public ResponseEntity<JoonowJobService.JobResponse> getJobs(
        @PathVariable String municipality
    ) {
        return ResponseEntity.ok(
            joonowJobService.getJobs(municipality)
        );
    }
}