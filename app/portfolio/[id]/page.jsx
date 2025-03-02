'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import SinglePortfolio from './components/SinglePortfolio';

const portfolioItems = [
  {
    id: 1,
    title: 'Web Design Project',
    category: 'Web Development',
    image: 'http://192.168.118.3:3001/portfolio1.jpg',
    description: 'Modern web design project for a tech startup',
    client: 'Tech Innovators Inc.',
    duration: '3 months',
    technologies: ['React', 'Next.js', 'Tailwind CSS', 'Node.js'],
    challenge: 'Creating a responsive and modern web application that showcases the client\'s innovative technology solutions while maintaining optimal performance.',
    solution: 'Implemented a component-based architecture using React and Next.js, utilized Tailwind CSS for responsive design, and optimized performance through lazy loading and code splitting.',
    gallery: [
      'http://192.168.118.3:3001/portfolio1.jpg',
      'http://192.168.118.3:3001/portfolio1-2.jpg',
      'http://192.168.118.3:3001/portfolio1-3.jpg',
    ],
  },
  {
    id: 2,
    title: 'Mobile App UI',
    category: 'UI/UX Design',
    image: 'http://192.168.118.3:3001/portfolio2.jpg',
    description: 'User interface design for a fitness tracking app',
    client: 'FitTech Solutions',
    duration: '2 months',
    technologies: ['Figma', 'Adobe XD', 'Sketch', 'Protopie'],
    challenge: 'Designing an intuitive and engaging user interface for a fitness tracking app that appeals to both beginners and advanced users.',
    solution: 'Created a clean and modern design system with clear visual hierarchy, implemented gamification elements, and designed an intuitive onboarding process.',
    gallery: [
      'http://192.168.118.3:3001/portfolio2.jpg',
      'http://192.168.118.3:3001/portfolio2-2.jpg',
      'http://192.168.118.3:3001/portfolio2-3.jpg',
    ],
  },
  {
    id: 3,
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: 'http://192.168.118.3:3001/portfolio3.jpg',
    description: 'Full-stack e-commerce solution with modern features',
    client: 'Global Retail Co.',
    duration: '4 months',
    technologies: ['Next.js', 'MongoDB', 'Stripe', 'AWS'],
    challenge: 'Building a scalable e-commerce platform that can handle high traffic and provide a seamless shopping experience.',
    solution: 'Developed a full-stack solution using Next.js for the frontend and MongoDB for the database, integrated Stripe for payments, and deployed on AWS for scalability.',
    gallery: [
      'http://192.168.118.3:3001/portfolio3.jpg',
      'http://192.168.118.3:3001/portfolio3-2.jpg',
      'http://192.168.118.3:3001/portfolio3-3.jpg',
    ],
  },
];

export default function PortfolioDetail() {
  const params = useParams();

  return (
    <SinglePortfolio id={params.id} />
  );
} 