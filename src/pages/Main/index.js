import React, { useState, useCallback, useEffect } from "react";
import {
  FaGithub,
  FaPlus,
  FaSpinner,
  FaBars,
  FaTrash,
  FaKey,
} from "react-icons/fa";
import {
  Container,
  Form,
  SubmitButton,
  List,
  DeleteButton,
  TokenInput,
  ErrorMessage,
} from "./styles";

import api, { setGithubToken } from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [token, setToken] = useState("");
  const [showTokenInput, setShowTokenInput] = useState(false);

  // Buscar repos salvos
  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");
    const tokenStorage = localStorage.getItem("github_token");

    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage));
    }
    if (tokenStorage) {
      setToken(tokenStorage);
    }
  }, []);

  // Salvar alterações
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  const handleTokenSave = useCallback(() => {
    if (token.trim()) {
      localStorage.setItem("github_token", token);
      setGithubToken(token);
      setShowTokenInput(false);
      setAlert(null);
    }
  }, [token]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();

      async function submit() {
        setLoading(true);
        setAlert(null);
        try {
          if (newRepo === "") {
            throw new Error("Você precisa indicar um repositorio!");
          }

          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = repositorios.find((repo) => repo.name === newRepo);

          if (hasRepo) {
            throw new Error("Repositorio Duplicado");
          }

          const data = {
            name: response.data.full_name,
          };

          setRepositorios([...repositorios, data]);
          setNewRepo("");
        } catch (error) {
          setAlert(
            error.message ||
              "Erro ao buscar repositório. Verifique o token ou tente novamente."
          );
          console.log(error);
        } finally {
          setLoading(false);
        }
      }

      submit();
    },
    [newRepo, repositorios]
  );

  function handleinputChange(e) {
    setNewRepo(e.target.value);
    setAlert(null);
  }

  const handleDelete = useCallback(
    (repo) => {
      const find = repositorios.filter((r) => r.name !== repo);
      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <Container>
      <h1>
        <FaGithub size={25} />
        Meus Repositorios
      </h1>

      {!token && (
        <TokenInput>
          <button
            type="button"
            onClick={() => setShowTokenInput(!showTokenInput)}
          >
            <FaKey size={16} /> Adicionar Token GitHub
          </button>
          {showTokenInput && (
            <div>
              <input
                type="password"
                placeholder="Cole seu token aqui"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
              <button type="button" onClick={handleTokenSave}>
                Salvar Token
              </button>
              <small>
                Gere um token em: https://github.com/settings/tokens
              </small>
            </div>
          )}
        </TokenInput>
      )}

      <Form onSubmit={handleSubmit} error={alert ? 1 : 0}>
        <input
          type="text"
          placeholder="Adicionar Repositorios (ex: facebook/react)"
          value={newRepo}
          onChange={handleinputChange}
        />

        <SubmitButton loading={loading ? 1 : 0}>
          {loading ? (
            <FaSpinner color="#FFF" size={14} />
          ) : (
            <FaPlus color="#FFF" size={14} />
          )}
        </SubmitButton>
      </Form>

      {alert && <ErrorMessage>{alert}</ErrorMessage>}

      <List>
        {repositorios.map((repo) => (
          <li key={repo.name}>
            <span>
              <DeleteButton onClick={() => handleDelete(repo.name)}>
                <FaTrash size={14} />
              </DeleteButton>
              {repo.name}
            </span>
            <a href={`/repositorio/${repo.name}`}>
              <FaBars size={20} />
            </a>
          </li>
        ))}
      </List>
    </Container>
  );
}
