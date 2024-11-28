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

function getNumberOfUserPosts(post) {
  return parseInt(
    (post.querySelector('.message-userExtras > dl:nth-child(2) > dd')?.textContent.trim().replace(',', '') || '0'),
    10
  )
}

function getAuthorName(element) {
  return element.getAttribute('data-author');
}

function getTitle(thread) {
  const titleElement = thread.querySelector('.structItem-title');
  return titleElement ? titleElement.innerText : '';
}
