package br.com.conectacidadao.controller;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class TesteBancoController {

    private final MongoTemplate mongoTemplate;

    public TesteBancoController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/api/teste/banco")
    public Map<String, Object> testarBanco() {

        String nomeBanco = mongoTemplate.getDb().getName();

        return Map.of(
            "status", "ok",
            "mensagem", "Backend conectado ao MongoDB!",
            "banco", nomeBanco
        );
    }
}