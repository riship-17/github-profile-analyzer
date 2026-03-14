import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Users, Link as LinkIcon, Calendar } from 'lucide-react';

const ProfileHeader = ({ profile }) => {
    if (!profile) return null;

    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="subtle-border p-8 mb-8 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-20 -mt-20"></div>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10">
                <div className="relative group">
                    <img
                        src={profile.avatar_url}
                        alt={profile.login}
                        className="w-32 h-32 rounded-full border-4 border-white shadow-md object-cover relative z-10"
                    />
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-4xl font-bold text-slate-900 mb-1">{profile.name || profile.login}</h1>
                    <a
                        href={profile.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 transition-colors text-lg mb-4 inline-block font-medium"
                    >
                        @{profile.login}
                    </a>

                    {profile.bio && (
                        <p className="text-slate-600 mb-6 max-w-2xl text-lg leading-relaxed">
                            {profile.bio}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                            <Users size={16} className="text-slate-400" />
                            <span><strong className="text-slate-900">{profile.followers}</strong> followers</span>
                            <span className="text-slate-300">&bull;</span>
                            <span><strong className="text-slate-900">{profile.following}</strong> following</span>
                        </div>

                        {profile.location && (
                            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                                <MapPin size={16} className="text-slate-400" />
                                <span>{profile.location}</span>
                            </div>
                        )}

                        {profile.blog && (
                            <a
                                href={profile.blog.startsWith('http') ? profile.blog : `https://${profile.blog}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 bg-slate-50 hover:bg-indigo-50 px-4 py-2 rounded-full border border-slate-200 hover:border-indigo-200 transition-colors"
                            >
                                <LinkIcon size={16} className="text-slate-400" />
                                <span className="truncate max-w-[200px]">{profile.blog}</span>
                            </a>
                        )}

                        <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-200">
                            <Calendar size={16} className="text-slate-400" />
                            <span>Joined {joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProfileHeader;
