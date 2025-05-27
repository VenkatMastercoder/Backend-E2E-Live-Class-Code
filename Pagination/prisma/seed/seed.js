const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const courseNames = [
  // Technology & Computer Science
  "Introduction to Programming",
  "Web Development Fundamentals",
  "Data Structures and Algorithms",
  "Database Management Systems",
  "Cloud Computing Essentials",
  "Artificial Intelligence Basics",
  "Machine Learning Fundamentals",
  "Cybersecurity Principles",
  "Mobile App Development",
  "Software Engineering Practices",
  
  // Business & Management
  "Business Administration",
  "Marketing Strategy",
  "Financial Management",
  "Project Management",
  "Entrepreneurship 101",
  "Human Resource Management",
  "Supply Chain Operations",
  "Business Ethics",
  "Strategic Management",
  "Digital Marketing",
  
  // Science & Mathematics
  "Calculus I",
  "Physics for Engineers",
  "Organic Chemistry",
  "Biology Fundamentals",
  "Statistics and Probability",
  "Environmental Science",
  "Astronomy Basics",
  "Linear Algebra",
  "Quantum Mechanics",
  "Biochemistry",
  
  // Arts & Humanities
  "World History",
  "Creative Writing",
  "Philosophy 101",
  "Art History",
  "Music Theory",
  "Literature Analysis",
  "Cultural Studies",
  "Film Studies",
  "Photography Basics",
  "Graphic Design",
  
  // Social Sciences
  "Introduction to Psychology",
  "Sociology Fundamentals",
  "Political Science",
  "Economics 101",
  "Anthropology Basics",
  "International Relations",
  "Public Policy",
  "Social Psychology",
  "Urban Planning",
  "Gender Studies",
  
  // Health & Medicine
  "Human Anatomy",
  "Public Health",
  "Nutrition Science",
  "Medical Ethics",
  "Healthcare Management",
  "Mental Health",
  "Physical Therapy Basics",
  "Pharmacology",
  "Nursing Fundamentals",
  "Emergency Medicine",
  
  // Languages
  "English Composition",
  "Spanish for Beginners",
  "Mandarin Chinese I",
  "French Language",
  "German Basics",
  "Japanese Culture & Language",
  "Italian for Travelers",
  "Arabic Language",
  "Russian Studies",
  "Latin Fundamentals",
  
  // Engineering
  "Mechanical Engineering Basics",
  "Electrical Circuit Theory",
  "Civil Engineering",
  "Chemical Engineering",
  "Robotics Engineering",
  "Aerospace Engineering",
  "Industrial Engineering",
  "Materials Science",
  "Control Systems",
  "Engineering Design",
  
  // Professional Skills
  "Public Speaking",
  "Leadership Development",
  "Critical Thinking",
  "Time Management",
  "Professional Writing",
  "Negotiation Skills",
  "Team Building",
  "Problem Solving",
  "Communication Skills",
  "Career Development",
  
  // Specialized Topics
  "Blockchain Technology",
  "Internet of Things",
  "Renewable Energy",
  "Game Development",
  "Data Analytics",
  "Digital Photography",
  "3D Modeling",
  "Virtual Reality",
  "Sustainable Design",
  "Social Media Marketing",
  
  // Additional Courses
  "Research Methods",
  "Technical Writing",
  "Quality Management",
  "Risk Assessment",
  "Innovation Management",
  "Digital Transformation",
  "Business Intelligence",
  "Network Security",
  "User Experience Design",
  "Agile Methodologies"
];

async function main() {
  console.log('Start seeding...');
  
  for (const courseName of courseNames) {
    const course = await prisma.course.create({
      data: {
        course_title: courseName,
      },
    });
    console.log(`Created course with id: ${course.course_id}`);
  }
  
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
