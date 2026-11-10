package br.com.conectacidadao.domain.repositories;

import br.com.conectacidadao.domain.entities.Occurrence;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface OccurrenceRepository extends JpaRepository<Occurrence, UUID> 
{
    
}
