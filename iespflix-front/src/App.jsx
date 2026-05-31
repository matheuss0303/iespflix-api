import { useEffect, useState } from "react";
import api from "./api";
import "./style.css";

export default function App() {
    const [logado, setLogado] = useState(false);
    const [admin, setAdmin] = useState(false);

    const [loginForm, setLoginForm] = useState({ email: "", senha: "" });

    const [conteudos, setConteudos] = useState([]);
    const [busca, setBusca] = useState("");
    const [selecionado, setSelecionado] = useState(null);
    const [favoritos, setFavoritos] = useState([]);
    const [assistidos, setAssistidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mostrarAdmin, setMostrarAdmin] = useState(false);
    const [trailer, setTrailer] = useState(null);
    const [editandoId, setEditandoId] = useState(null);
    const [aba, setAba] = useState("TODOS");
    const [perfilAberto, setPerfilAberto] = useState(false);

    const formInicial = {
        titulo: "",
        tipo: "FILME",
        genero: "",
        ano: "",
        duracaoMinutos: "",
        relevancia: "",
        sinopse: "",
        trailerUrl: "",
        imagemUrl: "",
    };

    const [form, setForm] = useState(formInicial);

    async function carregarConteudos() {
        try {
            setLoading(true);
            const response = await api.get("/conteudos");
            setConteudos(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        const usuarioLogado = localStorage.getItem("usuarioLogado");
        const usuarioAdmin = localStorage.getItem("admin") === "true";

        if (usuarioLogado) {
            setLogado(true);
            setAdmin(usuarioAdmin);
        }

        carregarConteudos();

        setFavoritos(JSON.parse(localStorage.getItem("favoritos")) || []);
        setAssistidos(JSON.parse(localStorage.getItem("assistidos")) || []);
    }, []);

    function fazerLogin(e) {
        e.preventDefault();

        const ehAdmin =
            loginForm.email === "admin@iespflix.com" &&
            loginForm.senha === "123456";

        localStorage.setItem("usuarioLogado", "true");
        localStorage.setItem("admin", ehAdmin ? "true" : "false");

        setLogado(true);
        setAdmin(ehAdmin);
    }

    function sair() {
        localStorage.removeItem("usuarioLogado");
        localStorage.removeItem("admin");
        setLogado(false);
        setAdmin(false);
        setPerfilAberto(false);
        setMostrarAdmin(false);
    }

    async function salvarConteudo(e) {
        e.preventDefault();

        if (!admin) {
            alert("Acesso negado.");
            return;
        }

        if (editandoId) {
            await api.put(`/conteudos/${editandoId}`, form);
        } else {
            await api.post("/conteudos", form);
        }

        setForm(formInicial);
        setEditandoId(null);
        setMostrarAdmin(false);
        carregarConteudos();
    }

    async function excluirConteudo(id) {
        if (!admin) {
            alert("Acesso negado.");
            return;
        }

        const confirmar = confirm("Tem certeza que deseja excluir este conteúdo?");
        if (!confirmar) return;

        await api.delete(`/conteudos/${id}`);
        setSelecionado(null);
        carregarConteudos();
    }

    function prepararEdicao(conteudo) {
        if (!admin) {
            alert("Acesso negado.");
            return;
        }

        setForm({
            titulo: conteudo.titulo || "",
            tipo: conteudo.tipo || "FILME",
            genero: conteudo.genero || "",
            ano: conteudo.ano || "",
            duracaoMinutos: conteudo.duracaoMinutos || "",
            relevancia: conteudo.relevancia || "",
            sinopse: conteudo.sinopse || "",
            trailerUrl: conteudo.trailerUrl || "",
            imagemUrl: conteudo.imagemUrl || "",
        });

        setEditandoId(conteudo.id);
        setMostrarAdmin(true);
        setSelecionado(null);

        window.scrollTo({ top: 0, behavior: "smooth" });
    }

    function alternarFavorito(id) {
        const novosFavoritos = favoritos.includes(id)
            ? favoritos.filter((favoritoId) => favoritoId !== id)
            : [...favoritos, id];

        setFavoritos(novosFavoritos);
        localStorage.setItem("favoritos", JSON.stringify(novosFavoritos));
    }

    function alternarAssistido(id) {
        const novosAssistidos = assistidos.includes(id)
            ? assistidos.filter((assistidoId) => assistidoId !== id)
            : [...assistidos, id];

        setAssistidos(novosAssistidos);
        localStorage.setItem("assistidos", JSON.stringify(novosAssistidos));
    }

    function abrirTrailer(conteudo) {
        if (!conteudo?.trailerUrl) {
            alert("Trailer não disponível para este conteúdo.");
            return;
        }

        let url = conteudo.trailerUrl;

        if (url.includes("watch?v=")) {
            url = url.replace("watch?v=", "embed/");
        }

        setTrailer(url);
        alternarAssistido(conteudo.id);
    }

    function progressoConteudo(id) {
        return assistidos.includes(id) ? 100 : 35;
    }

    const conteudosBuscados = conteudos.filter((conteudo) => {
        const bateBusca = conteudo.titulo
            .toLowerCase()
            .includes(busca.toLowerCase());

        const bateAba =
            aba === "TODOS" ||
            conteudo.tipo === aba ||
            conteudo.genero === aba ||
            (aba === "FAVORITOS" && favoritos.includes(conteudo.id)) ||
            (aba === "ASSISTIDOS" && assistidos.includes(conteudo.id));

        return bateBusca && bateAba;
    });

    const top10 = [...conteudosBuscados]
        .sort((a, b) => Number(b.relevancia) - Number(a.relevancia))
        .slice(0, 10);

    const filmes = conteudosBuscados.filter((c) => c.tipo === "FILME");
    const series = conteudosBuscados.filter((c) => c.tipo === "SERIE");

    const favoritosLista = conteudosBuscados.filter((c) =>
        favoritos.includes(c.id)
    );

    const assistidosLista = conteudosBuscados.filter((c) =>
        assistidos.includes(c.id)
    );

    const generos = [...new Set(conteudos.map((c) => c.genero).filter(Boolean))];

    const destaque = top10[0] || conteudos[0];

    function Card({ conteudo, ranking }) {
        const progresso = progressoConteudo(conteudo.id);

        return (
            <div className="card">
                {ranking && <div className="ranking-number">{ranking}</div>}

                {assistidos.includes(conteudo.id) && (
                    <div className="watched-badge">Assistido</div>
                )}

                <button
                    type="button"
                    className="favorite-btn"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alternarFavorito(conteudo.id);
                    }}
                >
                    {favoritos.includes(conteudo.id) ? "❤️" : "🤍"}
                </button>

                <img
                    src={conteudo.imagemUrl}
                    alt={conteudo.titulo}
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelecionado(conteudo);
                    }}
                />

                <div className="progress-bar">
                    <div
                        className="progress-fill"
                        style={{ width: `${progresso}%` }}
                    ></div>
                </div>

                <div
                    className="card-body"
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSelecionado(conteudo);
                    }}
                >
                    <h3>{conteudo.titulo}</h3>
                    <span>{conteudo.tipo}</span>
                    <p>{conteudo.genero}</p>
                    <small>⭐ {conteudo.relevancia}</small>
                </div>
            </div>
        );
    }

    function Secao({ titulo, itens, ranking = false }) {
        if (itens.length === 0) return null;

        return (
            <section className="linha">
                <h2>{titulo}</h2>

                <div className="carrossel">
                    {itens.map((conteudo, index) => (
                        <Card
                            key={conteudo.id}
                            conteudo={conteudo}
                            ranking={ranking ? index + 1 : null}
                        />
                    ))}
                </div>
            </section>
        );
    }

    if (!logado) {
        return (
            <div className="login-page">
                <div className="login-box">
                    <h1>IespFlix</h1>

                    <h2>Entrar</h2>

                    <form onSubmit={fazerLogin}>
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={loginForm.email}
                            onChange={(e) =>
                                setLoginForm({ ...loginForm, email: e.target.value })
                            }
                            required
                        />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={loginForm.senha}
                            onChange={(e) =>
                                setLoginForm({ ...loginForm, senha: e.target.value })
                            }
                            required
                        />

                        <button type="submit">Entrar</button>
                    </form>

                    <p>Use qualquer e-mail e senha para entrar.</p>
                    <p className="admin-hint">
                        Acesso administrativo exclusivo do desenvolvedor.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">

            {!selecionado && !trailer && (
            <header className="navbar">

                <h1 className="logo">IespFlix</h1>

                <input
                    className="search"
                    type="text"
                    placeholder="Pesquisar filmes ou séries..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                />

                {admin && (
                    <button
                        type="button"
                        className="admin-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setMostrarAdmin(!mostrarAdmin);
                            setEditandoId(null);
                            setForm(formInicial);
                        }}
                    >
                        Admin
                    </button>
                )}

                <div className="profile-area">
                    <button
                        type="button"
                        className="profile-btn"
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPerfilAberto(!perfilAberto);
                        }}
                    >
                        👤 {admin ? "Matheus Admin" : "Visitante"}
                    </button>

                    {perfilAberto && (
                        <div className="profile-menu">
                            <p>Perfil: {admin ? "Matheus Admin" : "Visitante"}</p>
                            <p>Plano: Premium</p>
                            <p>Favoritos: {favoritos.length}</p>
                            <p>Assistidos: {assistidos.length}</p>
                            {admin && <p>Acesso: Administrador</p>}
                            <button type="button" onClick={sair}>
                                Sair
                            </button>
                        </div>
                    )}
                </div>
            </header>
            )}

            {destaque && (
                <section
                    className="hero"
                    style={{
                        backgroundImage: `url(${destaque.imagemUrl})`,
                    }}
                >
                    <div className="hero-overlay">
                        <div className="hero-content">
                            <h2>{destaque.titulo}</h2>

                            <p>{destaque.sinopse}</p>

                            <div className="hero-buttons">
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        abrirTrailer(destaque);
                                    }}
                                >
                                    ▶ Assistir
                                </button>

                                <button
                                    type="button"
                                    className="secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setSelecionado(destaque);
                                    }}
                                >
                                    Mais informações
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section className="categorias">
                {[
                    "TODOS",
                    "FILME",
                    "SERIE",
                    "FAVORITOS",
                    "ASSISTIDOS",
                    ...generos,
                ].map((item) => (
                    <button
                        type="button"
                        key={item}
                        className={aba === item ? "ativo" : ""}
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setAba(item);
                        }}
                    >
                        {item === "TODOS"
                            ? "Início"
                            : item === "FILME"
                                ? "Filmes"
                                : item === "SERIE"
                                    ? "Séries"
                                    : item === "FAVORITOS"
                                        ? "❤️ Minha Lista"
                                        : item === "ASSISTIDOS"
                                            ? "▶ Continuar assistindo"
                                            : item}
                    </button>
                ))}
            </section>

            {admin && mostrarAdmin && (
                <section className="admin-panel">
                    <h2>{editandoId ? "Editar Conteúdo" : "Cadastrar Conteúdo"}</h2>

                    <div className="admin-stats">
                        <div>
                            <strong>{conteudos.length}</strong>
                            <span>Total</span>
                        </div>

                        <div>
                            <strong>{filmes.length}</strong>
                            <span>Filmes</span>
                        </div>

                        <div>
                            <strong>{series.length}</strong>
                            <span>Séries</span>
                        </div>

                        <div>
                            <strong>{favoritos.length}</strong>
                            <span>Favoritos</span>
                        </div>

                        <div>
                            <strong>{assistidos.length}</strong>
                            <span>Assistidos</span>
                        </div>
                    </div>

                    <form onSubmit={salvarConteudo}>
                        <input
                            placeholder="Título"
                            value={form.titulo}
                            onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                            required
                        />

                        <select
                            value={form.tipo}
                            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                        >
                            <option value="FILME">FILME</option>
                            <option value="SERIE">SERIE</option>
                        </select>

                        <input
                            placeholder="Gênero"
                            value={form.genero}
                            onChange={(e) => setForm({ ...form, genero: e.target.value })}
                        />

                        <input
                            placeholder="Ano"
                            type="number"
                            value={form.ano}
                            onChange={(e) => setForm({ ...form, ano: e.target.value })}
                        />

                        <input
                            placeholder="Duração em minutos"
                            type="number"
                            value={form.duracaoMinutos}
                            onChange={(e) =>
                                setForm({ ...form, duracaoMinutos: e.target.value })
                            }
                        />

                        <input
                            placeholder="Relevância"
                            type="number"
                            step="0.1"
                            value={form.relevancia}
                            onChange={(e) =>
                                setForm({ ...form, relevancia: e.target.value })
                            }
                        />

                        <input
                            placeholder="URL do trailer embed"
                            value={form.trailerUrl}
                            onChange={(e) =>
                                setForm({ ...form, trailerUrl: e.target.value })
                            }
                        />

                        <input
                            placeholder="URL da imagem"
                            value={form.imagemUrl}
                            onChange={(e) =>
                                setForm({ ...form, imagemUrl: e.target.value })
                            }
                        />

                        <textarea
                            placeholder="Sinopse"
                            value={form.sinopse}
                            onChange={(e) => setForm({ ...form, sinopse: e.target.value })}
                        />

                        <button type="submit">
                            {editandoId ? "Salvar alterações" : "Cadastrar"}
                        </button>
                    </form>
                </section>
            )}

            <main className="conteudos">
                {loading && <div className="loading">Carregando conteúdos...</div>}

                {!loading && conteudosBuscados.length === 0 && (
                    <div className="empty">Nenhum filme ou série encontrado 😢</div>
                )}

                {!loading && (
                    <>
                        <Secao titulo="🏆 Top 10 Mais Relevantes" itens={top10} ranking />
                        <Secao titulo="▶ Continuar assistindo" itens={assistidosLista} />
                        <Secao titulo="🔥 Todos os conteúdos" itens={conteudosBuscados} />
                        <Secao titulo="🎬 Filmes" itens={filmes} />
                        <Secao titulo="📺 Séries" itens={series} />
                        <Secao titulo="❤️ Minha lista" itens={favoritosLista} />
                    </>
                )}
            </main>

            {selecionado && (
                <div className="modal-bg" onClick={() => setSelecionado(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="close"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSelecionado(null);
                            }}
                        >
                            X
                        </button>

                        <img src={selecionado.imagemUrl} alt={selecionado.titulo} />

                        <div className="modal-info">
                            <h2>{selecionado.titulo}</h2>

                            <p>{selecionado.sinopse}</p>

                            <p>
                                <strong>Tipo:</strong> {selecionado.tipo}
                            </p>

                            <p>
                                <strong>Gênero:</strong> {selecionado.genero}
                            </p>

                            <p>
                                <strong>Ano:</strong> {selecionado.ano}
                            </p>

                            <p>
                                <strong>Nota:</strong> ⭐ {selecionado.relevancia}
                            </p>

                            <div className="modal-actions">
                                <button
                                    type="button"
                                    className="modal-btn primary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        abrirTrailer(selecionado);
                                    }}
                                >
                                    ▶ Assistir Trailer
                                </button>

                                <button
                                    type="button"
                                    className="modal-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        alternarFavorito(selecionado.id);
                                    }}
                                >
                                    {favoritos.includes(selecionado.id)
                                        ? "❤️ Remover dos Favoritos"
                                        : "🤍 Adicionar aos Favoritos"}
                                </button>

                                <button
                                    type="button"
                                    className="modal-btn"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        alternarAssistido(selecionado.id);
                                    }}
                                >
                                    {assistidos.includes(selecionado.id)
                                        ? "✅ Remover dos Assistidos"
                                        : "▶ Marcar como Assistido"}
                                </button>

                                {admin && (
                                    <>
                                        <button
                                            type="button"
                                            className="modal-btn edit"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                prepararEdicao(selecionado);
                                            }}
                                        >
                                            ✏️ Editar
                                        </button>

                                        <button
                                            type="button"
                                            className="modal-btn delete"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                excluirConteudo(selecionado.id);
                                            }}
                                        >
                                            🗑️ Excluir
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {trailer && (
                <div className="trailer-modal" onClick={() => setTrailer(null)}>
                    <div className="trailer-content" onClick={(e) => e.stopPropagation()}>
                        <button
                            type="button"
                            className="close"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setTrailer(null);
                            }}
                        >
                            X
                        </button>

                        <iframe
                            width="100%"
                            height="500"
                            src={trailer}
                            title="Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}
        </div>
    );
}