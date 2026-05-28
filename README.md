# IESPFLIX API

API REST desenvolvida com Spring Boot para gerenciamento de conteúdos da plataforma IESPFLIX.

## Tecnologias utilizadas

* Java 17
* Spring Boot 3
* Spring Web
* Spring Data JPA
* Bean Validation
* Flyway
* H2 Database
* Lombok
* Swagger / OpenAPI

---

## Funcionalidades

### Conteúdos

* Criar conteúdo
* Listar conteúdos
* Buscar conteúdo por ID
* Atualizar conteúdo
* Remover conteúdo

### Filtros e consultas

* Buscar por título
* Buscar por gênero
* Buscar por tipo
* Ordenação por título

### Extras

* Tratamento global de exceções
* Persistência com H2
* Documentação Swagger
* Validações com Bean Validation

---

## Estrutura do Projeto

```text
src/main/java
 ├── controller
 ├── dto
 ├── entity
 ├── enums
 ├── exception
 ├── repository
 └── service
```

---

## Como executar o projeto

### Clonar repositório

```bash
git clone https://github.com/SEU-USUARIO/iespflix-api.git
```

---

### Entrar na pasta

```bash
cd iespflix-api
```

---

### Executar aplicação

```bash
mvn spring-boot:run
```

---

## Swagger

Documentação da API:

```text
http://localhost:8080/swagger-ui/index.html
```

---

## H2 Console

```text
http://localhost:8080/h2-console
```

### JDBC URL

```text
jdbc:h2:file:./data/iespflix
```

---

## Autores

Matheus Soares da Silva /   André  Coelho
