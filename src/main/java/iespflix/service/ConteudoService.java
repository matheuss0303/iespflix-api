package iespflix.service;

import iespflix.dto.ConteudoRequestDTO;
import iespflix.entity.ConteudoEntity;
import iespflix.repository.ConteudoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import iespflix.enums.TipoConteudo;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ConteudoService {

    private final ConteudoRepository conteudoRepository;

    public ConteudoEntity criar(ConteudoRequestDTO dto) {

        ConteudoEntity conteudo = ConteudoEntity.builder()
                .id(UUID.randomUUID())
                .titulo(dto.getTitulo())
                .tipo(dto.getTipo())
                .ano(dto.getAno())
                .duracaoMinutos(dto.getDuracaoMinutos())
                .relevancia(dto.getRelevancia())
                .sinopse(dto.getSinopse())
                .trailerUrl(dto.getTrailerUrl())
                .genero(dto.getGenero())
                .criadoEm(LocalDateTime.now())
                .atualizadoEm(LocalDateTime.now())
                .build();
        conteudo.setImagemUrl(dto.getImagemUrl());

        return conteudoRepository.save(conteudo);
    }

    public List<ConteudoEntity> listar() {

        return conteudoRepository.findAll();
    }

    public ConteudoEntity buscarPorId(UUID id) {

        return conteudoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado"));
    }

    public void deletar(UUID id) {

        conteudoRepository.deleteById(id);
    }
    public ConteudoEntity atualizar(UUID id, ConteudoRequestDTO dto) {

        ConteudoEntity conteudo = conteudoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Conteúdo não encontrado"));

        conteudo.setTitulo(dto.getTitulo());
        conteudo.setTipo(dto.getTipo());
        conteudo.setAno(dto.getAno());
        conteudo.setDuracaoMinutos(dto.getDuracaoMinutos());
        conteudo.setRelevancia(dto.getRelevancia());
        conteudo.setSinopse(dto.getSinopse());
        conteudo.setTrailerUrl(dto.getTrailerUrl());
        conteudo.setGenero(dto.getGenero());
        conteudo.setImagemUrl(dto.getImagemUrl());

        return conteudoRepository.save(conteudo);
    }

    public List<ConteudoEntity> buscarPorGenero(String genero) {

        return conteudoRepository
                .findByGeneroIgnoreCaseOrderByTituloAsc(genero);
    }

    public List<ConteudoEntity> buscarPorTipo(TipoConteudo tipo) {

        return conteudoRepository
                .findByTipoOrderByTituloAsc(tipo);
    }

    public List<ConteudoEntity> buscarPorTitulo(String titulo) {

        return conteudoRepository.buscarPorTitulo(titulo);
    }
}