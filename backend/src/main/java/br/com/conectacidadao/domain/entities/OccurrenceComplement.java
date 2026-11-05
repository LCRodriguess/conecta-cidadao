package br.com.conectacidadao.domain.entities;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.UUID;

@Document(collection = "occurrence_complements")
public class OccurrenceComplement {

    @Id
    private UUID id;

    private UUID occurrenceId;

    private String description;

    private LocalDateTime createdAt;

    public OccurrenceComplement() 
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

    public UUID getOccurrenceId() 
    {
        return occurrenceId;
    }

    public void setOccurrenceId(UUID occurrenceId) 
    {
        this.occurrenceId = occurrenceId;
    }

    public String getDescription() 
    {
        return description;
    }

    public void setDescription(String description) 
    {
        this.description = description;
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