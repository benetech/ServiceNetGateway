package org.benetech.servicenet.service.dto;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;
import java.util.UUID;

/**
 * A DTO for the SystemAccount entity.
 */
public class SystemAccountDTO implements Serializable {

    private UUID id;

    @NotNull
    private String name;

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }

        SystemAccountDTO systemAccountDTO = (SystemAccountDTO) o;
        if (systemAccountDTO.getId() == null || getId() == null) {
            return false;
        }
        return Objects.equals(getId(), systemAccountDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }

    @Override
    public String toString() {
        return "SystemAccountDTO{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            "}";
    }
}