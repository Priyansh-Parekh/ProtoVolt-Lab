/**
 * User Seed Data
 */
export const userSeed = [
    {
        _id: 'prof_turing_id',
        name: 'Dr. Alan Turing',
        email: 'alan.turing@example.com',
        password: 'password123',
        role: 'professor',
        profilePicture: 'https://example.com/images/turing.png',
        bio: 'Pioneer of theoretical computer science and artificial intelligence.',
    },
    {
        _id: 'prof_curie_id',
        name: 'Professor Marie Curie',
        email: 'marie.curie@example.com',
        password: 'password123',
        role: 'professor',
        profilePicture: 'https://example.com/images/curie.png',
        bio: 'Expert in radioactive circuits and novel power sources.',
    },
    {
        _id: 'prof_tesla_id',
        name: 'Nikola Tesla',
        email: 'nikola.tesla@example.com',
        password: 'password123',
        role: 'professor',
        bio: 'Inventor, electrical engineer, and futurist known for contributions to the design of the modern AC electricity system.',
    },
    {
        _id: 'student_alice_id',
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'password123',
        role: 'student',
        bio: 'Eager to learn about digital logic.',
    },
    {
        _id: 'student_bob_id',
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: 'password123',
        role: 'student',
        bio: '',
    },
    {
        _id: 'student_charlie_id',
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        password: 'password123',
        role: 'student',
        bio: '',
    },
     {
        _id: 'student_diana_id',
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        password: 'password123',
        role: 'student',
        bio: 'Interested in power electronics.',
    },
];

/**
 * Classroom Seed Data
 */
export const classroomSeed = [
    {
        _id: 'classroom_ee101_id',
        name: 'Analog Circuits 101',
        owner: 'prof_curie_id',
        course: 'EE-101',
        description: 'An introductory course on the fundamentals of analog electronic circuits.',
        joinCode: 'A3B1C9',
        assignments: ['assignment_1_id', 'assignment_3_id'],
        announcements: ['announcement_1_id', 'announcement_3_id'],
        students: ['student_alice_id', 'student_bob_id', 'student_diana_id'],
        professors: ['prof_curie_id'],
        imageUrl:"https://images.unsplash.com/photo-1599951680131-d8a4e8203c94?q=80&w=2070&auto=format&fit=crop",
        createdAt: '2025-09-01T10:00:00Z',
        updatedAt: '2025-09-01T10:00:00Z',
    },
    {
        _id: 'classroom_cs202_id',
        name: 'Digital Logic Design',
        owner: 'prof_turing_id',
        course: 'CS-202',
        description: 'Exploring logic gates, boolean algebra, and digital systems.',
        joinCode: 'X7Y5Z2',
        assignments: ['assignment_2_id'],
        announcements: ['announcement_2_id'],
        imageUrl:"https://images.unsplash.com/photo-1550751827-4133704a425f?q=80&w=2070&auto=format&fit=crop",
        students: ['student_alice_id', 'student_charlie_id'],
        professors: ['prof_turing_id'],
        createdAt: '2025-09-02T11:00:00Z',
        updatedAt: '2025-09-02T11:00:00Z',
    },
    {
        _id: 'classroom_phy305_id',
        name: 'Advanced Electromagnetism',
        owner: 'prof_tesla_id',
        course: 'PHY-305',
        description: 'A deep dive into Maxwell\'s equations and AC circuit theory.',
        joinCode: 'M8N2P1',
        assignments: [],
        announcements: [],
        imageUrl:"https://images.unsplash.com/photo-1617802319350-2a5b2b2a7c4c?q=80&w=2070&auto=format&fit=crop",
        students: ['student_diana_id', 'student_bob_id'],
        professors: ['prof_tesla_id'],
        createdAt: '2025-09-03T09:00:00Z',
        updatedAt: '2025-09-03T09:00:00Z',
    }
];

/**
 * Announcement Seed Data
 */
export const announcementSeed = [
    {
        _id: 'announcement_1_id',
        title: 'Welcome to Analog Circuits!',
        professor: 'prof_curie_id',
        content: 'Welcome everyone! Please review the syllabus and procure the necessary lab equipment before our first session next week.',
        createdAt: '2025-09-01T10:05:00Z',
        updatedAt: '2025-09-01T10:05:00Z',
    },
    {
        _id: 'announcement_2_id',
        title: 'Office Hours Update',
        professor: 'prof_turing_id',
        content: 'My office hours for this semester will be on Tuesdays from 2 PM to 4 PM. Please sign up in advance.',
        createdAt: '2025-09-03T14:00:00Z',
        updatedAt: '2025-09-03T14:00:00Z',
    },
    {
        _id: 'announcement_3_id',
        title: 'Lab 1 Graded',
        professor: 'prof_curie_id',
        content: 'I have finished grading Lab 1. Please check your submissions for feedback. Overall, great work!',
        createdAt: '2025-10-20T18:00:00Z',
        updatedAt: '2025-10-20T18:00:00Z',
    },
];

/**
 * Circuit Seed Data
 */
