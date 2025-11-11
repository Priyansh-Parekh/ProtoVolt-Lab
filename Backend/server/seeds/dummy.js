import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Models
import User from '../models/users.js';
import Announcement from '../models/announcements.js';
import Assignment from '../models/assignments.js';
import Classroom from "../models/classrooms.js";
import Circuit from "../models/circuits.js";
import Component from "../models/components.js";
import Node from "../models/nodes.js";
import StudAss from "../models/studAss.js";
import SubTab from "../models/subTab.js";

dotenv.config();

const URI = "mongodb+srv://priyanshparekh24:RChtNBwy0wN2I56W@ace-up-data.wkfpvme.mongodb.net/ProtoVolt";

// Seeder configuration
const NUM_CLASSROOMS = 4;
const NUM_ASSIGNMENTS_PER_CLASS = 5;
const NUM_ANNOUNCEMENTS_PER_CLASS = 2;
const STUDENT_SUBMISSION_RATE = 0.8;
const STUDENT_ENROLLMENT_RATE = 0.7;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error(`MongoDB Connection Error: ${err.message}`);
    process.exit(1);
  }
};

// Helper utilities
const getRandomSubset = (array, percentage) =>
  array.filter(() => Math.random() < percentage);
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];

const classroomNames = [
  'Basic Circuit Analysis', 'Digital Logic Design',
  'Analog Electronics', 'Signals & Systems',
  'Control Systems', 'Microprocessors'
];

// ----------------------------------------------------------
// Function to create a VALID circuit (multiple components + shared nodes)
// ----------------------------------------------------------
const createValidCircuit = (owner, index) => {
    // Create nodes (shared between components)
    const nodeA = new Node({
      _id: new mongoose.Types.ObjectId(),
      id: `nA-${owner._id}-${index}`,
      position: { x: 100, y: 100 },
    });
    const nodeB = new Node({
      _id: new mongoose.Types.ObjectId(),
      id: `nB-${owner._id}-${index}`,
      position: { x: 200, y: 100 },
    });
    const nodeC = new Node({
      _id: new mongoose.Types.ObjectId(),
      id: `nC-${owner._id}-${index}`,
      position: { x: 150, y: 200 },
    });
  
    // Components sharing common nodes (valid electrical path)
    const r1 = new Component({
      _id: new mongoose.Types.ObjectId(),
      id: `R1-${owner._id}-${index}`,
      type: 'resistor',
      label: 'R1',
      position: { x: 150, y: 90 },
      properties: { resistance: 220 },
      terminals: [{ id: 't1', node: nodeA._id }, { id: 't2', node: nodeB._id }]
    });
  
    const r2 = new Component({
      _id: new mongoose.Types.ObjectId(),
      id: `R2-${owner._id}-${index}`,
      type: 'resistor',
      label: 'R2',
      position: { x: 180, y: 160 },
      properties: { resistance: 330 },
      terminals: [{ id: 't1', node: nodeB._id }, { id: 't2', node: nodeC._id }]
    });
  
    const v1 = new Component({
      _id: new mongoose.Types.ObjectId(),
      id: `V1-${owner._id}-${index}`,
      type: 'dc-source',
      label: 'V1',
      position: { x: 120, y: 160 },
      properties: { voltage: 12 },
      terminals: [{ id: 'p', node: nodeC._id }, { id: 'n', node: nodeA._id }]
    });
  
    // --- Removed 'wire' component definition ---
  
    const circuit = new Circuit({
      _id: new mongoose.Types.ObjectId(),
      name: `Valid Circuit ${index + 1} - ${owner.name}`,
      owner: owner._id,
      analysed: Math.random() > 0.4,
      circuitdata: {
        // --- Removed 'wire._id' from this array ---
        components: [r1._id, r2._id, v1._id], 
        nodes: [nodeA._id, nodeB._id, nodeC._id],
      },
    });
  
    return { 
      nodes: [nodeA, nodeB, nodeC], 
      // --- Removed 'wire' from this returned array ---
      components: [r1, r2, v1], 
      circuit 
    };
  };

