onmessage = function (e) {
  console.log(`${e.data} received from main script`);
  postMessage('Sending message back to main script');
};


// importScripts('ffmpeg.js');
//
// onmessage = async (event) => {
//   const videoFile = event.data;
//
//   const ffmpeg = createFFmpeg({ log: true });
//   await ffmpeg.load();
//   ffmpeg.FS('writeFile', 'test.mp4', await fetchFile(videoFile));
//   await ffmpeg.run('-i', 'test.mp4', '-vf', 'fps=1', 'out%d.jpg');
//   const data = ffmpeg.FS('readdir', '/');
//   const jpgFiles = data.filter((file) => file.endsWith('.jpg'));
//   const frames = jpgFiles.map((file) => {
//     const data = ffmpeg.FS('readFile', file);
//     const base64 = Buffer.from(data).toString('base64');
//     return `data:image/jpg;base64,${base64}`;
//   });
//
//   // Send the frames data back to the main thread
//   postMessage(frames);
// };