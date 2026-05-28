package iespflix.entity;

import iespflix.enums.TipoConteudo;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "conteudos")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class ConteudoEntity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Enumerated(EnumType.STRING)
    private TipoConteudo tipo;

    private Short ano;

    @Column(name = "duracao_minutos")
    private Short duracaoMinutos;

    private Integer relevancia;

    @Column(columnDefinition = "TEXT")
    private String sinopse;

    @Column(name = "trailer_url")
    private String trailerUrl;

    private String genero;

    @Column(name = "criado_em")
    private LocalDateTime criadoEm;

    @Column(name = "atualizado_em")
    private LocalDateTime atualizadoEm;

    @Column(name = "imagem_url")
    private String imagemUrl;
}