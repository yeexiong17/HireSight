import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
) {
  try {
    const resumeId = '2';
    
    // In production, fetch file path from database using resumeId
    // For now, we'll construct the path based on the ID
    const uploadsDir = join(process.cwd(), 'uploads', 'resumes');
    
    // Mock file mapping - In production, get this from database
    const mockFileMapping: Record<string, string> = {
      '1': 'resume_1704110400000.pdf', // Mock filename
      'resume_1': 'resume_1704110400000.pdf'
    };
    
    const fileName = mockFileMapping[resumeId];
    if (!fileName) {
      return NextResponse.json({ error: 'Resume not found' }, { status: 404 });
    }
    
    const filePath = join(uploadsDir, fileName);
    
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
    
    const fileBuffer = await readFile(filePath);
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    
    // Set appropriate content type
    let contentType = 'application/octet-stream';
    switch (fileExtension) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
    }
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `inline; filename="${fileName}"`,
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
      },
    });
    
  } catch (error) {
    console.error('Error serving resume file:', error);
    return NextResponse.json({ error: 'Failed to serve file' }, { status: 500 });
  }
}
