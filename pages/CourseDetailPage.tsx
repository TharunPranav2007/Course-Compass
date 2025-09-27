import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { COURSES } from '../constants';
import type { Course, DiscussionPost, Review } from '../types';
import { summarizeReviews } from '../services/geminiService';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { ThumbsUp, ThumbsDown, Star, Bookmark, CheckCircle, BookOpen, MessageSquare, Info, BrainCircuit } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';

const StarRating: React.FC<{ rating: number }> = ({ rating }) => (
    <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-5 h-5 ${i < Math.round(rating) ? 'text-orange' : 'text-tertiary'}`} fill="currentColor" />
        ))}
    </div>
);

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const avgRating = (review.rating.content + review.rating.instructor + review.rating.practicality) / 3;
    return (
        <div className="bg-primary p-4 rounded-lg border border-tertiary">
            <div className="flex items-start justify-between">
                <div>
                    <p className="font-semibold text-white">{review.username}</p>
                    <p className="text-xs text-light">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <StarRating rating={avgRating} />
            </div>
            <p className="mt-4 text-light">{review.text}</p>
            <div className="mt-4 flex items-center gap-4 text-sm">
                <button className="flex items-center gap-1 text-light hover:text-accent"><ThumbsUp className="w-4 h-4" /> {review.upvotes}</button>
                <button className="flex items-center gap-1 text-light hover:text-orange"><ThumbsDown className="w-4 h-4" /> {review.downvotes}</button>
            </div>
        </div>
    );
};

const TABS = {
    OVERVIEW: 'Overview',
    CURRICULUM: 'Curriculum',
    REVIEWS_SUMMARY: 'AI Summary & Reviews',
    DISCUSSION_HUB: 'Discussion Hub',
};

const CourseDetailPage: React.FC = () => {
    const { courseId } = useParams<{ courseId: string }>();
    const [course, setCourse] = useState<Course | null>(null);
    const [summary, setSummary] = useState<string>('');
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [discussionPosts, setDiscussionPosts] = useState<DiscussionPost[]>([]);
    const [newPostText, setNewPostText] = useState('');
    const [activeTab, setActiveTab] = useState(TABS.OVERVIEW);

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { user } = useAuth();
    
    const isSaved = course ? isInWishlist(course.id) : false;

    const ratingBreakdown = useMemo(() => {
        if (!course || course.reviews.length === 0) {
            return { content: 0, instructor: 0, practicality: 0 };
        }

        const totalReviews = course.reviews.length;
        const totals = course.reviews.reduce((acc, review) => {
            acc.content += review.rating.content;
            acc.instructor += review.rating.instructor;
            acc.practicality += review.rating.practicality;
            return acc;
        }, { content: 0, instructor: 0, practicality: 0 });

        return {
            content: totals.content / totalReviews,
            instructor: totals.instructor / totalReviews,
            practicality: totals.practicality / totalReviews,
        };
    }, [course]);

    const handleToggleWishlist = () => {
        if (!course) return;
        if (isSaved) {
            removeFromWishlist(course.id);
        } else {
            addToWishlist(course.id);
        }
    };

    const handlePostSubmit = () => {
        if (!newPostText.trim() || !user) return;
        const newPost: DiscussionPost = {
            id: `dpost_${Date.now()}`,
            userId: user.id,
            username: user.name,
            text: newPostText.trim(),
            createdAt: new Date().toISOString(),
        };
        setDiscussionPosts(prevPosts => [newPost, ...prevPosts]);
        setNewPostText('');
    };
    
    const fetchSummary = useCallback(async () => {
        if (course && course.reviews.length > 0) {
            setIsLoadingSummary(true);
            try {
                const result = await summarizeReviews(course.reviews);
                setSummary(result);
            } catch (error) {
                console.error(error);
                setSummary('Could not load summary.');
            } finally {
                setIsLoadingSummary(false);
            }
        }
    }, [course]);

    useEffect(() => {
        const foundCourse = COURSES.find(c => c.id === courseId);
        if (foundCourse) {
            setCourse(foundCourse);
            // Mock initial discussion posts
            setDiscussionPosts([
                {id: 'd1', userId: 'u10', username: 'TechGuru', text: 'Has anyone finished the final project?', createdAt: '2023-11-10'},
                {id: 'd2', userId: 'u11', username: 'Learner22', text: 'I am stuck on module 3, any tips?', createdAt: '2023-11-11'},
            ]);
        }
    }, [courseId]);

    useEffect(() => {
        if (activeTab === TABS.REVIEWS_SUMMARY && !summary) {
            fetchSummary();
        }
    }, [activeTab, summary, fetchSummary]);

    if (!course) {
        return <div className="text-center text-white">Course not found.</div>;
    }

    const tabItems = [
        { name: TABS.OVERVIEW, icon: Info },
        { name: TABS.CURRICULUM, icon: BookOpen },
        { name: TABS.REVIEWS_SUMMARY, icon: BrainCircuit },
        { name: TABS.DISCUSSION_HUB, icon: MessageSquare },
    ];

    return (
        <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {/* Course Header */}
                    <div className="mb-6">
                        <p className="text-accent font-semibold">{course.platform}</p>
                        <h1 className="text-4xl font-bold text-white mt-1">{course.title}</h1>
                        <p className="text-md text-light mt-2">Taught by <span className="font-semibold text-white">{course.instructor}</span></p>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-tertiary">
                        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                            {tabItems.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                        activeTab === tab.name
                                        ? 'border-accent text-accent'
                                        : 'border-transparent text-light hover:text-white hover:border-gray-300'
                                    }`}
                                >
                                    <tab.icon className="w-5 h-5" />
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="mt-8">
                        {activeTab === TABS.OVERVIEW && (
                             <div className="bg-secondary p-6 rounded-lg">
                                <h2 className="text-xl font-bold text-white mb-4">Course Description</h2>
                                <p className="text-light whitespace-pre-line">{course.longDescription}</p>
                            </div>
                        )}
                        {activeTab === TABS.CURRICULUM && (
                             <div className="bg-secondary p-6 rounded-lg">
                                <h2 className="text-xl font-bold text-white mb-4">What You'll Learn</h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                                    {course.content.map((topic, index) => (
                                        <li key={index} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-accent mr-3 mt-1 flex-shrink-0" />
                                            <span className="text-light">{topic}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {activeTab === TABS.REVIEWS_SUMMARY && (
                             <div className="space-y-8">
                                <div className="bg-secondary p-6 rounded-lg">
                                    <h2 className="text-xl font-bold text-white mb-4">AI-Powered Review Summary</h2>
                                    {isLoadingSummary ? <Spinner /> : (
                                        <div className="prose prose-invert prose-p:text-light prose-li:text-light" dangerouslySetInnerHTML={{ __html: summary.replace(/\n/g, '<br />') }} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-4">All User Reviews</h2>
                                    <div className="space-y-4">
                                        {course.reviews.map(review => <ReviewCard key={review.id} review={review} />)}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeTab === TABS.DISCUSSION_HUB && (
                             <div>
                                <h2 className="text-2xl font-bold text-white mb-4">Discussion Hub</h2>
                                <div className="bg-secondary p-6 rounded-lg">
                                    {user ? (
                                        <div className="mb-6">
                                            <textarea 
                                                className="w-full bg-primary border border-tertiary rounded-md p-2 text-white placeholder-light focus:ring-accent focus:border-accent" 
                                                placeholder="Ask a question or share a resource..."
                                                value={newPostText}
                                                onChange={(e) => setNewPostText(e.target.value)}
                                                rows={3}
                                                aria-label="New discussion post"
                                            />
                                            <Button onClick={handlePostSubmit} disabled={!newPostText.trim()} className="mt-2">Post</Button>
                                        </div>
                                    ) : <p className="text-light mb-4 text-center">Please log in to join the discussion.</p>}
                                    <div className="space-y-4">
                                        {discussionPosts.map(post => (
                                            <div key={post.id} className="bg-primary p-3 rounded-md">
                                                <p className="font-semibold text-white">{post.username} <span className="text-xs text-tertiary ml-2">{new Date(post.createdAt).toLocaleString()}</span></p>
                                                <p className="text-light mt-1">{post.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <img src={course.imageUrl} alt={course.title} className="rounded-lg shadow-lg mb-4 w-full aspect-video object-cover" />
                        <div className="bg-secondary p-6 rounded-lg">
                            <div className="text-3xl font-bold text-accent mb-4">{course.price === 0 ? 'Free' : `₹${course.price}`}</div>
                            {user && (
                                <Button className="w-full flex items-center justify-center gap-2 mb-2" onClick={handleToggleWishlist}>
                                    <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                    {isSaved ? 'Saved to Wishlist' : 'Save to Wishlist'}
                                </Button>
                            )}
                             <a href={course.url} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
                                <Button variant="secondary" className="w-full">Go to Course</Button>
                             </a>
                             <div className="mt-4 pt-4 border-t border-tertiary space-y-4">
                                {course.reviews.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-md font-bold text-white mb-2">Average User Ratings</h4>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-light">Content Quality</span>
                                            <div className="flex items-center gap-2">
                                                <StarRating rating={ratingBreakdown.content} />
                                                <span className="text-white font-semibold w-6 text-right">{ratingBreakdown.content.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-light">Instructor</span>
                                             <div className="flex items-center gap-2">
                                                <StarRating rating={ratingBreakdown.instructor} />
                                                <span className="text-white font-semibold w-6 text-right">{ratingBreakdown.instructor.toFixed(1)}</span>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-light">Practicality</span>
                                             <div className="flex items-center gap-2">
                                                <StarRating rating={ratingBreakdown.practicality} />
                                                <span className="text-white font-semibold w-6 text-right">{ratingBreakdown.practicality.toFixed(1)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div className={`space-y-2 text-sm ${course.reviews.length > 0 ? 'pt-4 border-t border-tertiary' : ''}`}>
                                    <p><span className="font-semibold text-white w-24 inline-block">Instructor:</span> {course.instructor}</p>
                                    <p><span className="font-semibold text-white w-24 inline-block">Level:</span> {course.level}</p>
                                    <p><span className="font-semibold text-white w-24 inline-block">Language:</span> {course.language}</p>
                                    <p><span className="font-semibold text-white w-24 inline-block">Subject:</span> {course.subject}</p>
                                </div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailPage;