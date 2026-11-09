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
import java.time.LocalDate;
import java.time.LocalTime;
import br.com.conectacidadao.domain.entities.enums.EventCategory;

@Entity
@Table(name = "events")
public class Event 
{
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    private String municipality;
    @Enumerated(EnumType.STRING)
    private EventCategory category;

    private String title;
    private String descShort;
    private String descFull;

    @Column(name = "event_date")
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String locationShort;
    private String locationFull;

    private String audience;
    @Column(name = "before_text")
    private String before;

    public Event() 
    {

    }

    public UUID getId() 
    {
        return id;
    }

    public void setId(UUID id) 
    {
        this.id = id;
    }

    public String getMunicipality() 
    {
        return municipality;
    }

    public void setMunicipality(String municipality) 
    {
        this.municipality = municipality;
    }

    public EventCategory getCategory() 
    {
        return category;
    }

    public void setCategory(EventCategory category) 
    {
        this.category = category;
    }

    public String getTitle() 
    {
        return title;
    }

    public void setTitle(String title) 
    {
        this.title = title;
    }

    public String getDescShort() 
    {
        return descShort;
    }

    public void setDescShort(String descShort) 
    {
        this.descShort = descShort;
    }

    public String getDescFull() 
    {
        return descFull;
    }

    public void setDescFull(String descFull) 
    {
        this.descFull = descFull;
    }

    public LocalDate getDate() 
    {
        return date;
    }

    public void setDate(LocalDate date) 
    {
        this.date = date;
    }

    public LocalTime getStartTime() 
    {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) 
    {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() 
    {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) 
    {
        this.endTime = endTime;
    }

    public String getLocationShort() 
    {
        return locationShort;
    }

    public void setLocationShort(String locationShort) 
    {
        this.locationShort = locationShort;
    }

    public String getLocationFull() 
    {
        return locationFull;
    }

    public void setLocationFull(String locationFull) 
    {
        this.locationFull = locationFull;
    }

    public String getAudience() 
    {
        return audience;
    }

    public void setAudience(String audience) 
    {
        this.audience = audience;
    }

    public String getBefore() 
    {
        return before;
    }

    public void setBefore(String before) 
    {
        this.before = before;
    }
}