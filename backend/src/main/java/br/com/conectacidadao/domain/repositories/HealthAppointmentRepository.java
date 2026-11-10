package br.com.conectacidadao.domain.repositories;

import java.util.UUID;
import br.com.conectacidadao.domain.entities.HealthAppointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthAppointmentRepository extends JpaRepository<HealthAppointment, UUID> 
{
    List<HealthAppointment> findByMunicipality(String municipality);
}