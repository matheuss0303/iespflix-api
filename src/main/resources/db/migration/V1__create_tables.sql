CREATE TABLE usuarios (

                          id UUID PRIMARY KEY,

                          nome_completo VARCHAR(150) NOT NULL,

                          data_nascimento DATE NOT NULL,

                          email VARCHAR(254) NOT NULL UNIQUE,

                          senha_hash VARCHAR(60) NOT NULL,

                          cpf_cnpj VARCHAR(14) UNIQUE,

                          perfil VARCHAR(20) NOT NULL,

                          criado_em TIMESTAMP NOT NULL,

                          atualizado_em TIMESTAMP NOT NULL

);