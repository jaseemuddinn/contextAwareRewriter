// Available rewriting modes configuration

export const REWRITING_MODES = [
    {
        id: 'formal',
        name: 'Formal',
        description: 'Professional and structured language',
        icon: '👔',
        prompt: 'formal and professional'
    },
    {
        id: 'casual',
        name: 'Casual',
        description: 'Relaxed and conversational tone',
        icon: '😊',
        prompt: 'casual and conversational'
    },
    {
        id: 'technical',
        name: 'Technical',
        description: 'Precise and domain-specific language',
        icon: '⚙️',
        prompt: 'technical and precise'
    },
    {
        id: 'creative',
        name: 'Creative',
        description: 'Engaging and expressive language',
        icon: '🎨',
        prompt: 'creative and engaging'
    },
    {
        id: 'academic',
        name: 'Academic',
        description: 'Scholarly and research-oriented',
        icon: '🎓',
        prompt: 'academic and scholarly'
    },
    {
        id: 'concise',
        name: 'Concise',
        description: 'Shortened while maintaining meaning',
        icon: '📝',
        prompt: 'concise and brief'
    },
    {
        id: 'elaborate',
        name: 'Elaborate',
        description: 'Expanded with additional detail',
        icon: '📖',
        prompt: 'detailed and comprehensive'
    }
];

export const DEFAULT_CONTEXT = {
    audience: 'general',
    purpose: 'other',
    tone: 'neutral',
    complexity: 'moderate',
    length: 'same'
};

export const CONTEXT_OPTIONS = {
    audience: [
        { value: 'professional', label: 'Professional' },
        { value: 'academic', label: 'Academic' },
        { value: 'casual', label: 'Casual' },
        { value: 'general', label: 'General' }
    ],
    purpose: [
        { value: 'email', label: 'Email' },
        { value: 'essay', label: 'Essay' },
        { value: 'report', label: 'Report' },
        { value: 'social', label: 'Social Media' },
        { value: 'creative', label: 'Creative Writing' },
        { value: 'other', label: 'Other' }
    ],
    tone: [
        { value: 'formal', label: 'Formal' },
        { value: 'casual', label: 'Casual' },
        { value: 'friendly', label: 'Friendly' },
        { value: 'authoritative', label: 'Authoritative' },
        { value: 'neutral', label: 'Neutral' }
    ],
    complexity: [
        { value: 'simple', label: 'Simple' },
        { value: 'moderate', label: 'Moderate' },
        { value: 'complex', label: 'Complex' }
    ],
    length: [
        { value: 'shorter', label: 'Shorter' },
        { value: 'same', label: 'Same Length' },
        { value: 'longer', label: 'Longer' }
    ]
};