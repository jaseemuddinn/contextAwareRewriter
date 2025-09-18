# AI-Powered Context-Aware Text Rewriter

A modern, intelligent text rewriting application built with Next.js that transforms your text using AI while considering context, audience, and writing style preferences.

## Features

### 🎯 **Context-Aware Rewriting**

- Intelligent detection of audience, purpose, and tone
- Customizable context settings for precise control
- Multiple rewriting modes: Formal, Casual, Technical, Creative, Academic, Concise, and Elaborate

### 🤖 **AI Integration**

- **Primary**: AkashChat API with LLaMA model support
- **Fallback**: Demo mode with intelligent dummy data for development
- Configurable AI parameters (temperature, max tokens, model selection)

### 📝 **Rich Text Interface**

- Split-screen design with original and rewritten text
- Real-time word/character counting and reading time estimates
- Copy to clipboard and download functionality
- Side-by-side comparison view with change highlighting

### ⚙️ **Advanced Features**

- Local storage for preferences and history
- Responsive design for desktop and mobile
- Dark mode support
- Privacy-focused (all data stored locally)
- Comprehensive settings management

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. **Clone and install dependencies:**

```bash
git clone https://github.com/jaseemuddinn/contextAwareRewriter.git
npm install
```

2. **Start the development server:**

```bash
npm run dev
```

3. **Open the application:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Usage

### Basic Text Rewriting

1. **Enter your text** in the left input area
2. **Select a rewriting mode** from the sidebar:

   - 👔 **Formal**: Professional and structured language
   - 😊 **Casual**: Relaxed and conversational tone
   - ⚙️ **Technical**: Precise and domain-specific language
   - 🎨 **Creative**: Engaging and expressive language
   - 🎓 **Academic**: Scholarly and research-oriented
   - 📝 **Concise**: Shortened while maintaining meaning
   - 📖 **Elaborate**: Expanded with additional detail

3. **Configure context settings**:

   - **Audience**: Professional, Academic, Casual, General
   - **Purpose**: Email, Essay, Report, Social Media, Creative Writing
   - **Tone**: Formal, Casual, Friendly, Authoritative, Neutral
   - **Complexity**: Simple, Moderate, Complex
   - **Length**: Shorter, Same, Longer

4. **Click "✨ Rewrite Text"** to generate the enhanced version

### AI Configuration

#### Demo Mode (Default)

The application starts in demo mode with intelligent dummy data that simulates real AI responses. This allows you to test all features without needing an API key.

#### AkashChat API Setup

1. Go to **Settings** → **AI Configuration**
2. Enter your AkashChat API key
3. Select your preferred model
4. Adjust temperature and token limits as needed
5. Save settings


### Settings & Preferences

Access the settings page to configure:

- **AI Service**: API keys, model selection, parameters
- **Defaults**: Preferred rewriting mode and context
- **Behavior**: Auto-save, real-time features, suggestions
- **Data**: History management and privacy controls



## Technology Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4
- **State Management**: React Context API with useReducer
- **Storage**: Browser localStorage for preferences and history
- **AI Integration**: AkashChat API
- **Styling**: Tailwind CSS with custom components
- **Development**: ESLint, PostCSS

Built with ❤️ using Next.js, React, and Tailwind CSS
