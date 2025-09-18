// User model
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId; // Password required only if not using Google OAuth
        },
        minlength: [6, 'Password must be at least 6 characters'],
    },
    googleId: {
        type: String,
        sparse: true, // Allows multiple null values
    },
    image: {
        type: String,
    },
    preferences: {
        defaultMode: {
            type: String,
            default: 'formal',
        },
        defaultContext: {
            audience: { type: String, default: 'general' },
            purpose: { type: String, default: 'other' },
            tone: { type: String, default: 'neutral' },
            complexity: { type: String, default: 'moderate' },
            length: { type: String, default: 'same' },
        },
        aiConfig: {
            apiKey: { type: String, default: '' },
            model: { type: String, default: 'Meta-Llama-3-1-8B-Instruct-FP8' },
            baseUrl: { type: String, default: 'https://chatapi.akash.network/api/v1' },
            maxTokens: { type: Number, default: 2000 },
            temperature: { type: Number, default: 0.7 },
        },
        autoSave: { type: Boolean, default: true },
        enableRealtime: { type: Boolean, default: false },
        enableSuggestions: { type: Boolean, default: true },
    },
    emailVerified: {
        type: Date,
        default: null,
    },
}, {
    timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

// Transform output
userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
};

export default mongoose.models.User || mongoose.model('User', userSchema);