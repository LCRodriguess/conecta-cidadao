package br.com.conectacidadao.domain.repositories;

import br.com.conectacidadao.domain.entities.OccurrenceComplement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OccurrenceComplementRepository extends JpaRepository<OccurrenceComplement, UUID> 
{
    List<OccurrenceComplement> findByOccurrenceId(UUID occurrenceId);
}
