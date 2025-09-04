# AI Features Setup

## OpenAI API Key Configuration

To use the AI features (college recommendations, essay assistance, application guidance), you need to set up your OpenAI API key.

### 1. Get Your API Key

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Sign in or create an account
3. Create a new API key
4. Copy the API key

### 2. Set Environment Variable

Create a `.env` file in the project root and add:

```bash
VITE_OPENAI_API_KEY=your_actual_api_key_here
```

### 3. Restart Development Server

After adding the API key, restart your development server:

```bash
npm run dev
```

## AI Features Available

### 1. College Recommendations
- Personalized college suggestions based on your profile
- Categorized as Reach, Target, and Safety schools
- Detailed fit analysis and program information

### 2. Essay Assistant
- **Brainstorming**: Generate essay ideas based on prompts
- **Analysis**: Get detailed feedback on your essays
- Support for Common App, Supplemental, and Scholarship essays

### 3. Application Guidance
- Step-by-step guidance for each application stage
- Personalized tips based on your profile
- Quick tips and best practices

## Security Note

- Never commit your API key to version control
- The API key is only used client-side for development
- In production, consider using a server-side API to protect your key

## Demo Mode

If no API key is provided, the AI features will show demo data and prompts to set up the API key.
