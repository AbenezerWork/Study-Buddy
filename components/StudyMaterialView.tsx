
import React from 'react';
import { StudyMaterialTopic, ContentBlock, FormattedText as FormattedTextType, HeadingBlock, ParagraphBlock, ListBlock, AlertBlock, CodeBlock, ImageBlock, ListItemContent } from '../types';

// Helper component to render FormattedText arrays
const FormattedText: React.FC<{ segments: FormattedTextType[] | undefined }> = ({ segments }) => {
  if (!segments || segments.length === 0) return null;
  return (
    <>
      {segments.map((segment, index) => {
        let element = <>{segment.text}</>;
        if (segment.bold) element = <strong>{element}</strong>;
        if (segment.italic) element = <em>{element}</em>;
        if (segment.underline) element = <u>{element}</u>;
        if (segment.code) element = <code className="px-1 py-0.5 bg-slate-200 text-xs sm:text-sm rounded">{element}</code>;
        if (segment.link) element = <a href={segment.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline break-words">{element}</a>;
        
        return <React.Fragment key={index}>{element}</React.Fragment>;
      })}
    </>
  );
};

// Helper component to render a single ContentBlock
const ContentBlockRenderer: React.FC<{ block: ContentBlock }> = ({ block }) => {
  switch (block.type) {
    case 'heading':
      const hb = block as HeadingBlock;
      const Tag = `h${hb.level}` as keyof JSX.IntrinsicElements;
      let headingClasses = "font-semibold text-slate-700 scroll-mt-28"; // scroll-mt for anchor links
      if (hb.level === 1) headingClasses += " text-2xl sm:text-3xl mt-6 mb-4 pb-2 border-b border-slate-300"; 
      else if (hb.level === 2) headingClasses += " text-xl sm:text-2xl mt-5 mb-3 pb-1 border-b border-slate-200";
      else if (hb.level === 3) headingClasses += " text-lg sm:text-xl mt-4 mb-2";
      else if (hb.level === 4) headingClasses += " text-md sm:text-lg mt-3 mb-1";
      else headingClasses += " text-base sm:text-md mt-2 mb-1";
      return <Tag id={hb.id} className={headingClasses}><FormattedText segments={hb.content} /></Tag>;

    case 'paragraph':
      const pb = block as ParagraphBlock;
      return <p className="mb-4 leading-relaxed text-sm sm:text-base text-slate-700"><FormattedText segments={pb.content} /></p>;

    case 'list':
      const lb = block as ListBlock;
      const ListTag = lb.ordered ? 'ol' : 'ul';
      const listStyle = lb.ordered ? 'list-decimal' : 'list-disc';
      return (
        <ListTag className={`${listStyle} pl-5 sm:pl-6 mb-4 space-y-1 text-sm sm:text-base text-slate-700`}>
          {lb.items.map((item: ListItemContent) => (
            <li key={item.id} className="mb-0.5"><FormattedText segments={item.content} /></li>
          ))}
        </ListTag>
      );
    
    case 'image':
      const ib = block as ImageBlock;
      return (
        <figure className="my-4 sm:my-6">
          <img src={ib.src} alt={ib.alt} className="max-w-full h-auto rounded-md shadow-sm mx-auto border border-slate-200" />
          {ib.caption && (
            <figcaption className="text-center text-xs sm:text-sm text-slate-500 mt-2">
              <FormattedText segments={ib.caption} />
            </figcaption>
          )}
        </figure>
      );

    case 'alert':
      const ab = block as AlertBlock;
      let alertClasses = "p-3 sm:p-4 mb-4 border rounded-md text-xs sm:text-sm";
      if (ab.style === 'info') alertClasses += " bg-sky-50 border-sky-300 text-sky-700";
      else if (ab.style === 'warning') alertClasses += " bg-amber-50 border-amber-300 text-amber-700";
      else if (ab.style === 'success') alertClasses += " bg-green-50 border-green-300 text-green-700";
      else if (ab.style === 'danger') alertClasses += " bg-red-50 border-red-300 text-red-700";
      return (
        <div className={alertClasses} role="alert">
          {ab.title && <strong className="font-semibold block mb-1 text-sm sm:text-base"><FormattedText segments={ab.title} /></strong>}
          <FormattedText segments={ab.content} />
        </div>
      );

    case 'code':
      const cb = block as CodeBlock;
      return (
        <pre className="bg-slate-800 text-slate-100 p-3 sm:p-4 rounded-md overflow-x-auto my-4 text-xs sm:text-sm">
          <code>{cb.code}</code>
        </pre>
      );
    
    case 'tableOfContents':
      return null; 

    default:
      return null;
  }
};


interface StudyMaterialViewProps {
  topics: StudyMaterialTopic[];
}

const StudyMaterialView: React.FC<StudyMaterialViewProps> = ({ topics }) => {
  if (!topics || topics.length === 0) {
    return <p className="text-center text-slate-500 py-10">No study material available.</p>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto text-slate-800">
      {/* Global Table of Contents */}
      <nav className="mb-8 sm:mb-12 p-4 sm:p-6 bg-slate-50 rounded-lg shadow border border-slate-200" aria-labelledby="global-toc-heading">
        <h2 id="global-toc-heading" className="text-xl sm:text-2xl font-bold text-indigo-700 mb-3 sm:mb-4 pb-2 border-b border-indigo-200">
          Table of Contents
        </h2>
        <ul className="space-y-1.5 sm:space-y-2">
          {topics.map(topic => (
            <li key={`toc-topic-${topic.id}`}>
              <a href={`#heading-${topic.id}`} className="text-indigo-600 hover:text-indigo-800 hover:underline font-semibold text-sm sm:text-base">
                {topic.title}
              </a>
              <ul className="pl-3 sm:pl-4 mt-1 space-y-0.5 sm:space-y-1">
                {topic.contentBlocks
                  .filter(block => block.type === 'heading' && ((block as HeadingBlock).level === 2 || (block as HeadingBlock).level === 3))
                  .map(block => {
                    const headingBlock = block as HeadingBlock;
                    return (
                      <li key={`toc-subheading-${headingBlock.id}`} className={headingBlock.level === 3 ? 'ml-3 sm:ml-4' : ''}>
                        <a href={`#${headingBlock.id}`} className="text-xs sm:text-sm text-indigo-500 hover:text-indigo-700 hover:underline">
                          <FormattedText segments={headingBlock.content} />
                        </a>
                      </li>
                    );
                  })}
              </ul>
            </li>
          ))}
        </ul>
      </nav>

      {/* Content Sections */}
      <div className="space-y-10 sm:space-y-12">
        {topics.map(topic => (
          <section key={topic.id} aria-labelledby={`heading-${topic.id}`} className="pt-2">
            <h1 id={`heading-${topic.id}`} className="text-2xl sm:text-3xl font-bold text-slate-800 mb-4 sm:mb-6 pb-2 border-b border-slate-300 scroll-mt-28">
              {topic.title}
            </h1>
            
            {topic.introduction && (
                <div className="mb-4 sm:mb-6 italic text-slate-600 text-sm sm:text-base">
                    <FormattedText segments={topic.introduction} />
                </div>
            )}

            {topic.contentBlocks.map((block) => (
              <ContentBlockRenderer key={block.id} block={block} />
            ))}
            
            {topic.summary && (
                <div className="mt-6 sm:mt-8 pt-3 sm:pt-4 border-t border-slate-200 text-xs sm:text-sm text-slate-600">
                    <strong className="block mb-1 font-semibold">Summary:</strong>
                    <FormattedText segments={topic.summary} />
                </div>
            )}
          </section>
        ))}
      </div>
    </div>
  );
};

export default StudyMaterialView;
