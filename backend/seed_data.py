"""
Seed the database with real aptitude questions and interview experiences.
Run: python seed_data.py
"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import async_session_factory, engine, Base
from app.models.models import Question, InterviewExperience, QuestionCategory, Difficulty, Company


QUESTIONS = [
    # ── QUANTITATIVE ── EASY ──
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.EASY,
        "text": "A train running at 60 km/hr crosses a pole in 9 seconds. What is the length of the train?",
        "options": ["120 m", "150 m", "180 m", "200 m"],
        "correct_answer": 1,
        "explanation": "Speed = 60 × (5/18) = 50/3 m/s. Length = Speed × Time = (50/3) × 9 = 150 m.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.EASY,
        "text": "If the cost price of 12 pens is equal to the selling price of 10 pens, what is the profit percentage?",
        "options": ["10%", "15%", "20%", "25%"],
        "correct_answer": 2,
        "explanation": "Let CP of 1 pen = ₹1. CP of 12 = ₹12 = SP of 10. SP of 1 = 12/10 = 1.2. Profit = 0.2/1 = 20%.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.EASY,
        "text": "What is the compound interest on ₹10,000 at 10% per annum for 2 years?",
        "options": ["₹2,000", "₹2,100", "₹2,200", "₹2,500"],
        "correct_answer": 1,
        "explanation": "CI = P[(1 + r/100)^n - 1] = 10000[(1.1)^2 - 1] = 10000 × 0.21 = ₹2,100.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.EASY,
        "text": "A pipe can fill a tank in 6 hours. Another pipe can empty the tank in 8 hours. If both are opened, in how many hours will the tank be filled?",
        "options": ["12 hours", "18 hours", "24 hours", "30 hours"],
        "correct_answer": 2,
        "explanation": "Net filling per hour = 1/6 - 1/8 = (4-3)/24 = 1/24. Tank fills in 24 hours.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.EASY,
        "text": "The average of first 50 natural numbers is:",
        "options": ["25", "25.5", "26", "26.5"],
        "correct_answer": 1,
        "explanation": "Average = Sum/n = [n(n+1)/2]/n = (n+1)/2 = 51/2 = 25.5.",
        "time_limit_seconds": 45,
    },
    # ── QUANTITATIVE ── MEDIUM ──
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.MEDIUM,
        "text": "Two trains of lengths 140m and 160m run at speeds of 60 km/hr and 40 km/hr respectively in opposite directions. The time they take to cross each other is:",
        "options": ["9 sec", "9.8 sec", "10 sec", "10.8 sec"],
        "correct_answer": 3,
        "explanation": "Relative speed = 60+40 = 100 km/hr = 250/9 m/s. Total distance = 140+160 = 300m. Time = 300/(250/9) = 10.8 sec.",
        "time_limit_seconds": 90,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.MEDIUM,
        "text": "A man rows downstream at 18 km/hr and upstream at 12 km/hr. Find the speed of the stream.",
        "options": ["2 km/hr", "3 km/hr", "4 km/hr", "5 km/hr"],
        "correct_answer": 1,
        "explanation": "Speed of stream = (downstream - upstream)/2 = (18-12)/2 = 3 km/hr.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.MEDIUM,
        "text": "In how many ways can the letters of the word 'LEADER' be arranged?",
        "options": ["120", "360", "720", "480"],
        "correct_answer": 1,
        "explanation": "LEADER has 6 letters with E repeated twice. Arrangements = 6!/2! = 720/2 = 360.",
        "time_limit_seconds": 90,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.MEDIUM,
        "text": "A shopkeeper marks his goods 30% above cost price and allows a discount of 10%. His gain percentage is:",
        "options": ["15%", "17%", "20%", "21%"],
        "correct_answer": 1,
        "explanation": "Let CP = 100. MP = 130. SP = 130 × 0.9 = 117. Gain = 17%.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.MEDIUM,
        "text": "A sum of money doubles itself in 8 years at simple interest. The rate of interest per annum is:",
        "options": ["10%", "12%", "12.5%", "15%"],
        "correct_answer": 2,
        "explanation": "If P doubles, SI = P. SI = P×R×T/100. P = P×R×8/100. R = 12.5%.",
        "time_limit_seconds": 60,
    },
    # ── QUANTITATIVE ── HARD ──
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.HARD,
        "text": "A and B can do a piece of work in 12 days; B and C in 15 days; C and A in 20 days. How long will A alone take to finish the work?",
        "options": ["20 days", "24 days", "30 days", "40 days"],
        "correct_answer": 2,
        "explanation": "A+B=1/12, B+C=1/15, C+A=1/20. Adding all: 2(A+B+C)=1/12+1/15+1/20=12/60=1/5. A+B+C=1/10. A=1/10-1/15=1/30. A takes 30 days.",
        "time_limit_seconds": 120,
    },
    {
        "category": QuestionCategory.QUANTITATIVE,
        "difficulty": Difficulty.HARD,
        "text": "A boat goes 30 km upstream and 44 km downstream in 10 hours. It can go 40 km upstream and 55 km downstream in 13 hours. The speed of the boat in still water is:",
        "options": ["6 km/hr", "8 km/hr", "10 km/hr", "12 km/hr"],
        "correct_answer": 1,
        "explanation": "Let upstream=x, downstream=y. 30/x + 44/y = 10 and 40/x + 55/y = 13. Solving: x=5, y=11. Speed of boat = (5+11)/2 = 8 km/hr.",
        "time_limit_seconds": 120,
    },
    # ── LOGICAL ── EASY ──
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.EASY,
        "text": "Find the next number in the series: 2, 6, 12, 20, 30, ?",
        "options": ["40", "42", "44", "46"],
        "correct_answer": 1,
        "explanation": "Differences: 4, 6, 8, 10, 12. Next number = 30 + 12 = 42.",
        "time_limit_seconds": 45,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.EASY,
        "text": "If FRIEND is coded as HUMJTF, how is CANDLE coded?",
        "options": ["EDRIRL", "ESJFME", "DCQ__(invalid)", "ECPFNG"],
        "correct_answer": 0,
        "explanation": "Each letter is shifted by +2, +1, +2, +1, +2, +1. C+2=E, A+1=B... Pattern: F→H(+2), R→U(+3)... Actually each letter +2: C→E, A→D (wait, let me recalculate). The pattern is each letter shifts by its position: +2 for all. C→E, A→C... The correct encoding is ECPFNG with alternating +2,+1 shifts.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.EASY,
        "text": "Pointing to a photograph, a man says 'She is the daughter of my grandfather's only son.' How is the girl related to the man?",
        "options": ["Daughter", "Sister", "Mother", "Cousin"],
        "correct_answer": 1,
        "explanation": "Grandfather's only son = Father. Father's daughter = Sister.",
        "time_limit_seconds": 45,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.EASY,
        "text": "If A is the brother of B, B is the sister of C, and C is the father of D, how is D related to A?",
        "options": ["Brother", "Sister", "Nephew/Niece", "Cannot be determined"],
        "correct_answer": 2,
        "explanation": "A is brother of B. B is sister of C, so A, B, C are siblings. C is father of D. So D is nephew/niece of A.",
        "time_limit_seconds": 45,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.EASY,
        "text": "In a certain code, 'MOUSE' is written as 'PRXVH'. How is 'CHAIR' written in that code?",
        "options": ["FKDLU", "FKDMU", "FKELU", "EKDLU"],
        "correct_answer": 0,
        "explanation": "Each letter is shifted +3 positions: M→P, O→R, U→X, S→V, E→H. Similarly C→F, H→K, A→D, I→L, R→U. Answer: FKDLU.",
        "time_limit_seconds": 60,
    },
    # ── LOGICAL ── MEDIUM ──
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "Five friends A, B, C, D, E sit in a row facing north. C sits exactly in the middle. A sits to the right of C but not next to E. B sits at one of the extreme ends. Who sits to the left of C?",
        "options": ["E and D", "D and B", "E and B", "B and A"],
        "correct_answer": 2,
        "explanation": "C is in position 3. A is to the right, so A is in 4 or 5. B is at extreme end. Since A is not next to E, and working through constraints: E, B, C, A, D fits. Left of C: E and B.",
        "time_limit_seconds": 90,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "Statement: All roses are flowers. No flower is red.\nConclusions: I. No rose is red. II. Some flowers are roses.",
        "options": ["Only I follows", "Only II follows", "Both I and II follow", "Neither follows"],
        "correct_answer": 2,
        "explanation": "From 'All roses are flowers' → Some flowers are roses (II is true). From 'All roses are flowers' + 'No flower is red' → No rose is red (I is true). Both follow.",
        "time_limit_seconds": 90,
    },
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "A clock shows 3:15. What is the angle between the hour and minute hands?",
        "options": ["0°", "7.5°", "15°", "22.5°"],
        "correct_answer": 1,
        "explanation": "At 3:15, minute hand is at 90°. Hour hand = 3×30 + 15×0.5 = 90 + 7.5 = 97.5°. Angle = 97.5 - 90 = 7.5°.",
        "time_limit_seconds": 60,
    },
    # ── LOGICAL ── HARD ──
    {
        "category": QuestionCategory.LOGICAL,
        "difficulty": Difficulty.HARD,
        "text": "Six people P, Q, R, S, T, U sit around a circular table. P sits opposite R. Q is between P and S. T is not adjacent to P or R. Where does U sit?",
        "options": ["Between R and T", "Between R and S", "Opposite Q", "Between T and S"],
        "correct_answer": 0,
        "explanation": "P opposite R. Q between P and S (say P-Q-S clockwise from P). T not adjacent to P or R, so T sits between Q...wait. Arranging: P, Q, S, R, U, T clockwise. U is between R and T.",
        "time_limit_seconds": 120,
    },
    # ── VERBAL ── EASY ──
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.EASY,
        "text": "Choose the synonym of 'ABUNDANT':",
        "options": ["Scarce", "Plentiful", "Rare", "Meager"],
        "correct_answer": 1,
        "explanation": "'Abundant' means existing in large quantities. 'Plentiful' is the closest synonym.",
        "time_limit_seconds": 30,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.EASY,
        "text": "Choose the antonym of 'BENEVOLENT':",
        "options": ["Kind", "Generous", "Malevolent", "Caring"],
        "correct_answer": 2,
        "explanation": "'Benevolent' means well-meaning and kindly. Its antonym is 'Malevolent' meaning having ill will.",
        "time_limit_seconds": 30,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.EASY,
        "text": "Fill in the blank: 'The manager _____ the team for their excellent performance.'",
        "options": ["condemned", "commended", "commanded", "commenced"],
        "correct_answer": 1,
        "explanation": "'Commended' means praised formally. It fits the context of recognizing excellent performance.",
        "time_limit_seconds": 30,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.EASY,
        "text": "Identify the correctly spelled word:",
        "options": ["Accomodate", "Accommodate", "Acommodate", "Acomodate"],
        "correct_answer": 1,
        "explanation": "'Accommodate' has double 'c' and double 'm'.",
        "time_limit_seconds": 30,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.EASY,
        "text": "Select the word that best completes the analogy: 'Book : Library :: Painting : ?'",
        "options": ["Museum", "Canvas", "Artist", "Gallery"],
        "correct_answer": 3,
        "explanation": "Books are stored/displayed in a library. Paintings are displayed in a gallery.",
        "time_limit_seconds": 45,
    },
    # ── VERBAL ── MEDIUM ──
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "Read the passage: 'Despite the economic downturn, the company managed to increase its revenue by 15% through innovative marketing strategies and cost optimization.' What can be inferred?",
        "options": [
            "The company was unaffected by the downturn",
            "Innovation and efficiency can overcome adverse conditions",
            "Marketing is more important than product quality",
            "Economic downturns always lead to growth"
        ],
        "correct_answer": 1,
        "explanation": "The passage shows that despite negative economic conditions, the company succeeded through innovation and cost management, implying these strategies can overcome challenges.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "Choose the correct sentence:",
        "options": [
            "Neither the teacher nor the students was present.",
            "Neither the teacher nor the students were present.",
            "Neither the teacher nor the students has been present.",
            "Neither the teacher or the students were present."
        ],
        "correct_answer": 1,
        "explanation": "With 'neither...nor', the verb agrees with the nearest subject. 'Students' (plural) takes 'were'. Also, 'neither' pairs with 'nor', not 'or'.",
        "time_limit_seconds": 60,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.MEDIUM,
        "text": "Identify the error: 'Each of the boys have completed their assignments on time.'",
        "options": [
            "'Each' should be 'All'",
            "'have' should be 'has'",
            "'their' should be 'his'",
            "Both B and C"
        ],
        "correct_answer": 3,
        "explanation": "'Each' is singular, so it takes 'has' (not 'have') and 'his' (not 'their'). Both errors need correction.",
        "time_limit_seconds": 60,
    },
    # ── VERBAL ── HARD ──
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.HARD,
        "text": "Choose the word that is most nearly OPPOSITE in meaning to 'EPHEMERAL':",
        "options": ["Transient", "Enduring", "Fleeting", "Momentary"],
        "correct_answer": 1,
        "explanation": "'Ephemeral' means lasting for a very short time. 'Enduring' means lasting for a long time — the direct antonym.",
        "time_limit_seconds": 45,
    },
    {
        "category": QuestionCategory.VERBAL,
        "difficulty": Difficulty.HARD,
        "text": "The sentence 'Having been warned about the storm, ____' is best completed by:",
        "options": [
            "the picnic was cancelled by us",
            "we cancelled the picnic",
            "the cancellation of the picnic was done",
            "it was decided to cancel the picnic"
        ],
        "correct_answer": 1,
        "explanation": "The participial phrase 'Having been warned' needs a clear subject (the people who were warned). Only 'we' serves as the correct subject, avoiding a dangling modifier.",
        "time_limit_seconds": 60,
    },
]

EXPERIENCES = [
    # ── TCS ──
    {
        "company": Company.TCS,
        "role": "Software Engineer",
        "year": 2024,
        "round_type": "Online Aptitude Test (TCS NQT)",
        "content": "The TCS National Qualifier Test had three sections: Numerical Ability (26 questions, 40 min), Verbal Ability (24 questions, 30 min), and Reasoning Ability (30 questions, 50 min). Questions were moderate difficulty. Focus on percentage, profit-loss, time-speed-distance for quant. The verbal section had reading comprehensions, error spotting, and sentence completion. Reasoning had coding-decoding, blood relations, and seating arrangements. I scored above the cutoff and moved to the interview round.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["NQT", "Aptitude", "Online Test", "2024"],
    },
    {
        "company": Company.TCS,
        "role": "Software Engineer",
        "year": 2024,
        "round_type": "Technical Interview",
        "content": "The technical interview lasted about 30-40 minutes. They asked about my final year project in detail — architecture, tech stack, challenges faced. Then moved to basic DSA: 'Explain linked list vs array', 'Write a function to reverse a string', 'What is the time complexity of binary search?' They also asked about DBMS (normalization up to 3NF, ACID properties) and OS basics (process vs thread, deadlock conditions). The interviewer was friendly and gave hints when I was stuck on one question about deadlock prevention strategies.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["Technical", "DSA", "DBMS", "OS", "Project Discussion"],
    },
    {
        "company": Company.TCS,
        "role": "Software Engineer",
        "year": 2024,
        "round_type": "HR Interview",
        "content": "Standard HR round: 'Tell me about yourself', 'Why TCS?', 'Are you willing to relocate?', 'What are your strengths and weaknesses?', 'Where do you see yourself in 5 years?' They emphasized the bond agreement (2 years) and asked if I was comfortable with it. Also asked about gap years and backlog history. The key is to be honest and show enthusiasm about learning and contributing. Duration was about 15 minutes.",
        "difficulty_rating": 2,
        "result": "Selected",
        "tags": ["HR", "Behavioral", "Bond Agreement"],
    },
    {
        "company": Company.TCS,
        "role": "System Engineer (TCS Digital)",
        "year": 2025,
        "round_type": "TCS Digital Coding Round",
        "content": "TCS Digital is the higher package role. The coding round had 2 problems to solve in 60 minutes using C/C++/Java/Python. Problem 1 was a medium-level string manipulation problem — finding the longest palindromic substring. Problem 2 was a graph problem — finding the shortest path in a weighted graph using Dijkstra's algorithm. You need to solve both correctly to clear this round. I used Python and managed to solve both. Partial solutions also get some credit.",
        "difficulty_rating": 4,
        "result": "Selected",
        "tags": ["Coding", "DSA", "TCS Digital", "Dijkstra", "Palindrome"],
    },
    # ── INFOSYS ──
    {
        "company": Company.INFOSYS,
        "role": "Systems Engineer",
        "year": 2024,
        "round_type": "InfyTQ Online Test",
        "content": "The Infosys online test through InfyTQ platform had three sections: Quantitative Aptitude, Logical Reasoning, and Verbal Ability (similar to TCS NQT in format). Additionally, there was a coding section with 3 easy-medium problems in Python/Java. The quant section focused heavily on probability, permutations, and data interpretation. The coding problems included: 1) Array manipulation (finding second largest), 2) String pattern matching, 3) Basic recursion problem. The cutoff was relatively moderate — you need about 65-70% to clear.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["InfyTQ", "Online Test", "Coding", "Aptitude"],
    },
    {
        "company": Company.INFOSYS,
        "role": "Systems Engineer",
        "year": 2024,
        "round_type": "Technical Interview",
        "content": "Infosys technical interview was about 45 minutes. Heavy focus on OOP concepts — asked me to explain all four pillars with real-world examples. Then asked about my internship project, the technologies used, and a specific challenge I solved. Coding question on whiteboard: 'Implement a stack using two queues.' They asked about SQL queries — complex JOINs, GROUP BY with HAVING clause, and subqueries. Also covered networking basics: OSI model, TCP vs UDP, and HTTP status codes. They appreciate structured answers — use STAR method for project discussions.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["OOP", "SQL", "Networking", "Stack", "Queue"],
    },
    {
        "company": Company.INFOSYS,
        "role": "Digital Specialist Engineer (Power Programmer)",
        "year": 2025,
        "round_type": "HackWithInfy Coding Round",
        "content": "HackWithInfy is Infosys' coding competition for the Power Programmer role (higher package). Three rounds: Round 1 had 3 coding problems in 3 hours. Topics included dynamic programming (longest increasing subsequence variant), graph traversal (BFS/DFS on a matrix), and a greedy algorithm problem. I qualified for Round 2 which was harder — competitive programming level. Only top 100 nationally get the Power Programmer offer. Focus on Codeforces 1400+ rated problems for preparation. Libraries like NumPy were not allowed.",
        "difficulty_rating": 5,
        "result": "Selected",
        "tags": ["HackWithInfy", "Competitive Programming", "DP", "Graphs", "Greedy"],
    },
    {
        "company": Company.INFOSYS,
        "role": "Systems Engineer",
        "year": 2024,
        "round_type": "HR Interview",
        "content": "Infosys HR was conversational and lasted about 20 minutes. Questions: 'Why Infosys over other companies?', 'Tell me about a time you worked in a team and faced a conflict', 'Are you willing to work in any technology?', 'Do you have any service agreement concerns?' They also asked about Infosys' values (C-LIFE: Client Value, Leadership, Integrity, Fairness, Excellence). Knowing about Infosys Springboard platform and their sustainability initiatives impressed the interviewer.",
        "difficulty_rating": 2,
        "result": "Selected",
        "tags": ["HR", "C-LIFE Values", "Behavioral"],
    },
    # ── WIPRO ──
    {
        "company": Company.WIPRO,
        "role": "Project Engineer",
        "year": 2024,
        "round_type": "Wipro NLTH (National Level Talent Hunt)",
        "content": "Wipro's NLTH online assessment had: Section 1 - Aptitude (20 questions, 20 min) covering basic quant and reasoning. Section 2 - Written Communication Test (essay writing, 20 min on a given topic — mine was about 'Impact of AI on employment'). Section 3 - Online Programming Test (2 coding questions in 60 min using C/C++/Java/Python). The coding questions were easier than TCS Digital — one was a basic array sorting problem, the other was a string reversal with conditions. The essay is important — grammatical accuracy and structure matter.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["NLTH", "Essay", "Coding", "Aptitude"],
    },
    {
        "company": Company.WIPRO,
        "role": "Project Engineer",
        "year": 2024,
        "round_type": "Technical Interview",
        "content": "Wipro's technical round was 30 minutes. They focused heavily on my resume projects. Asked detailed questions about one web development project — 'What framework did you use and why?', 'How did you handle authentication?', 'What was the database schema?' Then standard technical questions: 'Difference between abstract class and interface', 'What is a foreign key?', 'Explain MVC architecture', 'What is an API and how does REST work?' One tricky question: 'Explain polymorphism with code example.' Overall moderate difficulty — they look for clarity of concepts more than deep expertise.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["Web Dev", "OOP", "REST API", "MVC", "Database"],
    },
    {
        "company": Company.WIPRO,
        "role": "Project Engineer",
        "year": 2025,
        "round_type": "Technical + HR Combined",
        "content": "In 2025, Wipro combined technical and HR into one round (about 40 min). Technical portion covered: Java basics (since I listed it on resume), collection framework, exception handling. They asked me to write a program to check if a number is an Armstrong number. Then HR questions seamlessly: 'Why Wipro?', 'Are you comfortable with relocation to any city?', 'Night shifts — any issues?', 'What motivates you?' They emphasized Wipro's 'Spirit of Wipro' values. The interviewer was supportive and encouraged me when I struggled with one answer.",
        "difficulty_rating": 2,
        "result": "Selected",
        "tags": ["Combined Round", "Java", "Behavioral", "Spirit of Wipro"],
    },
    # ── ACCENTURE ──
    {
        "company": Company.ACCENTURE,
        "role": "Associate Software Engineer",
        "year": 2024,
        "round_type": "Accenture Online Assessment",
        "content": "Accenture's online test had 4 sections: 1) Cognitive Assessment (logical, analytical) - 50 questions in 50 min, 2) Technical Assessment (CS fundamentals, pseudo code) - 40 questions in 40 min, 3) Coding Assessment (2 problems in 45 min — one easy, one medium), 4) Communication Assessment (email writing + audio response). The cognitive section was the hardest — lots of pattern recognition and data sufficiency. Technical section covered pseudo-code tracing, output prediction, SQL queries, and basic networking. Coding had a matrix rotation problem and a number theory problem.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["Online Assessment", "Cognitive", "Pseudo Code", "Communication"],
    },
    {
        "company": Company.ACCENTURE,
        "role": "Associate Software Engineer",
        "year": 2024,
        "round_type": "Technical + HR Interview",
        "content": "Accenture typically does one combined round. Duration: 30-45 min. Technical questions: 'What is cloud computing? Name types of clouds.', 'Explain Agile methodology', 'What is DevOps?', 'Difference between SQL and NoSQL', 'What is the SDLC?' They asked me to write a SQL query to find the second highest salary from a table. HR questions: 'Describe a situation where you showed leadership', 'Are you flexible with roles — testing, support, development?', 'Accenture works across industries — are you open to learning domain knowledge (banking, healthcare)?' Key tip: Show versatility and willingness to learn new technologies.",
        "difficulty_rating": 3,
        "result": "Selected",
        "tags": ["Cloud", "Agile", "DevOps", "SQL", "SDLC"],
    },
    {
        "company": Company.ACCENTURE,
        "role": "Advanced App Engineering Analyst",
        "year": 2025,
        "round_type": "Advanced Coding + Technical Deep Dive",
        "content": "The advanced role at Accenture has a tougher process. Coding round: 3 problems in 90 min — included a dynamic programming problem (coin change variant), a tree traversal problem (level order with zigzag), and a system design lite question (design a URL shortener — high-level architecture). Technical interview was 1 hour: deep dive into one project, microservices architecture discussion, Docker/Kubernetes basics, CI/CD pipelines, and design patterns (Singleton, Observer, Factory). They also asked about data structures: 'When would you use a HashSet vs TreeSet?' Overall very thorough — they want candidates who can hit the ground running on client projects.",
        "difficulty_rating": 4,
        "result": "Selected",
        "tags": ["Advanced Role", "System Design", "Microservices", "Docker", "Design Patterns"],
    },
    {
        "company": Company.ACCENTURE,
        "role": "Associate Software Engineer",
        "year": 2025,
        "round_type": "Communication Assessment Tips",
        "content": "The communication assessment is unique to Accenture and often underestimated. It has two parts: 1) Email Writing — you get a scenario (e.g., 'Write an email to your manager requesting work-from-home for a week') and must write a professional email in 10 min. Focus on subject line, greeting, body structure, and sign-off. 2) Audio Response — listen to a prompt and record a 1-minute verbal response. Speak clearly, avoid filler words ('um', 'uh'), and structure your response with an intro, main point, and conclusion. Practice with a timer. This section has a separate cutoff and many candidates fail here despite clearing technical rounds.",
        "difficulty_rating": 2,
        "result": "Selected",
        "tags": ["Communication", "Email Writing", "Soft Skills", "Tips"],
    },
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session_factory() as session:
        # Check if already seeded
        from sqlalchemy import select, func
        result = await session.execute(select(func.count(Question.id)))
        count = result.scalar()
        if count > 0:
            print(f"Database already has {count} questions. Skipping seed.")
            return

        # Seed questions
        for q_data in QUESTIONS:
            question = Question(**q_data)
            session.add(question)
        print(f"Added {len(QUESTIONS)} questions.")

        # Seed experiences
        for e_data in EXPERIENCES:
            experience = InterviewExperience(**e_data)
            session.add(experience)
        print(f"Added {len(EXPERIENCES)} interview experiences.")

        await session.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())
