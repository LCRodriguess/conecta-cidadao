package br.com.conectacidadao.application.services;

import br.com.conectacidadao.domain.entities.Occurrence;
import br.com.conectacidadao.domain.entities.enums.OccurrenceStatus;
import br.com.conectacidadao.domain.repositories.OccurrenceRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OccurrenceService 
{
    private final OccurrenceRepository occurrenceRepository;

    public OccurrenceService(OccurrenceRepository occurrenceRepository) 
    {
        this.occurrenceRepository = occurrenceRepository;
    }

    public Occurrence create(Occurrence occurrence) 
    {
        occurrence.setStatus(OccurrenceStatus.Recebido);
        occurrence.setCreatedAt(LocalDateTime.now());

        if (occurrence.getProtocol() == null || occurrence.getProtocol().isBlank()) {
            long nextNumber = occurrenceRepository.count() + 1;
            String protocol = String.format(
                    "SIM-%d-%04d",
                    occurrence.getCreatedAt().getYear(),
                    nextNumber
            );
            occurrence.setProtocol(protocol);
        }

        return occurrenceRepository.save(occurrence);
    }

    public List<Occurrence> findAll() 
    {
        return occurrenceRepository.findAll();
    }

    public Occurrence findById(UUID id) 
    {
        return occurrenceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ocorrência não encontrada."));
    }

    public Occurrence update(UUID id, Occurrence updatedOccurrence) 
    {
        Occurrence occurrence = findById(id);

        occurrence.setTitle(updatedOccurrence.getTitle());
        occurrence.setDescription(updatedOccurrence.getDescription());
        occurrence.setCategory(updatedOccurrence.getCategory());
        occurrence.setMunicipality(updatedOccurrence.getMunicipality());
        occurrence.setStreet(updatedOccurrence.getStreet());
        occurrence.setNumber(updatedOccurrence.getNumber());
        occurrence.setNeighborhood(updatedOccurrence.getNeighborhood());
        occurrence.setReferencePoint(updatedOccurrence.getReferencePoint());
        occurrence.setPhotoUrl(updatedOccurrence.getPhotoUrl());
        if (updatedOccurrence.getStatus() != null) {
            occurrence.setStatus(updatedOccurrence.getStatus());
        }

        return occurrenceRepository.save(occurrence);
    }

    public void delete(UUID id) 
    {
        Occurrence occurrence = findById(id);
        occurrenceRepository.delete(occurrence);
    }
}
