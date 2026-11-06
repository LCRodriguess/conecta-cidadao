package br.com.conectacidadao.application.validators;
import br.com.conectacidadao.domain.entities.Event;

public class EventValidator 
{

    public void validate(Event event) 
    {
        if (event == null) {
            throw new IllegalArgumentException(
                    "O evento não pode ser vazio."
            );
        }

        if (event.getMunicipality() == null ||
                (!event.getMunicipality().equals("rio-das-ostras")
                && !event.getMunicipality().equals("sapucaia"))) {
            throw new IllegalArgumentException(
                    "Município inválido."
            );
        }

        if (event.getCategory() == null) {
            throw new IllegalArgumentException(
                    "A categoria é obrigatória."
            );
        }

        if (isBlank(event.getTitle())) {
            throw new IllegalArgumentException(
                    "O título é obrigatório."
            );
        }

        if (isBlank(event.getDescFull())) {
            throw new IllegalArgumentException(
                    "A descrição é obrigatória."
            );
        }

        if (event.getDate() == null) {
            throw new IllegalArgumentException(
                    "A data é obrigatória."
            );
        }

        if (event.getStartTime() == null ||
                event.getEndTime() == null) {
            throw new IllegalArgumentException(
                    "Os horários são obrigatórios."
            );
        }

        if (!event.getEndTime().isAfter(event.getStartTime())) {
            throw new IllegalArgumentException(
                    "O horário final deve ser posterior ao inicial."
            );
        }

        if (isBlank(event.getLocationFull())) {
            throw new IllegalArgumentException(
                    "O local é obrigatório."
            );
        }

        if (isBlank(event.getAudience())) {
            throw new IllegalArgumentException(
                    "O público-alvo é obrigatório."
            );
        }
    }

    private boolean isBlank(String value) 
    {
        return value == null || value.isBlank();
    }
}