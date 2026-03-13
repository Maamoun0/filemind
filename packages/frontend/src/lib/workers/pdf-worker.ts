/**
 * fileMind PDF Web Worker — Client-Side Processing via pdf-lib
 * Handles: MERGE, SPLIT, COMPRESS, METADATA extraction
 * All operations run entirely in the browser (no server upload needed).
 */
import { PDFDocument } from 'pdf-lib';

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent) => {
    const { type, data } = e.data;

    try {
        switch (type) {
            case 'PROCESS_PDF_METADATA': {
                const { arrayBuffer } = data;
                const pdf = await PDFDocument.load(arrayBuffer);
                const pages = pdf.getPageCount();
                const title = pdf.getTitle() || 'Untitled';
                const author = pdf.getAuthor() || 'Unknown';
                const creationDate = pdf.getCreationDate()?.toISOString() || null;

                ctx.postMessage({
                    status: 'SUCCESS',
                    result: {
                        numPages: pages,
                        title,
                        author,
                        creationDate,
                        message: `PDF analyzed: ${pages} pages.`,
                    },
                });
                break;
            }

            case 'MERGE_PDF': {
                const { files } = data;
                if (!files || files.length < 2) {
                    throw new Error('At least 2 PDF files are required for merging.');
                }

                const mergedPdf = await PDFDocument.create();

                for (const fileBuffer of files) {
                    const donorPdf = await PDFDocument.load(fileBuffer);
                    const copiedPages = await mergedPdf.copyPages(donorPdf, donorPdf.getPageIndices());
                    copiedPages.forEach((page) => mergedPdf.addPage(page));
                }

                const mergedBytes = await mergedPdf.save();

                ctx.postMessage({
                    status: 'SUCCESS',
                    result: {
                        output: mergedBytes.buffer,
                        filename: 'fileMind_Merged.pdf',
                        numPages: mergedPdf.getPageCount(),
                        message: `Merged ${files.length} PDFs into ${mergedPdf.getPageCount()} pages.`,
                    },
                }, [mergedBytes.buffer]);
                break;
            }

            case 'SPLIT_PDF': {
                const { arrayBuffer, ranges } = data;
                const sourcePdf = await PDFDocument.load(arrayBuffer);
                const totalPages = sourcePdf.getPageCount();
                const outputs: { buffer: ArrayBuffer; filename: string; pages: number }[] = [];

                for (let i = 0; i < ranges.length; i++) {
                    const [start, end] = ranges[i];
                    if (start < 0 || end >= totalPages || start > end) {
                        throw new Error(`Invalid range [${start}, ${end}] for PDF with ${totalPages} pages.`);
                    }

                    const newPdf = await PDFDocument.create();
                    const indices = Array.from({ length: end - start + 1 }, (_, k) => start + k);
                    const copiedPages = await newPdf.copyPages(sourcePdf, indices);
                    copiedPages.forEach((page) => newPdf.addPage(page));

                    const bytes = await newPdf.save();
                    outputs.push({
                        buffer: bytes.buffer as ArrayBuffer,
                        filename: `fileMind_Split_Part${i + 1}.pdf`,
                        pages: indices.length,
                    });
                }

                ctx.postMessage({
                    status: 'SUCCESS',
                    result: {
                        outputs,
                        message: `Split into ${outputs.length} parts from ${totalPages} pages.`,
                    },
                }, outputs.map(o => o.buffer));
                break;
            }

            case 'COMPRESS_PDF': {
                const { arrayBuffer } = data;
                const originalSize = arrayBuffer.byteLength;

                const pdf = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

                pdf.setTitle('');
                pdf.setAuthor('');
                pdf.setSubject('');
                pdf.setKeywords([]);
                pdf.setProducer('fileMind');
                pdf.setCreator('fileMind');

                const compressedBytes = await pdf.save({
                    useObjectStreams: true,
                });

                const savedPercent = Math.round((1 - compressedBytes.byteLength / originalSize) * 100);

                ctx.postMessage({
                    status: 'SUCCESS',
                    result: {
                        output: compressedBytes.buffer,
                        filename: 'fileMind_Compressed.pdf',
                        originalSize,
                        compressedSize: compressedBytes.byteLength,
                        savedPercent: Math.max(savedPercent, 0),
                        message: `Compressed PDF. Saved ~${Math.max(savedPercent, 0)}%.`,
                    },
                }, [compressedBytes.buffer]);
                break;
            }

            default:
                ctx.postMessage({ status: 'ERROR', message: `Unknown task type: ${type}` });
        }
    } catch (error: any) {
        console.error('[Worker-PDF] Error:', error);
        ctx.postMessage({ status: 'ERROR', message: error.message || 'PDF processing failed.' });
    }
};
