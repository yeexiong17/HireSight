# AI Interview Platform

An intelligent hiring platform that leverages AI to streamline the recruitment process with automated job analysis, AI-powered interviews, and comprehensive candidate evaluation.

## Features

- **AI-Powered Job Analysis**: Get intelligent suggestions for job descriptions, requirements, and responsibilities using ChatGPT
- **Automated Interview System**: AI-driven candidate interviews with customizable profiles
- **Candidate Management**: Comprehensive dashboard for tracking and managing candidates
- **Real-time Analytics**: Insights into hiring performance and candidate metrics

## Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key (for AI job analysis)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd hire2
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```
   - Get your OpenAI API key from: https://platform.openai.com/api-keys

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## AI Job Analysis Setup

The platform includes an AI-powered job analysis feature that uses ChatGPT to generate intelligent suggestions for:

- Job descriptions and overviews
- Required skills and qualifications
- Key responsibilities
- Salary ranges based on market data
- Technical and soft skills recommendations

### Setting up OpenAI Integration

1. **Get an OpenAI API Key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create an account or sign in
   - Generate a new API key

2. **Configure the API Key**:
   - Add your API key to the `.env.local` file:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. **Test the Integration**:
   - Navigate to the employer dashboard
   - Click "Post New Job"
   - Fill in a job title and click "Analyze Job"
   - The AI will generate comprehensive job suggestions

### Fallback Behavior

If no OpenAI API key is configured, the system will automatically fall back to a mock analysis system that provides basic suggestions based on keyword matching. This ensures the platform remains functional even without the AI integration.

## Usage

### For Employers

1. **Post New Jobs**: Use the AI-assisted job posting feature to create comprehensive job listings
2. **Manage Candidates**: Review applications and track candidate progress
3. **Configure AI Interviews**: Set up automated interview profiles for different roles
4. **Analytics Dashboard**: Monitor hiring metrics and performance

### For Candidates

1. **Browse Jobs**: Search and filter available positions
2. **AI Interview**: Participate in automated first-round interviews
3. **Track Applications**: Monitor application status and feedback

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── jobs/
│   │       └── analyze/          # AI job analysis API
│   ├── employer/                 # Employer dashboard and features
│   ├── candidate/                # Candidate portal
│   └── interview/                # Interview system
├── components/
│   ├── employee/                 # Employer-specific components
│   └── ui/                       # Reusable UI components
└── lib/                          # Utilities and mock data
```

## API Endpoints

- `POST /api/jobs/analyze` - AI-powered job analysis
- `POST /api/interview/chat` - Interview chat system

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **AI Integration**: OpenAI GPT-4
- **Icons**: Lucide React

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
