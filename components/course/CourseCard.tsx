import React from 'react';
import { Link } from 'react-router-dom';
import type { Course } from '../../types';
import { BookOpen, BarChart } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <Link to={`/course/${course.id}`} className="block group">
        <div className="relative bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-full flex flex-col group-hover:ring-2 group-hover:ring-accent">
            <div className="relative">
                <img className="w-full h-40 object-cover" src={course.imageUrl} alt={course.title} />
                <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm rounded-md p-1.5 shadow-md flex items-center justify-center">
                    <img className="h-6 object-contain" src={course.platformLogoUrl} alt={`${course.platform} logo`} title={course.platform} />
                </div>
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold text-white mt-1 group-hover:text-accent transition-colors">{course.title}</h3>
                <p className="text-sm text-light mt-2 flex-grow">{course.description}</p>
                <div className="mt-4 pt-4 border-t border-tertiary flex justify-between items-center text-sm">
                    <span className="flex items-center" title="Level"><BarChart className="w-4 h-4 mr-1 text-orange" /> {course.level}</span>
                    <span className="flex items-center" title="Subject"><BookOpen className="w-4 h-4 mr-1 text-orange" /> {course.subject}</span>
                    <span className="font-bold text-accent">{course.price === 0 ? 'Free' : `₹${course.price}`}</span>
                </div>
            </div>
        </div>
    </Link>
  );
};

export default CourseCard;