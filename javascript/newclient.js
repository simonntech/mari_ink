  const API_URL = "https://mari-clients-api.onrender.com/api";

  document.getElementById("clientForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado para cadastrar um cliente.");
      return;
    }

    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Convertendo campos para os tipos corretos
    data.is_first_client = data.is_first_client === "true";
    data.number_of_tattoos = parseInt(data.number_of_tattoos || "0");

    try {
      const response = await fetch(`${API_URL}/clients`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert("Cliente cadastrado com sucesso!");
        this.reset();
      } else {
        const result = await response.json();
        alert("Erro ao cadastrar: " + (result.message || response.statusText));
      }
    } catch (error) {
      console.error("Erro ao enviar dados:", error);
      alert("Erro ao cadastrar cliente.");
    }
  });