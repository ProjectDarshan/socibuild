import React, { useState } from 'react';
import { Briefcase, Award, ArrowRight, MessageSquare } from 'lucide-react';
import { generateInterviewQuestions, evaluateInterviewAnswer } from '../services/geminiService';
import { InterviewFeedback, Scenario, UserProfile } from '../types';

interface InterviewPrepProps {
  userProfile: UserProfile;
  onStartMockInterview: (role: string) => void;
}

export const InterviewPrep: React.FC<InterviewPrepProps> = ({ userProfile, onStartMockInterview }) => {
  const [interviewRoleInput, setInterviewRoleInput] = useState('');
  const [interviewQuestions, setInterviewQuestions] = useState<string[]>([]);
  const [activeInterviewQuestion, setActiveInterviewQuestion] = useState<string | null>(null);
  const [interviewAnswerInput, setInterviewAnswerInput] = useState('');
  const [interviewFeedback, setInterviewFeedback] = useState<InterviewFeedback | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateInterviewQuestions = async () => {
    if(!interviewRoleInput) return;
    setIsLoading(true);
    const questions = await generateInterviewQuestions(interviewRoleInput, userProfile.language);
    setInterviewQuestions(questions);
    setIsLoading(false);
  };

  const handleAnalyzeInterviewAnswer = async () => {
    if(!activeInterviewQuestion || !interviewAnswerInput) return;
    setIsLoading(true);
    const feedback = await evaluateInterviewAnswer(activeInterviewQuestion, interviewAnswerInput, userProfile.language);
    setInterviewFeedback(feedback);
    setIsLoading(false);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
       <div className="mb-8">
         <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Interview Prep HQ</h1>
         <p className="text-gray-500 dark:text-gray-400">Master your next interview with AI-generated questions and feedback.</p>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Left Panel: Configuration & List */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex flex-col shadow-sm h-fit">
             <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">Target Job Role</label>
                <div className="flex flex-col gap-3">
                   <input 
                      type="text" 
                      value={interviewRoleInput}
                      onChange={(e) => setInterviewRoleInput(e.target.value)}
                      className="w-full p-3 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm border-none focus:ring-2 focus:ring-primary-500 transition-all"
                      placeholder="e.g. Product Manager"
                   />
                   <button 
                      onClick={handleGenerateInterviewQuestions}
                      disabled={isLoading || !interviewRoleInput}
                      className="w-full py-3 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-xl text-sm font-bold hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors flex items-center justify-center gap-2"
                   >
                      {isLoading ? 'Generating...' : 'Generate Questions'}
                   </button>
                   <button 
                      onClick={() => onStartMockInterview(interviewRoleInput)}
                      disabled={!interviewRoleInput}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-gray-900/20"
                   >
                      <MessageSquare className="w-4 h-4" /> Start Mock Interview
                   </button>
                </div>
             </div>

             <div className="flex-1">
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider">Question Bank</h3>
                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                   {interviewQuestions.length === 0 ? (
                      <div className="text-center py-8 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-xl">
                          <p className="text-sm text-gray-400 italic">Generate questions to get started.</p>
                      </div>
                   ) : (
                      interviewQuestions.map((q, idx) => (
                         <div 
                            key={idx} 
                            onClick={() => { setActiveInterviewQuestion(q); setInterviewFeedback(null); setInterviewAnswerInput(''); }}
                            className={`p-4 rounded-xl border cursor-pointer transition-all text-sm font-medium ${activeInterviewQuestion === q ? 'bg-primary-50 border-primary-500 text-primary-900 dark:bg-primary-900/30 dark:text-white dark:border-primary-500 shadow-sm' : 'bg-gray-50 border-transparent hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 dark:text-gray-300'}`}
                         >
                            {q}
                         </div>
                      ))
                   )}
                </div>
             </div>
          </div>

          {/* Right Panel: Practice Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-8 flex flex-col shadow-sm min-h-[500px]">
             {!activeInterviewQuestion ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                   <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-6">
                       <Briefcase className="w-8 h-8 opacity-40" />
                   </div>
                   <p className="text-lg font-medium">Select a question from the left to practice your answer.</p>
                </div>
             ) : (
                <>
                   <div className="mb-8">
                      <span className="text-xs font-bold text-primary-500 uppercase tracking-wider bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded-md">Practicing</span>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-3 leading-tight">{activeInterviewQuestion}</h2>
                   </div>

                   <div className="flex-1 flex flex-col gap-6">
                      <textarea 
                         value={interviewAnswerInput}
                         onChange={(e) => setInterviewAnswerInput(e.target.value)}
                         placeholder="Type your answer here... (Use the STAR method: Situation, Task, Action, Result)"
                         className="flex-1 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[200px] text-base leading-relaxed"
                      />
                      <div className="flex justify-end">
                          <button 
                             onClick={handleAnalyzeInterviewAnswer}
                             disabled={isLoading || !interviewAnswerInput}
                             className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                             {isLoading ? 'Analyzing...' : 'Analyze My Answer'} <ArrowRight className="w-4 h-4" />
                          </button>
                      </div>
                   </div>

                   {interviewFeedback && (
                      <div className="mt-10 animate-slide-up border-t border-gray-100 dark:border-gray-700 pt-8">
                         <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                               <Award className="w-6 h-6 text-yellow-500" /> Feedback Report
                            </h3>
                            <div className={`px-4 py-1.5 rounded-full font-bold text-sm ${interviewFeedback.score >= 7 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                               Score: {interviewFeedback.score}/10
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-100 dark:border-green-900/30">
                               <h4 className="font-bold text-green-700 dark:text-green-500 text-xs uppercase mb-3 tracking-wide">Strengths</h4>
                               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                  {interviewFeedback.strengths.map((s, i) => <li key={i}>{s}</li>)}
                               </ul>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-2xl border border-red-100 dark:border-red-900/30">
                               <h4 className="font-bold text-red-700 dark:text-red-500 text-xs uppercase mb-3 tracking-wide">Improvements</h4>
                               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-2">
                                  {interviewFeedback.improvements.map((s, i) => <li key={i}>{s}</li>)}
                               </ul>
                            </div>
                         </div>

                         <div className="bg-primary-50 dark:bg-primary-900/10 p-6 rounded-2xl border border-primary-100 dark:border-primary-900/30">
                            <h4 className="font-bold text-primary-700 dark:text-primary-500 text-xs uppercase mb-3 tracking-wide">Better Version</h4>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-primary-300 pl-4">"{interviewFeedback.sampleAnswer}"</p>
                         </div>
                      </div>
                   )}
                </>
             )}
          </div>
       </div>
    </div>
  );
};
