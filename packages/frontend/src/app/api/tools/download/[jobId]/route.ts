import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(
    request: NextRequest,
    { params }: { params: { jobId: string } }
) {
    const { jobId } = params;

    try {
        const backendResponse = await fetch(`${BACKEND_URL}/api/tools/download/${jobId}`, {
            method: 'GET',
            // Server-to-server: no CORS restrictions
        });

        if (!backendResponse.ok) {
            let errorMessage = `Backend error: ${backendResponse.status}`;
            try {
                const errorBody = await backendResponse.text();
                const parsed = JSON.parse(errorBody);
                errorMessage = parsed.detail || errorMessage;
            } catch {
                // keep default
            }
            return NextResponse.json({ detail: errorMessage }, { status: backendResponse.status });
        }

        // Pipe the file stream from backend to browser
        const fileBuffer = await backendResponse.arrayBuffer();
        
        // Forward content headers from backend
        const contentDisposition = backendResponse.headers.get('content-disposition') || 'attachment';
        const contentType = backendResponse.headers.get('content-type') || 'application/octet-stream';

        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Disposition': contentDisposition,
                'Content-Type': contentType,
                'Content-Length': String(fileBuffer.byteLength),
            },
        });

    } catch (error) {
        console.error('[fileMind-Proxy] Download proxy error:', error);
        return NextResponse.json(
            { detail: 'Failed to reach backend server. Please try again.' },
            { status: 502 }
        );
    }
}
