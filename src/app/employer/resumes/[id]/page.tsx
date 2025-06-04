'use client';

import React, { useState } from 'react';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Edit3, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Download,
  AlertTriangle,
  Info,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Globe
} from 'lucide-react';
import Link from 'next/link';

interface ExtractedField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  category: 'personal' | 'contact' | 'experience' | 'education' | 'skills' | 'other';
  position?: { page: number; x: number; y: number; width: number; height: number };
  isEditing?: boolean;
}

interface ResumeData {
  id: string;
  candidateName: string;
  jobTitle: string;
  fileName: string;
  uploadDate: string;
  status: 'pending' | 'approved' | 'rejected';
  totalPages: number;
  extractedFields: ExtractedField[];
}

const mockResumeData: ResumeData = {
  id: '1',
  candidateName: 'John Smith',
  jobTitle: 'Senior Frontend Developer',
  fileName: 'john_smith_resume.pdf',
  uploadDate: '2024-01-15',
  status: 'pending',
  totalPages: 2,
  extractedFields: [
    {
      id: '1',
      label: 'candidate_name',
      value: 'John Smith',
      confidence: 98,
      category: 'personal',
      position: { page: 1, x: 100, y: 50, width: 200, height: 30 }
    },
    {
      id: '2',
      label: 'email',
      value: 'john.smith@email.com',
      confidence: 95,
      category: 'contact',
      position: { page: 1, x: 100, y: 100, width: 250, height: 20 }
    },
    {
      id: '3',
      label: 'phone',
      value: '+1 (555) 123-4567',
      confidence: 92,
      category: 'contact',
      position: { page: 1, x: 100, y: 120, width: 180, height: 20 }
    },
    {
      id: '4',
      label: 'location',
      value: 'San Francisco, CA',
      confidence: 90,
      category: 'contact',
      position: { page: 1, x: 100, y: 140, width: 150, height: 20 }
    },
    {
      id: '5',
      label: 'linkedin_profile',
      value: 'linkedin.com/in/johnsmith',
      confidence: 88,
      category: 'contact',
      position: { page: 1, x: 100, y: 160, width: 220, height: 20 }
    },
    {
      id: '6',
      label: 'years_of_experience',
      value: '8 years',
      confidence: 85,
      category: 'experience',
      position: { page: 1, x: 100, y: 200, width: 100, height: 20 }
    },
    {
      id: '7',
      label: 'current_position',
      value: 'Senior Frontend Developer at TechCorp',
      confidence: 93,
      category: 'experience',
      position: { page: 1, x: 100, y: 250, width: 300, height: 20 }
    },
    {
      id: '8',
      label: 'education',
      value: 'Bachelor of Science in Computer Science, Stanford University',
      confidence: 91,
      category: 'education',
      position: { page: 1, x: 100, y: 400, width: 400, height: 20 }
    },
    {
      id: '9',
      label: 'skills',
      value: 'React, TypeScript, JavaScript, Node.js, Python, AWS, Docker',
      confidence: 87,
      category: 'skills',
      position: { page: 2, x: 100, y: 100, width: 450, height: 60 }
    },
    {
      id: '10',
      label: 'certifications',
      value: 'AWS Certified Developer, Google Cloud Professional',
      confidence: 89,
      category: 'other',
      position: { page: 2, x: 100, y: 200, width: 350, height: 40 }
    },
    {
      id: '11',
      label: 'languages',
      value: 'English (Native), Spanish (Conversational)',
      confidence: 82,
      category: 'other',
      position: { page: 2, x: 100, y: 300, width: 300, height: 20 }
    },
    {
      id: '12',
      label: 'summary',
      value: 'Experienced frontend developer with 8+ years building scalable web applications',
      confidence: 75,
      category: 'other',
      position: { page: 1, x: 100, y: 180, width: 500, height: 40 }
    }
  ]
};

