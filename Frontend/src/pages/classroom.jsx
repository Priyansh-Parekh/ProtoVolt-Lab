import React, { useEffect } from 'react'
import { FaRegSadTear } from "react-icons/fa";

//importing utils
import api from '../utils/axios';

//components
import ClassroomJoinPopup from '../components/classroom/ClassroomJoinPopup.jsx'
import Classroom_header from '../components/classroom/classroomHeader.jsx'
import Classroom_card from '../components/classroom/classroomCard.jsx'

//seeds
// import {classroomSeed} from '../seeds/data'

//usefull fun
import { useState } from 'react'
import { error } from '../utils/toastify.js';

const Classroom = ({user}) => {

    const [classrooms, setClassrooms] = useState([]);
    const [joinPopup, setJoinPopup] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get('/user/data/getClassrooms');
                if (res.data.success) {
                    setClassrooms(res.data.classrooms);
                } else {
                    error(res.data.message);
                }
            } catch (err) {
                console.error("API error:", err);
            }
        }

        fetchData();
    }, []);



    // console.log(classrooms)

    return (
        <>
            <div className='h-max min-h-screen bg-[var(--color-primary)] z-[-1] '>
                <Classroom_header setJoinPopup={setJoinPopup} user={user} />
                {joinPopup && <ClassroomJoinPopup setJoinPopup={setJoinPopup} />}
                <div className="w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {classrooms.length === 0 &&
                        <section className="flex flex-col items-center justify-center min-h-[60vh] bg-[var(--color-primary)] text-[var(--color-text-bright)] animate-fadeIn rounded-2xl shadow-[var(--shadow-soft)] p-8 m-6">
                            {/* Icon */}
                            <div className="text-[var(--color-accent-cyan)] text-7xl animate-float mb-4">
                                <FaRegSadTear />
                            </div>

                            {/* Text */}
                            <h2 className="text-2xl md:text-3xl font-bold mb-2 text-center">
                                You’re not enrolled in any classroom yet
                            </h2>
                            <p className="text-[var(--color-text-light)] text-center max-w-md mb-6">
                                It looks like you haven’t joined any classes. Once you enroll, your classrooms will appear here.
                            </p>
                        </section>
                    }
                    {classrooms.length !== 0 && classrooms.map((course, index) => (
                        <Classroom_card key={index} classroom={course} />
                    ))}
                </div>

            </div>

        </>
    )
}

export default Classroom