import Classroom from '../../models/classrooms.js';
import User from '../../models/users.js';

const joinClassroom = async (req, res) => {
  try {
    const { joinCode } = req.body;
    const user = req.user;
    const userId = user._id;

    console.log(joinCode)

    if (!joinCode) {
      return res.status(400).json({ success: false, message: 'Please provide a join code' });
    }

    // 1️⃣ Find the classroom
    const classroom = await Classroom.findOne({ joinCode });
    if (!classroom) {
      return res.status(404).json({ success: false, message: 'Classroom not found with this code' });
    }

    // 2️⃣ Check if already in classroom (as student or professor)
    const alreadyMember =
      classroom.students.some((s) => s.equals(userId)) ||
      classroom.professors.some((p) => p.equals(userId)) ||
      classroom.owner.equals(userId);

    if (alreadyMember) {
      return res.status(200).json({
        success: true,
        message: 'You are already a member of this classroom',
        classroomName: classroom.name,
      });
    }

    // 3️⃣ Determine user role
    const dbUser = await User.findById(userId);
    if (!dbUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const role = dbUser.role?.toLowerCase();

    // 4️⃣ Add to correct list in classroom
    if (role === 'professor') {
      await Classroom.findByIdAndUpdate(classroom._id, {
        $addToSet: { professors: userId },
      });
    } else {
      // Default: student
      await Classroom.findByIdAndUpdate(classroom._id, {
        $addToSet: { students: userId },
      });
    }

    // 5️⃣ Add classroom reference to user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { classrooms: classroom._id },
    });

    res.status(200).json({
      success: true,
      message: `Successfully joined classroom as ${role || 'student'}!`,
      classroomName: classroom.name,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error, please try again later' });
  }
};

export default joinClassroom;
