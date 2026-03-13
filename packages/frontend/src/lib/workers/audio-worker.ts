/**
 * fileMind Audio Web Worker — Client-Side Processing via FFmpeg WASM
 * Handles: FORMAT_CONVERT (e.g., OGG→MP3, WAV→MP3, M4A→MP3)
 * Runs entirely in the browser — no server upload needed for simple conversions.
 */
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

async function initFFmpeg() {
    if (ffmpeg && ffmpeg.loaded) return ffmpeg;

    ffmpeg = new FFmpeg();

    ffmpeg.on('log', ({ message }) => {
        console.log('[Worker-Audio] FFmpeg:', message);
    });

    ffmpeg.on('progress', ({ progress }) => {
        self.postMessage({
            status: 'PROGRESS',
            result: { progress: Math.round(progress * 100) },
        });
    });

    // Load FFmpeg WASM core
    await ffmpeg.load({
        coreURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.js',
        wasmURL: 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm/ffmpeg-core.wasm',
    });

    return ffmpeg;
}

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent) => {
    const { type, data } = e.data;

    try {
        switch (type) {
            case 'CONVERT_AUDIO': {
                const { file, inputFormat, outputFormat } = data;

                const ff = await initFFmpeg();

                const inputName = `input.${inputFormat}`;
                const outputName = `output.${outputFormat}`;

                const fileData = file instanceof ArrayBuffer ? new Uint8Array(file) : await fetchFile(file);
                await ff.writeFile(inputName, fileData);

                await ff.exec(['-i', inputName, '-q:a', '2', outputName]);

                const outputData = await ff.readFile(outputName);
                const outputBuffer = (outputData as Uint8Array).buffer;

                await ff.deleteFile(inputName);
                await ff.deleteFile(outputName);

                ctx.postMessage({
                    status: 'SUCCESS',
                    result: {
                        output: outputBuffer,
                        filename: `fileMind_Converted.${outputFormat}`,
                        message: `Converted ${inputFormat.toUpperCase()} → ${outputFormat.toUpperCase()} successfully.`,
                    },
                }, [outputBuffer]);
                break;
            }

            default:
                ctx.postMessage({ status: 'ERROR', message: `Unknown audio task type: ${type}` });
        }
    } catch (error: any) {
        console.error('[Worker-Audio] Error:', error);
        ctx.postMessage({ status: 'ERROR', message: error.message || 'Audio processing failed.' });
    }
};
