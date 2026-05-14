export interface NeedItem {
  id: string;
  name: string;
  cost: number;
  sponsored: boolean;
}

export interface SchoolNeed {
  id: string;
  schoolName: string;
  location: string;
  district: string;
  state: string;
  needTitle: string;
  description: string;
  urgency: "critical" | "high" | "medium" | "low";
  goalAmount: number;
  raisedAmount: number;
  category: string;
  sponsors: number;
  daysLeft: number;
  headmaster: string;
  students: number;
  featured: boolean;
  items: NeedItem[];
}

export interface FeedPost {
  id: string;
  type: "donation" | "milestone" | "announcement" | "success";
  userName: string;
  userRole: string;
  school: string;
  content: string;
  amount?: number;
  timestamp: string;
  likes: number;
  liked: boolean;
  initials: string;
  avatarColor: string;
}

export interface ImpactStory {
  id: string;
  schoolName: string;
  location: string;
  projectTitle: string;
  description: string;
  completedDate: string;
  fundsRaised: number;
  supporters: number;
  students: number;
}

export interface Notification {
  id: string;
  type: "milestone" | "new_campaign" | "thank_you" | "update" | "celebration";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  school?: string;
  amount?: number;
}

export const SCHOOL_NEEDS: SchoolNeed[] = [
  {
    id: "1",
    schoolName: "Govt. Primary School Rampur",
    location: "Rampur, Rajasthan",
    district: "Alwar",
    state: "Rajasthan",
    needTitle: "Toilet Block Reconstruction",
    description:
      "The only toilet facility for 240 students collapsed during last monsoon. Girls have been absent from school since. This is an urgent sanitation crisis affecting attendance and dignity of students.",
    urgency: "critical",
    goalAmount: 280000,
    raisedAmount: 196000,
    category: "Sanitation",
    sponsors: 47,
    daysLeft: 12,
    headmaster: "Ram Prakash Sharma",
    students: 240,
    featured: true,
    items: [
      { id: "i1", name: "Bricks & Cement", cost: 80000, sponsored: true },
      { id: "i2", name: "Plumbing & Fixtures", cost: 60000, sponsored: true },
      { id: "i3", name: "Labour Charges", cost: 90000, sponsored: false },
      { id: "i4", name: "Tiles & Flooring", cost: 30000, sponsored: false },
      { id: "i5", name: "Electrical Fittings", cost: 20000, sponsored: false },
    ],
  },
  {
    id: "2",
    schoolName: "Zilla Parishad School Wadgaon",
    location: "Wadgaon, Maharashtra",
    district: "Pune",
    state: "Maharashtra",
    needTitle: "Computer Lab Setup",
    description:
      "350 students have never touched a computer. In today's digital world, they're being left behind. Setting up a basic computer lab will open doors to digital literacy and future opportunities.",
    urgency: "high",
    goalAmount: 450000,
    raisedAmount: 189000,
    category: "Technology",
    sponsors: 32,
    daysLeft: 28,
    headmaster: "Sunanda Kulkarni",
    students: 350,
    featured: false,
    items: [
      { id: "i1", name: "Computers (15 units)", cost: 300000, sponsored: false },
      { id: "i2", name: "Networking & Internet", cost: 60000, sponsored: true },
      { id: "i3", name: "Furniture", cost: 50000, sponsored: false },
      { id: "i4", name: "UPS & Power Backup", cost: 40000, sponsored: false },
    ],
  },
  {
    id: "3",
    schoolName: "Sarvodaya Middle School Tikri",
    location: "Tikri, Madhya Pradesh",
    district: "Sehore",
    state: "Madhya Pradesh",
    needTitle: "Classroom Roof Repair",
    description:
      "3 classrooms are without roofs after cyclone damage. 180 students study under makeshift tarpaulin in extreme heat and heavy monsoon rains. This is both a health and learning emergency.",
    urgency: "critical",
    goalAmount: 320000,
    raisedAmount: 280000,
    category: "Infrastructure",
    sponsors: 89,
    daysLeft: 5,
    headmaster: "Prakash Tiwari",
    students: 180,
    featured: false,
    items: [
      { id: "i1", name: "RCC Roofing Material", cost: 200000, sponsored: true },
      { id: "i2", name: "Steel Framework", cost: 80000, sponsored: true },
      { id: "i3", name: "Labour & Installation", cost: 40000, sponsored: false },
    ],
  },
  {
    id: "4",
    schoolName: "Kendriya Vidyalaya Sunderpur",
    location: "Sunderpur, Bihar",
    district: "Muzaffarpur",
    state: "Bihar",
    needTitle: "Library & Reading Room",
    description:
      "420 curious minds, zero books to read. The school has no library. Students walk 4km to borrow books from the panchayat office. A vibrant library will ignite a love for reading that lasts a lifetime.",
    urgency: "medium",
    goalAmount: 150000,
    raisedAmount: 67500,
    category: "Library",
    sponsors: 21,
    daysLeft: 45,
    headmaster: "Meera Devi",
    students: 420,
    featured: false,
    items: [
      { id: "i1", name: "Bookshelves (20 units)", cost: 40000, sponsored: false },
      { id: "i2", name: "Books (2000 titles)", cost: 80000, sponsored: false },
      { id: "i3", name: "Reading Tables & Chairs", cost: 30000, sponsored: true },
    ],
  },
  {
    id: "5",
    schoolName: "Govt. High School Kaveri Nagar",
    location: "Kaveri Nagar, Karnataka",
    district: "Mysuru",
    state: "Karnataka",
    needTitle: "Science Lab Equipment",
    description:
      "Students preparing for competitive exams have never conducted a lab experiment. Practical education is key to breaking poverty cycles. Help equip the lab for 280 aspiring scientists.",
    urgency: "high",
    goalAmount: 200000,
    raisedAmount: 44000,
    category: "Technology",
    sponsors: 14,
    daysLeft: 60,
    headmaster: "Dr. Rajesh Gowda",
    students: 280,
    featured: false,
    items: [
      { id: "i1", name: "Chemistry Equipment Set", cost: 80000, sponsored: false },
      { id: "i2", name: "Physics Lab Kit", cost: 70000, sponsored: false },
      { id: "i3", name: "Biology Specimens", cost: 30000, sponsored: false },
      { id: "i4", name: "Storage Cabinets", cost: 20000, sponsored: true },
    ],
  },
];

