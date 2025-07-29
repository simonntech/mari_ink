const API_URL = "https://mari-clients-api.onrender.com/api";
const form = document.getElementById("clientForm");
const params = new URLSearchParams(window.location.search);
const clientId = params.get("client_id");

const token = localStorage.getItem("token");
if(!token) {
    alert("Você precisa estar logado.");
    window.location.href = "index.html";
}

const FIELDS = [
  "first_name", "last_name", "gender", "birth_date",
  "phone", "social_media", "address_street", "address_number",
  "address_neighborhood", "address_city", "address_state", "zip_code",
  "fav_style", "number_of_tattoos", "allergies", "is_first_client"
];


async function loadClient(id) {
    try {
        const response = await fetch(`${API_URL}/clients/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!response.ok) throw new Error("Erro ao carregar cliente");

        const client = await response.json();

        const client_name = document.getElementById("nome_cliente");
        client_name.innerText = `${client.first_name} ${client.last_name}`

        FIELDS.forEach((key) => {
            if (form[key] !== undefined && client[key] !== undefined) {
                if (key === "birth_date") {
                    form[key].value = client[key].split("T")[0];
                } else {
                    form[key].value = client[key];
                }
            }
        })
    } catch (err) {
        alert(`Erro ao carregar cliente ${err}`)
    }
}

form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    data.is_first_client = data.is_first_client === "true";
    data.number_of_tattoos = parseInt(data.number_of_tattoos || "0");

    try {
        const response = await fetch(`${API_URL}/clients/${clientId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert("Cliente atualizado com sucesso!");
            window.location.href = `client.html?client_id=${clientId}`
        } else {
            const result = await response.json();
            alert("Erro ao atualizar: " (result.message || response.statusText));
        }
    } catch (err) {
        alert("Erro ao atualizar cliente", err);
    }
});

if(clientId) {
    loadClient(clientId);
} else {
    alert("ID do cliente não encontrado.");
    window.location.href = "dashboard.html";
}