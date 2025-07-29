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
                <span class="col-5 text-break">${client.phone}</span>
                    <span class="col-1 text-end">
                        <a href="editclient.html?client_id=${client.client_id}"><button class="btn btn-sm btn-warning me-1"><i class="fas fa-edit"></i></button></a>
                        <button class="btn btn-sm btn-danger delete-btn"><i class="fas fa-trash-alt"></i></button>
                        </span>
                        `;
                        
                const deleteBtn = li.querySelector(".delete-btn");

                deleteBtn.addEventListener("click", () => {
                    if (confirm(`Excluir ${client.first_name}?`)) {
                        fetch(`${API_URL}/clients/${client.client_id}`, {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        })
                        .then(res => {
                            if(!res.ok) {
                                throw new Error("Erro ao excluir o cliente.");
                            }
                            li.remove();
                        })
                        .catch(err => {
                            alert("Erro ao excluir cliente: " + err.message);
                        })
                    }
                })

                clientsList.appendChild(li);

            });
        });
}


function logout() {
    localStorage.removeItem("token");
    window.location.href = "index.html";
}
