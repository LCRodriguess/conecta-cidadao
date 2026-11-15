package br.com.conectacidadao.config;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

public class DatabaseFallbackListener implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    private static final Logger log = LoggerFactory.getLogger(DatabaseFallbackListener.class);

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment env = event.getEnvironment();
        String url = env.getProperty("SUPABASE_DB_URL", "").trim();
        String user = env.getProperty("SUPABASE_DB_USER", "").trim();
        String pass = env.getProperty("SUPABASE_DB_PASSWORD", "").trim();

        if (!url.isBlank() && canConnect(url, user, pass)) {
            log.info("Conexão com Supabase PostgreSQL verificada com sucesso.");
            return;
        }

        log.warn("Supabase indisponível ou sem credenciais no .env. Subindo banco local H2 (modo PostgreSQL) com os dados iniciais.");

        Map<String, Object> h2Props = Map.of(
            "spring.datasource.url", "jdbc:h2:mem:conectacidadao;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;DEFAULT_NULL_ORDERING=HIGH;DB_CLOSE_DELAY=-1",
            "spring.datasource.driver-class-name", "org.h2.Driver",
            "spring.datasource.username", "sa",
            "spring.datasource.password", "",
            "spring.flyway.locations", "classpath:db/h2",
            "spring.jpa.database-platform", "org.hibernate.dialect.H2Dialect"
        );

        env.getPropertySources().addFirst(new MapPropertySource("h2Fallback", h2Props));
    }

    private boolean canConnect(String url, String user, String pass) {
        int previousTimeout = DriverManager.getLoginTimeout();
        try {
            // Timeout curto para não travar o boot se o Supabase estiver inacessível
            DriverManager.setLoginTimeout(4);
            try (Connection conn = DriverManager.getConnection(url, user, pass)) {
                return conn.isValid(3);
            }
        } catch (Exception ex) {
            log.warn("Falha ao conectar ao Supabase ({}): {}", url, ex.getMessage());
            return false;
        } finally {
            DriverManager.setLoginTimeout(previousTimeout);
        }
    }
}

