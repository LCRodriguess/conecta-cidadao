package br.com.conectacidadao.domain.entities;
import br.com.conectacidadao.domain.entities.enums.OccurrenceCategory;
import br.com.conectacidadao.domain.entities.enums.OccurrenceStatus;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "occurrences")
public class Occurrence 
{

    @Id
    private UUID id;

    private String protocol;
    private String title;
    private String description;

    private OccurrenceCategory category;
    private OccurrenceStatus status;

    private String municipality;
    private String street;
    private String number;
    private String neighborhood;
    private String referencePoint;
    private String photoUrl;

    private LocalDateTime createdAt;

    public Occurrence() 
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

    public String getProtocol() 
    {
        return protocol;
    }

    public void setProtocol(String protocol) 
    {
        this.protocol = protocol;
    }

    public String getTitle() 
    {
        return title;
    }

    public void setTitle(String title) 
    {
        this.title = title;
    }

    public String getDescription() 
    {
        return description;
    }

    public void setDescription(String description) 
    {
        this.description = description;
    }

    public OccurrenceCategory getCategory() 
    {
        return category;
    }

    public void setCategory(OccurrenceCategory category) 
    {
        this.category = category;
    }

    public OccurrenceStatus getStatus() 
    {
        return status;
    }

    public void setStatus(OccurrenceStatus status) 
    {
        this.status = status;
    }

    public String getMunicipality() 
    {
        return municipality;
    }

    public void setMunicipality(String municipality) 
    {
        this.municipality = municipality;
    }

    public String getStreet() 
    {
        return street;
    }

    public void setStreet(String street) 
    {
        this.street = street;
    }

    public String getNumber() 
    {
        return number;
    }

    public void setNumber(String number) 
    {
        this.number = number;
    }

    public String getNeighborhood() 
    {
        return neighborhood;
    }

    public void setNeighborhood(String neighborhood) 
    {
        this.neighborhood = neighborhood;
    }

    public String getReferencePoint() 
    {
        return referencePoint;
    }

    public void setReferencePoint(String referencePoint) 
    {
        this.referencePoint = referencePoint;
    }

    public String getPhotoUrl() 
    {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) 
    {
        this.photoUrl = photoUrl;
    }

    public LocalDateTime getCreatedAt() 
    {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) 
    {
        this.createdAt = createdAt;
    }
}