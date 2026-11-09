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
@Table(name = "health_units")
public class HealthUnit 
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String name;
    private String municipality;
    private String badge;
    private String badgeClass;
    private String type;
    private String address;
    private String phone;

    public HealthUnit() 
    {

    }

    public HealthUnit(String name, String municipality, String badge,
                      String badgeClass, String type, String address,
                      String phone) {
        this.name = name;
        this.municipality = municipality;
        this.badge = badge;
        this.badgeClass = badgeClass;
        this.type = type;
        this.address = address;
        this.phone = phone;
    }

    public UUID getId() 
    {
        return id;
    }

    public void setId(UUID id) 
    {
        this.id = id;
    }

    public String getName() 
    {
        return name;
    }

    public void setName(String name) 
    {
        this.name = name;
    }

    public String getMunicipality() 
    {
        return municipality;
    }

    public void setMunicipality(String municipality) 
    {
        this.municipality = municipality;
    }

    public String getBadge() 
    {
        return badge;
    }

    public void setBadge(String badge) 
    {
        this.badge = badge;
    }

    public String getBadgeClass() 
    {
        return badgeClass;
    }

    public void setBadgeClass(String badgeClass) 
    {
        this.badgeClass = badgeClass;
    }

    public String getType() 
    {
        return type;
    }

    public void setType(String type) 
    {
        this.type = type;
    }

    public String getAddress() 
    {
        return address;
    }

    public void setAddress(String address) 
    {
        this.address = address;
    }

    public String getPhone() 
    {
        return phone;
    }

    public void setPhone(String phone) 
    {
        this.phone = phone;
    }
}