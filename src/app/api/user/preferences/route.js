import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route';
import connectDB from '../../../../lib/mongodb';
import User from '../../../../models/User';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await connectDB();
        const user = await User.findOne({ email: session.user.email }).select('preferences');

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Return user preferences, with defaults if some fields are missing
        const preferences = {
            defaultMode: user.preferences?.defaultMode || 'formal',
            defaultContext: user.preferences?.defaultContext || {
                audience: 'general',
                purpose: 'other',
                tone: 'neutral',
                complexity: 'moderate',
                length: 'same'
            },
            aiConfig: {
                apiKey: user.preferences?.aiConfig?.apiKey || '',
                model: user.preferences?.aiConfig?.model || 'Meta-Llama-3-1-8B-Instruct-FP8',
                baseUrl: user.preferences?.aiConfig?.baseUrl || 'https://chatapi.akash.network/api/v1',
                maxTokens: user.preferences?.aiConfig?.maxTokens || 2000,
                temperature: user.preferences?.aiConfig?.temperature || 0.7
            },
            autoSave: user.preferences?.autoSave !== undefined ? user.preferences.autoSave : true,
            enableRealtime: user.preferences?.enableRealtime || false,
            enableSuggestions: user.preferences?.enableSuggestions !== undefined ? user.preferences.enableSuggestions : true
        };

        return NextResponse.json({ preferences });
    } catch (error) {
        console.error('Error fetching user preferences:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function PUT(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { preferences } = await request.json();

        if (!preferences) {
            return NextResponse.json({ error: 'Preferences data required' }, { status: 400 });
        }

        await connectDB();

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: { preferences } },
            { new: true, runValidators: true }
        ).select('preferences');

        if (!updatedUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
            message: 'Preferences updated successfully',
            preferences: updatedUser.preferences
        });
    } catch (error) {
        console.error('Error updating user preferences:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}