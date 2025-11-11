import Classroom from "../../models/classrooms.js"; 

const getClassroomPeople = async (req, res) => {
  try {
    const loggedInUser = req.user;
    if (!loggedInUser) {
      return res.status(401).json({ success: false, message: "Unauthorized. Please log in." });
    }

    const { classroomId } = req.params;

    const classroom = await Classroom.findById(classroomId)
      .populate('students')
      .populate('professors');

    if (!classroom) {
      return res.status(404).json({ success: false, message: "Classroom not found." });
    }
    
    // Security check: Ensure the person requesting is a member
    const isStudent = classroom.students.some(student => student._id.equals(loggedInUser._id));
    const isProfessor = classroom.professors.some(prof => prof._id.equals(loggedInUser._id));

    if (!isStudent && !isProfessor) {
        return res.status(403).json({ success: false, message: "Forbidden: You are not a member of this classroom." });
    }

    // Send the populated data
    res.status(200).json({
      success: true,
      students: classroom.students,
      professors: classroom.professors,
      message: "Data of students and profs of a particular class has been sent."
    });

  } catch (err) {
    console.error("Error fetching classroom members:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export default getClassroomPeople;