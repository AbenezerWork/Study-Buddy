
import React, { useState, useEffect, useCallback } from 'react';
import { StudyMode, Flashcard, MultipleChoiceQuestion, StudyMaterialTopic, Subject, Chapter } from './types';
import FlashcardView from './components/FlashcardView';
import QuizView from './components/QuizView';
import StudyMaterialView from './components/StudyMaterialView';
import NavigationControls from './components/NavigationControls';
import ModeSelector from './components/ModeSelector';
import Sidebar from './components/Sidebar';

const metadata = {
  "name": "Study Buddy: Flashcards & Quizzes",
  "description": "An interactive web application to study with flashcards and test your knowledge with multiple-choice questions. Built with React, TypeScript, and Tailwind CSS.",
  "requestFramePermissions": []
};

const App: React.FC = () => {
  const [mode, setMode] = useState<StudyMode>(StudyMode.FLASHCARD);
  
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);

  const [chapterFlashcards, setChapterFlashcards] = useState<Flashcard[]>([]);
  const [chapterMcqs, setChapterMcqs] = useState<MultipleChoiceQuestion[]>([]);
  const [chapterStudyMaterialTopics, setChapterStudyMaterialTopics] = useState<StudyMaterialTopic[]>([]);
  
  const [isLoadingSubjects, setIsLoadingSubjects] = useState(true);
  const [errorSubjects, setErrorSubjects] = useState<string | null>(null);
  const [isLoadingChapterData, setIsLoadingChapterData] = useState(false);
  const [errorChapterData, setErrorChapterData] = useState<string | null>(null);

  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [currentMcqIndex, setCurrentMcqIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, number | null>>({});
  const [showFeedback, setShowFeedback] = useState<Record<string, boolean>>({});

  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  
  useEffect(() => {
    document.title = currentChapter ? `${currentChapter.name} | ${metadata.name}` : metadata.name;
  }, [currentChapter]);

  useEffect(() => {
    const fetchSubjects = async () => {
      setIsLoadingSubjects(true);
      setErrorSubjects(null);
      try {
        const response = await fetch('/data/subjects.json');
        if (!response.ok) throw new Error(`Failed to load subjects list. Status: ${response.status} ${response.statusText}`);
        const data = await response.json();
        setSubjects(data);
        if (data.length > 0 && data[0].chapters.length > 0) {
          handleSelectChapter(data[0].chapters[0].id, data[0].id);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while fetching subjects.";
        setErrorSubjects(`Could not load subjects: ${errorMessage}. Please ensure 'public/data/subjects.json' is available and correctly formatted.`);
        console.error("Error fetching subjects:", err);
        setSubjects([]);
      } finally {
        setIsLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!selectedChapterId || !selectedSubjectId) {
      setCurrentChapter(null);
      setChapterFlashcards([]);
      setChapterMcqs([]);
      setChapterStudyMaterialTopics([]);
      setQuizCompleted(false);
      setQuizScore(0);
      return;
    }

    const subject = subjects.find(s => s.id === selectedSubjectId);
    const chapter = subject?.chapters.find(c => c.id === selectedChapterId);
    setCurrentChapter(chapter || null);

    if (!chapter) {
      setErrorChapterData(`Chapter (ID: ${selectedChapterId}) not found in subject (ID: ${selectedSubjectId}).`);
      setQuizCompleted(false);
      setQuizScore(0);
      return;
    }
    
    const fetchChapterData = async () => {
      setIsLoadingChapterData(true);
      setErrorChapterData(null);
      setChapterFlashcards([]);
      setChapterMcqs([]);
      setChapterStudyMaterialTopics([]);
      setCurrentFlashcardIndex(0);
      setCurrentMcqIndex(0);
      setUserAnswers({});
      setShowFeedback({});
      setQuizCompleted(false);
      setQuizScore(0);

      try {
        const fetchData = async (path: string | undefined, type: string) => {
          if (!path) return [];
          const response = await fetch(path);
          if (!response.ok) {
            console.warn(`Failed to fetch ${type} from ${path}: ${response.statusText}`);
            return []; 
          }
          try {
            return await response.json();
          } catch (jsonError) {
            console.error(`Error parsing JSON for ${type} from ${path}:`, jsonError);
            throw new Error(`Invalid JSON format for ${type} at ${path}.`);
          }
        };

        const [flashcardData, mcqData, studyMaterialData] = await Promise.all([
          fetchData(chapter.flashcardsPath, "flashcards"),
          fetchData(chapter.mcqsPath, "MCQs"),
          fetchData(chapter.studyMaterialPath, "study material")
        ]);
        
        setChapterFlashcards(flashcardData);
        setChapterMcqs(mcqData);
        setChapterStudyMaterialTopics(studyMaterialData);

      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred loading chapter data.";
        setErrorChapterData(`Error loading content for '${chapter.name}': ${errorMessage}`);
        console.error(`Error fetching chapter data for ${chapter.id}:`, err);
      } finally {
        setIsLoadingChapterData(false);
      }
    };

    fetchChapterData();
  }, [selectedChapterId, selectedSubjectId, subjects]);


  const handleSelectChapter = (chapterId: string, subjectId: string) => {
    setSelectedSubjectId(subjectId);
    setSelectedChapterId(chapterId);
    setMode(StudyMode.FLASHCARD); 
    setCurrentMcqIndex(0);
    setUserAnswers({});
    setShowFeedback({});
    setQuizCompleted(false);
    setQuizScore(0);
    setCurrentFlashcardIndex(0);
  };

  const handleModeChange = (newMode: StudyMode) => {
    setMode(newMode);
    // Reset progress specific to quiz or flashcards when mode changes
    setCurrentFlashcardIndex(0);
    setCurrentMcqIndex(0);
    setUserAnswers({});
    setShowFeedback({});
    setQuizCompleted(false);
    setQuizScore(0);
  };

  const handleNext = () => {
    if (mode === StudyMode.FLASHCARD) {
      if (currentFlashcardIndex < chapterFlashcards.length - 1) {
        setCurrentFlashcardIndex(prev => prev + 1);
      }
    } else if (mode === StudyMode.QUIZ && chapterMcqs.length > 0) {
      const currentMcqForNav = chapterMcqs[currentMcqIndex];
      if (currentMcqForNav) {
        if (!quizCompleted) { 
          const currentQuestionAnswered = showFeedback[currentMcqForNav.id];
          if (!currentQuestionAnswered) return; 

          if (currentMcqIndex === chapterMcqs.length - 1) { 
            let score = 0;
            chapterMcqs.forEach(mcqItem => {
              if (userAnswers[mcqItem.id] === mcqItem.correctAnswerIndex) {
                score++;
              }
            });
            setQuizScore(score);
            setQuizCompleted(true);
            // Stays on the last question for review start
          } else { 
            setCurrentMcqIndex(prev => prev + 1);
          }
        } else { // Quiz completed, in review mode
          if (currentMcqIndex < chapterMcqs.length - 1) {
            setCurrentMcqIndex(prev => prev + 1);
          }
        }
      }
    }
  };

  const handlePrevious = () => {
    if (mode === StudyMode.FLASHCARD) {
      if (currentFlashcardIndex > 0) {
        setCurrentFlashcardIndex(prev => prev - 1);
      }
    } else if (mode === StudyMode.QUIZ) {
      if (currentMcqIndex > 0) { 
        setCurrentMcqIndex(prev => prev - 1);
      }
    }
  };
  
  const handleAnswerSelect = useCallback((mcqId: string, optionIndex: number) => {
    if (quizCompleted) return; // Do not allow answer changes after quiz is completed
    setUserAnswers(prev => ({ ...prev, [mcqId]: optionIndex }));
    setShowFeedback(prev => ({ ...prev, [mcqId]: true }));
  }, [quizCompleted]);

  const restartQuiz = () => {
    setCurrentMcqIndex(0);
    setUserAnswers({});
    setShowFeedback({});
    setQuizScore(0);
    setQuizCompleted(false);
  };

  const currentFlashcard = chapterFlashcards[currentFlashcardIndex];
  const currentMcq = chapterMcqs[currentMcqIndex];

  const renderContent = () => {
    if (!selectedChapterId && !isLoadingSubjects && !errorSubjects) {
      return <p className="text-center text-slate-500 py-10 text-lg">Select a chapter to start studying.</p>;
    }
    if (isLoadingChapterData) return <p className="text-center text-slate-500 py-10 text-lg">Loading chapter content...</p>;
    if (errorChapterData) return <div className="text-center text-red-600 bg-red-100 border border-red-300 p-4 rounded-md py-10"><p className="font-semibold">Error Loading Content</p><p className="text-sm">{errorChapterData}</p></div>;

    if (mode === StudyMode.FLASHCARD) {
      if (!chapterFlashcards.length) return <p className="text-center text-slate-500 py-10">No flashcards available for this chapter.</p>;
      if (!currentFlashcard) return <p className="text-center text-slate-500 py-10">Flashcard not found.</p>;
      return <FlashcardView flashcard={currentFlashcard} />;
    } 
    
    if (mode === StudyMode.QUIZ) {
      if (!chapterMcqs.length) return <p className="text-center text-slate-500 py-10">No quiz questions available for this chapter.</p>;
      
      const currentQuestionToDisplay = chapterMcqs[currentMcqIndex];
      if (!currentQuestionToDisplay) return <p className="text-center text-slate-500 py-10">Question not found.</p>;

      return (
        <div> {/* Wrapper div for score and QuizView */}
          {quizCompleted && (
            <div className="text-center mb-4 sm:mb-6 pb-4 border-b border-slate-300">
              <h2 className="text-2xl sm:text-3xl font-bold text-indigo-700 mb-2">Quiz Completed!</h2>
              <p className="text-xl sm:text-2xl text-slate-700 mb-3">
                Your score: <span className="font-bold text-indigo-600">{quizScore}</span> / {chapterMcqs.length}
              </p>
              <button
                onClick={restartQuiz}
                className="px-6 py-2 sm:py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-sm sm:text-base"
              >
                Restart Quiz for this Chapter
              </button>
              <p className="mt-3 text-sm text-slate-600">You can now review your answers using the Previous/Next buttons.</p>
            </div>
          )}
          <QuizView 
            mcq={currentQuestionToDisplay}
            onAnswerSelect={(optionIdx) => handleAnswerSelect(currentQuestionToDisplay.id, optionIdx)}
            selectedAnswer={userAnswers[currentQuestionToDisplay.id] === undefined ? null : userAnswers[currentQuestionToDisplay.id]}
            showFeedback={quizCompleted || (showFeedback[currentQuestionToDisplay.id] || false)}
          />
        </div>
      );
    }

    if (mode === StudyMode.STUDY_MATERIAL) {
        if (!chapterStudyMaterialTopics.length) return <p className="text-center text-slate-500 py-10">No study material available for this chapter.</p>;
        return <StudyMaterialView topics={chapterStudyMaterialTopics} />;
    }
    return null;
  };

  let totalItems = 0;
  let currentIndex = 0;
  let itemTypeLabel = "";
  let showNavigation = false;
  let isNextEffectivelyDisabled = true;
  let isPrevEffectivelyDisabled = true;
  let nextButtonText = "Next";

  if (mode === StudyMode.FLASHCARD && chapterFlashcards.length > 0) {
    totalItems = chapterFlashcards.length;
    currentIndex = currentFlashcardIndex;
    itemTypeLabel = "Card";
    showNavigation = true;
    isNextEffectivelyDisabled = currentFlashcardIndex >= chapterFlashcards.length - 1;
    isPrevEffectivelyDisabled = currentFlashcardIndex <= 0;
  } else if (mode === StudyMode.QUIZ && chapterMcqs.length > 0) {
    totalItems = chapterMcqs.length;
    currentIndex = currentMcqIndex;
    itemTypeLabel = "Question";
    showNavigation = true; 
    
    isPrevEffectivelyDisabled = currentMcqIndex <= 0;

    if (!quizCompleted) {
      const currentQuestionAnswered = currentMcq && showFeedback[currentMcq.id];
      isNextEffectivelyDisabled = !currentQuestionAnswered;
      if (currentMcqIndex === chapterMcqs.length - 1) {
        nextButtonText = "Finish Quiz";
      }
    } else { // Quiz completed (review mode)
      isNextEffectivelyDisabled = currentMcqIndex >= chapterMcqs.length - 1;
      nextButtonText = "Next"; // Reset from "Finish Quiz" if it was set
    }
  }
  
  const isModeSelectorDisabled = !selectedChapterId || isLoadingChapterData || !!errorChapterData;

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-100">
      <Sidebar 
        subjects={subjects} 
        selectedChapterId={selectedChapterId} 
        onSelectChapter={handleSelectChapter}
        isLoading={isLoadingSubjects}
      />
      <div className="flex-1 flex flex-col items-center p-2 sm:p-4 lg:p-6 overflow-y-auto w-full">
        <header className="my-4 md:my-6 text-center w-full max-w-4xl">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-indigo-700">{currentChapter?.name || metadata.name}</h1>
          {currentChapter && subjects.find(s => s.id === selectedSubjectId) && (
            <p className="text-sm sm:text-base text-slate-600 mt-1">
              Studying: {subjects.find(s => s.id === selectedSubjectId)?.name}
            </p>
          )}
          {!currentChapter && (
             <p className="text-sm sm:text-base text-slate-600 mt-1">{metadata.description}</p>
          )}
        </header>
        
        <main className="w-full max-w-3xl xl:max-w-4xl flex-grow flex flex-col">
          {selectedChapterId && !isLoadingChapterData && !errorChapterData && (
             <ModeSelector 
              currentMode={mode} 
              onSelectMode={handleModeChange} 
              disabled={isModeSelectorDisabled}
            />
          )}
          
          <div className="bg-slate-50 p-3 sm:p-4 md:p-6 rounded-lg shadow-lg flex-grow flex flex-col justify-center mb-6 min-h-[calc(100vh-22rem)] sm:min-h-[calc(100vh-20rem)] md:min-h-[30rem] overflow-y-auto">
            {isLoadingSubjects && !selectedChapterId && <p className="text-center text-slate-500 py-10 text-lg">Loading subject list...</p>}
            {errorSubjects && !selectedChapterId && <div className="text-center text-red-700 bg-red-100 border border-red-300 p-4 rounded-md py-10"><p className="font-semibold">Failed to Load Subjects</p><p className="text-sm mt-1">{errorSubjects}</p></div>}
            {renderContent()}
          </div>

          {!isLoadingChapterData && !errorChapterData && showNavigation && (
            <NavigationControls
              onPrevious={handlePrevious}
              onNext={handleNext}
              isPreviousDisabled={isPrevEffectivelyDisabled}
              isNextDisabled={isNextEffectivelyDisabled}
              currentIndex={currentIndex}
              totalItems={totalItems}
              itemTypeLabel={itemTypeLabel}
              nextButtonText={nextButtonText}
            />
          )}
        </main>
        <footer className="mt-auto pt-6 pb-3 text-center text-xs sm:text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} Study Buddy App. Happy Studying!</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
