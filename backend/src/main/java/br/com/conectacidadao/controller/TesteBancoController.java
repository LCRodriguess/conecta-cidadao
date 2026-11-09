package br.com.conectacidadao.controller;

import java.util.Map;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TesteBancoController {

    private final JdbcTemplate jdbcTemplate;

    public TesteBancoController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/api/teste/banco")
    public Map<String, Object> testarBanco() {

        String nomeBanco = jdbcTemplate.queryForObject("select current_database()", String.class);
        String versao = jdbcTemplate.queryForObject("show server_version", String.class);

        return Map.of(
            "status", "ok",
            "mensagem", "Backend conectado ao Supabase (PostgreSQL)!",
            "banco", nomeBanco,
            "versao", versao
        );
    }
}
