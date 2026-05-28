package iespflix.repository;

import iespflix.entity.ConteudoEntity;
import iespflix.enums.TipoConteudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ConteudoRepository extends JpaRepository<ConteudoEntity, UUID> {

    List<ConteudoEntity> findByGeneroIgnoreCaseOrderByTituloAsc(String genero);

    List<ConteudoEntity> findByTipoOrderByTituloAsc(TipoConteudo tipo);

    @Query("""
       SELECT c
       FROM ConteudoEntity c
       WHERE LOWER(c.titulo) LIKE LOWER(CONCAT('%', :titulo, '%'))
       ORDER BY c.relevancia DESC
       """)
    List<ConteudoEntity> buscarPorTitulo(String titulo);
}