export const circuitSeed = [
    {
        _id: 'solution_circuit_id',
        name: 'Lab 1 - Solution Key',
        owner: 'prof_curie_id',
        analysed: true,
        circuitdata: {
            conponents: [
                { id: 'dc-source-1', type: 'dc-source', label: 'V1', position: { x: 50, y: 100 }, properties: { voltage: '9V' }, terminals: [{ id: 't1' }, { id: 't2' }] },
                { id: 'resistor-1', type: 'resistor', label: 'R1', position: { x: 150, y: 100 }, properties: { resistance: '1k' }, terminals: [{ id: 't1' }, { id: 't2' }] },
                { id: 'ground-1', type: 'ground', label: 'GND', position: { x: 150, y: 200 }, properties: {}, terminals: [{ id: 't1' }] }
            ]
        }
    },
    {
        _id: 'student_submission_circuit_id',
        name: 'Alices Lab 1 Submission',
        owner: 'student_alice_id',
        analysed: false,
        circuitdata: {
            conponents: [
                { id: 'dc-source-student', type: 'dc-source', label: 'V_in', position: { x: 60, y: 110 }, properties: { voltage: '5V' }, terminals: [{ id: 't1' }, { id: 't2' }] },
                { id: 'resistor-student', type: 'resistor', label: 'R_load', position: { x: 160, y: 110 }, properties: { resistance: '2.2k' }, terminals: [{ id: 't1' }, { id: 't2' }] },
            ]
        }
    },
    {
        _id: 'personal_project_bob',
        name: 'Bob\'s RC Filter',
        owner: 'student_bob_id',
        analysed: true,
        circuitdata: {
            conponents: [
                 { id: 'dc-source-bob', type: 'dc-source', label: 'V1', position: { x: 50, y: 150 }, properties: { voltage: '12V' }, terminals: [{ id: 't1' }, { id: 't2' }] },
                 { id: 'resistor-bob', type: 'resistor', label: 'R1', position: { x: 150, y: 150 }, properties: { resistance: '4.7k' }, terminals: [{ id: 't1' }, { id: 't2' }] },
                 { id: 'capacitor-bob', type: 'capacitor', label: 'C1', position: { x: 250, y: 150 }, properties: { capacitance: '10uF' }, terminals: [{ id: 't1' }, { id: 't2' }] },
            ]
        }
    }
];

/**
 * SubTab Seed Data
 */
export const subTabSeed = [
    {
        _id: 'sub_tab_id_1',
        name: 'Main Simulation',
        circuit: 'solution_circuit_id',
    },
    {
        _id: 'sub_tab_id_2',
        name: 'Alice\'s Attempt 1',
        circuit: 'student_submission_circuit_id',
    }
];

/**
 * Assignment Seed Data
 */
export const assignmentSeed = [
    {
        _id: 'assignment_1_id',
        title: 'Lab 1: Simple Series Circuit',
        description: 'Construct a simple series circuit with one DC source and one resistor. Measure the voltage and current.',
        dueDate: '2025-10-15T23:59:59Z',
        apparatus: '9V DC Power Supply, 1k Ohm Resistor, Breadboard, Multimeter, Wires',
        solutionCircuit: 'solution_circuit_id',
        subTabs: 'sub_tab_id_1',
        uploadedFiles: 'https://example.com/files/lab1_instructions.pdf',
        createdAt: '2025-09-05T16:00:00Z',
        updatedAt: '2025-09-05T16:00:00Z',
    },
    {
        _id: 'assignment_2_id',
        title: 'Homework 1: Truth Tables',
        description: 'Create the truth tables for AND, OR, NOT, and XOR gates.',
        dueDate: '2025-10-22T23:59:59Z',
        apparatus: 'Pen and Paper',
        solutionCircuit: null,
        subTabs: null,
        uploadedFiles: null,
        createdAt: '2025-09-06T11:30:00Z',
        updatedAt: '2025-09-06T11:30:00Z',
    },
    {
        _id: 'assignment_3_id',
        title: 'Lab 2: RC Circuit Analysis',
        description: 'Build and analyze the time constant of a first-order RC circuit.',
        dueDate: '2025-11-01T23:59:59Z',
        apparatus: '12V DC Power Supply, 4.7k Ohm Resistor, 10uF Capacitor, Oscilloscope, Wires',
        solutionCircuit: null,
        subTabs: null,
        uploadedFiles: null,
        createdAt: '2025-10-20T10:00:00Z',
        updatedAt: '2025-10-20T10:00:00Z',
    },
];

/**
 * EComponent Seed Data
 */
export const eComponentSeed = [
    { id: 'capacitor-example-1', type: 'capacitor', label: 'C1', position: { x: 100, y: 100 }, properties: { capacitance: '100uF' }, terminals: [{ id: 't1' }, { id: 't2' }] },
    { id: 'inductor-example-1', type: 'inductor', label: 'L1', position: { x: 200, y: 200 }, properties: { inductance: '10mH' }, terminals: [{ id: 't1' }, { id: 't2' }] },
    { id: 'diode-example-1', type: 'diode', label: 'D1', position: { x: 300, y: 100 }, properties: { forward_voltage: '0.7V' }, terminals: [{ id: 'anode' }, { id: 'cathode' }] },
];

/**
 * DComponent Seed Data
 */
export const dComponentSeed = [
    { id: 'or-gate-example-1', type: 'or-gate', label: 'OR1', position: { x: 150, y: 150 }, properties: { inputs: 2 }, terminals: [{ id: 'in1' }, { id: 'in2' }, { id: 'out' }] },
    { id: 'not-gate-example-1', type: 'not-gate', label: 'NOT1', position: { x: 250, y: 250 }, properties: {}, terminals: [{ id: 'in' }, { id: 'out' }] },
    { id: 'xor-gate-example-1', type: 'xor-gate', label: 'XOR1', position: { x: 350, y: 150 }, properties: { inputs: 2 }, terminals: [{ id: 'in1' }, { id: 'in2' }, { id: 'out' }] },
];

/**
 * Node Seed Data
 */
export const nodeSeed = [
    { id: 'node-1', position: { x: 100, y: 150 } },
    { id: 'node-2', position: { x: 200, y: 150 } },
    { id: 'node-3', position: { x: 100, y: 250 } },
    { id: 'node-4', position: { x: 200, y: 250 } }
];
