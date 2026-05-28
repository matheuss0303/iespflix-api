CREATE TABLE conteudo (

                          id UUID PRIMARY KEY,

                          titulo VARCHAR(200) NOT NULL,

                          tipo VARCHAR(10) NOT NULL,

                          ano SMALLINT NOT NULL,

                          duracao_minutos SMALLINT NOT NULL,

                          relevancia DECIMAL(4,2) NOT NULL,

                          sinopse TEXT,

                          trailer_url VARCHAR(500),

                          genero VARCHAR(50),

                          criado_em TIMESTAMP NOT NULL,

                          atualizado_em TIMESTAMP NOT NULL

);