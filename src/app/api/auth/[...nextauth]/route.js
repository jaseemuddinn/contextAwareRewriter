// NextAuth configuration
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    await connectDB();

                    const user = await User.findOne({
                        email: credentials.email.toLowerCase()
                    });

                    if (!user || !user.password) {
                        return null;
                    }

                    const isValid = await user.comparePassword(credentials.password);

                    if (!isValid) {
                        return null;
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email,
                        name: user.name,
                        image: user.image,
                    };
                } catch (error) {
                    console.error('Auth error:', error);
                    return null;
                }
            }
        })
    ],
    pages: {
        signIn: '/auth/signin',
        signUp: '/auth/signup',
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account?.provider === 'google') {
                try {
                    await connectDB();

                    const existingUser = await User.findOne({
                        $or: [
                            { email: user.email },
                            { googleId: account.providerAccountId }
                        ]
                    });

                    if (existingUser) {
                        // Update Google ID if not set
                        if (!existingUser.googleId) {
                            existingUser.googleId = account.providerAccountId;
                            existingUser.image = user.image;
                            await existingUser.save();
                        }
                        return true;
                    }

                    // Create new user
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image,
                        googleId: account.providerAccountId,
                        emailVerified: new Date(),
                    });

                    return true;
                } catch (error) {
                    console.error('Google sign-in error:', error);
                    return false;
                }
            }

            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token?.id) {
                try {
                    await connectDB();
                    // Check if token.id is a valid MongoDB ObjectId (24 hex chars)
                    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(token.id);

                    let user = null;
                    if (isValidObjectId) {
                        user = await User.findById(token.id).select('-password');
                    } else {
                        // For non-ObjectId (like Google OAuth), find by email
                        user = await User.findOne({ email: session.user.email }).select('-password');
                    }

                    if (user) {
                        session.user = {
                            id: user._id.toString(),
                            email: user.email,
                            name: user.name,
                            image: user.image,
                            preferences: user.preferences,
                        };
                    }
                } catch (error) {
                    console.error('Session callback error:', error);
                }
            }
            return session;
        },
    },
    session: {
        strategy: 'jwt',
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };