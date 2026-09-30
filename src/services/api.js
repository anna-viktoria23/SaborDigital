// Substitua pelo IP da sua máquina na rede local (ex: 'http://192.168.1.15:3000') se testar em dispositivo físico.
// Use 'http://10.0.2.2:3000' para o Emulador do Android Studio.
export const BASE_URL = "http://10.0.2.2:3000";

// Token armazenado em memória após o login
let authToken = null;

/**
 * Define o token de autenticação globalmente no aplicativo
 */
export function setAuthToken(token) {
  authToken = token;
}

/**
 * Função auxiliar centralizada para realizar todas as requisições HTTP
 */
async function request(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
    ...options.headers,
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
      const erro = new Error(
        body.mensagem || body.erro || `Erro ${response.status}: Falha na requisição`
      );
      erro.status = response.status;
      throw erro;
    }

    return body;
  } catch (error) {
    console.error(`Erro na requisição para ${endpoint}:`, error.message);
    throw error;
  }
}

/* ==========================================================================
   1. USUÁRIOS & AUTENTICAÇÃO (CRUD DE USUÁRIO)
   ========================================================================== */

// POST - Registrar / Criar novo usuário (C do CRUD)
export async function registrarUsuario(nome, email, senha, papel = "cliente") {
  return request("/auth/registrar", {
    method: "POST",
    body: JSON.stringify({ nome, email, senha, papel }),
  });
}

// POST - Autenticar / Login do usuário
export async function loginUsuario(email, senha) {
  const dados = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, senha }),
  });

  if (dados.token) {
    setAuthToken(dados.token);
  }

  return dados;
}

// GET - Listar todos os usuários (R do CRUD)
export async function buscarUsuarios() {
  return request("/usuarios");
}

// GET por ID - Buscar dados de um usuário específico (R do CRUD)
export async function buscarUsuarioPorId(id) {
  return request(`/usuarios/${id}`);
}

// PUT - Atualizar dados do usuário (U do CRUD)
export async function editarUsuario(id, dadosUsuario) {
  // dadosUsuario ex: { nome, email, senha, papel }
  return request(`/usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(dadosUsuario),
  });
}

// DELETE - Remover / Excluir usuário (D do CRUD)
export async function removerUsuario(id) {
  return request(`/usuarios/${id}`, {
    method: "DELETE",
  });
}

/* ==========================================================================
   2. PRODUTOS (CRUD)
   ========================================================================== */

// GET - Listar todos os produtos
export async function buscarProdutos() {
  const resposta = await request("/produtos");
  return resposta.dados.map((produto) => ({
    ...produto,
    imagemUrl: produto.imagem ? `${BASE_URL}${produto.imagem}` : null,
  }));
}

// GET por ID - Buscar produto específico
export async function buscarProdutoPorId(id) {
  const resposta = await request(`/produtos/${id}`);
  const produto = resposta.dados;
  return {
    ...produto,
    imagemUrl: produto.imagem ? `${BASE_URL}${produto.imagem}` : null,
  };
}

// POST - Cadastrar novo produto (Requer Admin)
export async function cadastrarProduto(produtoDados) {
  return request("/produtos", {
    method: "POST",
    body: JSON.stringify(produtoDados),
  });
}

// PUT - Atualizar produto existente (Requer Admin)
export async function editarProduto(id, produtoDados) {
  return request(`/produtos/${id}`, {
    method: "PUT",
    body: JSON.stringify(produtoDados),
  });
}

// DELETE - Remover produto (Requer Admin)
export async function removerProduto(id) {
  return request(`/produtos/${id}`, {
    method: "DELETE",
  });
}

/* ==========================================================================
   3. CARDÁPIOS (CRUD)
   ========================================================================== */

// GET - Listar todos os cardápios
export async function buscarCardapios() {
  const resposta = await request("/cardapios");
  return resposta.dados;
}

// GET por ID - Buscar cardápio por ID com seus produtos
export async function buscarCardapioPorId(id) {
  const resposta = await request(`/cardapios/${id}`);
  return resposta.dados;
}

// POST - Cadastrar novo cardápio com vínculo de produtos
export async function cadastrarCardapio(nome, descricao, produtosIds, disponivel = true) {
  return request("/cardapios", {
    method: "POST",
    body: JSON.stringify({ nome, descricao, produtos: produtosIds, disponivel }),
  });
}

// DELETE - Remover cardápio
export async function removerCardapio(id) {
  return request(`/cardapios/${id}`, {
    method: "DELETE",
  });
}

/* ==========================================================================
   4. PEDIDOS (CRUD)
   ========================================================================== */

// GET - Listar todos os pedidos
export async function buscarPedidos() {
  return request("/pedidos");
}

// GET por ID - Buscar detalhes de um pedido
export async function buscarPedidoPorId(id) {
  return request(`/pedidos/${id}`);
}

//POST - Criar novo pedido
export async function criarPedido(cliente, itens) {
  return request("/pedidos", {
    method: "POST",
    body: JSON.stringify({ cliente, itens }),
  });
}

// PATCH - Atualizar status do pedido (pendente, preparo, pronto, entregue)
export async function atualizarStatusPedido(id, status) {
  return request(`/pedidos/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

// DELETE - Cancelar/Excluir pedido
export async function removerPedido(id){
    return request(`/pedidos/${id}`, {
        method: "DELETE"
    })
}
