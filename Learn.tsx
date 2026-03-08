import React, { useState } from 'react';
import { ChevronRight, BookOpen, Clock, FileText, CheckCircle, HelpCircle } from 'lucide-react';
import { Course, Lesson, UserProfile } from '../types';
import { generateLessonContent, generateQuizQuestion } from '../services/geminiService';

interface LearnProps {
  courses: Course[];
  userProfile: UserProfile;
}

export const Learn: React.FC<LearnProps> = ({ courses, userProfile }) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonContent, setLessonContent] = useState('');
  const [quizData, setQuizData] = useState<{question: string, options: string[], correctIndex: number} | null>(null);

  const handleStartLesson = async (lesson: Lesson) => {
    setActiveLesson(lesson);
    setLessonContent("Generating personalized lesson content...");
    setQuizData(null);
    const content = await generateLessonContent(lesson.title, lesson.type, userProfile);
    setLessonContent(content);
    if (lesson.type === 'Quiz') {
        generateQuizQuestion(lesson.title, userProfile.language).then(setQuizData);
    }
  };

  if (activeLesson) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
         <div className="mb-4 flex items-center gap-2">
            <button onClick={() => { setActiveLesson(null); setQuizData(null); }} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
               <ChevronRight className="w-4 h-4 rotate-180" /> Back to Course
            </button>
         </div>
         
         <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 md:p-12 border border-gray-100 dark:border-gray-700 overflow-y-auto max-w-4xl mx-auto w-full shadow-sm">
             <div className="flex justify-between items-start mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
               <div>
                  <span className="text-xs font-bold text-primary-500 uppercase tracking-wider bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">{activeLesson.type}</span>
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-4">{activeLesson.title}</h1>
               </div>
               <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-xl">
                  {activeLesson.type === 'Quiz' ? <HelpCircle className="w-6 h-6 text-gray-500 dark:text-gray-300" /> : <BookOpen className="w-6 h-6 text-gray-500 dark:text-gray-300" />}
               </div>
             </div>

             <div className="prose dark:prose-invert max-w-none mb-12">
                {lessonContent === "Generating personalized lesson content..." ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-6"></div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">AI is crafting your lesson based on your learning style...</p>
                    </div>
                ) : (
                    <div className="whitespace-pre-wrap leading-relaxed text-lg text-gray-700 dark:text-gray-300 font-serif">
                        {lessonContent}
                    </div>
                )}
             </div>

             {activeLesson.type === 'Quiz' && quizData && (
                <div className="mt-8 bg-primary-50 dark:bg-primary-900/10 p-8 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <HelpCircle className="w-5 h-5 text-primary-500" /> Check Your Understanding
                    </h3>
                    <p className="font-medium text-gray-800 dark:text-gray-200 mb-6 text-lg">{quizData.question}</p>
                    <div className="space-y-3">
                        {quizData.options.map((opt, idx) => (
                            <button 
                              key={idx}
                              className="w-full text-left p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-all font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:shadow-md"
                              onClick={() => {
                                  if(idx === quizData.correctIndex) alert("Correct!");
                                  else alert("Try again!");
                              }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>
             )}

             <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center">
                 <button 
                    onClick={() => { setActiveLesson(null); }}
                    className="text-gray-500 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                 >
                    Previous Lesson
                 </button>
                 <button 
                  onClick={() => { setActiveLesson(null); }}
                  className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:shadow-primary-500/40 hover:-translate-y-0.5"
                 >
                     Complete Lesson
                 </button>
             </div>
         </div>
      </div>
    );
  }

  if (activeCourse) {
    return (
      <div className="h-full flex flex-col animate-fade-in">
         <div className="mb-6 flex items-center gap-2">
            <button onClick={() => setActiveCourse(null)} className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors">
               <ChevronRight className="w-4 h-4 rotate-180" /> Back to Courses
            </button>
         </div>
         
         <div className="flex flex-col lg:flex-row gap-8">
             <div className="flex-1">
                 <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 mb-8 shadow-sm">
                     <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">{activeCourse.title}</h1>
                     <p className="text-lg text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">{activeCourse.description}</p>
                     
                     <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                         <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1 rounded-full font-bold text-xs uppercase tracking-wide">{activeCourse.level}</span>
                         <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {activeCourse.lessons.length} Lessons</span>
                         <span className="flex items-center gap-1"><CheckCircle className="w-4 h-4" /> {activeCourse.category}</span>
                     </div>
                 </div>

                 <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 px-2">Curriculum</h3>
                 <div className="space-y-4">
                     {activeCourse.lessons.map((lesson, idx) => (
                         <div 
                          key={lesson.id} 
                          onClick={() => handleStartLesson(lesson)}
                          className="group flex items-center p-5 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl hover:shadow-lg hover:border-primary-200 dark:hover:border-primary-800 cursor-pointer transition-all duration-300"
                         >
                             <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mr-5 transition-colors ${lesson.isCompleted ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500 group-hover:bg-primary-100 group-hover:text-primary-600 dark:group-hover:bg-primary-900/30 dark:group-hover:text-primary-400'}`}>
                                 {lesson.isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                             </div>
                             <div className="flex-1">
                                 <h4 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{lesson.title}</h4>
                                 <div className="flex items-center gap-4 text-xs text-gray-400 mt-1.5 font-medium">
                                     <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {lesson.duration}</span>
                                     <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> {lesson.type}</span>
                                 </div>
                             </div>
                             <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center group-hover:bg-primary-500 group-hover:text-white transition-all">
                                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                             </div>
                         </div>
                     ))}
                 </div>
             </div>
             
             <div className="w-full lg:w-80">
                 <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 sticky top-6 shadow-sm">
                     <h3 className="font-bold text-gray-900 dark:text-white mb-6">Your Progress</h3>
                     <div className="relative pt-1">
                        <div className="flex mb-3 items-center justify-between">
                          <div>
                            <span className="text-xs font-bold inline-block py-1 px-2 uppercase rounded-md text-primary-600 bg-primary-100 dark:bg-primary-900/30 dark:text-primary-400">
                              {activeCourse.progress}% Completed
                            </span>
                          </div>
                        </div>
                        <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-gray-100 dark:bg-gray-700">
                          <div style={{ width: `${activeCourse.progress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-1000 ease-out"></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                            Keep going! You're making great progress on mastering {activeCourse.title}.
                        </p>
                     </div>
                 </div>
             </div>
         </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Learning Portal</h1>
        <p className="text-gray-500 dark:text-gray-400">Master social dynamics with structured courses designed for you.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {courses.map(course => (
             <div 
              key={course.id} 
              onClick={() => setActiveCourse(course)}
              className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-3xl p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative overflow-hidden"
             >
                 <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-700"></div>
                 
                 <div className="mb-6 relative z-10">
                     <span className={`text-xs font-bold px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-300 uppercase tracking-wide`}>{course.category}</span>
                 </div>
                 
                 <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors relative z-10">{course.title}</h3>
                 <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 flex-1 leading-relaxed relative z-10">{course.description}</p>
                 
                 <div className="flex items-center justify-between mt-auto relative z-10 pt-6 border-t border-gray-50 dark:border-gray-700/50">
                     <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-medium">
                         <BookOpen className="w-4 h-4" />
                         <span>{course.lessons.length} Lessons</span>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500" style={{ width: `${course.progress}%` }}></div>
                        </div>
                        <span className="text-xs font-bold text-gray-400">{course.progress}%</span>
                     </div>
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};
