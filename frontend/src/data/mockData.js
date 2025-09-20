export const mockIssues = [
  {
    id: "101",
    title: "Pothole on Main Road",
    description: "Large pothole causing damage to vehicles near Oak Street intersection",
    status: "Pending",
    priority: "High",
    category: "Roads",
    date: "2024-03-15",
    location: "Main Road & Oak Street",
    lastUpdate: "2024-03-15",
    type: "image",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Pothole+Image",
    assignedTo: null,
    reportedBy: "John Doe"
  },
  {
    id: "102",
    title: "Broken Street Light",
    description: "Street light not working on Elm Street, creating safety hazard",
    status: "In Progress",
    priority: "Medium",
    category: "Lighting",
    date: "2024-03-14",
    location: "Elm Street, Block 5",
    lastUpdate: "2024-03-16",
    type: "image",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Street+Light",
    assignedTo: "Electrical Dept",
    reportedBy: "Sarah Wilson"
  },
  {
    id: "103",
    title: "Water Leak",
    description: "Major water leak causing flooding on residential street",
    status: "Resolved",
    priority: "High",
    category: "Water",
    date: "2024-03-13",
    location: "Pine Avenue",
    lastUpdate: "2024-03-17",
    type: "video",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Water+Leak+Video",
    assignedTo: "Water Dept",
    reportedBy: "Mike Johnson"
  },
  {
    id: "104",
    title: "Noise Complaint",
    description: "Excessive noise from construction site during night hours",
    status: "Pending",
    priority: "Low",
    category: "Noise",
    date: "2024-03-17",
    location: "Downtown Construction Site",
    lastUpdate: "2024-03-17",
    type: "audio",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Audio+Recording",
    assignedTo: null,
    reportedBy: "Lisa Brown"
  },
  {
    id: "105",
    title: "Garbage Collection Issue",
    description: "Garbage not collected for over a week in residential area",
    status: "In Progress",
    priority: "Medium",
    category: "Waste",
    date: "2024-03-16",
    location: "Maple Street Residential Area",
    lastUpdate: "2024-03-17",
    type: "image",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Garbage+Issue",
    assignedTo: "Waste Management",
    reportedBy: "Robert Davis"
  },
  {
    id: "106",
    title: "Damaged Sidewalk",
    description: "Cracked sidewalk posing tripping hazard for pedestrians",
    status: "Pending",
    priority: "Medium",
    category: "Roads",
    date: "2024-03-17",
    location: "Cherry Lane",
    lastUpdate: "2024-03-17",
    type: "image",
    source: "https://via.placeholder.com/400x300/3B82F6/FFFFFF?text=Sidewalk+Damage",
    assignedTo: null,
    reportedBy: "Emma Thompson"
  }
];

export const departments = [
  { 
    id: 1, 
    name: "Roads Department", 
    activeIssues: 15, 
    avgResponseTime: "2.5 days",
    totalResolved: 124,
    efficiency: 78
  },
  { 
    id: 2, 
    name: "Water Department", 
    activeIssues: 8, 
    avgResponseTime: "1.8 days",
    totalResolved: 89,
    efficiency: 85
  },
  { 
    id: 3, 
    name: "Electrical Department", 
    activeIssues: 12, 
    avgResponseTime: "3.2 days",
    totalResolved: 67,
    efficiency: 72
  },
  { 
    id: 4, 
    name: "Waste Management", 
    activeIssues: 6, 
    avgResponseTime: "1.5 days",
    totalResolved: 156,
    efficiency: 92
  }
];

export const categories = [
  "Roads",
  "Lighting", 
  "Water",
  "Waste",
  "Noise",
  "Parks",
  "Traffic",
  "Public Safety"
];

export const priorities = ["Low", "Medium", "High"];
export const statuses = ["Pending", "In Progress", "Resolved"];

export const monthlyData = [
  { month: 'Jan', issues: 45, resolved: 38 },
  { month: 'Feb', issues: 52, resolved: 44 },
  { month: 'Mar', issues: 48, resolved: 41 },
  { month: 'Apr', issues: 61, resolved: 55 },
  { month: 'May', issues: 55, resolved: 49 },
  { month: 'Jun', issues: 58, resolved: 52 }
];