package br.com.conectacidadao.repositories;
import br.com.conectacidadao.domain.entities.OccurrenceComplement;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.UUID;

public interface OccurrenceComplementRepository extends MongoRepository<OccurrenceComplement, UUID> 
{
    List<OccurrenceComplement> findByOccurrenceId(UUID occurrenceId);
}