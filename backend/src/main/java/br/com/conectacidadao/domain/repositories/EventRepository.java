package br.com.conectacidadao.domain.repositories;

import java.util.UUID;
import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import br.com.conectacidadao.domain.entities.Event;
import br.com.conectacidadao.domain.entities.enums.EventCategory;

public interface EventRepository extends JpaRepository<Event, UUID> 
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