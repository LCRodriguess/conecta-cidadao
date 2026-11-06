package br.com.conectacidadao.domain.repositories;
import br.com.conectacidadao.domain.entities.VaccineCampaign;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface VaccineCampaignRepository extends MongoRepository<VaccineCampaign, String> 
{
    List<VaccineCampaign> findByMunicipality(String municipality);
}