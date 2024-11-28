// Classe para armazenar os dados de configuração
class StorageData {
  constructor(data = {}) {
    this.users = data.users || [];
    this.minimumPosts = data.minimumPosts || 0;
    this.blacklist = data.blacklist || [];
  }

  needIgnoreUser(userName, numberOfPosts) {
    return this.users.includes(userName) || this.minimumPosts > numberOfPosts;
  }

  threadTitleIsBlacklisted(title) {
    return this.blacklist.some((word) =>
      title.toLowerCase().includes(word.toLowerCase())
    );
  }
}

// Funções utilitárias
function getPosts() {
  return document.querySelectorAll('article.message');
}

function getThreads() {
  return document.querySelectorAll('.js-threadList > .structItem');
}

function getUserName(post) {
  return post.getAttribute('data-author');
}

function getNumberOfUserPosts(post) {
  const userExtras = post.querySelector('.message-userExtras>.pairs');
  return userExtras
    ? parseInt(userExtras.textContent.replaceAll(',', ''), 10)
    : Number.MAX_SAFE_INTEGER;
}

function getAuthorName(thread) {
  return thread.getAttribute('data-author');
}

function getTitle(thread) {
  const titleElement = thread.querySelector('.structItem-title');
  return titleElement ? titleElement.innerText : '';
}

// Adiciona a classe "hidden" dinamicamente
/* if (!document.getElementById('custom-css')) {
  const style = document.createElement('style');
  style.id = 'custom-css';
  style.textContent = `
    .hidden {
      display: none !important;
    }
  `;
  document.head.appendChild(style);
} */
