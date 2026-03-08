import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, User, Sparkles, Activity, Mic, MicOff, FileText, XCircle } from 'lucide-react';
import { Message, Scenario, AnalysisResult, UserProfile } from '../types';
import { generateChatResponse, analyzeConversation, generateScenarioReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

interface ChatProps {
  scenario: Scenario;
  userProfile: UserProfile;
  onBack: () => void;
  onUpdateSocialIQ: (increment: number) => void;
}

export const Chat: React.FC<ChatProps> = ({ scenario, userProfile, onBack, onUpdateSocialIQ }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'model',
      text: `(Scenario: ${scenario.title}) Hi! I'm ${scenario.aiPersona.split(' ')[0]}. ${scenario.description} ${scenario.initialPrompt}`,
      timestamp: Date.now()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<AnalysisResult | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
        setInputText(prev => prev + (prev ? ' ' : '') + transcript);
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

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', text: inputText, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
        const [response, analysis] = await Promise.all([
            generateChatResponse([...messages, userMsg], userMsg.text, scenario.aiPersona, scenario.category, userProfile),
            analyzeConversation(userMsg.text, userProfile.language)
        ]);

        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: response, timestamp: Date.now() }]);
        setLastAnalysis(analysis);
        
        if (analysis.confidenceScore > 80) onUpdateSocialIQ(1);
    } catch (error) {
        console.error(error);
    } finally {
        setIsLoading(false);
    }
  };

  const handleEndChat = async () => {
    setIsGeneratingReport(true);
    setShowReport(true);
    const report = await generateScenarioReport(messages, scenario.title, userProfile.language);
    setReportContent(report);
    setIsGeneratingReport(false);
  };

  const ConfidenceMeter = ({ score }: { score: number }) => {
    let color = 'bg-red-500';
    let text = 'Needs Work';
    if (score >= 50) { color = 'bg-yellow-500'; text = 'Improving'; }
    if (score >= 80) { color = 'bg-green-500'; text = 'Confident'; }

    return (
        <div className="flex items-center gap-2 md:gap-3 bg-white dark:bg-gray-800 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-gray-100 dark:border-gray-700 shadow-sm animate-fade-in">
            <Activity className={`w-3 h-3 md:w-4 md:h-4 ${score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-red-500'}`} />
            <div className="flex flex-col w-20 md:w-28">
                <div className="flex justify-between text-[8px] md:text-[10px] uppercase font-bold text-gray-400 mb-0.5 md:mb-1">
                    <span>{text}</span>
                    <span>{score}%</span>
                </div>
                <div className="w-full h-1 md:h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className={`h-full ${color} transition-all duration-500`} 
                        style={{ width: `${score}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
  };

  if (showReport) {
    return (
      <div className="h-full flex flex-col animate-fade-in p-4 md:p-8 bg-white dark:bg-gray-900 overflow-y-auto custom-scrollbar">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary-500" />
              Scenario Report
            </h2>
            <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
              <XCircle className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {isGeneratingReport ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mb-4"></div>
              <p className="text-gray-500 dark:text-gray-400 font-medium">Analyzing your conversation...</p>
            </div>
          ) : (
            <div className="prose dark:prose-invert max-w-none bg-gray-50 dark:bg-gray-800/50 p-8 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm">
               <ReactMarkdown>{reportContent}</ReactMarkdown>
               <div className="mt-8 flex justify-center">
                 <button 
                   onClick={onBack}
                   className="px-8 py-3 bg-primary-600 text-white rounded-xl font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/30 hover:-translate-y-0.5"
                 >
                   Back to Dashboard
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col animate-fade-in relative">
      {/* Chat Header */}
      <div className="flex items-center justify-between mb-4 border-b border-gray-100 dark:border-gray-700 pb-4 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 truncate text-sm md:text-base">
              {scenario.title}
              <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${scenario.difficulty === 'Easy' ? 'bg-green-100 text-green-700' : scenario.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                {scenario.difficulty}
              </span>
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">Speaking with: {scenario.aiPersona}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 ml-2">
           {lastAnalysis && (
               <div className="hidden md:block">
                   <ConfidenceMeter score={lastAnalysis.confidenceScore} />
               </div>
           )}
           <button 
             onClick={handleEndChat}
             className="px-3 py-1.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors border border-red-100 dark:border-red-900/30"
           >
             End Chat
           </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar pb-4 min-h-0">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden ${msg.role === 'user' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                {msg.role === 'user' ? (
                  userProfile.avatar ? (
                    <img src={userProfile.avatar} alt="You" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
              </div>
              
              <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-primary-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[70%]">
                <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 flex-shrink-0 flex items-center justify-center">
                   <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-1">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
             </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Analysis Feedback (Mobile/Desktop) */}
      {lastAnalysis && (
        <div className="mb-4 animate-slide-up bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700 flex items-start gap-3 shrink-0">
           <div className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm text-primary-500">
              <Sparkles className="w-4 h-4" />
           </div>
           <div className="flex-1">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-1">Live Feedback</p>
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{lastAnalysis.feedback}</p>
              {lastAnalysis.betterAlternative && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 italic">Try: "{lastAnalysis.betterAlternative}"</p>
              )}
           </div>
        </div>
      )}

      {/* Input Area */}
      <div className="pt-2 shrink-0">
        <div className="relative flex items-center gap-2">
          <button
            onClick={startListening}
            className={`p-4 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
            title="Voice Input"
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isListening ? "Listening..." : "Type your response..."}
            className="flex-1 p-4 pr-12 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isLoading}
            className="absolute right-2 p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 disabled:opacity-50 disabled:hover:bg-primary-600 transition-all shadow-md"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
