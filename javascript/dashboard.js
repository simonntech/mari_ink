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
            data.forEach(client => {
                const li = document.createElement("li");

                li.className = "list-group-item d-flex justify-content-between align-items-center";

                li.innerHTML = `
                    <span class="col-3 text-break"><a href="client.html?client_id=${client.client_id}" class="text-decoration-none"> ${client.first_name} ${client.last_name}</a></span>
                    <span class="col-2">${client.gender}</span>
                    <span class="col-3 text-break p-2">${client.social_media}</span>
                    <span class="col-3 text-break">${client.phone}</span>
                    <span class="col-1 text-end">
                        <button class="btn btn-sm btn-warning me-1"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-sm btn-danger"><i class="fas fa-trash-alt"></i></button>
                        </span>
                `;
                clientsList.appendChild(li);
            });
        });
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
