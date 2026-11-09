package br.com.conectacidadao.domain.repositories;

import java.util.UUID;
import br.com.conectacidadao.domain.entities.VaccineCampaign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VaccineCampaignRepository extends JpaRepository<VaccineCampaign, UUID> 
{
    List<VaccineCampaign> findByMunicipality(String municipality);
}