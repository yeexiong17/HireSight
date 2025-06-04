import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// Mock OCR/AI extraction function - In production, integrate with services like:
// - AWS Textract
// - Google Document AI
// - Azure Form Recognizer
// - OpenAI Vision API
async function extractDataFromResume(filePath: string, fileName: string) {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data - In production, this would come from OCR/AI service
  const mockExtractedData = {
    candidate_name: "John Doe",
    email: "john.doe@email.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    linkedin_profile: "linkedin.com/in/johndoe",
    years_of_experience: "5 years",
    current_position: "Software Engineer at TechCorp",
    education: "Bachelor of Science in Computer Science, UC Berkeley",
    skills: "JavaScript, React, Node.js, Python, AWS, Docker",
    certifications: "AWS Certified Developer",
    languages: "English (Native), Spanish (Conversational)",
    summary: "Experienced software engineer with 5+ years building scalable web applications"
  };

  // Calculate mock confidence scores
  const fieldsWithConfidence = Object.entries(mockExtractedData).map(([key, value], index) => ({
    id: `field_${index + 1}`,
    label: key,
    value: value,
    confidence: Math.floor(Math.random() * 30) + 70, // Random confidence between 70-100
    category: getCategoryForField(key),
    position: {
      page: Math.random() > 0.5 ? 1 : 2,
      x: Math.floor(Math.random() * 400) + 100,
      y: Math.floor(Math.random() * 600) + 50,
      width: Math.floor(Math.random() * 200) + 150,
      height: 20
    }
  }));

  return fieldsWithConfidence;
}

function getCategoryForField(fieldName: string): string {
  const categoryMap: Record<string, string> = {
    candidate_name: 'personal',
    summary: 'personal',
    email: 'contact',
    phone: 'contact',
    location: 'contact',
    linkedin_profile: 'contact',
    years_of_experience: 'experience',
    current_position: 'experience',
    education: 'education',
    skills: 'skills',
    certifications: 'other',
    languages: 'other'
  };
  return categoryMap[fieldName] || 'other';
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    const jobId = formData.get('jobId') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Please upload PDF, JPEG, or PNG files only.' 
      }, { status: 400 });
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Please upload files smaller than 5MB.' 
      }, { status: 400 });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'resumes');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `resume_${timestamp}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Extract data from resume (mock implementation)
    const extractedFields = await extractDataFromResume(filePath, fileName);

    // In production, save to database
    const resumeData = {
      id: `resume_${timestamp}`,
      candidateName: extractedFields.find(f => f.label === 'candidate_name')?.value || 'Unknown',
      jobId: jobId,
      fileName: file.name,
      filePath: fileName, // Store relative path
      uploadDate: new Date().toISOString(),
      status: 'pending',
      totalPages: Math.floor(Math.random() * 3) + 1, // Mock page count
      extractedFields: extractedFields,
      fileSize: file.size,
      fileType: file.type
    };

    console.log('Resume uploaded and processed:', {
      fileName: file.name,
      size: file.size,
      extractedFields: extractedFields.length
    });

    return NextResponse.json({
      success: true,
      message: 'Resume uploaded and processed successfully',
      data: resumeData
    });

  } catch (error) {
    console.error('Error processing resume upload:', error);
    return NextResponse.json({ 
      error: 'Failed to process resume upload' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve uploaded resumes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const jobId = searchParams.get('jobId');

    // In production, fetch from database
    // For now, return mock data
    const mockResumes = [
      {
        id: 'resume_1',
        candidateName: 'John Smith',
        jobId: jobId || 'job_1',
        fileName: 'john_smith_resume.pdf',
        uploadDate: '2024-01-15T10:30:00Z',
        status: 'pending',
        extractedFields: 12,
        confidence: 92
      }
    ];

    return NextResponse.json({
      success: true,
      data: mockResumes
    });

  } catch (error) {
    console.error('Error fetching resumes:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch resumes' 
    }, { status: 500 });
  }
}
