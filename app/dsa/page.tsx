"use client";

import { useRef } from "react";
import Navbar from "../components/home/Navbar";
import SubNavbar from "../components/home/SubNavbar";
import Footer from "../components/home/Footer";
import CTA from "../components/home/CTA";
import { ArrowRight, ExternalLink, Timer, Globe, Star, ShieldCheck, Clock, Search } from "lucide-react";

const companyPrepQuestions = [
    // Beginner Level (1-20)
    { id: 1, title: "Contains Duplicate", category: "Arrays", difficulty: "Easy", url: "https://leetcode.com/problems/contains-duplicate/" },
    { id: 2, title: "Valid Anagram", category: "Arrays", difficulty: "Easy", url: "https://leetcode.com/problems/valid-anagram/" },
    { id: 3, title: "Valid Palindrome", category: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/valid-palindrome/" },
    { id: 4, title: "Best Time to Buy And Sell Stock", category: "Sliding Window", difficulty: "Easy", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/" },
    { id: 5, title: "Valid Parentheses", category: "Stack", difficulty: "Easy", url: "https://leetcode.com/problems/valid-parentheses/" },
    { id: 6, title: "Binary Search", category: "Binary Search", difficulty: "Easy", url: "https://leetcode.com/problems/binary-search/" },
    { id: 7, title: "Reverse Linked List", category: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-linked-list/" },
    { id: 8, title: "Invert Binary Tree", category: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/invert-binary-tree/" },
    { id: 9, title: "Same Tree", category: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/same-tree/" },
    { id: 10, title: "Climbing Stairs", category: "1-D DP", difficulty: "Easy", url: "https://leetcode.com/problems/climbing-stairs/" },
    { id: 11, title: "Plus One", category: "Math", difficulty: "Easy", url: "https://leetcode.com/problems/plus-one/" },
    { id: 12, title: "Two Sum", category: "Arrays", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum/" },
    { id: 13, title: "Two Sum II Input Array Is Sorted", category: "Two Pointers", difficulty: "Easy", url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
    { id: 14, title: "Min Stack", category: "Stack", difficulty: "Easy", url: "https://leetcode.com/problems/min-stack/" },
    { id: 15, title: "Merge Two Sorted Lists", category: "Linked List", difficulty: "Easy", url: "https://leetcode.com/problems/merge-two-sorted-lists/" },
    { id: 16, title: "Maximum Depth of Binary Tree", category: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/maximum-depth-of-binary-tree/" },
    { id: 17, title: "Kth Largest Element in a Stream", category: "Priority Queue", difficulty: "Easy", url: "https://leetcode.com/problems/kth-largest-element-in-a-stream/" },
    { id: 18, title: "Subsets", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets/" },
    { id: 19, title: "Min Cost Climbing Stairs", category: "1-D DP", difficulty: "Easy", url: "https://leetcode.com/problems/min-cost-climbing-stairs/" },
    { id: 20, title: "Happy Number", category: "Math", difficulty: "Easy", url: "https://leetcode.com/problems/happy-number/" },
    
    // Intermediate Level (39-106)
    { id: 39, title: "Group Anagrams", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/group-anagrams/" },
    { id: 40, title: "Longest Substring Without Repeating Characters", category: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
    { id: 41, title: "Evaluate Reverse Polish Notation", category: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/evaluate-reverse-polish-notation/" },
    { id: 42, title: "Koko Eating Bananas", category: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/koko-eating-bananas/" },
    { id: 43, title: "Reorder List", category: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/reorder-list/" },
    { id: 44, title: "Subtree of Another Tree", category: "Trees", difficulty: "Easy", url: "https://leetcode.com/problems/subtree-of-another-tree/" },
    { id: 45, title: "K Closest Points to Origin", category: "Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/k-closest-points-to-origin/" },
    { id: 46, title: "Combination Sum", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum/" },
    { id: 47, title: "Permutations", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/permutations/" },
    { id: 48, title: "Letter Combinations of a Phone Number", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/letter-combinations-of-a-phone-number/" },
    { id: 49, title: "Number of Islands", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/number-of-islands/" },
    { id: 50, title: "Walls And Gates", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/walls-and-gates/" },
    { id: 51, title: "Rotting Oranges", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/rotting-oranges/" },
    { id: 52, title: "Longest Palindromic Substring", category: "1-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/longest-palindromic-substring/" },
    { id: 53, title: "Longest Common Subsequence", category: "2-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/longest-common-subsequence/" },
    { id: 54, title: "Gas Station", category: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/gas-station/" },
    { id: 55, title: "Merge Intervals", category: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/merge-intervals/" },
    { id: 56, title: "Spiral Matrix", category: "Math", difficulty: "Medium", url: "https://leetcode.com/problems/spiral-matrix/" },
    { id: 57, title: "Reverse Bits", category: "Bit Manipulation", difficulty: "Easy", url: "https://leetcode.com/problems/reverse-bits/" },
    { id: 58, title: "Reverse Integer", category: "Bit Manipulation", difficulty: "Medium", url: "https://leetcode.com/problems/reverse-integer/" },
    { id: 59, title: "Top K Frequent Elements", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/top-k-frequent-elements/" },
    { id: 60, title: "Generate Parentheses", category: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/generate-parentheses/" },
    { id: 61, title: "Find Minimum in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
    { id: 62, title: "Remove Nth Node From End of List", category: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/" },
    { id: 63, title: "Lowest Common Ancestor of a Binary Search Tree", category: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
    { id: 64, title: "Kth Largest Element in an Array", category: "Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
    { id: 65, title: "Combination Sum II", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/combination-sum-ii/" },
    { id: 66, title: "Subsets II", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/subsets-ii/" },
    { id: 67, title: "Surrounded Regions", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/surrounded-regions/" },
    { id: 68, title: "Palindromic Substrings", category: "1-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/palindromic-substrings/" },
    { id: 69, title: "Best Time to Buy and Sell Stock With Cooldown", category: "2-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/" },
    
    // Advanced Level (74-106)
    { id: 74, title: "Encode and Decode Strings", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/encode-and-decode-strings/" },
    { id: 75, title: "3Sum", category: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/3sum/" },
    { id: 76, title: "Longest Repeating Character Replacement", category: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/longest-repeating-character-replacement/" },
    { id: 77, title: "Daily Temperatures", category: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/daily-temperatures/" },
    { id: 78, title: "Search in Rotated Sorted Array", category: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
    { id: 79, title: "Copy List With Random Pointer", category: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/copy-list-with-random-pointer/" },
    { id: 80, title: "Binary Tree Level Order Traversal", category: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
    { id: 81, title: "Task Scheduler", category: "Priority Queue", difficulty: "Medium", url: "https://leetcode.com/problems/task-scheduler/" },
    { id: 82, title: "Word Search", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/word-search/" },
    { id: 83, title: "Implement Trie (Prefix Tree)", category: "Tries", difficulty: "Medium", url: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
    { id: 84, title: "Clone Graph", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/clone-graph/" },
    { id: 85, title: "Decode Ways", category: "1-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/decode-ways/" },
    { id: 86, title: "Coin Change II", category: "2-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change-ii/" },
    { id: 87, title: "Hand of Straights", category: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/hand-of-straights/" },
    { id: 88, title: "Non Overlapping Intervals", category: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/non-overlapping-intervals/" },
    { id: 89, title: "Meeting Rooms II", category: "Intervals", difficulty: "Medium", url: "https://leetcode.com/problems/meeting-rooms-ii/" },
    { id: 90, title: "Product of Array Except Self", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/product-of-array-except-self/" },
    { id: 91, title: "Container With Most Water", category: "Two Pointers", difficulty: "Medium", url: "https://leetcode.com/problems/container-with-most-water/" },
    { id: 92, title: "Permutation in String", category: "Sliding Window", difficulty: "Medium", url: "https://leetcode.com/problems/permutation-in-string/" },
    { id: 93, title: "Add Two Numbers", category: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/add-two-numbers/" },
    { id: 94, title: "Binary Tree Right Side View", category: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/binary-tree-right-side-view/" },
    { id: 95, title: "Palindrome Partitioning", category: "Backtracking", difficulty: "Medium", url: "https://leetcode.com/problems/palindrome-partitioning/" },
    { id: 96, title: "Pacific Atlantic Water Flow", category: "Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/pacific-atlantic-water-flow/" },
    { id: 97, title: "Coin Change", category: "1-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/coin-change/" },
    { id: 98, title: "Target Sum", category: "2-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/target-sum/" },
    { id: 99, title: "Merge Triplets to Form Target Triplet", category: "Greedy", difficulty: "Medium", url: "https://leetcode.com/problems/merge-triplets-to-form-target-triplet/" },
    { id: 100, title: "Multiply Strings", category: "Math", difficulty: "Medium", url: "https://leetcode.com/problems/multiply-strings/" },
    { id: 101, title: "Valid Sudoku", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/valid-sudoku/" },
    { id: 102, title: "Minimum Window Substring", category: "Sliding Window", difficulty: "Hard", url: "https://leetcode.com/problems/minimum-window-substring/" },
    { id: 103, title: "Car Fleet", category: "Stack", difficulty: "Medium", url: "https://leetcode.com/problems/car-fleet/" },
    { id: 104, title: "Time Based Key Value Store", category: "Binary Search", difficulty: "Medium", url: "https://leetcode.com/problems/time-based-key-value-store/" },
    { id: 105, title: "Find The Duplicate Number", category: "Linked List", difficulty: "Medium", url: "https://leetcode.com/problems/find-the-duplicate-number/" },
    { id: 106, title: "Count Good Nodes in Binary Tree", category: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/count-good-nodes-in-binary-tree/" },
    
    // Expert Level (128-150)
    { id: 128, title: "Longest Consecutive Sequence", category: "Arrays", difficulty: "Medium", url: "https://leetcode.com/problems/longest-consecutive-sequence/" },
    { id: 129, title: "Trapping Rain Water", category: "Two Pointers", difficulty: "Hard", url: "https://leetcode.com/problems/trapping-rain-water/" },
    { id: 130, title: "Largest Rectangle In Histogram", category: "Stack", difficulty: "Hard", url: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
    { id: 131, title: "Median of Two Sorted Arrays", category: "Binary Search", difficulty: "Hard", url: "https://leetcode.com/problems/median-of-two-sorted-arrays/" },
    { id: 132, title: "Merge K Sorted Lists", category: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/merge-k-sorted-lists/" },
    { id: 133, title: "Construct Binary Tree From Preorder And Inorder Traversal", category: "Trees", difficulty: "Medium", url: "https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/" },
    { id: 134, title: "Find Median From Data Stream", category: "Priority Queue", difficulty: "Hard", url: "https://leetcode.com/problems/find-median-from-data-stream/" },
    { id: 135, title: "N Queens", category: "Backtracking", difficulty: "Hard", url: "https://leetcode.com/problems/n-queens/" },
    { id: 136, title: "Word Search II", category: "Tries", difficulty: "Hard", url: "https://leetcode.com/problems/word-search-ii/" },
    { id: 137, title: "Word Ladder", category: "Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/word-ladder/" },
    { id: 138, title: "Reconstruct Itinerary", category: "Advanced Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/reconstruct-itinerary/" },
    { id: 139, title: "Partition Equal Subset Sum", category: "1-D DP", difficulty: "Medium", url: "https://leetcode.com/problems/partition-equal-subset-sum/" },
    { id: 140, title: "Distinct Subsequences", category: "2-D DP", difficulty: "Hard", url: "https://leetcode.com/problems/distinct-subsequences/" },
    { id: 141, title: "Edit Distance", category: "2-D DP", difficulty: "Hard", url: "https://leetcode.com/problems/edit-distance/" },
    { id: 142, title: "Reverse Nodes In K Group", category: "Linked List", difficulty: "Hard", url: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    { id: 143, title: "Binary Tree Maximum Path Sum", category: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
    { id: 144, title: "Min Cost to Connect All Points", category: "Advanced Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/min-cost-to-connect-all-points/" },
    { id: 145, title: "Cheapest Flights Within K Stops", category: "Advanced Graphs", difficulty: "Medium", url: "https://leetcode.com/problems/cheapest-flights-within-k-stops/" },
    { id: 146, title: "Burst Balloons", category: "2-D DP", difficulty: "Hard", url: "https://leetcode.com/problems/burst-balloons/" },
    { id: 147, title: "Serialize And Deserialize Binary Tree", category: "Trees", difficulty: "Hard", url: "https://leetcode.com/problems/serialize-and-deserialize-binary-tree/" },
    { id: 148, title: "Swim In Rising Water", category: "Advanced Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/swim-in-rising-water/" },
    { id: 149, title: "Alien Dictionary", category: "Advanced Graphs", difficulty: "Hard", url: "https://leetcode.com/problems/alien-dictionary/" },
    { id: 150, title: "Regular Expression Matching", category: "2-D DP", difficulty: "Hard", url: "https://leetcode.com/problems/regular-expression-matching/" }
];

const faangQuestions = {
    "Array & Matrix": [
      "Two Sum", "Best Time to Buy and Sell Stock", "Maximum Subarray (Kadanes Algorithm)", "Merge Intervals", "Product of Array Except Self",
      "Find Duplicate Number", "Set Matrix Zeroes", "Rotate Image (90 Matrix Rotation)", "Spiral Matrix", "Longest Consecutive Sequence",
      "Subarray Sum Equals K", "Merge Sorted Arrays", "Minimum Number of Swaps to Sort", "Sliding Window Maximum", "Matrix Search (Search in 2D matrix)"
    ],
    "String": [
      "Longest Substring Without Repeating Characters", "Valid Anagram", "Group Anagrams", "Longest Palindromic Substring", "Palindrome Partitioning",
      "String to Integer (Atoi)", "Implement strStr()", "Decode Ways", "Roman to Integer", "Multiply Strings"
    ],
    "Linked List": [
      "Reverse a Linked List", "Detect Cycle in Linked List", "Merge Two Sorted Lists", "Remove N-th Node from End", "Intersection of Two Linked Lists",
      "Add Two Numbers (as Linked Lists)", "Copy List with Random Pointer", "Reverse Nodes in K-Group", "Rotate Linked List", "Sort a Linked List"
    ],
    "Stack & Queue": [
      "Valid Parentheses", "Min Stack", "Evaluate Reverse Polish Notation", "Largest Rectangle in Histogram", "Daily Temperatures",
      "Sliding Window Maximum", "Implement Queue using Stacks", "Implement Stack using Queues", "Next Greater Element", "Remove K Digits"
    ],
    "Trees & Graphs": [
      "Binary Tree Level Order Traversal", "Validate Binary Search Tree", "Lowest Common Ancestor", "Invert Binary Tree", "Serialize and Deserialize Binary Tree",
      "Construct Binary Tree from Traversals", "Diameter of Binary Tree", "Path Sum", "Word Ladder", "Number of Islands", "Clone Graph",
      "Course Schedule (Topological Sort)", "Binary Tree Zigzag Level Order", "Symmetric Tree", "Maximum Depth of Binary Tree"
    ],
    "Heap / Priority Queue": [
      "Merge K Sorted Lists", "Find Median from Data Stream", "Top K Frequent Elements", "Kth Largest Element in Array", "Sliding Window Median"
    ],
    "Backtracking": [
      "Subsets", "Permutations", "Word Search", "Sudoku Solver", "N-Queens", "Combination Sum", "Palindrome Partitioning",
      "Letter Combinations of a Phone Number", "Generate Parentheses", "Rat in a Maze"
    ],
    "Greedy & Interval Problems": [
      "Jump Game", "Gas Station", "Insert Interval", "Non-overlapping Intervals", "Minimum Number of Arrows to Burst Balloons"
    ],
    "Dynamic Programming": [
      "Climbing Stairs", "Coin Change", "Longest Increasing Subsequence", "House Robber", "House Robber II", "Longest Common Subsequence",
      "Edit Distance", "Decode Ways", "Word Break", "Maximum Product Subarray", "Unique Paths", "Target Sum", "Partition Equal Subset Sum",
      "Palindromic Substrings", "Rod Cutting Problem"
    ],
    "Bit Manipulation, Math & Others": [
      "Single Number", "Counting Bits", "Reverse Bits", "Power of Two", "Majority Element"
    ]
};

const studyPlan = [
    { week: "Week 1-2", focus: "Arrays, Strings, and Basic Patterns", hours: "2-3 hours/day" },
    { week: "Week 3-4", focus: "Linked Lists and Stacks/Queues", hours: "2-3 hours/day" },
    { week: "Week 5-6", focus: "Trees and Basic Graph Algorithms", hours: "3-4 hours/day" },
    { week: "Week 7-8", focus: "Advanced Data Structures", hours: "3-4 hours/day" },
    { week: "Week 9-10", focus: "Dynamic Programming", hours: "4-5 hours/day" },
    { week: "Week 11-12", focus: "Advanced Algorithms & System Design", hours: "4-5 hours/day" }
];

const platforms = [
    { name: "LeetCode", description: "Most popular coding interview preparation platform", problems: "3000+", url: "https://leetcode.com", rating: 4.8 },
    { name: "HackerRank", description: "Comprehensive programming challenges and tutorials", problems: "2500+", url: "https://hackerrank.com", rating: 4.6 },
    { name: "GeeksforGeeks", description: "Detailed explanations and implementations", problems: "5000+", url: "https://geeksforgeeks.org", rating: 4.7 },
    { name: "CodeChef", description: "Competitive programming practice problems", problems: "4000+", url: "https://codechef.com", rating: 4.5 }
];

export default function DSAPage() {
  const levels = [
    { title: "Beginner", range: [1, 20], color: "text-emerald-500" },
    { title: "Intermediate", range: [39, 69], color: "text-blue-500" },
    { title: "Advanced", range: [74, 106], color: "text-violet-500" },
    { title: "Expert", range: [128, 150], color: "text-rose-500" }
  ];

  const refs = {
    companyPrep: useRef<HTMLDivElement>(null),
    faang: useRef<HTMLDivElement>(null),
    studyPlan: useRef<HTMLDivElement>(null),
    platforms: useRef<HTMLDivElement>(null),
  };

  const handleNav = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      <Navbar />
      <SubNavbar />
      
      <main>
        {/* Condensed Shortcut Bar */}
        <div className="sticky top-[64px] z-40 bg-zinc-900 border-b border-white/5 py-3 hidden md:block">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="flex items-center gap-6">
                    {[
                        { name: "Internship Prep", ref: refs.companyPrep },
                        { name: "FAANG Blueprint", ref: refs.faang },
                        { name: "12-Week Roadmap", ref: refs.studyPlan },
                        { name: "Practice Portals", ref: refs.platforms }
                    ].map((item) => (
                        <button 
                            key={item.name}
                            onClick={() => handleNav(item.ref)}
                            className="text-[10px] font-bold text-zinc-400 hover:text-white uppercase tracking-widest transition-colors"
                        >
                            {item.name}
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Condensed Hero Section */}
        <section className="bg-zinc-900 py-10 md:py-12 overflow-hidden relative border-b border-white/5">
          <div className="absolute top-0 right-0 w-[50%] h-full bg-emerald-600/5 blur-[100px] pointer-events-none" />
          <div className="mx-auto max-w-7xl px-6 lg:px-10 relative z-10">
            <div className="max-w-3xl space-y-2">
              <div className="inline-flex h-4 items-center px-1.5 border border-white/10 bg-white/5 text-emerald-400 text-[8px] font-bold uppercase tracking-widest leading-none">
                Engineering Track
              </div>
              <h1 className="text-3xl md:text-4xl font-normal tracking-tighter text-white leading-tight">
                Unified <span className="text-emerald-500">DSA</span> Blueprint.
              </h1>
              <p className="text-zinc-400 text-[14px] font-normal max-w-xl">
                 Master the technical stack required by the worlds leading engineering teams with our synchronized curriculum.
              </p>
            </div>
          </div>
        </section>

        {/* 1. Question Explorer - Internship Prep */}
        <section ref={refs.companyPrep} className="py-10 md:py-12 bg-white scroll-mt-24">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <div className="mb-8 flex items-center justify-between border-b border-zinc-50 pb-4">
                <div className="space-y-1">
                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest">Core Module 01</p>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase tracking-widest">Internship Prep Track</h2>
                </div>
                <div className="hidden sm:block text-[9px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 px-3 py-1.5 border border-zinc-100">
                    V2.1 Optimized
                </div>
            </div>
            
            {levels.map((level) => (
              <div key={level.title} className="mb-10">
                {/* Level Header */}
                <div className="flex items-center gap-4 mb-4">
                  <h3 className={`text-[12px] font-bold tracking-widest ${level.color} uppercase`}>
                    {level.title} Validations
                  </h3>
                  <div className="h-[1px] flex-1 bg-zinc-100" />
                  <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">
                    {companyPrepQuestions.filter(q => q.id >= level.range[0] && q.id <= level.range[1]).length} Modules
                  </span>
                </div>

                {/* Question Table - Simplified */}
                <div className="overflow-hidden border border-zinc-100">
                  <table className="w-full border-collapse">
                    <thead className="bg-zinc-50/50">
                      <tr className="border-b border-zinc-100">
                        <th className="text-left py-3 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">ID</th>
                        <th className="text-left py-3 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Title</th>
                        <th className="text-left py-3 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Category</th>
                        <th className="text-left py-3 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Tier</th>
                        <th className="text-right py-3 px-4 text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companyPrepQuestions
                        .filter(q => q.id >= level.range[0] && q.id <= level.range[1])
                        .map((q) => (
                        <tr key={q.id} className="group border-b border-zinc-50 hover:bg-zinc-50/50 transition-colors">
                          <td className="py-2.5 px-4 text-[11px] font-bold text-zinc-300">#{q.id}</td>
                          <td className="py-2.5 px-4 text-[13px] font-bold text-zinc-900 line-clamp-1">{q.title}</td>
                          <td className="py-2.5 px-4">
                            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">
                              {q.category}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className={`text-[9px] font-bold uppercase tracking-widest ${
                              q.difficulty === "Easy" ? "text-emerald-500" : 
                              q.difficulty === "Medium" ? "text-blue-500" : "text-rose-500"
                            }`}>
                              {q.difficulty}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-right">
                            <a 
                              href={q.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-[10px] font-bold text-zinc-900 hover:text-blue-600 transition-colors uppercase tracking-widest"
                            >
                              Explore <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. FAANG Masterlist */}
        <section ref={refs.faang} className="py-10 bg-zinc-50 border-y border-zinc-100 scroll-mt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mb-8">
                    <p className="text-violet-600 text-[10px] font-bold uppercase tracking-widest mb-1">Module 02</p>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase tracking-widest">FAANG Blueprint</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {Object.entries(faangQuestions).map(([category, questions]) => (
                        <div key={category} className="bg-white border border-zinc-200 p-5 rounded-none hover:border-violet-500 transition-colors duration-300">
                            <h3 className="text-[11px] font-bold text-zinc-900 uppercase tracking-widest border-b border-zinc-50 pb-3 mb-4 flex items-center justify-between">
                                {category}
                                <span className="text-zinc-400 font-medium text-[9px]">{questions.length} Modules</span>
                            </h3>
                            <ul className="space-y-2">
                                {questions.map((q, i) => (
                                    <li key={i} className="flex items-start gap-2 group">
                                        <div className="h-1 w-1 rounded-full bg-violet-400 mt-1.5 shrink-0" />
                                        <span className="text-[11px] text-zinc-500 group-hover:text-zinc-900 cursor-pointer transition-colors leading-tight">{q}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 3. Study Plan Timeline */}
        <section ref={refs.studyPlan} className="py-10 bg-white scroll-mt-24 border-b border-zinc-100">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mb-8">
                    <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Module 03</p>
                    <h2 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase tracking-widest text-center">12-Week Strategic Roadmap</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {studyPlan.map((plan, i) => (
                        <div key={i} className="group p-5 border border-zinc-100 hover:border-emerald-500 transition-all duration-300">
                            <div className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest mb-2">{plan.week}</div>
                            <h4 className="text-[14px] font-bold text-zinc-900 mb-4 leading-tight">{plan.focus}</h4>
                            <div className="flex items-center gap-2 text-zinc-400 font-mono text-[9px] font-bold uppercase">
                                <Clock size={10} />
                                <span>{plan.hours}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* 4. Practice Platforms Card Grid - Simplified High-Density */}
        <section ref={refs.platforms} className="py-10 bg-zinc-900 text-white scroll-mt-24">
            <div className="mx-auto max-w-7xl px-6 lg:px-10">
                <div className="mb-8 flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="space-y-1">
                        <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Internal Module 04</p>
                        <h2 className="text-2xl font-bold tracking-tight text-white uppercase tracking-widest">External practice portals</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {platforms.map((platform) => (
                        <a 
                            key={platform.name}
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-zinc-800/20 p-5 border border-white/5 hover:border-blue-500 transition-all group flex flex-col"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <Globe size={18} className="text-zinc-600 group-hover:text-blue-400 transition-colors" />
                                <div className="flex items-center gap-1 text-zinc-400">
                                    <Star size={10} className="text-orange-400 fill-orange-400" />
                                    <span className="text-[10px] font-bold">{platform.rating}</span>
                                </div>
                            </div>
                            <h3 className="text-[15px] font-bold text-white mb-1">{platform.name}</h3>
                            <p className="text-[11px] text-zinc-500 mb-6 flex-grow leading-relaxed">{platform.description}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                                <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{platform.problems} Validations</span>
                                <ExternalLink size={12} className="text-zinc-600 group-hover:text-white transition-colors" />
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </div>
  );
}
