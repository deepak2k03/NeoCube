// client/src/data/fieldsData.js
import React from 'react';
import { 
  Code2, HeartPulse, Sprout, Landmark, 
  HardHat, Zap, ShieldAlert, Truck, Globe 
} from 'lucide-react';

export const FIELDS = [
  {
    id: 'cs',
    name: 'Computer Science',
    description: 'Software Engineering, Cloud Architecture, and AI Systems.',
    icon: <Code2 className="w-8 h-8" />,
    color: 'from-blue-500 to-indigo-600',
    accent: 'text-blue-400',
    categories: ['Frontend', 'Backend', 'DevOps', 'AI/ML', 'Web3'],
    // Mock Techs for CS
    techs: [
      { _id: '1', name: 'React.js', slug: 'reactjs', category: 'Frontend', difficulty: 'Intermediate', icon: <Code2 className="w-full h-full"/>, isTrending: true, shortDescription: 'The library for web and native user interfaces.' },
      { _id: '2', name: 'Node.js', slug: 'nodejs', category: 'Backend', difficulty: 'Intermediate', icon: <Globe className="w-full h-full"/>, isTrending: true, shortDescription: 'JavaScript runtime built on Chrome V8 engine.' },
    ]
  },
  {
    id: 'medtech',
    name: 'Healthcare (MedTech)',
    description: 'Robotics, Telemedicine, and AI Diagnostics.',
    icon: <HeartPulse className="w-8 h-8" />,
    color: 'from-rose-500 to-pink-600',
    accent: 'text-rose-400',
    categories: ['Diagnostics', 'Robotics', 'Patient Data', 'Wearables'],
    techs: [
      { _id: 'm1', name: 'Da Vinci Systems', slug: 'davinci', category: 'Robotics', difficulty: 'Advanced', icon: <HeartPulse className="w-full h-full"/>, isTrending: true, shortDescription: 'Robotic-assisted surgical systems.' },
      { _id: 'm2', name: 'AI Radiology', slug: 'ai-radiology', category: 'Diagnostics', difficulty: 'Intermediate', icon: <Zap className="w-full h-full"/>, isTrending: false, shortDescription: 'Computer vision for X-ray analysis.' },
    ]
  },
  {
    id: 'agritech',
    name: 'Agriculture (AgriTech)',
    description: 'Precision farming, IoT Sensors, and Drone Analytics.',
    icon: <Sprout className="w-8 h-8" />,
    color: 'from-emerald-500 to-green-600',
    accent: 'text-emerald-400',
    categories: ['Precision Farming', 'Supply Chain', 'Biotech'],
    techs: [
      { _id: 'a1', name: 'IoT Soil Sensors', slug: 'soil-sensors', category: 'Precision Farming', difficulty: 'Beginner', icon: <Sprout className="w-full h-full"/>, isTrending: true, shortDescription: 'Real-time moisture and nutrient tracking.' },
    ]
  },
  {
    id: 'fintech',
    name: 'Finance (FinTech)',
    description: 'Blockchain, Algo-Trading, and Secure Payments.',
    icon: <Landmark className="w-8 h-8" />,
    color: 'from-amber-500 to-yellow-600',
    accent: 'text-amber-400',
    categories: ['Blockchain', 'Payments', 'Security'],
    techs: []
  },
  {
    id: 'contech',
    name: 'Construction (ConTech)',
    description: 'BIM, 3D Printing, and Smart Materials.',
    icon: <HardHat className="w-8 h-8" />,
    color: 'from-orange-500 to-red-600',
    accent: 'text-orange-400',
    categories: ['Design', 'Materials', 'Safety'],
    techs: []
  },
  {
    id: 'cleantech',
    name: 'Energy (CleanTech)',
    description: 'Smart Grids, Renewables, and Battery Tech.',
    icon: <Zap className="w-8 h-8" />,
    color: 'from-cyan-500 to-blue-600',
    accent: 'text-cyan-400',
    categories: ['Renewables', 'Grid', 'Storage'],
    techs: []
  },
  {
    id: 'defense',
    name: 'Defense & Security',
    description: 'Cyberwarfare, Drones, and Surveillance.',
    icon: <ShieldAlert className="w-8 h-8" />,
    color: 'from-slate-500 to-gray-600',
    accent: 'text-slate-400',
    categories: ['Cyber', 'Hardware', 'Intel'],
    techs: []
  },
  {
    id: 'logistics',
    name: 'Logistics & Auto',
    description: 'Autonomous Vehicles and Smart Supply Chain.',
    icon: <Truck className="w-8 h-8" />,
    color: 'from-violet-500 to-purple-600',
    accent: 'text-violet-400',
    categories: ['Fleet', 'Autonomous', 'Tracking'],
    techs: []
  },
];