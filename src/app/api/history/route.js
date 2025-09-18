// History management API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import RewriteHistory from '@/models/RewriteHistory';

// GET - Fetch user's rewrite history
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get('limit')) || 50;
        const skip = parseInt(searchParams.get('skip')) || 0;
        const mode = searchParams.get('mode');
        const favorite = searchParams.get('favorite') === 'true';
        const tags = searchParams.get('tags')?.split(',').filter(Boolean);
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        const options = {
            limit: Math.min(limit, 100), // Max 100 items per request
            skip,
            mode,
            favorite: searchParams.has('favorite') ? favorite : undefined,
            tags,
            startDate,
            endDate,
        };

        const history = await RewriteHistory.getByUser(session.user.id, options);

        // Get total count for pagination
        const totalCount = await RewriteHistory.countDocuments({
            userId: session.user.id,
            archived: false,
        });

        return NextResponse.json({
            history,
            pagination: {
                total: totalCount,
                limit,
                skip,
                hasMore: skip + limit < totalCount,
            }
        });

    } catch (error) {
        console.error('History fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch history' },
            { status: 500 }
        );
    }
}

// POST - Save new rewrite to history
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const data = await req.json();
        const {
            originalText,
            rewrittenText,
            mode,
            context,
            metadata = {},
            tags = [],
        } = data;

        // Validation
        if (!originalText || !rewrittenText || !mode) {
            return NextResponse.json(
                { error: 'Original text, rewritten text, and mode are required' },
                { status: 400 }
            );
        }

        await connectDB();

        const historyItem = await RewriteHistory.create({
            userId: session.user.id,
            originalText,
            rewrittenText,
            mode,
            context: context || {},
            metadata: metadata || {},
            tags: tags || [],
        });

        return NextResponse.json({
            message: 'History item saved successfully',
            historyItem
        }, { status: 201 });

    } catch (error) {
        console.error('History save error:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return NextResponse.json(
                { error: messages.join(', ') },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: 'Failed to save history' },
            { status: 500 }
        );
    }
}

// DELETE - Clear all history or specific items
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(req.url);
        const itemIds = searchParams.get('ids')?.split(',').filter(Boolean);

        if (itemIds && itemIds.length > 0) {
            // Delete specific items
            const result = await RewriteHistory.deleteMany({
                userId: session.user.id,
                _id: { $in: itemIds }
            });

            return NextResponse.json({
                message: `${result.deletedCount} history items deleted`,
                deletedCount: result.deletedCount
            });
        } else {
            // Clear all history
            const result = await RewriteHistory.deleteMany({
                userId: session.user.id
            });

            return NextResponse.json({
                message: `All history cleared (${result.deletedCount} items)`,
                deletedCount: result.deletedCount
            });
        }

    } catch (error) {
        console.error('History delete error:', error);
        return NextResponse.json(
            { error: 'Failed to delete history' },
            { status: 500 }
        );
    }
}