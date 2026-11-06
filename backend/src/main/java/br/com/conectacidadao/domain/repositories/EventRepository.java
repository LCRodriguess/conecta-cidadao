package br.com.conectacidadao.domain.repositories;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;

public interface EventRepository extends MongoRepository<Event, String> 
{
    List<Event> findByMunicipalityOrderByDateAscStartTimeAsc(
            String municipality
    );

    List<Event> findByMunicipalityAndCategoryOrderByDateAscStartTimeAsc(
            String municipality,
            EventCategory category
    );

    List<Event> findByMunicipalityAndDateBetweenOrderByDateAscStartTimeAsc(
            String municipality,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Event> findByMunicipalityAndCategoryAndDateBetweenOrderByDateAscStartTimeAsc(
            String municipality,
            EventCategory category,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Event> findByMunicipalityAndTitleContainingIgnoreCaseOrderByDateAscStartTimeAsc(
            String municipality,
            String title
    );
}