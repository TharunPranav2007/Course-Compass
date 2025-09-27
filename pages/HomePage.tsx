import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, BookCopy, Navigation } from 'lucide-react';
import { COURSES } from '../constants';
import CourseCard from '../components/course/CourseCard';

const popularSubjects = ['Python', 'JavaScript', 'Machine Learning', 'React', 'Data Science', 'SQL'];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubjectClick = (subject: string) => {
    navigate(`/courses?subject=${encodeURIComponent(subject)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden pt-16 pb-24 sm:pt-24 sm:pb-32 text-center">
        {/* Animated background blobs */}
        <div className="absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#00C49F] to-[#415A77] opacity-20"
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          />
        </div>
        <div className="absolute -bottom-48 right-1/2 -z-10 translate-x-1/2 transform-gpu blur-3xl" aria-hidden="true">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-[#FF7B00] to-[#1B263B] opacity-25"
            style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}
          />
        </div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter animate-fade-in">
          Navigate Your Ambition.
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-lg text-light animate-fade-in-up delay-200">
          Stop guessing. Start learning. Course Compass delivers AI-driven clarity to your educational journey, crafting personalized paths to success.
        </p>
        <div className="mt-10 max-w-xl mx-auto animate-fade-in-up delay-400">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light h-5 w-5 group-focus-within:text-accent transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for any course or skill..."
              className="w-full bg-secondary/80 backdrop-blur-sm border border-tertiary rounded-full py-4 pl-12 pr-6 text-white placeholder-light focus:ring-2 focus:ring-accent focus:border-accent transition-all text-lg"
            />
          </form>
          <div className="mt-6 text-sm text-light animate-fade-in-up delay-600">
            Or, <Link to="/learning-path" className="font-semibold text-accent hover:text-accent-hover underline underline-offset-2">
               build your AI learning path &rarr;
            </Link>
          </div>
        </div>
      </div>
      
      {/* Featured Courses Section */}
      <div className="space-y-12">
        <h2 className="text-3xl font-bold text-white text-center animate-fade-in-up delay-600">
            Start Your Journey Today
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in-up delay-800">
            {COURSES.slice(0, 3).map(course => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
        <div className="text-center animate-fade-in-up delay-800">
            <Link to="/courses" className="text-accent hover:text-accent-hover font-semibold transition-colors group">
                Explore All Courses <span className="transition-transform group-hover:translate-x-1 inline-block">&rarr;</span>
            </Link>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="text-center py-16 sm:py-24">
        <h2 className="text-3xl font-bold text-white mb-4 animate-fade-in-up">Unleash Your Potential</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-light mb-16 animate-fade-in-up delay-200">
            We analyze, you excel. It’s that simple.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-secondary p-8 rounded-xl border border-tertiary/50 transition-all duration-300 hover:border-accent/50 hover:-translate-y-2 animate-fade-in-up delay-400">
                <div className="flex items-center justify-center h-16 w-16 bg-accent/10 rounded-full ring-8 ring-accent/5 mx-auto">
                    <BookCopy className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Discover</h3>
                <p className="mt-2 text-light">Explore thousands of courses from leading platforms, all in one place.</p>
            </div>
            <div className="bg-secondary p-8 rounded-xl border border-tertiary/50 transition-all duration-300 hover:border-accent/50 hover:-translate-y-2 animate-fade-in-up delay-600">
                <div className="flex items-center justify-center h-16 w-16 bg-accent/10 rounded-full ring-8 ring-accent/5 mx-auto">
                    <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Analyze</h3>
                <p className="mt-2 text-light">Get unbiased, AI-powered summaries of student reviews to make informed decisions.</p>
            </div>
            <div className="bg-secondary p-8 rounded-xl border border-tertiary/50 transition-all duration-300 hover:border-accent/50 hover:-translate-y-2 animate-fade-in-up delay-800">
                <div className="flex items-center justify-center h-16 w-16 bg-accent/10 rounded-full ring-8 ring-accent/5 mx-auto">
                    <Navigation className="h-8 w-8 text-accent" />
                </div>
                <h3 className="mt-6 text-xl font-semibold text-white">Achieve</h3>
                <p className="mt-2 text-light">Generate personalized learning paths that guide you from start to finish.</p>
            </div>
        </div>
      </div>

      {/* Popular Subjects Section */}
      <div className="text-center py-16">
        <h2 className="text-3xl font-bold text-white animate-fade-in-up">Explore Trending Topics</h2>
        <div className="mt-8 max-w-4xl mx-auto flex flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in-up delay-200">
          {popularSubjects.map(subject => (
            <button
              key={subject}
              onClick={() => handleSubjectClick(subject)}
              className="px-6 py-3 bg-secondary/50 border border-tertiary/50 text-light hover:text-white rounded-full transition-all duration-300 font-medium hover:bg-accent/20 hover:border-accent/50"
            >
              {subject}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
