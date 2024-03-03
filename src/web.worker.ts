onmessage = function (e) {
  console.log(`${e.data} received from main script`);
  postMessage('Sending message back to main script');
};
