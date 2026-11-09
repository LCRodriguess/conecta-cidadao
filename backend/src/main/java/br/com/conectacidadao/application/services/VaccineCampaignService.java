package br.com.conectacidadao.application.services;

import java.util.UUID;
import br.com.conectacidadao.domain.entities.VaccineCampaign;
import br.com.conectacidadao.domain.repositories.VaccineCampaignRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VaccineCampaignService 
{
    private final VaccineCampaignRepository vaccineCampaignRepository;

    public VaccineCampaignService(VaccineCampaignRepository vaccineCampaignRepository) 
    {
        this.vaccineCampaignRepository = vaccineCampaignRepository;
    }

    public List<VaccineCampaign> findByMunicipality(String municipality) 
    {
        return vaccineCampaignRepository.findByMunicipality(municipality);
    }

    public VaccineCampaign save(VaccineCampaign campaign) 
    {
        return vaccineCampaignRepository.save(campaign);
    }

    public void delete(UUID id) 
    {
        vaccineCampaignRepository.deleteById(id);
    }
}