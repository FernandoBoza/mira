onmessage = function (e) {
  console.log(`${e.data} received from main script`);

  // Test for multithread worker
  const sab = new SharedArrayBuffer(1024);
  postMessage(sab);
  postMessage('Sending message back to main script');
};
