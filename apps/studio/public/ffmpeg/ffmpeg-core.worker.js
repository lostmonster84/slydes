// Stub worker file for @ffmpeg/core (single-threaded).
//
// @ffmpeg/ffmpeg's worker derives a default `workerURL` by replacing
// `ffmpeg-core.js` → `ffmpeg-core.worker.js` and encodes it into
// `mainScriptUrlOrBlob` for Emscripten's locateFile().
//
// The single-threaded @ffmpeg/core package does NOT ship a real worker script
// (only multi-threaded cores do). Providing this stub prevents 404s during load.
Couldn't find the requested file /dist/esm/ffmpeg-core.worker.js in @ffmpeg/core.