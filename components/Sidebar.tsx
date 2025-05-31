
import React, { useState, useEffect } from 'react';
import { Subject, Chapter } from '../types';
import { ChevronDownIcon, FolderIcon } from './icons';

interface SidebarProps {
  subjects: Subject[];
  selectedChapterId: string | null;
  onSelectChapter: (chapterId: string, subjectId: string) => void;
  isLoading: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ subjects, selectedChapterId, onSelectChapter, isLoading }) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  // Automatically expand the subject of the initially selected chapter
  useEffect(() => {
    if (selectedChapterId && subjects.length > 0) {
      const subjectWithSelectedChapter = subjects.find(subject => 
        subject.chapters.some(chapter => chapter.id === selectedChapterId)
      );
      if (subjectWithSelectedChapter && !expandedSubjects.has(subjectWithSelectedChapter.id)) {
        setExpandedSubjects(prev => {
          const newSet = new Set(prev);
          newSet.add(subjectWithSelectedChapter.id);
          return newSet;
        });
      }
    }
  // Only run this effect if selectedChapterId or subjects change initially. Avoid re-running on expandedSubjects change.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChapterId, subjects]);


  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subjectId)) {
        newSet.delete(subjectId);
      } else {
        newSet.add(subjectId);
      }
      return newSet;
    });
  };

  if (isLoading) {
    return (
      <aside className="w-full lg:w-72 lg:max-w-xs xl:w-80 bg-slate-800 text-slate-200 p-4 space-y-2 lg:min-h-screen lg:overflow-y-auto">
        <div className="h-8 bg-slate-700 rounded animate-pulse mb-3"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-1">
            <div className="h-10 bg-slate-700 rounded animate-pulse"></div>
            <div className="pl-4">
              <div className="h-8 my-1 bg-slate-600 rounded animate-pulse w-3/4"></div>
              <div className="h-8 my-1 bg-slate-600 rounded animate-pulse w-2/3"></div>
            </div>
          </div>
        ))}
      </aside>
    );
  }
  
  if (!subjects.length && !isLoading) {
    return (
      <aside className="w-full lg:w-72 lg:max-w-xs xl:w-80 bg-slate-800 text-slate-200 p-4 lg:min-h-screen">
        <p className="text-slate-400">No subjects found. Please check `public/data/subjects.json`.</p>
      </aside>
    )
  }

  return (
    <aside className="w-full lg:w-72 lg:max-w-xs xl:w-80 bg-slate-800 text-slate-200 p-3 sm:p-4 lg:min-h-screen lg:overflow-y-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-indigo-300 px-1">Course Content</h2>
      <nav>
        <ul className="space-y-1">
          {subjects.map(subject => (
            <li key={subject.id}>
              <button
                onClick={() => toggleSubject(subject.id)}
                className="w-full flex items-center justify-between p-2.5 rounded-md text-left text-sm sm:text-base text-slate-100 hover:bg-slate-700 focus:outline-none focus:bg-slate-700 transition-colors"
                aria-expanded={expandedSubjects.has(subject.id)}
                aria-controls={`subject-chapters-${subject.id}`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <FolderIcon className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                  <span className="truncate">{subject.name}</span>
                </span>
                <ChevronDownIcon className="w-5 h-5 flex-shrink-0" isRotated={expandedSubjects.has(subject.id)} />
              </button>
              {expandedSubjects.has(subject.id) && (
                <ul id={`subject-chapters-${subject.id}`} className="pl-4 pr-1 py-1 mt-1 space-y-0.5 border-l-2 border-slate-700 ml-2.5">
                  {subject.chapters.length > 0 ? (
                    subject.chapters.map(chapter => (
                      <li key={chapter.id}>
                        <button
                          onClick={() => onSelectChapter(chapter.id, subject.id)}
                          className={`
                            w-full text-left p-2 pl-3 rounded-md text-xs sm:text-sm transition-colors
                            flex items-center gap-2.5 group
                            ${selectedChapterId === chapter.id 
                              ? 'bg-indigo-600 text-white font-semibold shadow-md' 
                              : 'text-slate-300 hover:bg-slate-600 hover:text-slate-100 focus:bg-slate-600 focus:text-slate-100'
                            }
                          `}
                          aria-current={selectedChapterId === chapter.id ? "page" : undefined}
                        >
                          <span className={`flex-shrink-0 w-1.5 h-1.5 rounded-full ${selectedChapterId === chapter.id ? 'bg-white' : 'bg-slate-500 group-hover:bg-slate-300'}`}></span>
                          <span className="truncate">{chapter.name}</span>
                        </button>
                      </li>
                    ))
                  ) : (
                     <li><p className="p-2 pl-3 text-xs sm:text-sm text-slate-400 italic">No chapters in this subject.</p></li>
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
