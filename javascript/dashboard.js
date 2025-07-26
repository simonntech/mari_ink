const API_URL = "https://mari-clients-api.onrender.com/api";


const clientsList = document.getElementById("clientsList");
if (clientsList) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "index.html";
        alert("Faça login para acessar.")
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
                li.innerHTML = `${client.first_name} ${client.last_name}`;
                clientsList.appendChild(li);
            });
        });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
