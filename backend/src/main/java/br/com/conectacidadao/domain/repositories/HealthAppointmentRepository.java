package br.com.conectacidadao.domain.repositories;
import br.com.conectacidadao.domain.entities.HealthAppointment;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface HealthAppointmentRepository extends MongoRepository<HealthAppointment, String> 
{
    List<HealthAppointment> findByMunicipality(String municipality);
}