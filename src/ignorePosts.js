chrome.storage.sync.get(['data', 'blockedUsers', 'allowedUsers'], (result) => {
  const storageData = new StorageData(result.data || {});
  const blockedUsers = new Set(result.blockedUsers || []);
  const allowedUsers = new Set(result.allowedUsers || []);
  console.log("kkk", allowedUsers);
  

  processPosts(storageData, blockedUsers, allowedUsers);
  observeNewPosts(storageData, blockedUsers, allowedUsers);
  saveBlockedUsers(blockedUsers);
  console.log(blockedUsers);
});

function processPosts(data, blocked, allowed) {
  const posts = document.querySelectorAll('article.message');
  posts.forEach((post) => {
    handlePost(post, data, blocked, allowed);
  });
}

function handlePost(post, storage, blocked, allowed) {
  const userName = post.getAttribute('data-author');
  const numberOfPosts = parseInt(
    post.querySelector('.message-userExtras > dl:nth-child(2) > dd').textContent.trim().replaceAll(',', '')
  );
  //console.log(["bloquear?:", userName, storageData.needIgnoreUser(userName, numberOfPosts) && !allowedUsers.has(userName)]);
  if (storage.needIgnoreUser(userName, numberOfPosts) && !allowed.has(userName)) {
    blocked.add(userName)
    post.style.display = 'none'; // Oculta o post indesejado
  } else {
    post.style.visibility = 'visible'; // Exibe o post permitido
  }
}

function observeNewPosts(storage, blocked, allowed) {
  const targetNode = document.querySelector('.p-body-pageContent'); // Pai dos posts
  if (!targetNode) return;

  const config = { childList: true, subtree: true }; // Observa adições no DOM
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1 && node.matches('article.message')) {
            handlePost(node, storage, blocked, allowed); // Processa posts adicionados
          }
        });
      }
    }
  });

  observer.observe(targetNode, config);
}

function saveBlockedUsers(blocked) {
  chrome.storage.sync.set({ blockedUsers: Array.from(blocked) }, () => {
    console.log('Blocked users updated:', blocked);
  });
}