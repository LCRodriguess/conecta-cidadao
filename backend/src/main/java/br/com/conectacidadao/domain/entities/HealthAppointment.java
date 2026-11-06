package br.com.conectacidadao.domain.entities;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import br.com.conectacidadao.domain.entities.enums.AppointmentType;

@Document(collection = "health_appointments")
public class HealthAppointment 
{
    @Id
    private String id;

    private String municipality;
    private String status;
    private String susCard;
    private AppointmentType type;
    private String professional;
    private String dateTime;
    private String location;
    private String actionLabel;
    private String instructions;

    public HealthAppointment() 
    {

    }

    public String getId() 
    {
        return id;
    }

    public String getMunicipality() 
    {
        return municipality;
    }

    public void setMunicipality(String municipality) 
    {
        this.municipality = municipality;
    }

    public String getStatus() 
    {
        return status;
    }

    public void setStatus(String status) 
    {
        this.status = status;
    }

    public String getSusCard() 
    {
        return susCard;
    }

    public void setSusCard(String susCard) 
    {
        this.susCard = susCard;
    }

    public AppointmentType getType() 
    {
        return type;
    }

    public void setType(AppointmentType type) 
    {
        this.type = type;
    }

    public String getProfessional() 
    {
        return professional;
    }

    public void setProfessional(String professional) 
    {
        this.professional = professional;
    }

    public String getDateTime() 
    {
        return dateTime;
    }

    public void setDateTime(String dateTime) 
    {
        this.dateTime = dateTime;
    }

    public String getLocation() 
    {
        return location;
    }

    public void setLocation(String location) 
    {
        this.location = location;
    }

    public String getActionLabel() 
    {
        return actionLabel;
    }

    public void setActionLabel(String actionLabel) 
    {
        this.actionLabel = actionLabel;
    }

    public String getInstructions() 
    {
        return instructions;
    }

    public void setInstructions(String instructions) 
    {
        this.instructions = instructions;
    }
}