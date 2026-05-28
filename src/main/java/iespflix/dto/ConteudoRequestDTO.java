package iespflix.dto;

import iespflix.enums.TipoConteudo;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ConteudoRequestDTO {

    @NotBlank
    @Size(max = 200)
    private String titulo;

    @NotNull
    private TipoConteudo tipo;

    @NotNull
    @Min(1888)
    @Max(2100)
    private Short ano;

    @NotNull
    @Min(1)
    @Max(999)
    private Short duracaoMinutos;

    @NotNull
    @DecimalMin("0.00")
    @DecimalMax("99.99")
    private BigDecimal relevancia;

    private String sinopse;

    private String trailerUrl;

    private String genero;
}