import axios from "axios";

const api = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github.v3+json",
  },
});

// Função para atualizar o token dinamicamente
export const setGithubToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `token ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

// Se houver um token no localStorage, adiciona ao header na inicialização
const initialToken = localStorage.getItem("github_token");
if (initialToken) {
  setGithubToken(initialToken);
}

export default api;
