package br.com.conectacidadao.controller;

import java.lang.management.ManagementFactory;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.util.List;

import javax.sql.DataSource;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.conectacidadao.application.services.AdminAuditService;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    private final DataSource dataSource;
    private final AdminAuditService auditService;

    public AdminController(DataSource dataSource, AdminAuditService auditService) {
        this.dataSource = dataSource;
        this.auditService = auditService;
    }

    @GetMapping("/system-status")
    public SystemStatusResponse getSystemStatus() {
        long dbLatencyMs = -1;
        String dbStatus = "DOWN";
        String dbError = null;

        long startNs = System.nanoTime();
        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement("SELECT 1")) {
            ps.execute();
            dbLatencyMs = Math.max(1, (System.nanoTime() - startNs) / 1_000_000);
            dbStatus = "UP";
        } catch (Exception ex) {
            dbError = ex.getMessage();
        }

        Runtime runtime = Runtime.getRuntime();
        long usedMemoryMb = (runtime.totalMemory() - runtime.freeMemory()) / (1024 * 1024);
        long maxMemoryMb = runtime.maxMemory() / (1024 * 1024);
        long uptimeSeconds = ManagementFactory.getRuntimeMXBean().getUptime() / 1000;

        auditService.record("TI_INFRA", "MONITORAMENTO",
            "Verificação de status servidor/banco (" + dbStatus + ", " + dbLatencyMs + " ms)", "INFO");

        return new SystemStatusResponse(
            "UP",
            dbStatus,
            dbLatencyMs,
            dbError,
            usedMemoryMb,
            maxMemoryMb,
            uptimeSeconds
        );
    }

    @GetMapping("/audit-logs")
    public List<AdminAuditService.AuditEntry> getAuditLogs() {
        return auditService.listRecent();
    }

    @PostMapping("/audit-logs")
    public AdminAuditService.AuditEntry addAuditLog(@RequestBody AuditRequest request) {
        return auditService.record(
            request.actorRole(),
            request.module(),
            request.action(),
            request.level()
        );
    }

    public record AuditRequest(String actorRole, String module, String action, String level) {}

    public record SystemStatusResponse(
        String serverStatus,
        String databaseStatus,
        long databaseLatencyMs,
        String databaseError,
        long jvmUsedMemoryMb,
        long jvmMaxMemoryMb,
        long uptimeSeconds
    ) {}
}

