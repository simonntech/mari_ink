const API_URL = "https://mari-clients-api.onrender.com/api"; // ajuste conforme o back

// LOGIN
const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login inválido");

      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } catch (err) {
      document.getElementById("loginError").textContent = err.message;
    }
  });
}

// DASHBOARD - LISTA CLIENTES
const clientsList = document.getElementById("clientsList");
if (clientsList) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "index.html"; // redireciona se não logado
  }

  fetch(`${API_URL}/clients`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        alert("Sessão expirada ou inválida. Faça login novamente.");
        localStorage.removeItem("token");
        window.location.href = "index.html";
      }
      return res.json();
    })
    .then(data => {
      clientsList.innerHTML = "";
      data.forEach(client => {
        const li = document.createElement("li");
        li.textContent = `${client.first_name} ${client.last_name}`;
        clientsList.appendChild(li);
      });
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location.href = "index.html";
}
