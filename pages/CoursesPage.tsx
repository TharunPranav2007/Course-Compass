import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { COURSES } from '../constants';
import CourseCard from '../components/course/CourseCard';
import Button from '../components/ui/Button';
import { Search, X, FilterX, Filter } from 'lucide-react';

const initialFilters = {
    platforms: [] as string[],
    subjects: [] as string[],
    levels: [] as string[],
    languages: [] as string[],
    maxPrice: 10000,
};

const FilterSidebar: React.FC<{
    filters: typeof initialFilters;
    setFilters: React.Dispatch<React.SetStateAction<typeof initialFilters>>;
    resetFilters: () => void;
    platforms: string[];
    subjects: string[];
    levels: string[];
    languages: string[];
}> = ({ filters, setFilters, resetFilters, platforms, subjects, levels, languages }) => {
    
    const handleCheckboxChange = (category: keyof typeof initialFilters, value: string) => {
        setFilters((prev) => {
            const list = prev[category] as string[];
            return {
                ...prev,
                [category]: list.includes(value)
                    ? list.filter((item: string) => item !== value)
                    : [...list, value]
            }
        });
    };
    
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }));
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button onClick={resetFilters} className="text-sm text-accent hover:text-accent-hover flex items-center gap-1">
                    <FilterX className="w-4 h-4" />
                    Reset
                </button>
            </div>
            
            <div className="space-y-6">
                {/* Price Filter */}
                <div>
                    <label htmlFor="price" className="block text-sm font-medium text-light mb-2">Max Price: <span className="font-bold text-accent">₹{filters.maxPrice}</span></label>
                    <input type="range" id="price" min="0" max="10000" value={filters.maxPrice} onChange={handlePriceChange} className="w-full h-2 bg-tertiary rounded-lg appearance-none cursor-pointer accent-accent" />
                </div>

                {/* Platform Filter */}
                <div>
                    <h4 className="font-semibold text-white mb-2">Platform</h4>
                    {platforms.map(platform => (
                        <div key={platform} className="flex items-center mb-1">
                            <input id={`platform-${platform}`} type="checkbox" value={platform} checked={filters.platforms.includes(platform)} onChange={() => handleCheckboxChange('platforms', platform)} className="h-4 w-4 rounded border-tertiary text-accent focus:ring-accent bg-primary" />
                            <label htmlFor={`platform-${platform}`} className="ml-2 text-sm text-light">{platform}</label>
                        </div>
                    ))}
                </div>

                {/* Subject Filter */}
                <div>
                    <h4 className="font-semibold text-white mb-2">Subject</h4>
                    {subjects.map(subject => (
                        <div key={subject} className="flex items-center mb-1">
                            <input id={`subject-${subject}`} type="checkbox" value={subject} checked={filters.subjects.includes(subject)} onChange={() => handleCheckboxChange('subjects', subject)} className="h-4 w-4 rounded border-tertiary text-accent focus:ring-accent bg-primary" />
                            <label htmlFor={`subject-${subject}`} className="ml-2 text-sm text-light">{subject}</label>
                        </div>
                    ))}
                </div>

                 {/* Level Filter */}
                <div>
                    <h4 className="font-semibold text-white mb-2">Level</h4>
                    {levels.map(level => (
                        <div key={level} className="flex items-center mb-1">
                            <input id={`level-${level}`} type="checkbox" value={level} checked={filters.levels.includes(level)} onChange={() => handleCheckboxChange('levels', level)} className="h-4 w-4 rounded border-tertiary text-accent focus:ring-accent bg-primary"/>
                            <label htmlFor={`level-${level}`} className="ml-2 text-sm text-light">{level}</label>
                        </div>
                    ))}
                </div>

                {/* Language Filter */}
                <div>
                    <h4 className="font-semibold text-white mb-2">Language</h4>
                    {languages.map(language => (
                        <div key={language} className="flex items-center mb-1">
                            <input id={`language-${language}`} type="checkbox" value={language} checked={filters.languages.includes(language)} onChange={() => handleCheckboxChange('languages', language)} className="h-4 w-4 rounded border-tertiary text-accent focus:ring-accent bg-primary"/>
                            <label htmlFor={`language-${language}`} className="ml-2 text-sm text-light">{language}</label>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const CoursesPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState(initialFilters);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [searchParams] = useSearchParams();

    const uniquePlatforms = useMemo(() => [...new Set(COURSES.map(c => c.platform))], []);
    const uniqueSubjects = useMemo(() => [...new Set(COURSES.map(c => c.subject))], []);
    const uniqueLevels = useMemo(() => [...new Set(COURSES.map(c => c.level))], []);
    const uniqueLanguages = useMemo(() => [...new Set(COURSES.map(c => c.language))], []);
    
    const resetFilters = () => {
        setFilters(initialFilters);
    };

    useEffect(() => {
        const subjectFromUrl = searchParams.get('subject');
        if (subjectFromUrl) {
            const matchingSubject = uniqueSubjects.find(s => s.toLowerCase() === subjectFromUrl.toLowerCase());
            if (matchingSubject) {
                setFilters(prev => ({
                    ...initialFilters,
                    subjects: [matchingSubject]
                }));
            }
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams, uniqueSubjects]);

    const filteredCourses = useMemo(() => {
        return COURSES.filter(course => {
            const searchTermLower = searchTerm.toLowerCase();
            const matchesSearch = searchTermLower === '' ||
                course.title.toLowerCase().includes(searchTermLower) ||
                course.description.toLowerCase().includes(searchTermLower) ||
                course.url.toLowerCase().includes(searchTermLower);
                
            const matchesPlatform = filters.platforms.length === 0 || filters.platforms.includes(course.platform);
            const matchesSubject = filters.subjects.length === 0 || filters.subjects.includes(course.subject);
            const matchesLevel = filters.levels.length === 0 || filters.levels.includes(course.level);
            const matchesLanguage = filters.languages.length === 0 || filters.languages.includes(course.language);
            const matchesPrice = course.price <= filters.maxPrice;

            return matchesSearch && matchesPlatform && matchesSubject && matchesLevel && matchesLanguage && matchesPrice;
        });
    }, [searchTerm, filters]);

    const filterSidebarComponent = (
        <FilterSidebar 
            filters={filters} 
            setFilters={setFilters}
            resetFilters={() => {
                resetFilters();
                setIsFilterOpen(false);
            }}
            platforms={uniquePlatforms}
            subjects={uniqueSubjects}
            levels={uniqueLevels}
            languages={uniqueLanguages}
        />
    );

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Explore Courses</h1>
                <p className="text-light">Find your next learning opportunity from our curated list of courses.</p>
            </div>

            <div className="relative mb-4">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-light h-5 w-5" />
                 <input
                    type="text"
                    placeholder="Search by title, description, or URL..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-secondary border border-tertiary rounded-md py-3 pl-12 pr-10 text-white placeholder-light focus:ring-accent focus:border-accent"
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-light hover:text-white">
                        <X className="h-5 w-5"/>
                    </button>
                )}
            </div>
            
            <div className="lg:hidden mb-6">
                <Button onClick={() => setIsFilterOpen(true)} className="w-full flex items-center justify-center gap-2">
                    <Filter className="w-5 h-5" />
                    Show Filters
                </Button>
            </div>
            
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Desktop Sidebar */}
                <div className="hidden lg:block lg:col-span-1">
                    {filterSidebarComponent}
                </div>

                {/* Mobile Filter Panel */}
                <>
                    <div 
                        className={`fixed inset-0 bg-black/60 z-50 lg:hidden transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                        onClick={() => setIsFilterOpen(false)}
                        aria-hidden="true"
                    />
                    <div 
                        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-primary shadow-2xl transform transition-transform duration-300 ease-in-out z-50 lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="filter-panel-title"
                    >
                        <div className="p-4 overflow-y-auto h-full">
                             <div className="absolute top-4 right-4 z-10">
                                 <button onClick={() => setIsFilterOpen(false)} className="text-light hover:text-white bg-primary/50 rounded-full p-1">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            {filterSidebarComponent}
                        </div>
                    </div>
                </>

                <div className="lg:col-span-3">
                    {filteredCourses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredCourses.map(course => (
                                <CourseCard key={course.id} course={course} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-secondary rounded-lg">
                            <h3 className="text-xl font-semibold text-white">No Courses Found</h3>
                            <p className="text-light mt-2">Try adjusting your search or filter criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoursesPage;