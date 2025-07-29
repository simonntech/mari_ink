const API_URL = "https://mari-clients-api.onrender.com/api";
const clientDetails = document.getElementById("clientDetails");

const params = new URLSearchParams(window.location.search);
const clientId = params.get("client_id");

const token = localStorage.getItem("token");
if (!token) {
    alert("Faça login para continuar.");
    window.location.href = "index.html";
}

function formatISODateBR(dataISO) {
    const [ano, mes, dia] = dataISO.split("T")[0].split("-");
    return `${dia}/${mes}/${ano}`;
}

fetch(`${API_URL}/clients/${clientId}`, {
    headers: {
        Authorization: `Bearer ${token}`
    }
})
    .then(res => {
        if (!res.ok) {
            throw new Error("Cliente não encontrado.");
        }
        return res.json();
    })
    .then(client => {
        const formatedBirthDate = formatISODateBR(client.birth_date);
        const formatedCreatedDate = formatISODateBR(client.registration_date);
        const formatedLastTattooDate = client.last_tattoo_date
            ? formatISODateBR(client.last_tattoo_date)
            : "Não informada";
        const editBtn = document.getElementById("editBtn");
        editBtn.innerHTML = `
            <a href="editclient.html?client_id=${client.client_id}"><button class="btn btn-warning mt-3"><i class="fas fa-edit"></i>Editar</button></a>
        `

        clientDetails.innerHTML = `
            <ul class="list-group">
                <li class="list-group-item list-group-item-dark"><strong>Nome:</strong> ${client.first_name} ${client.last_name}</li>
                <li class="list-group-item"><strong>Gênero:</strong> ${client.gender}</li>
                <li class="list-group-item"><strong>Cadastrado em:</strong> ${formatedCreatedDate}</li>
                <li class="list-group-item"><strong>Última tattoo:</strong> ${formatedLastTattooDate}</li>
                <li class="list-group-item"><strong>Rede Social:</strong> ${client.social_media}</li>
                <li class="list-group-item"><strong>Telefone:</strong> ${client.phone}</li>
                <li class="list-group-item"><strong>Nascimento:</strong> ${formatedBirthDate}</li>
                <li class="list-group-item"><strong>Endereço:</strong> ${client.address_street}, ${client.address_number}<br>Bairro: ${client.address_neighborhood}<br>Cidade: ${client.address_city}-${client.address_state}<br>CEP: ${client.zip_code}</li>
                <li class="list-group-item"><strong>Estilos favoritos:</strong> ${client.fav_style}</li>
                <li class="list-group-item"><strong>Tatuagens feitas:</strong> ${client.number_of_tattoos}</li>
                <li class="list-group-item"><strong>Alergias:</strong> ${client.allergies}</li>
                <li class="list-group-item">
                    <strong>${client.is_first_client
                    ? '<span class="text-secondary">Cliente novo</span>'
                    : '<span class="text-secondary">Cliente antigo</span>'}</strong>
                </li>
            </ul>
        `;
    })
    .catch(error => {
        clientDetails.innerHTML = `<div class="alert alert-danger">${error.message}</div>`;
    });
