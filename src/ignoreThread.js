chrome.storage.sync.get(['data', 'blockedUsers', 'allowedUsers'], (result) => {
  const storageData = new StorageData(result.data || {});
  const blockedUsers = new Set(result.blockedUsers || []);
  const allowedUsers = new Set(result.allowedUsers || []);

  ignoreUserThreads(storageData, blockedUsers, allowedUsers);
  muteBlacklist(storageData);
  
});

function ignoreUserThreads(data, blocked, allowed) {
  const threads = document.querySelectorAll('.js-threadList > .structItem');
  threads.forEach((thread) => {
    const author = getAuthorName(thread);
    if (data.needIgnoreUser(author) || blocked.has(author) && !allowed.has(author)) {
      thread.style.display = 'none'; // Oculta threads de usuários ignorados
    } else {
      thread.style.visibility = 'visible'; // Exibe threads permitidas
    }
  });
}

function muteBlacklist(storage) {
  const threads = document.querySelectorAll('.js-threadList > .structItem');
  threads.forEach((thread) => {
    const title = getTitle(thread);
    if (storage.threadTitleIsBlacklisted(title)) {
      thread.style.display = 'none'; // Oculta threads com palavras-chave bloqueadas
    } else {
      thread.style.visibility = 'visible'; // Exibe threads permitidas
    }
  });
}
