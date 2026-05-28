CREATE TABLE conteudos (
                           id UUID PRIMARY KEY,
                           titulo VARCHAR(255) NOT NULL,
                           tipo VARCHAR(50),
                           genero VARCHAR(100),
                           ano INT,
                           duracao_minutos INT,
                           sinopse TEXT,
                           imagem_url VARCHAR(255),
                           relevancia INT,
                           criado_em TIMESTAMP,
                           atualizado_em TIMESTAMP,
                           trailer_url VARCHAR(255)
);