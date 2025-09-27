import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { generateLearningPath } from '../services/geminiService';
import { COURSES } from '../constants';
import type { LearningPathStep } from '../types';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { X, Tag, Lightbulb } from 'lucide-react';

const experienceLevels = ['None', 'Beginner', 'Intermediate', 'Advanced'];

const LearningPathPage: React.FC = () => {
    const { user } = useAuth();
    const [goal, setGoal] = useState('');
    const [experience, setExperience] = useState('Beginner');
    const [interests, setInterests] = useState<string[]>(user?.interests || []);
    const [interestInput, setInterestInput] = useState('');
    const [learningPath, setLearningPath] = useState<LearningPathStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const allSubjects = useMemo(() => [...new Set(COURSES.map(c => c.subject))], []);

    const handleAddInterest = (interest: string) => {
        if (interest && !interests.includes(interest)) {
            setInterests([...interests, interest]);
        }
        setInterestInput('');
    };
    
    const handleRemoveInterest = (interestToRemove: string) => {
        setInterests(interests.filter(interest => interest !== interestToRemove));
    };

    const handleGeneratePath = async () => {
        if (!goal) {
            alert('Please enter your learning goal.');
            return;
        }
        setIsLoading(true);
        setLearningPath([]);
        try {
            const result = await generateLearningPath(goal, experience, interests);
            if (result.length === 0) {
                 setLearningPath([{ title: "Error", description: "Sorry, we could not generate a learning path at this time. The AI may have been unable to find a suitable path for your request. Please try again with a different goal.", rationale: "" }]);
            } else {
                setLearningPath(result);
            }
        } catch (error) {
            console.error(error);
             setLearningPath([{ title: "Error", description: "An unexpected error occurred. Please try again later.", rationale: "" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-white mb-2">AI-Powered Learning Path Generator</h1>
            <p className="text-light mb-8">Describe your career goal, and our AI will create a custom learning path for you.</p>

            <div className="bg-secondary p-8 rounded-lg shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="goal" className="block text-sm font-medium text-white mb-2">What is your main learning goal?</label>
                        <textarea
                            id="goal"
                            rows={4}
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            className="w-full bg-primary border border-tertiary rounded-md p-2 text-white placeholder-light focus:ring-accent focus:border-accent"
                            placeholder="e.g., 'Become a Full-Stack Web Developer', 'Master Data Science for finance', 'Build mobile apps with React Native'"
                        />
                    </div>
                    <div>
                        <label htmlFor="experience" className="block text-sm font-medium text-white mb-2">What is your current experience level?</label>
                        <select
                            id="experience"
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            className="w-full bg-primary border border-tertiary rounded-md p-2 text-white focus:ring-accent focus:border-accent"
                        >
                            {experienceLevels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="mt-6">
                     <label htmlFor="interests" className="block text-sm font-medium text-white mb-2">Add your interests to personalize the path:</label>
                    <div className="flex flex-wrap items-center gap-2 p-2 bg-primary border border-tertiary rounded-md">
                        {interests.map(interest => (
                            <span key={interest} className="flex items-center bg-accent/20 text-accent text-sm font-medium px-2.5 py-1 rounded-full">
                                {interest}
                                <button onClick={() => handleRemoveInterest(interest)} className="ml-1.5 text-accent/70 hover:text-accent">
                                    <X size={14} />
                                </button>
                            </span>
                        ))}
                         <input
                            id="interests"
                            type="text"
                            value={interestInput}
                            onChange={(e) => setInterestInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddInterest(interestInput)}
                            list="subjects-list"
                            className="bg-transparent flex-grow p-1 text-white focus:outline-none"
                            placeholder="Add an interest..."
                        />
                        <datalist id="subjects-list">
                            {allSubjects.filter(s => !interests.includes(s)).map(subject => (
                                <option key={subject} value={subject} />
                            ))}
                        </datalist>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Button onClick={handleGeneratePath} disabled={isLoading || !goal}>
                        {isLoading ? 'Generating...' : 'Generate My Learning Path'}
                    </Button>
                </div>
            </div>

            {isLoading && (
                <div className="mt-8 text-center">
                    <Spinner size="lg" />
                    <p className="text-light mt-4">Our AI is crafting your personalized path... this may take a moment.</p>
                </div>
            )}

            {learningPath.length > 0 && !isLoading && (
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-white mb-4 text-center">Your Personalized Learning Path</h2>
                    <div className="space-y-4">
                        {learningPath.map((step, index) => (
                             <div key={index} className="bg-secondary p-6 rounded-lg shadow-lg border-l-4 border-accent">
                                <div className="flex items-start gap-4">
                                    <div className="bg-accent/20 text-accent font-bold rounded-full h-8 w-8 flex items-center justify-center flex-shrink-0 mt-1">{index + 1}</div>
                                    <div className="flex-grow">
                                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                                        <p className="text-light mt-2">{step.description}</p>
                                        {step.rationale && (
                                            <div className="mt-4 bg-primary/50 p-3 rounded-md border border-tertiary">
                                                <p className="flex items-center text-sm font-semibold text-orange"><Lightbulb className="w-4 h-4 mr-2" /> Why it's important:</p>
                                                <p className="text-sm text-light mt-1">{step.rationale}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                             </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LearningPathPage;