// ----------------------------------------------------------
// Main Seeder
// ----------------------------------------------------------
const seedDatabase = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing non-user collections...');
    await Announcement.deleteMany({});
    await Assignment.deleteMany({});
    await StudAss.deleteMany({});
    await SubTab.deleteMany({});
    await Circuit.deleteMany({});
    await Component.deleteMany({});
    await Node.deleteMany({});
    await Classroom.deleteMany({});
    console.log('✅ Cleared all except users.');

    // Fetch users
    const users = await User.find({});
    const professors = users.filter(u => u.role === 'professor');
    const students = users.filter(u => u.role === 'student');
    if (!professors.length || !students.length) {
      console.error('❌ Missing professors or students.');
      process.exit(1);
    }

    // Data arrays
    let newClassrooms = [];
    let newAssignments = [];
    let newAnnouncements = [];
    let newCircuits = [];
    let newComponents = [];
    let newNodes = [];
    let newSubTabs = [];
    let newStudAsses = [];

    console.log(`📘 Generating ${NUM_CLASSROOMS} classrooms...`);
    for (let i = 0; i < NUM_CLASSROOMS; i++) {
      const profOwner = professors[i % professors.length];
      const enrolledStudents = getRandomSubset(students, STUDENT_ENROLLMENT_RATE);

      const classroom = new Classroom({
        _id: new mongoose.Types.ObjectId(),
        name: classroomNames[i % classroomNames.length],
        owner: profOwner._id,
        course: `EE-${100 + i}`,
        description: `Generated class for ${classroomNames[i % classroomNames.length]}.`,
        joinCode: `JOIN${1000 + i}`,
        students: enrolledStudents.map(s => s._id),
        professors: [profOwner._id],
      });

      newClassrooms.push(classroom);
      profOwner.classrooms.push(classroom._id);
      enrolledStudents.forEach(s => s.classrooms.push(classroom._id));

      // Announcements
      for (let j = 0; j < NUM_ANNOUNCEMENTS_PER_CLASS; j++) {
        const ann = new Announcement({
          _id: new mongoose.Types.ObjectId(),
          title: `Announcement ${j + 1} for ${classroom.name}`,
          professor: profOwner._id,
          content: `This is an announcement for ${classroom.name}.`,
          classroom: classroom._id,
        });
        newAnnouncements.push(ann);
        classroom.announcements.push(ann._id);
      }

      // Assignments
      for (let j = 0; j < NUM_ASSIGNMENTS_PER_CLASS; j++) {
        const ass = new Assignment({
          _id: new mongoose.Types.ObjectId(),
          title: `Homework ${j + 1} - ${classroom.name}`,
          description: `Complete HW${j + 1} circuit.`,
          dueDate: new Date(Date.now() + (j + 1) * 7 * 24 * 60 * 60 * 1000),
          assignedApparatus: [{ type: 'resistor', quantity: 2 }, { type: 'dc-source', quantity: 1 }],
          professor: profOwner._id,
          classroom: classroom._id,
        });
        newAssignments.push(ass);
        classroom.assignments.push(ass._id);

        // Student submissions
        for (const student of enrolledStudents) {
          if (Math.random() < STUDENT_SUBMISSION_RATE) {
            // Create fewer valid circuits (1–2)
            const { nodes, components, circuit } = createValidCircuit(student, j);
            newNodes.push(...nodes);
            newComponents.push(...components);
            newCircuits.push(circuit);
            student.circuits.push(circuit._id);

            const subTab = new SubTab({
              _id: new mongoose.Types.ObjectId(),
              name: "My Submission",
              circuit: circuit._id,
            });
            newSubTabs.push(subTab);

            const studAss = new StudAss({
              _id: new mongoose.Types.ObjectId(),
              owner: student._id,
              subTabs: [subTab._id],
              completed: Math.random() > 0.2,
              assignment: ass._id,
            });
            newStudAsses.push(studAss);
          }
        }
      }
    }

    // Bulk inserts
    console.log('⚙️ Bulk inserting data...');
    if (newNodes.length) await Node.insertMany(newNodes);
    if (newComponents.length) await Component.insertMany(newComponents);
    if (newCircuits.length) await Circuit.insertMany(newCircuits);
    if (newSubTabs.length) await SubTab.insertMany(newSubTabs);
    if (newClassrooms.length) await Classroom.insertMany(newClassrooms);
    if (newAssignments.length) await Assignment.insertMany(newAssignments);
    if (newAnnouncements.length) await Announcement.insertMany(newAnnouncements);
    if (newStudAsses.length) await StudAss.insertMany(newStudAsses);
    await Promise.all(users.map(u => u.save()));

    console.log('✅ Seeding complete!');
    console.log(`Created:
    ${newClassrooms.length} Classrooms
    ${newAssignments.length} Assignments
    ${newAnnouncements.length} Announcements
    ${newStudAsses.length} Student Submissions
    ${newCircuits.length} Circuits
    ${newComponents.length} Components
    ${newNodes.length} Nodes`);
  } catch (err) {
    console.error('❌ Seeding Error:', err.message);
    console.error(err.stack);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 MongoDB disconnected.');
    process.exit();
  }
};

seedDatabase();
