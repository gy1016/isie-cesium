// 子线程注册监听函数，接收到主线程消息后，将消息回发
self.addEventListener('message', (e) => {
  self.postMessage(e.data);
});

// 用定时器发消息
setInterval(() => {
  self.postMessage('someMessage');
}, 1000);
