import React from 'react'
import Classroom_header from '../components/classroom/classroom_header'
import Classroom_controlbar from '../components/classroom/Classroom_controlbar'
import Classroom_card from '../components/classroom/classroom_card'


// data/mockCourses.js

export const courses = [
    {
        id: 'nextjs-mastery-2025',
        title: 'Next.js 15: The Full Stack',
        description: 'Master server components, actions, and advanced routing in the latest version of Next.js.',
        imageUrl: 'https://images.unsplash.com/photo-1632187974189-96191b3a5347?w=800&q=80',
        progress: 65,
    },
    {
        id: 'python-for-ai-2025',
        title: 'Python for AI & ML',
        description: 'Unlock the power of PyTorch and Scikit-learn to build and train your own neural networks.',
        imageUrl: 'https://images.unsplash.com/photo-1555949963-ff98c872d8e1?w=800&q=80',
        progress: 30,
    },
    {
        id: 'docker-kubernetes-devops',
        title: 'Docker & Kubernetes: The Essentials',
        description: 'Containerize your applications and orchestrate them at scale. A must-have skill for modern DevOps.',
        imageUrl: 'https://images.unsplash.com/photo-1605744574977-195d7e6a41f1?w=800&q=80',
        progress: 100,
    },
    {
        id: 'ui-ux-for-devs',
        title: 'UI/UX Principles for Developers',
        description: 'Learn the fundamentals of design, typography, and layout to build applications that users love.',
        imageUrl: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?w=800&q=80',
        progress: 15,
    },
    {
        id: 'arduino-iot-projects',
        title: 'Arduino: From Zero to IoT Hero',
        description: 'Build your own smart devices. This course covers everything from basic circuits to cloud integration.',
        imageUrl: 'https://images.unsplash.com/photo-1575224300303-a065e917d833?w=800&q=80',
        progress: 0,
    },
    {
        id: 'advanced-sql-masterclass',
        title: 'Advanced SQL Masterclass',
        description: 'Go beyond basic queries. Master window functions, CTEs, and database optimization techniques.',
        imageUrl: 'https://images.unsplash.com/photo-1593349348639-5c1280989502?w=800&q=80',
        progress: 90,
    },
    {
        id: 'web-sockets-realtime-apps',
        title: 'Real-Time Apps with WebSockets',
        description: 'Build interactive, real-time applications like chat apps and live dashboards from scratch.',
        imageUrl: 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=800&q=80',
        progress: 45,
    }
];


const Classroom = () => {
    return (
        <>
            <div className='h-max bg-[#030712] z-[-1] '>
                <Classroom_header />
                <Classroom_controlbar />
                <div className="w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {courses.map((course, index) => (
                        <Classroom_card key={index} course={course} />
                    ))}
                </div>

            </div>

        </>
    )
}

export default Classroom