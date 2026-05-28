package iespflix.controller;

import iespflix.dto.ConteudoRequestDTO;
import iespflix.entity.ConteudoEntity;
import iespflix.service.ConteudoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.UUID;
import iespflix.enums.TipoConteudo;

import java.util.List;

@RestController
@RequestMapping("/conteudos")
@RequiredArgsConstructor
public class ConteudoController {

    private final ConteudoService conteudoService;

    @PostMapping
    public ConteudoEntity criar(@RequestBody @Valid ConteudoRequestDTO dto) {

        return conteudoService.criar(dto);
    }

    @GetMapping
    public List<ConteudoEntity> listar() {

        return conteudoService.listar();
    }

    @GetMapping("/{id}")
    public ConteudoEntity buscarPorId(@PathVariable UUID id) {

        return conteudoService.buscarPorId(id);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable UUID id) {

        conteudoService.deletar(id);
    }

    @PutMapping("/{id}")
    public ConteudoEntity atualizar(
            @PathVariable UUID id,
            @RequestBody @Valid ConteudoRequestDTO dto
    ) {

        return conteudoService.atualizar(id, dto);
    }

    @GetMapping("/genero/{genero}")
    public List<ConteudoEntity> buscarPorGenero(
            @PathVariable String genero
    ) {

        return conteudoService.buscarPorGenero(genero);
    }

    @GetMapping("/tipo/{tipo}")
    public List<ConteudoEntity> buscarPorTipo(
            @PathVariable TipoConteudo tipo
    ) {

        return conteudoService.buscarPorTipo(tipo);
    }

    @GetMapping("/buscar")
    public List<ConteudoEntity> buscarPorTitulo(
            @RequestParam String titulo
    ) {

        return conteudoService.buscarPorTitulo(titulo);
    }
}