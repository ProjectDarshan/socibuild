import React, { useState } from 'react';
import { PenTool, Brain, Camera, ArrowRight, X, Sparkles, Mic, MicOff } from 'lucide-react';
import { analyzeEmailDraft, analyzeBehaviorDescription, analyzeImageVibe, analyzeConversation } from '../services/geminiService';
import { UserProfile } from '../types';

interface ToolsProps {
  userProfile: UserProfile;
}

export const Tools: React.FC<ToolsProps> = ({ userProfile }) => {
  const [activeTool, setActiveTool] = useState<'Email' | 'Behavior' | 'Vibe' | 'Voice' | null>(null);
  const [toolInput, setToolInput] = useState('');
  const [toolOutput, setToolOutput] = useState<any>('');
  const [emailTone, setEmailTone] = useState('Professional');
  const [vibeImage, setVibeImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setToolInput(prev => prev + (prev ? ' ' : '') + transcript);
      };
      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.start();
    } else {
      alert("Speech recognition not supported in this browser.");
    }
  };

  const handleToolSubmit = async () => {
    setIsLoading(true);
    let result: any = '';
    
    try {
        if (activeTool === 'Email' && toolInput.trim()) {
          result = await analyzeEmailDraft(toolInput, emailTone, userProfile.language);
        } else if (activeTool === 'Behavior' && toolInput.trim()) {
          result = await analyzeBehaviorDescription(toolInput, userProfile.language);
        } else if (activeTool === 'Vibe' && vibeImage) {
          result = await analyzeImageVibe(vibeImage.split(',')[1], userProfile.language); 
        } else if (activeTool === 'Voice' && toolInput.trim()) {
          result = await analyzeConversation(toolInput, userProfile.language);
        }
        setToolOutput(result);
    } catch (error) {
        console.error(error);
        setToolOutput("An error occurred. Please try again.");
    } finally {
        setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
              setVibeImage(reader.result as string);
              setToolOutput(null);
          };
          reader.readAsDataURL(file);
      }
  };

  const resetTool = () => {
      setActiveTool(null);
      setToolInput('');
      setToolOutput('');
      setVibeImage(null);
      setIsListening(false);
  };

  return (
    <div className="h-full flex flex-col animate-fade-in">
       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Social Toolbox</h1>
       <p className="text-gray-500 dark:text-gray-400 mb-8">Specialized AI tools to refine your communication and presence.</p>
       
       {!activeTool ? (
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <button 
                onClick={() => setActiveTool('Email')} 
                className="group p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50 dark:bg-blue-900/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
               <div className="w-12 h-12 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-sm">
                  <PenTool className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">Communication Lab</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">Draft emails or messages and get instant feedback on tone, clarity, and impact.</p>
               <div className="mt-4 flex items-center text-blue-600 font-bold text-xs relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                   Open Tool <ArrowRight className="w-3 h-3 ml-1" />
               </div>
            </button>

            <button 
                onClick={() => setActiveTool('Behavior')} 
                className="group p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50 dark:bg-purple-900/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
               <div className="w-12 h-12 bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-sm">
                  <Brain className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">Behavior Decoder</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">Describe a confusing social interaction to understand the underlying cues.</p>
               <div className="mt-4 flex items-center text-purple-600 font-bold text-xs relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                   Open Tool <ArrowRight className="w-3 h-3 ml-1" />
               </div>
            </button>

            <button 
                onClick={() => setActiveTool('Vibe')} 
                className="group p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-pink-50 dark:bg-pink-900/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
               <div className="w-12 h-12 bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-sm">
                  <Camera className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">Vibe Check AI</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">Upload a photo to analyze the first impression you project and get style tips.</p>
               <div className="mt-4 flex items-center text-pink-600 font-bold text-xs relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                   Open Tool <ArrowRight className="w-3 h-3 ml-1" />
               </div>
            </button>

            <button 
                onClick={() => setActiveTool('Voice')} 
                className="group p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-left relative overflow-hidden"
            >
               <div className="absolute top-0 right-0 w-24 h-24 bg-orange-50 dark:bg-orange-900/10 rounded-bl-full -mr-6 -mt-6 transition-transform group-hover:scale-110"></div>
               <div className="w-12 h-12 bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400 rounded-2xl flex items-center justify-center mb-4 relative z-10 shadow-sm">
                  <Mic className="w-6 h-6" />
               </div>
               <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 relative z-10">Voice Coach</h3>
               <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed relative z-10">Practice speaking clearly and confidently with real-time speech analysis.</p>
               <div className="mt-4 flex items-center text-orange-600 font-bold text-xs relative z-10 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                   Open Tool <ArrowRight className="w-3 h-3 ml-1" />
               </div>
            </button>
         </div>
       ) : (
         <div className="flex-1 bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 flex flex-col shadow-sm max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 dark:border-gray-700 pb-6">
              <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${activeTool === 'Email' ? 'bg-blue-100 text-blue-600' : activeTool === 'Behavior' ? 'bg-purple-100 text-purple-600' : activeTool === 'Vibe' ? 'bg-pink-100 text-pink-600' : 'bg-orange-100 text-orange-600'}`}>
                      {activeTool === 'Email' ? <PenTool className="w-6 h-6" /> : activeTool === 'Behavior' ? <Brain className="w-6 h-6" /> : activeTool === 'Vibe' ? <Camera className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                  </div>
                  <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {activeTool === 'Email' ? 'Communication Lab' : activeTool === 'Behavior' ? 'Behavior Decoder' : activeTool === 'Vibe' ? 'Vibe Check AI' : 'Voice Coach'}
                      </h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered analysis</p>
                  </div>
              </div>
              <button 
                onClick={resetTool} 
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors text-gray-500"
              >
                  <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col lg:flex-row gap-8">
                <div className="flex-1 flex flex-col">
                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
                        {activeTool === 'Email' ? 'Draft your text below:' : activeTool === 'Behavior' ? 'Describe the interaction:' : activeTool === 'Vibe' ? 'Upload your photo:' : 'Speak or type your phrase:'}
                    </label>
                    
                    {activeTool === 'Email' && (
                      <div className="mb-4 flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                        {['Professional', 'Friendly', 'Assertive', 'Formal', 'Empathetic'].map(t => (
                            <button 
                               key={t}
                               onClick={() => setEmailTone(t)}
                               className={`px-4 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${emailTone === t ? 'bg-primary-600 text-white border-primary-600 shadow-md transform scale-105' : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                            >
                                {t}
                            </button>
                        ))}
                      </div>
                    )}

                    {activeTool === 'Vibe' ? (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl p-8 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer relative group">
                             {vibeImage ? (
                                 <div className="relative w-full h-full flex items-center justify-center">
                                     <img src={vibeImage} alt="Preview" className="max-h-80 rounded-lg shadow-lg object-contain" />
                                     <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                                         <p className="text-white font-bold">Click to change</p>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="text-center py-12">
                                     <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                         <Camera className="w-10 h-10 text-gray-400" />
                                     </div>
                                     <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Click to upload image</p>
                                     <p className="text-sm text-gray-400 mt-2">Supports JPG, PNG</p>
                                 </div>
                             )}
                             <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                    ) : (
                        <div className="flex-1 relative">
                            <textarea 
                                className="w-full h-full p-6 bg-gray-50 dark:bg-gray-900/50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 border-none text-base leading-relaxed"
                                value={toolInput}
                                onChange={(e) => setToolInput(e.target.value)}
                                placeholder={activeTool === 'Email' ? "e.g., Hi team, I won't make the meeting..." : activeTool === 'Voice' ? "Press the mic and say something..." : "He crossed his arms and looked away when I said..."}
                            />
                            {activeTool === 'Voice' && (
                                <button
                                    onClick={startListening}
                                    className={`absolute bottom-4 right-4 p-3 rounded-full shadow-md transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white dark:bg-gray-700 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-600'}`}
                                >
                                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                                </button>
                            )}
                        </div>
                    )}
                    
                    <div className="mt-6 flex justify-end">
                        <button 
                            onClick={handleToolSubmit}
                            disabled={isLoading || (activeTool !== 'Vibe' && !toolInput) || (activeTool === 'Vibe' && !vibeImage)}
                            className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4" /> Analyze
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Output Section */}
                <div className="w-full lg:w-1/3 bg-gray-50 dark:bg-gray-900/30 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 overflow-y-auto max-h-[600px]">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">AI Analysis Result</h3>
                    
                    {!toolOutput ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center p-8 opacity-50">
                            <Sparkles className="w-12 h-12 mb-4" />
                            <p>Your AI insights will appear here.</p>
                        </div>
                    ) : (
                        <div className="prose dark:prose-invert prose-sm max-w-none animate-slide-up">
                            {typeof toolOutput === 'string' ? (
                                <div className="whitespace-pre-wrap">{toolOutput}</div>
                            ) : (
                                // Handle structured output if any (e.g. Vibe check result object or Email critique)
                                <div className="space-y-4">
                                    {/* Email Analysis Result */}
                                    {toolOutput.critique && (
                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">AI Critique</span>
                                            <div className="text-sm text-gray-700 dark:text-gray-300 mt-2 whitespace-pre-wrap">{toolOutput.critique}</div>
                                        </div>
                                    )}
                                    {toolOutput.rewrite && (
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <span className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wide">Polished Version</span>
                                            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900/50 rounded-lg text-gray-800 dark:text-gray-200 font-medium whitespace-pre-wrap border border-gray-200 dark:border-gray-700">
                                                {toolOutput.rewrite}
                                            </div>
                                            <button 
                                                onClick={() => navigator.clipboard.writeText(toolOutput.rewrite)}
                                                className="mt-3 text-xs font-bold text-gray-500 hover:text-gray-900 dark:hover:text-white flex items-center gap-1 transition-colors"
                                            >
                                                Copy to Clipboard
                                            </button>
                                        </div>
                                    )}

                                    {/* Vibe Check Result */}
                                    {toolOutput.vibe && (
                                        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                                            <span className="text-xs font-bold text-primary-500 uppercase tracking-wide">Vibe</span>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{toolOutput.vibe}</p>
                                        </div>
                                    )}
                                    {toolOutput.impression && (
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">First Impression</span>
                                            <p className="text-gray-700 dark:text-gray-300 mt-1 leading-relaxed">{toolOutput.impression}</p>
                                        </div>
                                    )}
                                    {toolOutput.tips && (
                                        <div>
                                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Style Tips</span>
                                            <ul className="list-disc list-inside mt-2 space-y-2 text-gray-600 dark:text-gray-400 text-sm">
                                                {toolOutput.tips.map((tip: string, i: number) => (
                                                    <li key={i}>{tip}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {/* Voice Coach Result (reuses AnalysisResult structure) */}
                                    {toolOutput.confidenceScore !== undefined && (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4 bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                <div className={`text-2xl font-bold ${toolOutput.confidenceScore >= 80 ? 'text-green-500' : toolOutput.confidenceScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                    {toolOutput.confidenceScore}%
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">Confidence Score</div>
                                            </div>
                                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
                                                <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Feedback</span>
                                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">{toolOutput.feedback}</p>
                                            </div>
                                            {toolOutput.betterAlternative && (
                                                <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Try Saying</span>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 italic">"{toolOutput.betterAlternative}"</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
         </div>
       )}
    </div>
  );
};
