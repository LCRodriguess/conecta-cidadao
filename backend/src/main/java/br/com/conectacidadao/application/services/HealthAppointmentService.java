package br.com.conectacidadao.application.services;
import br.com.conectacidadao.domain.entities.HealthAppointment;
import br.com.conectacidadao.domain.repositories.HealthAppointmentRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class HealthAppointmentService 
{
    private final HealthAppointmentRepository healthAppointmentRepository;

    public HealthAppointmentService(HealthAppointmentRepository healthAppointmentRepository) 
    {
        this.healthAppointmentRepository = healthAppointmentRepository;
    }

    public List<HealthAppointment> findByMunicipality(String municipality) 
    {
        return healthAppointmentRepository.findByMunicipality(municipality);
    }

    public HealthAppointment save(HealthAppointment appointment) 
    {
        return healthAppointmentRepository.save(appointment);
    }

    public void delete(String id) 
    {
        healthAppointmentRepository.deleteById(id);
    }
}