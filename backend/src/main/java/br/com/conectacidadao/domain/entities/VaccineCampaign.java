package br.com.conectacidadao.domain.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
@Entity
@Table(name = "vaccine_campaigns")
public class VaccineCampaign {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String name;
    private String targetAudience;
    private String municipality;
    private String note;

    public VaccineCampaign() 
    {

    }

    public VaccineCampaign(String name, String targetAudience,
                           String municipality, String note) {
        this.name = name;
        this.targetAudience = targetAudience;
        this.municipality = municipality;
        this.note = note;
    }

    public UUID getId() 
    {
        return id;
    }

    public String getName() 
    {
        return name;
    }

    public void setName(String name) 
    {
        this.name = name;
    }

    public String getTargetAudience() 
    {
        return targetAudience;
    }

    public void setTargetAudience(String targetAudience) 
    {
        this.targetAudience = targetAudience;
    }

    public String getMunicipality() 
    {
        return municipality;
    }

    public void setMunicipality(String municipality) 
    {
        this.municipality = municipality;
    }

    public String getNote() 
    {
        return note;
    }

    public void setNote(String note) 
    {
        this.note = note;
    }
}