# Contributing to AI-Powered Context-Aware Text Rewriter 🤖✨

Welcome to the AI-Powered Context-Aware Text Rewriter project! We're excited to have you contribute to this innovative text rewriting application built with Next.js and AI integration.

## 🚀 Project Overview

This is a modern web application that transforms text using AI-powered rewriting with contextual awareness. The project features:

- **Frontend**: Next.js 15 with React 19 and Tailwind CSS 4
- **AI Integration**: Akash Chat API with LLaMA model support
- **Authentication**: NextAuth.js for user management
- **Database**: MongoDB with Mongoose ODM
- **Architecture**: Component-based with React Context for state management

## 🛠️ Development Setup

### Prerequisites

- **Node.js** 18 or higher
- **npm** or **yarn** package manager
- **MongoDB** (local or cloud instance)
- **Akash Chat API Key** (for AI functionality)

### Local Development

1. **Fork and clone the repository**:
   ```bash
   git clone https://github.com/jaseemuddinn/contextAwareRewriter.git
   cd contextAwareRewriter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret
   MONGODB_URI=your-mongodb-connection-string
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open the application**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes (AI, auth, history)
│   ├── auth/              # Authentication pages
│   ├── history/           # User history pages
│   └── settings/          # User preferences
├── components/            # React components
│   ├── ContextPanel.js    # Context configuration
│   ├── ModeSelector.js    # Rewriting mode selection
│   ├── TextInput.js       # Input text area
│   ├── TextOutput.js      # Output text area
│   └── TextRewriter.js    # Main rewriter component
├── context/               # React Context providers
├── lib/                   # Database connections
├── models/               # Mongoose models
├── services/             # External service integrations
└── utils/                # Utility functions and constants
```

## 🎯 How to Contribute

### Types of Contributions Welcome

1. **🐛 Bug Fixes**: Fix issues in existing functionality
2. **✨ New Features**: Add new rewriting modes, UI improvements, or AI capabilities
3. **📚 Documentation**: Improve README, add code comments, or create tutorials
4. **🎨 UI/UX**: Enhance the user interface and experience
5. **⚡ Performance**: Optimize loading times and component rendering
6. **🧪 Testing**: Add unit tests, integration tests, or E2E tests
7. **🔧 DevOps**: Improve build processes, CI/CD, or deployment

### Development Workflow

1. **Find or create an issue**: Look for issues labeled `good first issue`, `enhancement`, or `bug`
2. **Comment on the issue**: Let others know you're working on it
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```
4. **Make your changes**: Follow the coding standards below
5. **Test your changes**: Ensure the app runs without errors
6. **Commit with conventional format**:
   ```bash
   git commit -m "feat: add new rewriting mode for technical writing"
   git commit -m "fix: resolve API timeout issues"
   git commit -m "docs: update installation instructions"
   ```
7. **Push and create a pull request**:
   ```bash
   git push origin feature/your-feature-name
   ```

## 📋 Coding Standards

### JavaScript/React Guidelines

- Use **functional components** with hooks
- Follow **ES6+ syntax** and modern JavaScript practices
- Use **camelCase** for variables and functions
- Use **PascalCase** for component names
- Implement proper **error handling** for async operations
- Add **JSDoc comments** for complex functions

### Component Development

- Keep components **focused and reusable**
- Use **React Context** for global state management
- Implement **proper prop validation** (consider adding PropTypes)
- Follow the **composition over inheritance** principle
- Use **custom hooks** for shared logic

### API Development

- Follow **RESTful conventions** for API routes
- Implement proper **error handling** and status codes
- Use **middleware** for authentication and validation
- Document API endpoints with clear examples

### Styling Guidelines

- Use **Tailwind CSS** classes for styling
- Follow **mobile-first** responsive design
- Maintain **consistent spacing** and typography
- Use **CSS custom properties** for theme variables
- Implement **dark mode** support where applicable

## 🧪 Testing Guidelines

Currently, the project doesn't have a testing framework set up. Contributing a testing setup would be highly valuable:

- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: API route testing
- **E2E Tests**: Cypress or Playwright
- **Component Tests**: Storybook for component documentation

## 🐛 Reporting Issues

When reporting bugs or requesting features:

1. **Search existing issues** to avoid duplicates
2. **Use descriptive titles** and provide context
3. **Include reproduction steps** for bugs
4. **Add screenshots** for UI-related issues
5. **Specify environment** (browser, OS, Node.js version)
6. **Use appropriate labels**: `bug`, `enhancement`, `documentation`, etc.


## 🔍 Pull Request Guidelines

### Before Submitting

- [ ] **Code follows** the project's coding standards
- [ ] **No ESLint errors** or warnings
- [ ] **Application runs** without console errors
- [ ] **Responsive design** works on mobile and desktop
- [ ] **Dark mode** compatibility (if applicable)
- [ ] **API endpoints** are properly documented
- [ ] **Environment variables** are documented if added

### PR Description Template

```markdown
## 📝 Description
Brief description of changes made.

## 🔗 Related Issue
Fixes #(issue number)

## 🧪 Testing
- [ ] Tested locally
- [ ] Responsive design checked
- [ ] Dark mode tested
- [ ] API functionality verified

## 📸 Screenshots
(if applicable)

## 📋 Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] No console errors
- [ ] Documentation updated
```

## 🌟 Areas for Contribution

### High Priority
- [ ] **Testing Framework**: Set up Jest/RTL for component testing
- [ ] **Error Boundaries**: Implement React error boundaries
- [ ] **Loading States**: Improve loading indicators and skeleton screens
- [ ] **Accessibility**: Add ARIA labels and keyboard navigation
- [ ] **Performance**: Implement code splitting and lazy loading

### Medium Priority
- [ ] **New Rewriting Modes**: Add specialized modes (legal, medical, etc.)
- [ ] **Batch Processing**: Support for multiple text processing
- [ ] **Export Features**: PDF, Word document export
- [ ] **Collaboration**: Text sharing and collaborative editing
- [ ] **Analytics**: Usage tracking and text improvement metrics

### Nice to Have
- [ ] **Browser Extension**: Chrome/Firefox extension
- [ ] **Mobile App**: React Native mobile application
- [ ] **API Rate Limiting**: Implement request throttling
- [ ] **Internationalization**: Multi-language support
- [ ] **Themes**: Custom UI themes and branding

## 📚 Resources

### Project Documentation
- [Architecture Overview](./ARCHITECTURE.md)
- [README](./README.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### AI Integration
- [Akash Chat API Documentation](https://chatapi.akash.network/docs)
- [OpenAI API Format](https://platform.openai.com/docs/api-reference)

### Development Tools
- [React Developer Tools](https://react.dev/learn/react-developer-tools)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Git Conventional Commits](https://www.conventionalcommits.org/)

## 🤝 Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please:

- **Be respectful** and constructive in discussions
- **Help others** learn and improve
- **Focus on the code**, not the person
- **Accept feedback** gracefully and provide it kindly
- **Report any unacceptable behavior** to the maintainers

## 🎉 Recognition

Contributors will be recognized in the following ways:

- **Contributors section** in the README
- **Release notes** mention for significant contributions
- **GitHub achievements** and badges
- **Community shoutouts** for outstanding contributions

## 📞 Getting Help

If you need help or have questions:

1. **Check existing issues** and discussions
2. **Join our community** discussions in GitHub Issues
3. **Tag maintainers** (@jaseemuddinn) in your questions
4. **Create a discussion** for general questions

---

Thank you for contributing to the AI-Powered Context-Aware Text Rewriter! Your contributions help make text rewriting more intelligent and accessible for everyone. 🚀