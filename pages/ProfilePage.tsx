
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import { User, Mail, Tag } from 'lucide-react';

const ProfilePage: React.FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <div className="text-center text-white">Please log in to view your profile.</div>;
    }

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-6">Your Profile</h1>
            <div className="bg-secondary p-8 rounded-lg shadow-lg">
                <div className="flex flex-col items-center sm:flex-row sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="h-24 w-24 rounded-full bg-tertiary flex items-center justify-center text-white text-4xl font-bold">
                        {user.name.charAt(0)}
                    </div>
                    <div className="flex-grow text-center sm:text-left">
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <p className="text-light flex items-center justify-center sm:justify-start mt-1">
                            <Mail className="w-4 h-4 mr-2" />
                            {user.email}
                        </p>
                        
                        <div className="mt-4">
                            <h3 className="font-semibold text-white mb-2 flex items-center justify-center sm:justify-start">
                                <Tag className="w-4 h-4 mr-2" />
                                Your Interests
                            </h3>
                            <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                                {user.interests.map(interest => (
                                    <span key={interest} className="bg-accent/20 text-accent text-xs font-medium px-2.5 py-1 rounded-full">
                                        {interest}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Button className="mt-6">Edit Profile</Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
