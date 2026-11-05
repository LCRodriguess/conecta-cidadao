package br.com.conectacidadao.services;
import br.com.conectacidadao.domain.entities.Occurrence;
import br.com.conectacidadao.domain.entities.OccurrenceComplement;
import br.com.conectacidadao.repositories.OccurrenceComplementRepository;
import br.com.conectacidadao.repositories.OccurrenceRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OccurrenceComplementService 
{
    private final OccurrenceComplementRepository complementRepository;
    private final OccurrenceRepository occurrenceRepository;

    public OccurrenceComplementService(OccurrenceComplementRepository complementRepository, OccurrenceRepository occurrenceRepository) 
    {
        this.complementRepository = complementRepository;
        this.occurrenceRepository = occurrenceRepository;
    }

    public OccurrenceComplement create(UUID occurrenceId, String description) 
    {

        Occurrence occurrence = occurrenceRepository.findById(occurrenceId)
                .orElseThrow(() -> new RuntimeException(
                        "Ocorrência não encontrada."
                ));

        if (description == null || description.isBlank()) {
            throw new RuntimeException(
                    "A descrição do complemento é obrigatória."
            );
        }

        OccurrenceComplement complement = new OccurrenceComplement();

        complement.setId(UUID.randomUUID());
        complement.setOccurrenceId(occurrence.getId());
        complement.setDescription(description);
        complement.setCreatedAt(LocalDateTime.now());

        return complementRepository.save(complement);
    }

    public List<OccurrenceComplement> findByOccurrenceId(UUID occurrenceId) {

        if (!occurrenceRepository.existsById(occurrenceId)) {
            throw new RuntimeException("Ocorrência não encontrada.");
        }

        return complementRepository.findByOccurrenceId(occurrenceId);
    }
}