export const FEED_POSTS: FeedPost[] = [
  {
    id: "f1",
    type: "milestone",
    userName: "Shaale-Vikas",
    userRole: "Platform",
    school: "Govt. Primary School Rampur",
    content:
      "Milestone reached! 70% of the toilet block fund has been raised. Just ₹84,000 more needed. The headmaster and students are overwhelmed with gratitude.",
    timestamp: "2m ago",
    likes: 214,
    liked: false,
    initials: "SV",
    avatarColor: "#0A7C5C",
  },
  {
    id: "f2",
    type: "donation",
    userName: "Priya Malhotra",
    userRole: "Alumni '08, IIT Bombay",
    school: "Zilla Parishad School Wadgaon",
    content:
      "Just sponsored 2 computers for my old school. I studied in that same classroom 16 years ago. Pay it forward — every child deserves the tools to dream bigger.",
    amount: 40000,
    timestamp: "18m ago",
    likes: 89,
    liked: true,
    initials: "PM",
    avatarColor: "#7C3AED",
  },
  {
    id: "f3",
    type: "success",
    userName: "Headmaster Tiwari",
    userRole: "Sarvodaya Middle School",
    school: "Sarvodaya Middle School Tikri",
    content:
      "We did it. The roof is complete! Students walked in today to dry classrooms for the first time in 8 months. 180 smiling faces. I cannot express our gratitude in words.",
    timestamp: "2h ago",
    likes: 567,
    liked: false,
    initials: "PT",
    avatarColor: "#DC2626",
  },
  {
    id: "f4",
    type: "donation",
    userName: "Arjun Reddy",
    userRole: "Alumni '12, BITS Pilani",
    school: "Govt. Primary School Rampur",
    content:
      "Donated to the toilet block campaign. Sanitation = education. When girls don't have safe facilities, they drop out. Let's fix this together.",
    amount: 10000,
    timestamp: "3h ago",
    likes: 43,
    liked: false,
    initials: "AR",
    avatarColor: "#2563EB",
  },
  {
    id: "f5",
    type: "announcement",
    userName: "District Collector",
    userRole: "Govt. of Rajasthan",
    school: "Govt. Primary School Rampur",
    content:
      "The District Administration has agreed to match all donations for the Rampur school toilet block campaign up to ₹50,000. This is the power of community driving government action.",
    timestamp: "5h ago",
    likes: 312,
    liked: true,
    initials: "DC",
    avatarColor: "#F59E0B",
  },
  {
    id: "f6",
    type: "donation",
    userName: "Neha Gupta",
    userRole: "Donor, Bangalore",
    school: "Kendriya Vidyalaya Sunderpur",
    content:
      "Books are the greatest gift you can give a child. Sponsored 200 books for the library campaign. Reading transformed my life — I hope it does the same for these students.",
    amount: 8000,
    timestamp: "1d ago",
    likes: 156,
    liked: false,
    initials: "NG",
    avatarColor: "#059669",
  },
];

