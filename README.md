# Mira Media Manager

Mira Media Manager is a web application that allows users to upload,
process, and manage media files. The application is built using React,
Bun.js, and Hono. The application is designed to be a lightweight
and easy to use media manager that can be used to process and manage
media files.

## TODO

### Frontend

- [ ] Use web workers to process videos in the background
- [ ] Use ffmpeg wasm to process/convert videos
- [ ] Create gallery and table view of uploaded files
- [ ] Use service workers to cache the UI

[//]: # (- [ ] Implement video editing to cut, splice, and merge videos)

[//]: # (- [ ] Implement audio editing to cut, splice, and merge audio)

[//]: # (- [ ] Implement image editing to crop, resize, and merge images)

[//]: # (### Backend)

[//]: # (- [ ] Created signed URLs for the frontend to upload to, [example]&#40;http://youtube.com/watch?v=l5akQHDcYIU&#41;)

[//]: # (    * handleSubmit&#40;fileName, filePath&#41;: create new video record without the file -> get signed url)

[//]: # (    * uploadVideo&#40;url&#41;: POST -> send video to blob storage)

[//]: # (- [ ] Implement streaming on backend)

[//]: # (- [ ] Project saving and loading functionality)

### Research

[//]: # (- [ ] Use web sockets to stream the data?)

- [ ] Implement a [remove green screen feature](https://youtube.com/watch?v=gzdUEuuNR6Y)
