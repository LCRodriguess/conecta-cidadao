package br.com.conectacidadao.domain.repositories;

import java.util.UUID;
import br.com.conectacidadao.domain.entities.HealthUnit;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthUnitRepository extends JpaRepository<HealthUnit, UUID> 
{
    List<HealthUnit> findByMunicipality(String municipality);
}