export const IMPACT_STORIES: ImpactStory[] = [
  {
    id: "s1",
    schoolName: "Govt. Primary School Rampur",
    location: "Rampur, Rajasthan",
    projectTitle: "New Classroom Block",
    description:
      "Three new classrooms were built from scratch, replacing broken-down mud walls. Student enrollment jumped 40% in the following year.",
    completedDate: "March 2024",
    fundsRaised: 520000,
    supporters: 143,
    students: 240,
  },
  {
    id: "s2",
    schoolName: "Zilla Parishad School Wadgaon",
    location: "Wadgaon, Maharashtra",
    projectTitle: "Clean Drinking Water",
    description:
      "Installed a RO purification system and water storage tanks. Children no longer fall sick from contaminated water. School attendance improved by 28%.",
    completedDate: "January 2024",
    fundsRaised: 180000,
    supporters: 67,
    students: 350,
  },
  {
    id: "s3",
    schoolName: "Sarvodaya Middle School Tikri",
    location: "Tikri, Madhya Pradesh",
    projectTitle: "Roof Reconstruction",
    description:
      "All three roofless classrooms now have sturdy concrete roofs. Students returned after 8 months of outdoor learning under tarpaulin sheets.",
    completedDate: "December 2023",
    fundsRaised: 320000,
    supporters: 89,
    students: 180,
  },
  {
    id: "s4",
    schoolName: "Kendriya Vidyalaya Sunderpur",
    location: "Sunderpur, Bihar",
    projectTitle: "Mid-day Meal Kitchen",
    description:
      "A hygienic kitchen and dining area was set up. School dropout rate halved as children now come for the nutritious daily meal along with quality education.",
    completedDate: "October 2023",
    fundsRaised: 245000,
    supporters: 78,
    students: 420,
  },
];

export const NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "celebration",
    title: "Goal Reached!",
    message: "Sarvodaya Middle School Tikri's roof reconstruction campaign is 100% funded!",
    timestamp: "Just now",
    read: false,
    school: "Sarvodaya Middle School Tikri",
    amount: 320000,
  },
  {
    id: "n2",
    type: "milestone",
    title: "70% Milestone",
    message: "Rampur toilet block campaign just hit 70%. ₹84,000 more to go!",
    timestamp: "2h ago",
    read: false,
    school: "Govt. Primary School Rampur",
  },
  {
    id: "n3",
    type: "thank_you",
    title: "Thank you from Headmaster Sharma",
    message: '"Your support means the world to our 240 students. God bless you." — Ram Prakash Sharma',
    timestamp: "5h ago",
    read: false,
    school: "Govt. Primary School Rampur",
  },
  {
    id: "n4",
    type: "new_campaign",
    title: "Urgent Need Added",
    message: "Govt. High School Kaveri Nagar needs science lab equipment for 280 students.",
    timestamp: "1d ago",
    read: true,
    school: "Govt. High School Kaveri Nagar",
  },
  {
    id: "n5",
    type: "update",
    title: "Impact Update",
    message: "Your ₹5,000 donation helped raise the roof at Sarvodaya Middle School. See the impact gallery.",
    timestamp: "2d ago",
    read: true,
  },
  {
    id: "n6",
    type: "milestone",
    title: "50 Supporters!",
    message: "Rampur school campaign now has 50 community supporters. You're part of something special.",
    timestamp: "3d ago",
    read: true,
  },
];

export const ANALYTICS = {
  totalFunds: 3480000,
  projectsCompleted: 28,
  activeSupporters: 1247,
  schoolsSupported: 14,
  studentsImpacted: 5840,
  monthlyData: [
    { month: "Oct", amount: 240000 },
    { month: "Nov", amount: 380000 },
    { month: "Dec", amount: 520000 },
    { month: "Jan", amount: 410000 },
    { month: "Feb", amount: 680000 },
    { month: "Mar", amount: 750000 },
    { month: "Apr", amount: 500000 },
  ],
  categoryData: [
    { label: "Infrastructure", value: 45, color: "#0A7C5C" },
    { label: "Sanitation", value: 22, color: "#F59E0B" },
    { label: "Technology", value: 18, color: "#3B82F6" },
    { label: "Library", value: 10, color: "#8B5CF6" },
    { label: "Other", value: 5, color: "#EC4899" },
  ],
};
