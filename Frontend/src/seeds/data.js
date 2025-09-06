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
        assignments: ['assignment_1_id'],
        announcements: ['announcement_1_id'],
        students: ['student_alice_id', 'student_bob_id'],
        professors: ['prof_curie_id'],
        imageUrl:"data:image/jpeg;base64,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",
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
        imageUrl:"data:image/jpeg;base64,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",
        students: ['student_alice_id', 'student_charlie_id'],
        professors: ['prof_turing_id'],
        createdAt: '2025-09-02T11:00:00Z',
        updatedAt: '2025-09-02T11:00:00Z',
    },
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
];

/**
 * Circuit Seed Data
 * Note: The component data is embedded directly inside the `circuitdata.conponents` array.
 * I have used the typo `conponents` to match your schema.
 */
export const circuitSeed = [
    {
        _id: 'solution_circuit_id',
        name: 'Lab 1 - Solution Key',
        owner: 'prof_curie_id',
        analysed: true,
        circuitdata: {
            conponents: [
                {
                    id: 'dc-source-1',
                    type: 'dc-source',
                    label: 'V1',
                    position: { x: 50, y: 100 },
                    properties: { voltage: '9V' },
                    terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
                },
                {
                    id: 'resistor-1',
                    type: 'resistor',
                    label: 'R1',
                    position: { x: 150, y: 100 },
                    properties: { resistance: '1k' },
                    terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
                },
                 {
                    id: 'ground-1',
                    type: 'ground',
                    label: 'GND',
                    position: { x: 150, y: 200 },
                    properties: {},
                    terminals: [{ id: 't1', nodeId: null }],
                }
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
                 {
                    id: 'dc-source-student',
                    type: 'dc-source',
                    label: 'V_in',
                    position: { x: 60, y: 110 },
                    properties: { voltage: '5V' },
                    terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
                },
                {
                    id: 'resistor-student',
                    type: 'resistor',
                    label: 'R_load',
                    position: { x: 160, y: 110 },
                    properties: { resistance: '2.2k' },
                    terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
                },
            ]
        }
    },
];

/**
 * SubTab Seed Data
 */
export const subTabSeed = [
    {
        _id: 'sub_tab_id_1',
        name: 'Main Simulation',
        circuit: 'solution_circuit_id',
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
];

/**
 * EComponent Seed Data (Example Structures for embedding)
 */
export const eComponentSeed = [
    {
        id: 'capacitor-example-1',
        type: 'capacitor',
        label: 'C1',
        position: { x: 100, y: 100 },
        properties: { capacitance: '100uF' },
        terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
    },
    {
        id: 'inductor-example-1',
        type: 'inductor',
        label: 'L1',
        position: { x: 200, y: 200 },
        properties: { inductance: '10mH' },
        terminals: [{ id: 't1', nodeId: null }, { id: 't2', nodeId: null }],
    }
];

/**
 * DComponent Seed Data (Example Structures for embedding)
 */
export const dComponentSeed = [
    {
        id: 'or-gate-example-1',
        type: 'or-gate',
        label: 'OR1',
        position: { x: 150, y: 150 },
        properties: { inputs: 2 },
        terminals: [{ id: 'in1' }, { id: 'in2' }, { id: 'out' }],
    },
    {
        id: 'not-gate-example-1',
        type: 'not-gate',
        label: 'NOT1',
        position: { x: 250, y: 250 },
        properties: {},
        terminals: [{ id: 'in' }, { id: 'out' }],
    }
];

/**
 * Node Seed Data
 * Note: Your `nodeSchema` is defined but not currently used in any other schema.
 * This is just an example of what that data would look like.
 */
export const nodeSeed = [
    {
        id: 'node-1',
        position: { x: 100, y: 150 }
    },
    {
        id: 'node-2',
        position: { x: 200, y: 150 }
    }
];