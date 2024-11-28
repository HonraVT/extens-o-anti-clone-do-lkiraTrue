chrome.storage.sync.get(['data', 'blockedUsers', 'allowedUsers'], (result) => {
  const storageData = new StorageData(result.data || {});
  const blockedUsers = new Set(result.blockedUsers || []);
  const allowedUsers = new Set(result.allowedUsers || []);
  const threads = getThreads();
  ignoreUserThreads(threads, storageData, blockedUsers, allowedUsers);
  muteBlacklist(threads, storageData);

});

function ignoreUserThreads(threadList, data, blocked, allowed) {
  threadList.forEach((thread) => {
    const author = getAuthorName(thread);
    if (data.needIgnoreUser(author) || blocked.has(author) && !allowed.has(author)) {
      thread.style.display = 'none'; // Oculta threads de usuários ignorados
    } else {
      thread.style.visibility = 'visible'; // Exibe threads permitidas
    }
  });
}

function muteBlacklist(threadList, storage) {
  threadList.forEach((thread) => {
    const title = getTitle(thread);
    if (storage.threadTitleIsBlacklisted(title)) {
      thread.style.display = 'none'; // Oculta threads com palavras-chave bloqueadas
    } else {
      thread.style.visibility = 'visible'; // Exibe threads permitidas
    }
  });
}
