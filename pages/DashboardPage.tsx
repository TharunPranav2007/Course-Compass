
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { COURSES } from '../constants';
import type { Course } from '../types';
import CourseCard from '../components/course/CourseCard';
import Spinner from '../components/ui/Spinner';
import { getRecommendations } from '../services/geminiService';
import { Bookmark, Star, GraduationCap } from 'lucide-react';

const DashboardPage: React.FC = () => {
    const { user } = useAuth();
    const { wishlist } = useWishlist();
    const [wishlistCourses, setWishlistCourses] = useState<Course[]>([]);
    const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
    const [isLoadingRecs, setIsLoadingRecs] = useState(false);

    useEffect(() => {
        const savedCourses = COURSES.filter(c => wishlist.includes(c.id));
        setWishlistCourses(savedCourses);

        // Fetch AI recommendations based on the first item in wishlist or user interests
        const fetchRecs = async () => {
            if (savedCourses.length > 0) {
                setIsLoadingRecs(true);
                try {
                    const recIds = await getRecommendations(savedCourses[0], COURSES);
                    const recs = COURSES.filter(c => recIds.includes(c.id));
                    setRecommendedCourses(recs);
                } catch (error) {
                    console.error("Failed to fetch recommendations:", error);
                } finally {
                    setIsLoadingRecs(false);
                }
            }
        };
        fetchRecs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [wishlist]);


    if (!user) {
        return null;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-6">Welcome back, {user.name}!</h1>

            <div className="space-y-12">
                {/* Saved Courses (Wishlist) */}
                <section>
                    <div className="flex items-center gap-3 mb-4">
                        <Bookmark className="w-6 h-6 text-accent"/>
                        <h2 className="text-2xl font-bold text-white">Your Saved Courses</h2>
                    </div>
                    {wishlistCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlistCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 bg-secondary rounded-lg">
                            <p className="text-light">You haven't saved any courses yet. Start exploring!</p>
                        </div>
                    )}
                </section>

                {/* Recommended For You */}
                <section>
                     <div className="flex items-center gap-3 mb-4">
                        <Star className="w-6 h-6 text-accent"/>
                        <h2 className="text-2xl font-bold text-white">Recommended For You</h2>
                    </div>
                    {isLoadingRecs ? <Spinner /> : (
                         recommendedCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {recommendedCourses.map(course => (
                                    <CourseCard key={course.id} course={course} />
                                ))}
                            </div>
                        ) : (
                            !isLoadingRecs && wishlistCourses.length > 0 && 
                            <div className="text-center py-10 bg-secondary rounded-lg">
                                <p className="text-light">Could not load recommendations at this time.</p>
                            </div>
                        )
                    )}
                     {!isLoadingRecs && wishlistCourses.length === 0 &&
                        <div className="text-center py-10 bg-secondary rounded-lg">
                            <p className="text-light">Save some courses to get personalized recommendations.</p>
                        </div>
                    }
                </section>

                {/* My Learning Paths */}
                 <section>
                    <div className="flex items-center gap-3 mb-4">
                        <GraduationCap className="w-6 h-6 text-accent"/>
                        <h2 className="text-2xl font-bold text-white">My Learning Paths</h2>
                    </div>
                    <div className="text-center py-10 bg-secondary rounded-lg">
                        <p className="text-light">This feature is coming soon! Saved learning paths will appear here.</p>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default DashboardPage;
