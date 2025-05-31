
export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

// --- New Structured Study Material Types ---

// For inline styling within text segments
export interface FormattedText {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  link?: string; // URL for hyperlinks
  code?: boolean; // For inline code style
}

// Base for all content blocks
interface ContentBlockBase {
  id: string; // Unique ID for the block (e.g., for React keys, deep linking)
}

export interface HeadingBlock extends ContentBlockBase {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6; // h1, h2, etc.
  content: FormattedText[]; // Typically one item, but allows for flexibility
}

export interface ParagraphBlock extends ContentBlockBase {
  type: 'paragraph';
  content: FormattedText[]; // Array of text segments with optional formatting
}

export interface ListItemContent {
  id: string; // Unique ID for the list item
  content: FormattedText[]; // Content of a list item
  // subItems?: ListItem[]; // For nested lists (future extension)
}

export interface ListBlock extends ContentBlockBase {
  type: 'list';
  ordered: boolean; // true for <ol>, false for <ul>
  items: ListItemContent[];
}

export interface ImageBlock extends ContentBlockBase {
  type: 'image';
  src: string;
  alt: string;
  caption?: FormattedText[];
}

export interface AlertBlock extends ContentBlockBase {
  type: 'alert';
  style: 'info' | 'warning' | 'success' | 'danger';
  title?: FormattedText[];
  content: FormattedText[];
}

export interface CodeBlock extends ContentBlockBase {
  type: 'code';
  language?: string; // e.g., 'javascript', 'python'
  code: string;
}

export interface TableOfContentsBlock extends ContentBlockBase {
  type: 'tableOfContents';
  title?: FormattedText[]; // Optional title for the TOC, e.g., "In this section:"
  // maxDepth?: number; // Optional: to control how many heading levels to include
}

// Union type for all possible content blocks
export type ContentBlock = 
  | HeadingBlock 
  | ParagraphBlock 
  | ListBlock 
  | ImageBlock 
  | AlertBlock
  | CodeBlock
  | TableOfContentsBlock;

export interface StudyMaterialTopic {
  id: string; // Used for linking in Table of Contents
  title: string; // Main title for the topic, used in TOC
  introduction?: FormattedText[]; // Optional introductory paragraph(s) for the topic
  contentBlocks: ContentBlock[]; // The main content, structured as blocks
  summary?: FormattedText[]; // Optional summary paragraph(s) for the topic
}

// --- End of Structured Study Material Types ---

export enum StudyMode {
  FLASHCARD = 'FLASHCARD',
  QUIZ = 'QUIZ',
  STUDY_MATERIAL = 'STUDY_MATERIAL',
}

// --- Subject and Chapter Structure ---
export interface Chapter {
  id: string;
  name: string;
  flashcardsPath?: string; // Path to flashcards JSON for this chapter
  mcqsPath?: string;       // Path to MCQs JSON for this chapter
  studyMaterialPath?: string; // Path to study material JSON for this chapter
}

export interface Subject {
  id: string;
  name: string;
  chapters: Chapter[];
}
