package br.com.conectacidadao.application.services;

import java.util.UUID;
import br.com.conectacidadao.domain.entities.HealthUnit;
import br.com.conectacidadao.domain.repositories.HealthUnitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class HealthUnitService {

    private final HealthUnitRepository healthUnitRepository;

    public HealthUnitService(HealthUnitRepository healthUnitRepository) 
    {
        this.healthUnitRepository = healthUnitRepository;
    }

    public List<HealthUnit> findByMunicipality(String municipality) 
    {
        return healthUnitRepository.findByMunicipality(municipality);
    }

    public HealthUnit save(HealthUnit healthUnit) 
    {
        return healthUnitRepository.save(healthUnit);
    }

    public void delete(UUID id) 
    {
        healthUnitRepository.deleteById(id);
    }
}