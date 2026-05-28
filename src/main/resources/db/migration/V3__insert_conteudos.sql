INSERT INTO conteudos
(
    id,
    titulo,
    tipo,
    genero,
    ano,
    duracao_minutos,
    sinopse,
    imagem_url,
    relevancia,
    criado_em,
    atualizado_em
)
VALUES
    (
        RANDOM_UUID(),
        'Dark',
        'SERIE',
        'Ficção',
        2017,
        60,
        'Uma série sombria sobre viagem no tempo.',
        'https://image.tmdb.org/t/p/w500/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    (
        RANDOM_UUID(),
        'Stranger Things',
        'SERIE',
        'Suspense',
        2016,
        50,
        'Mistérios sobrenaturais em Hawkins.',
        'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
        9,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    ),

    (
        RANDOM_UUID(),
        'Interstellar',
        'FILME',
        'Ficção',
        2014,
        169,
        'Exploração espacial para salvar a humanidade.',
        'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        10,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP
    );