export interface Question {
  id: number;
  question: string;
  type: 'mcq' | 'theory' | 'practical';
  options?: string[];
  image?: string;
  section: string;
}

export const EXAM_QUESTIONS: Question[] = [
  // Section A - MCQs (Basics)
  { 
    id: 1, 
    question: "Which of the following best describes UX?",
    type: 'mcq',
    options: [
      "Visual design of a website",
      "Overall experience of user interaction with a product",
      "Color and typography selection",
      "Frontend development"
    ],
    section: "Section A"
  },
  { 
    id: 2, 
    question: "Which option improves both usability AND readability?",
    type: 'mcq',
    options: [
      "Using more colors",
      "Adding animations everywhere",
      "Proper spacing and visual hierarchy",
      "Increasing font size randomly"
    ],
    section: "Section A"
  },
  { 
    id: 3, 
    question: "What is the main purpose of a wireframe?",
    type: 'mcq',
    options: [
      "Final UI design",
      "Backend structure",
      "Layout and structure planning before design",
      "Adding animations"
    ],
    section: "Section A"
  },
  { 
    id: 4, 
    question: "A button is not getting clicks. What is the MOST likely UX issue?",
    type: 'mcq',
    options: [
      "Code error",
      "Low contrast or poor visibility",
      "Database issue",
      "Server problem"
    ],
    section: "Section A"
  },
  { 
    id: 5, 
    question: "Which of the following is a UX problem (not UI)?",
    type: 'mcq',
    options: [
      "Poor color combination",
      "Misaligned elements",
      "Confusing navigation flow",
      "Small font size"
    ],
    section: "Section A"
  },
  // Section B - Visual Analysis (Image Based)
  {
    id: 6,
    question: "Look at the image provided. Comparing the two navigation styles, which improvement most impacts the 'Good UX' side?",
    type: 'mcq',
    image: "/assets/exams/ui_ux_navigation_comparison_1775983776360.png",
    options: [
        "The use of icons only",
        "Higher density of links",
        "Clear labels, better hierarchy, and thumb-friendly spacing",
        "Darker background colors"
    ],
    section: "Section B"
  },
  {
    id: 7,
    question: "Observe the landing page comparison. What is the primary reason the right side converts better?",
    type: 'mcq',
    image: "/assets/exams/ui_ux_visual_hierarchy_landing_page_1775983792981.png",
    options: [
        "It uses more gradients",
        "Strong visual hierarchy with a clear headline and 'Start Free' CTA button",
        "It has more text content",
        "The logo is positioned differently"
    ],
    section: "Section B"
  },
  {
    id: 8,
    question: "Accessibility Check: Study the color contrast comparison. Why is 'Low Accessibility' a danger for UI?",
    type: 'mcq',
    image: "/assets/exams/ui_ux_color_contrast_comparison_1775983812279.png",
    options: [
        "It makes the app look old",
        "It increases the build size",
        "It excludes users with visual impairments or those in bright environments",
        "It uses too much dark navy"
    ],
    section: "Section B"
  },
  {
    id: 9,
    question: "Form Design: Looking at the comparison, what is the most significant improvement in the 'Premium Experience'?",
    type: 'mcq',
    image: "/assets/exams/ui_ux_form_design_best_practices_1775983828295.png",
    options: [
        "It uses multiple columns",
        "Inline validation, single-column layout, and clear logical grouping",
        "Adding more input fields",
        "The 'Clear' and 'Help' buttons"
    ],
    section: "Section B"
  },
  // Section C - Advanced Principles
  {
    id: 10,
    question: "What does the 'Fitts's Law' primarily relate to in UI design?",
    type: 'mcq',
    options: [
        "The color wheel",
        "Size and distance of target elements for easier interaction",
        "Font pairing rules",
        "Server response times"
    ],
    section: "Section C"
  },
  {
    id: 11,
    question: "In Responsive Design, what is a 'Breakpoint'?",
    type: 'mcq',
    options: [
        "A bug in the code",
        "A specific screen width where the layout changes",
        "The time when the server stops responding",
        "A design error"
    ],
    section: "Section C"
  },
  {
    id: 12,
    question: "Which of these is a key benefit of a 'Design System'?",
    type: 'mcq',
    options: [
        "It makes the file size smaller",
        "Consistency across teams and products",
        "It replaces the need for developers",
        "It only helps with colors"
    ],
    section: "Section C"
  },
  {
    id: 13,
    question: "What is 'Affordance' in UI design?",
    type: 'mcq',
    options: [
        "How much the software costs",
        "Visual cues that suggest how an element should be used",
        "The contrast ratio of text",
        "The speed of an animation"
    ],
    section: "Section C"
  },
  {
    id: 14,
    question: "In the UX process, what is 'Personas' used for?",
    type: 'mcq',
    options: [
        "Creating fake profiles for testing",
        "Representing different user types within your targeted audience",
        "Creating custom fonts",
        "Designing profile pictures"
    ],
    section: "Section C"
  },
  {
    id: 15,
    question: "Which principle states that 'Users spend most of their time on other sites'?",
    type: 'mcq',
    options: [
        "Jacob's Law",
        "Miller's Law",
        "Hick's Law",
        "The 80/20 Rule"
    ],
    section: "Section C"
  },
  // Section D - Theory (Manual Grading)
  {
    id: 16,
    question: "Explain the 'Double Diamond' design process and its four phases. (5 Marks)",
    type: 'theory',
    section: "Section D"
  },
  {
    id: 17,
    question: "What is Information Architecture (IA), and why is it critical for complex enterprise applications? (5 Marks)",
    type: 'theory',
    section: "Section D"
  }
];

export const CORRECT_ANSWERS = {
  1: 1, // B
  2: 2, // C
  3: 2, // C
  4: 1, // B
  5: 2, // C
  6: 2, // C
  7: 1, // B
  8: 2, // C
  9: 1, // B
  10: 1, // B
  11: 1, // B
  12: 1, // B
  13: 1, // B
  14: 1, // B
  15: 0  // A
};
