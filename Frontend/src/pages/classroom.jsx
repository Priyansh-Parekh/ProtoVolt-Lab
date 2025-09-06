import React from 'react'

//components
import ClassroomJoinPopup from '../components/classroom/ClassroomJoinPopup'
import ClassroomCreatePopup from '../components/classroom/classroomCreatePopup'
import Classroom_header from '../components/classroom/classroomHeader'
import Classroom_card from '../components/classroom/classroomCard'

//helpers
import Loading from '../helper/Loading'

//hooks


//seeds
import {classroomSeed} from '../seeds/data'

//usefull fun
import { useState } from 'react'


const Classroom = () => {

    
    // it will work after DB is connected
    // if (isLoading) {
    //   return <Loading />;
    // }

    const [joinPopup,setJoinPopup] = useState(false);
    const [createPopup,setCreatePopup] = useState(false);
    return (
        <>
            <div className='h-max min-h-screen bg-[var(--color-primary)] z-[-1] '>
                 <Classroom_header setJoinPopup = {setJoinPopup} setCreatePopup={setCreatePopup} />
                 {joinPopup && <ClassroomJoinPopup setJoinPopup={setJoinPopup} />}
                 {createPopup && <ClassroomCreatePopup setCreatePopup={setCreatePopup} />}
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