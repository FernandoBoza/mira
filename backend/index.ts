import {deconstructFile} from "./services/videoService.ts";

const fileSample = Bun.file('./assets/2020NYE.mp4')

const server = Bun.serve({
    port: 3000,
    fetch: () => new Response(JSON.stringify(deconstructFile(fileSample)))
});

console.log(`Listening on http://localhost:${server.port}`)
