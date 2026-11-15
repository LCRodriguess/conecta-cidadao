package br.com.conectacidadao.application.services;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Deque;
import java.util.List;
import java.util.concurrent.ConcurrentLinkedDeque;

import org.springframework.stereotype.Service;

@Service
public class AdminAuditService {

    private static final int MAX_LOGS = 200;
    private final Deque<AuditEntry> logs = new ConcurrentLinkedDeque<>();

    public AdminAuditService() {
        record("TI_INFRA", "SISTEMA", "Backend Spring Boot inicializado", "INFO");
    }

    public AuditEntry record(String actorRole, String module, String action, String level) {
        AuditEntry entry = new AuditEntry(
            Instant.now().toString(),
            actorRole != null && !actorRole.isBlank() ? actorRole : "SISTEMA",
            module != null && !module.isBlank() ? module : "GERAL",
            action != null && !action.isBlank() ? action : "Ação registrada",
            level != null && !level.isBlank() ? level : "INFO"
        );
        logs.addFirst(entry);
        while (logs.size() > MAX_LOGS) {
            logs.pollLast();
        }
        return entry;
    }

    public List<AuditEntry> listRecent() {
        return Collections.unmodifiableList(new ArrayList<>(logs));
    }

    public record AuditEntry(
        String timestamp,
        String actorRole,
        String module,
        String action,
        String level
    ) {}
}

