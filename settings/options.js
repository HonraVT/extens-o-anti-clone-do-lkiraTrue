import { showError, showSucessMessage, stringToArray } from './utils.js';

let previousMinimumPosts = 0; // Variável para armazenar o valor atual de minimumPosts

function saveOptions(element) {
  element.preventDefault();

  try {
    const users = stringToArray(document.querySelector("#users").value);
    const minimumPosts = parseInt(document.querySelector("#minimumPosts").value, 10) || 0;
    const blacklist = stringToArray(document.querySelector('#blacklist').value);

    if (minimumPosts !== previousMinimumPosts) {
      chrome.storage.sync.remove("blockedUsers", () => {
        console.log("Blocked users cache cleared due to minimumPosts change.");
        updateBlockedUsersList([]); // Limpa a lista na interface
      });
      previousMinimumPosts = minimumPosts;
    }

    chrome.storage.sync.set({
      data: {
        users: users,
        minimumPosts: minimumPosts,
        blacklist: blacklist
      },
    });

    showSucessMessage();
  } catch (e) {
    showError();
  }
}

function restoreOptions() {
  function setCurrentChoice(result) {
    if (!result.data) {
      document.querySelector("#users").value = "";
      document.querySelector("#minimumPosts").value = 0;
      document.querySelector("#blacklist").value = "";
      return;
    }

    document.querySelector("#users").value = result.data.users;
    document.querySelector("#minimumPosts").value = result.data.minimumPosts || 0;
    document.querySelector("#blacklist").value = result.data.blacklist;

    previousMinimumPosts = result.data.minimumPosts || 0;
  }

  chrome.storage.sync.get("data", setCurrentChoice);

  // Atualiza a lista de usuários bloqueados
  chrome.storage.sync.get(["blockedUsers", "allowedUsers"], (result) => {
    const blockedUsers = result.blockedUsers || [];
    const allowedUsers = result.allowedUsers || [];
    updateBlockedUsersList(blockedUsers, allowedUsers);
  });
}

function updateBlockedUsersList(blockedUsers, allowedUsers) {
  const listElement = document.getElementById("blocked-users-list");
  listElement.innerHTML = ""; // Limpa a lista existente

  if (blockedUsers.length === 0) {
    listElement.innerHTML = "<p>Nenhum usuário bloqueado atualmente.</p>";
  } else {
    blockedUsers.forEach(user => {
      const userContainer = document.createElement("div");

      const userName = document.createElement("span");
      userName.textContent = user;

      const checkboxContainer = document.createElement("div");
      checkboxContainer.classList.add("checkbox-container"); // Aplica o estilo do container

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = allowedUsers.includes(user); // Marca se o usuário já está permitido
      checkbox.addEventListener("change", () => toggleUserPermission(user, checkbox.checked));

      checkboxContainer.appendChild(checkbox); // Coloca o checkbox dentro do contêiner
      userContainer.appendChild(userName);
      userContainer.appendChild(checkboxContainer);
      listElement.appendChild(userContainer);
    });
  }
}


function toggleUserPermission(user, isAllowed) {
  chrome.storage.sync.get("allowedUsers", (result) => {
    const allowedUsers = result.allowedUsers || [];

    if (isAllowed) {
      // Adicionar usuário à lista de permitidos
      if (!allowedUsers.includes(user)) {
        allowedUsers.push(user);
      }
    } else {
      // Remover usuário da lista de permitidos
      const index = allowedUsers.indexOf(user);
      if (index > -1) {
        allowedUsers.splice(index, 1);
      }
    }

    // Atualizar o armazenamento
    chrome.storage.sync.set({ allowedUsers }, () => {
      console.log(`Usuário ${user} ${isAllowed ? "permitido" : "bloqueado"} com sucesso.`);
    });
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);