package br.com.conectacidadao.domain.repositories;
import br.com.conectacidadao.domain.entities.HealthUnit;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HealthUnitRepository extends MongoRepository<HealthUnit, String> 
{
    List<HealthUnit> findByMunicipality(String municipality);
}