// Rewrite History model
import mongoose from 'mongoose';

const rewriteHistorySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    originalText: {
        type: String,
        required: [true, 'Original text is required'],
        maxlength: [10000, 'Original text too long'],
    },
    rewrittenText: {
        type: String,
        required: [true, 'Rewritten text is required'],
        maxlength: [15000, 'Rewritten text too long'],
    },
    mode: {
        type: String,
        required: [true, 'Rewriting mode is required'],
        enum: ['formal', 'casual', 'technical', 'creative', 'academic', 'concise', 'elaborate'],
    },
    context: {
        audience: {
            type: String,
            enum: ['professional', 'academic', 'casual', 'general'],
            default: 'general',
        },
        purpose: {
            type: String,
            enum: ['email', 'essay', 'report', 'social', 'creative', 'other'],
            default: 'other',
        },
        tone: {
            type: String,
            enum: ['formal', 'casual', 'friendly', 'authoritative', 'neutral'],
            default: 'neutral',
        },
        complexity: {
            type: String,
            enum: ['simple', 'moderate', 'complex'],
            default: 'moderate',
        },
        length: {
            type: String,
            enum: ['shorter', 'same', 'longer'],
            default: 'same',
        },
    },
    metadata: {
        confidence: {
            type: Number,
            min: 0,
            max: 1,
            default: 0,
        },
        processingTime: {
            type: Number,
            default: 0,
        },
        wordCount: {
            original: { type: Number, default: 0 },
            rewritten: { type: Number, default: 0 },
        },
        characterCount: {
            original: { type: Number, default: 0 },
            rewritten: { type: Number, default: 0 },
        },
        changes: [{
            type: {
                type: String,
                enum: ['addition', 'deletion', 'modification'],
            },
            originalSpan: [Number],
            newSpan: [Number],
            reason: String,
        }],
    },
    tags: [{
        type: String,
        trim: true,
    }],
    favorite: {
        type: Boolean,
        default: false,
    },
    archived: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

// Indexes for efficient querying
rewriteHistorySchema.index({ userId: 1, createdAt: -1 });
rewriteHistorySchema.index({ userId: 1, mode: 1 });
rewriteHistorySchema.index({ userId: 1, favorite: 1 });
rewriteHistorySchema.index({ userId: 1, tags: 1 });

// Calculate word and character counts before saving
rewriteHistorySchema.pre('save', function (next) {
    if (this.originalText) {
        this.metadata.wordCount.original = this.originalText.trim().split(/\s+/).length;
        this.metadata.characterCount.original = this.originalText.length;
    }

    if (this.rewrittenText) {
        this.metadata.wordCount.rewritten = this.rewrittenText.trim().split(/\s+/).length;
        this.metadata.characterCount.rewritten = this.rewrittenText.length;
    }

    next();
});

// Virtual for word difference
rewriteHistorySchema.virtual('wordDifference').get(function () {
    return this.metadata.wordCount.rewritten - this.metadata.wordCount.original;
});

// Virtual for character difference
rewriteHistorySchema.virtual('characterDifference').get(function () {
    return this.metadata.characterCount.rewritten - this.metadata.characterCount.original;
});

// Static methods
rewriteHistorySchema.statics.getByUser = function (userId, options = {}) {
    const {
        limit = 50,
        skip = 0,
        mode,
        favorite,
        archived = false,
        tags,
        startDate,
        endDate,
    } = options;

    const query = { userId, archived };

    if (mode) query.mode = mode;
    if (typeof favorite === 'boolean') query.favorite = favorite;
    if (tags && tags.length) query.tags = { $in: tags };

    if (startDate || endDate) {
        query.createdAt = {};
        if (startDate) query.createdAt.$gte = new Date(startDate);
        if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    return this.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip)
        .populate('userId', 'name email');
};

rewriteHistorySchema.statics.getStats = function (userId) {
    return this.aggregate([
        { $match: { userId: mongoose.Types.ObjectId(userId), archived: false } },
        {
            $group: {
                _id: null,
                totalRewrites: { $sum: 1 },
                averageConfidence: { $avg: '$metadata.confidence' },
                totalWordsProcessed: { $sum: '$metadata.wordCount.original' },
                favoriteCount: { $sum: { $cond: ['$favorite', 1, 0] } },
                modeDistribution: {
                    $push: '$mode'
                },
            }
        },
        {
            $project: {
                _id: 0,
                totalRewrites: 1,
                averageConfidence: { $round: ['$averageConfidence', 2] },
                totalWordsProcessed: 1,
                favoriteCount: 1,
                modeDistribution: 1,
            }
        }
    ]);
};

export default mongoose.models.RewriteHistory || mongoose.model('RewriteHistory', rewriteHistorySchema);