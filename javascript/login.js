const API_URL = "https://mari-clients-api.onrender.com/api"; 


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
