# Deployment Guide for Real Resume Upload Feature

This guide provides instructions for deploying the real resume upload feature in the application.

## Overview

The real resume upload feature allows candidates to upload their resumes for specific job applications. The system stores the uploaded resumes and makes them available for employers to review.

## Components

- **Resume Upload API Endpoint**: Handles file uploads and stores resumes.
- **Resume File Serving API Endpoint**: Serves uploaded resume files for viewing.
- **Candidate Resume Upload Component**: UI component for candidates to upload resumes.
- **Candidate Job Application Page**: Page where candidates apply to jobs and upload resumes.

## Prerequisites

- Node.js and npm installed.
- Application dependencies installed (`npm install`).
- Proper environment variables configured (see `.env.local`).

## Environment Variables

Ensure the following environment variables are set in `.env.local` or your deployment environment:

- `RESUME_STORAGE_PATH`: Directory path where uploaded resumes will be stored.
- `MAX_UPLOAD_SIZE`: Maximum allowed file size for uploads (e.g., 5MB).
- Any other relevant variables for your storage or database.

## Deployment Steps

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Build the Application**

   ```bash
   npm run build
   ```

3. **Start the Application**

   ```bash
   npm start
   ```

4. **Verify Upload Directory Permissions**

   Ensure the directory specified by `RESUME_STORAGE_PATH` exists and the application has read/write permissions.

5. **Test Resume Upload**

   - Navigate to the candidate job application page.
   - Upload a resume file (PDF, DOCX, etc.).
   - Confirm the upload succeeds and the file is stored.

6. **Test Resume Viewing**

   - As an employer, navigate to the resume review page.
   - Confirm the uploaded resume file can be viewed/downloaded.

## Notes

- Uploaded files are stored on the server filesystem. For production, consider using cloud storage (e.g., AWS S3) and update the API endpoints accordingly.
- Validate file types and sizes on both client and server sides.
- Implement security measures to prevent unauthorized access to uploaded files.

## Troubleshooting

- Check server logs for upload errors.
- Verify environment variables are correctly set.
- Ensure file storage path is accessible.

## Additional Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Handling File Uploads in Next.js](https://nextjs.org/docs/api-routes/api-middlewares#custom-config)

---

This completes the deployment setup for the real resume upload feature.
