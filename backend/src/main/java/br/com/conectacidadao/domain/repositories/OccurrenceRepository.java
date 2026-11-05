package br.com.conectacidadao.repositories;
import br.com.conectacidadao.domain.entities.Occurrence;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.UUID;

public interface OccurrenceRepository extends MongoRepository<Occurrence, UUID> 
{
    
}