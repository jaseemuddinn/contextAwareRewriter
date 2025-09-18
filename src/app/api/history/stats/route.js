// History statistics API
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/mongodb';
import RewriteHistory from '@/models/RewriteHistory';

// GET - Get user's rewrite statistics
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

        const [stats, recentActivity] = await Promise.all([
            RewriteHistory.getStats(session.user.id),
            RewriteHistory.aggregate([
                { $match: { userId: session.user.id, archived: false } },
                { $sort: { createdAt: -1 } },
                { $limit: 7 },
                {
                    $group: {
                        _id: {
                            $dateToString: {
                                format: '%Y-%m-%d',
                                date: '$createdAt'
                            }
                        },
                        count: { $sum: 1 },
                        modes: { $addToSet: '$mode' }
                    }
                },
                { $sort: { _id: -1 } }
            ])
        ]);

        const modeStats = {};
        if (stats[0]?.modeDistribution) {
            stats[0].modeDistribution.forEach(mode => {
                modeStats[mode] = (modeStats[mode] || 0) + 1;
            });
        }

        return NextResponse.json({
            overview: stats[0] || {
                totalRewrites: 0,
                averageConfidence: 0,
                totalWordsProcessed: 0,
                favoriteCount: 0,
            },
            modeDistribution: modeStats,
            recentActivity: recentActivity.map(day => ({
                date: day._id,
                count: day.count,
                modes: day.modes,
            })),
        });

    } catch (error) {
        console.error('Stats fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch statistics' },
            { status: 500 }
        );
    }
}