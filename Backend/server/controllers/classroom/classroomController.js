// Note: We no longer import 'express-async-handler'
import Classroom from '../../models/classrooms.js';
import User from '../../models/users.js';


const joinClassroom = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const userId = req.user.id;

    if (!joinCode) {
      return res.status(400).json({ message: 'Please provide a join code' });
    }

    // 2. Find the classroom
    const classroom = await Classroom.findOne({ joinCode });

    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found with this code' });
    }

    // 3. Check if user is the owner or a professor
    if (
      classroom.owner.equals(userId) ||
      classroom.professors.some((prof) => prof.equals(userId))
    ) {
      return res.status(400).json({ message: 'You are an instructor for this class and cannot join as a student' });
    }

    // 4. Check if user is already a student
    if (classroom.students.some((student) => student.equals(userId))) {
      return res.status(200).json({ message: 'You are already a member of this classroom' });
    }

    // 5. Add user to classroom's student list
    await Classroom.findByIdAndUpdate(classroom._id, {
      $addToSet: { students: userId },
    });

    // 6. Add classroom to user's classroom list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { classrooms: classroom._id },
    });

    res.status(200).json({
      message: 'Successfully joined classroom!',
      classroomName: classroom.name,
    });

  } catch (error) {
    console.error(error); 
    res.status(500).json({ message: 'Server error, please try again later' });
  }
};

export { joinClassroom };