export default function ResumeReviewPage({ params }: { params: { id: string } }) {
  const [resumeData, setResumeData] = useState<ResumeData>(mockResumeData);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<'all' | 'low-confidence' | 'consolidated' | 'compliance' | 'file-info'>('all');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const handleFieldEdit = (fieldId: string, newValue: string) => {
    setResumeData(prev => ({
      ...prev,
      extractedFields: prev.extractedFields.map(field =>
        field.id === fieldId ? { ...field, value: newValue, isEditing: false } : field
      )
    }));
  };

  const handleFieldDelete = (fieldId: string) => {
    setResumeData(prev => ({
      ...prev,
      extractedFields: prev.extractedFields.filter(field => field.id !== fieldId)
    }));
  };

  const handleApprove = () => {
    setResumeData(prev => ({ ...prev, status: 'approved' }));
    // In real app, make API call to update status
  };

  const handleReject = () => {
    setResumeData(prev => ({ ...prev, status: 'rejected' }));
    // In real app, make API call to update status
  };

  const getFieldIcon = (category: string) => {
    switch (category) {
      case 'personal':
        return <User className="w-4 h-4" />;
      case 'contact':
        return <Mail className="w-4 h-4" />;
      case 'experience':
        return <Briefcase className="w-4 h-4" />;
      case 'education':
        return <GraduationCap className="w-4 h-4" />;
      case 'skills':
        return <Award className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100';
    if (confidence >= 75) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const filteredFields = () => {
    switch (activeTab) {
      case 'low-confidence':
        return resumeData.extractedFields.filter(field => field.confidence < 85);
      case 'consolidated':
        return resumeData.extractedFields.filter(field => ['personal', 'contact', 'experience'].includes(field.category));
      case 'compliance':
        return resumeData.extractedFields.filter(field => ['personal', 'contact'].includes(field.category));
      default:
        return resumeData.extractedFields;
    }
  };

  const groupedFields = filteredFields().reduce((acc, field) => {
    if (!acc[field.category]) {
      acc[field.category] = [];
    }
    acc[field.category].push(field);
    return acc;
  }, {} as Record<string, ExtractedField[]>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link
                href="/employer/resumes"
                className="inline-flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Back to Resumes
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{resumeData.candidateName}</h1>
                <p className="text-sm text-gray-600">{resumeData.jobTitle} • {resumeData.fileName}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsEditMode(!isEditMode)}
                className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${
                  isEditMode 
                    ? 'border-blue-300 text-blue-700 bg-blue-50 hover:bg-blue-100' 
                    : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                }`}
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditMode ? 'Exit Edit' : 'Edit Fields'}
              </button>
              <button
                onClick={handleApprove}
                disabled={resumeData.status === 'approved'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </button>
              <button
                onClick={handleReject}
                disabled={resumeData.status === 'rejected'}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Document Preview */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">Document Preview</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              {/* Page Navigation */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {resumeData.totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(resumeData.totalPages, currentPage + 1))}
                  disabled={currentPage === resumeData.totalPages}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
            
            {/* Document Viewer */}
            <div className="p-4">
              <div className="relative bg-gray-100 rounded-lg" style={{ aspectRatio: '8.5/11', minHeight: '600px' }}>
                {/* Mock PDF/Document Display */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-600">PDF</span>
                    </div>
                    <p className="text-sm">Document Preview</p>
                    <p className="text-xs text-gray-400">Page {currentPage}</p>
                  </div>
                </div>
                
                {/* Highlight overlays for selected fields */}
                {selectedField && resumeData.extractedFields
                  .filter(field => field.id === selectedField && field.position?.page === currentPage)
                  .map(field => (
                    <div
                      key={field.id}
                      className="absolute border-2 border-blue-500 bg-blue-100 bg-opacity-30 rounded"
                      style={{
                        left: `${(field.position!.x / 600) * 100}%`,
                        top: `${(field.position!.y / 800) * 100}%`,
                        width: `${(field.position!.width / 600) * 100}%`,
                        height: `${(field.position!.height / 800) * 100}%`,
                      }}
                    />
                  ))
                }
              </div>
            </div>
          </div>

          {/* Right Panel - Extracted Data */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900">Extracted Data</h2>
              
              {/* Tabs */}
              <div className="mt-4">
                <nav className="flex space-x-8" aria-label="Tabs">
                  {[
                    { id: 'all', name: 'All Fields', count: resumeData.extractedFields.length },
                    { id: 'low-confidence', name: 'Low Confidence', count: resumeData.extractedFields.filter(f => f.confidence < 85).length },
                    { id: 'consolidated', name: 'Key Info', count: resumeData.extractedFields.filter(f => ['personal', 'contact', 'experience'].includes(f.category)).length },
                    { id: 'compliance', name: 'Compliance', count: resumeData.extractedFields.filter(f => ['personal', 'contact'].includes(f.category)).length },
                    { id: 'file-info', name: 'File Info', count: 1 }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm`}
                    >
                      {tab.name}
                      <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                        activeTab === tab.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-900'
                      }`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {activeTab === 'file-info' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">File Name:</span>
                      <p className="text-gray-600">{resumeData.fileName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Upload Date:</span>
                      <p className="text-gray-600">{new Date(resumeData.uploadDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Total Pages:</span>
                      <p className="text-gray-600">{resumeData.totalPages}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Status:</span>
                      <p className={`capitalize ${
                        resumeData.status === 'approved' ? 'text-green-600' :
                        resumeData.status === 'rejected' ? 'text-red-600' : 'text-yellow-600'
                      }`}>
                        {resumeData.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.entries(groupedFields).map(([category, fields]) => (
                    <div key={category}>
                      <h3 className="text-sm font-medium text-gray-900 mb-3 capitalize flex items-center">
                        {getFieldIcon(category)}
                        <span className="ml-2">{category.replace('_', ' ')}</span>
                        <span className="ml-2 text-xs text-gray-500">({fields.length})</span>
                      </h3>
                      <div className="space-y-3">
                        {fields.map((field) => (
                          <ExtractedFieldComponent
                            key={field.id}
                            field={field}
                            isEditMode={isEditMode}
                            isSelected={selectedField === field.id}
                            onSelect={() => setSelectedField(field.id === selectedField ? null : field.id)}
                            onEdit={handleFieldEdit}
                            onDelete={handleFieldDelete}
                            getConfidenceColor={getConfidenceColor}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Extracted Field Component
interface ExtractedFieldComponentProps {
  field: ExtractedField;
  isEditMode: boolean;
  isSelected: boolean;
  onSelect: () => void;
  onEdit: (fieldId: string, newValue: string) => void;
  onDelete: (fieldId: string) => void;
  getConfidenceColor: (confidence: number) => string;
}

function ExtractedFieldComponent({
  field,
  isEditMode,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  getConfidenceColor
}: ExtractedFieldComponentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(field.value);

  const handleSave = () => {
    onEdit(field.id, editValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(field.value);
    setIsEditing(false);
  };

  return (
    <div className={`p-3 border rounded-lg transition-colors ${
      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
              {field.label.replace('_', ' ')}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getConfidenceColor(field.confidence)}`}>
              {field.confidence}%
            </span>
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={2}
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-900 break-words">{field.value}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-1 ml-2">
          {isEditMode && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 text-gray-400 hover:text-blue-600"
                title="Edit field"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(field.id)}
                className="p-1 text-gray-400 hover:text-red-600"
                title="Delete field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={onSelect}
            className="p-1 text-gray-400 hover:text-blue-600"
            title="View in document"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
