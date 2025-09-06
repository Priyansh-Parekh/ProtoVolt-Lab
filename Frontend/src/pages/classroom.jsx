import React from 'react'
import Classroom_header from '../components/classroom/classroom_header'
import Classroom_controlbar from '../components/classroom/Classroom_controlbar'
import Classroom_card from '../components/classroom/classroom_card'
import {classroomSeed} from '../seeds/data'




const Classroom = () => {
    return (
        <>
            <div className='h-max bg-[#030712] z-[-1] '>
                <Classroom_header />
                <Classroom_controlbar />
                <div className="w-full p-4 md:p-6 lg:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {classroomSeed.map((course, index) => (
                        <Classroom_card key={index} classroom={course} />
                    ))}
                </div>

            </div>

        </>
    )
}

export default Classroom