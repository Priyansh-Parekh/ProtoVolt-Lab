import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Clipboard, Trello, Activity, Clock, CheckCircle, AlertCircle, TrendingUp, Users, Zap, ArrowRight, LogIn, Target, X, Award, BarChart2 } from 'lucide-react';

const Dashboard = ({ user = { name: 'Student' } }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const [stats, setStats] = useState({
    totalClassrooms: 0,
    assignmentsDue: 0,
    totalProjects: 0,
    completionRate: 0,
  });

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const rightBoxRef = useRef(null);
  const [rightBoxHeight, setRightBoxHeight] = useState('auto');

  const dummyJoinableClasses = [
    { name: 'Web Development 101', code: 'WEB123' },
    { name: 'Data Structures', code: 'DS456' },
    { name: 'AI & Machine Learning', code: 'AI789' },
    { name: 'Database Systems', code: 'DB101' },
    { name: 'Cloud Computing', code: 'CC222' },
    { name: 'Digital Circuits', code: 'DC333' },
    { name: 'Embedded Systems', code: 'ES555' },
    { name: 'Network Security', code: 'NS777' },
  ];

  const dummyAssignments = {
    'Web Development 101': [
      { title: 'HTML Basics', due: 'Nov 15' },
      { title: 'CSS Flexbox Project', due: 'Nov 20' },
      { title: 'React Components', due: 'Nov 25' },
      { title: 'JavaScript ES6 Features', due: 'Nov 28' },
      { title: 'REST API Integration', due: 'Dec 2' },
      { title: 'State Management', due: 'Dec 5' },
    ],
    'Data Structures': [
      { title: 'Linked List Implementation', due: 'Nov 18' },
      { title: 'Sorting Algorithms', due: 'Nov 22' },
      { title: 'Binary Tree Traversal', due: 'Nov 26' },
      { title: 'Hash Table Design', due: 'Nov 30' },
      { title: 'Graph Algorithms', due: 'Dec 4' },
    ],
    'AI & Machine Learning': [
      { title: 'Linear Regression Model', due: 'Nov 16' },
      { title: 'Neural Network Basics', due: 'Nov 23' },
      { title: 'Decision Trees', due: 'Nov 27' },
      { title: 'K-Means Clustering', due: 'Dec 1' },
      { title: 'CNN Implementation', due: 'Dec 6' },
      { title: 'NLP Project', due: 'Dec 10' },
    ],
    'Database Systems': [
      { title: 'SQL Queries', due: 'Nov 19' },
      { title: 'Database Design Project', due: 'Nov 24' },
      { title: 'Normalization Exercise', due: 'Nov 29' },
      { title: 'Transaction Management', due: 'Dec 3' },
      { title: 'Query Optimization', due: 'Dec 7' },
    ],
    'Cloud Computing': [
      { title: 'AWS EC2 Setup', due: 'Nov 17' },
      { title: 'Docker Containers', due: 'Nov 21' },
      { title: 'Kubernetes Deployment', due: 'Nov 25' },
      { title: 'Serverless Functions', due: 'Nov 29' },
      { title: 'CI/CD Pipeline', due: 'Dec 3' },
    ],
    'Digital Circuits': [
      { title: 'Logic Gates Lab', due: 'Nov 18' },
      { title: 'Combinational Circuits', due: 'Nov 22' },
      { title: 'Sequential Circuits', due: 'Nov 26' },
      { title: 'Flip-Flop Design', due: 'Nov 30' },
      { title: 'Counter Implementation', due: 'Dec 4' },
    ],
    'Embedded Systems': [
      { title: 'Arduino Basics', due: 'Nov 16' },
      { title: 'Sensor Integration', due: 'Nov 20' },
      { title: 'I2C Communication', due: 'Nov 24' },
      { title: 'PWM Control', due: 'Nov 28' },
      { title: 'RTOS Basics', due: 'Dec 2' },
    ],
    'Network Security': [
      { title: 'Encryption Protocols', due: 'Nov 19' },
      { title: 'Firewall Configuration', due: 'Nov 23' },
      { title: 'Penetration Testing', due: 'Nov 27' },
      { title: 'SSL/TLS Setup', due: 'Dec 1' },
      { title: 'Security Audit', due: 'Dec 5' },
    ],
    'Operating Systems': [
      { title: 'Process Scheduling', due: 'Nov 17' },
      { title: 'Memory Management', due: 'Nov 21' },
      { title: 'File Systems', due: 'Nov 25' },
      { title: 'Deadlock Handling', due: 'Nov 29' },
    ],
    'Computer Networks': [
      { title: 'OSI Model Study', due: 'Nov 18' },
      { title: 'TCP/IP Protocol', due: 'Nov 22' },
      { title: 'Network Simulation', due: 'Nov 26' },
      { title: 'Routing Algorithms', due: 'Nov 30' },
    ],
    'Software Engineering': [
      { title: 'UML Diagrams', due: 'Nov 16' },
      { title: 'Agile Methodology', due: 'Nov 20' },
      { title: 'Testing Strategies', due: 'Nov 24' },
      { title: 'Design Patterns', due: 'Nov 28' },
    ],
    'Mobile Development': [
      { title: 'Android UI Design', due: 'Nov 19' },
      { title: 'React Native App', due: 'Nov 23' },
      { title: 'State Management', due: 'Nov 27' },
      { title: 'API Integration', due: 'Dec 1' },
    ],
  };

  const dummyStudents = [
    { name: 'Alice Johnson', status: 'Submitted' },
    { name: 'Bob Smith', status: 'Pending' },
    { name: 'Charlie Brown', status: 'Submitted' },
    { name: 'Diana Ross', status: 'Late Submission' },
    { name: 'Eva Martinez', status: 'Submitted' },
    { name: 'Frank Lee', status: 'Pending' },
    { name: 'Grace Taylor', status: 'Submitted' },
    { name: 'Henry Wilson', status: 'Late Submission' },
  ];

  useEffect(() => {
    const dummyClassrooms = [
      { _id: '1', name: 'Web Development 101', course: 'Frontend Basics' },
      { _id: '2', name: 'Data Structures', course: 'Algorithms & Logic' },
      { _id: '3', name: 'AI & Machine Learning', course: 'Intro to ML' },
      { _id: '4', name: 'Database Systems', course: 'SQL & Design' },
      { _id: '5', name: 'Cloud Computing', course: 'AWS & Azure' },
      { _id: '6', name: 'Digital Circuits', course: 'Logic Design' },
      { _id: '7', name: 'Embedded Systems', course: 'IoT & Microcontrollers' },
      { _id: '8', name: 'Network Security', course: 'Cryptography & Defense' },
      { _id: '9', name: 'Operating Systems', course: 'Linux & Windows' },
      { _id: '10', name: 'Computer Networks', course: 'TCP/IP & Protocols' },
      { _id: '11', name: 'Software Engineering', course: 'Development Practices' },
      { _id: '12', name: 'Mobile Development', course: 'iOS & Android' },
    ];

    const dummyCircuits = [
      { _id: 'c1', name: 'Full Adder Circuit', createdAt: new Date() },
      { _id: 'c2', name: 'LED Blinker', createdAt: new Date() },
      { _id: 'c3', name: 'Sensor Module', createdAt: new Date() },
      { _id: 'c4', name: 'Amplifier Design', createdAt: new Date() },
      { _id: 'c5', name: 'Filter Circuit', createdAt: new Date() },
    ];

    setTimeout(() => {
      setClassrooms(dummyClassrooms);
      setCircuits(dummyCircuits);
      setStats({
        totalClassrooms: dummyClassrooms.length,
        assignmentsDue: 2,
        totalProjects: dummyCircuits.length,
        completionRate: 88,
      });
      setLoading(false);
    }, 800);
  }, []);

  useEffect(() => {
    if (rightBoxRef.current) {
      setRightBoxHeight(rightBoxRef.current.offsetHeight);
    }
    const onResize = () => {
      if (rightBoxRef.current) setRightBoxHeight(rightBoxRef.current.offsetHeight);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [classrooms]);

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      alert('Please enter a join code');
      return;
    }
    setIsJoining(true);
    setTimeout(() => {
      alert(`Joined classroom with code: ${joinCode.trim()}`);
      setJoinCode('');
      setIsJoining(false);
    }, 800);
  };

  const handleDummyClick = (code) => {
    setJoinCode(code);
    alert(`Selected code: ${code}`);
  };

  const handleClassClick = (className) => {
    setSelectedClass(selectedClass === className ? null : className);
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-[#020408] via-[#050a12] to-[#0a0e17] text-white pt-16">
        <div className="w-14 h-14 border-4 border-t-cyan-400 border-[#080f1a] rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#020408] via-[#050a12] to-[#0a0e17] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 to-transparent pointer-events-none"></div>
      <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-purple-500 opacity-10 blur-[150px] rounded-full"></div>
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-green-500 opacity-10 blur-[150px] rounded-full"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="space-y-8">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-500 to-cyan-400 bg-clip-text text-transparent">
                {user?.name || 'User'}
              </span>
            </h1>
            <p className="text-lg text-gray-400">
              Here's what's happening with your learning journey today.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-cyan-400/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="text-cyan-400" size={20} />
                </div>
                <TrendingUp className="text-green-400" size={20} />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalClassrooms}</h3>
              <p className="text-sm text-gray-400">Total Classrooms</p>
            </div>

            <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-purple-400/20 rounded-xl flex items-center justify-center">
                  <Clipboard className="text-purple-400" size={20} />
                </div>
                <AlertCircle className="text-purple-400" size={20} />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.assignmentsDue}</h3>
              <p className="text-sm text-gray-400">Assignments Due</p>
            </div>

            <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-teal-400/20 rounded-xl flex items-center justify-center">
                  <Trello className="text-teal-400" size={20} />
                </div>
                <Zap className="text-teal-400" size={20} />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.totalProjects}</h3>
              <p className="text-sm text-gray-400">Circuit Projects</p>
            </div>

            <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-green-400 transition-all hover:shadow-lg hover:shadow-green-500/50">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-green-400/20 rounded-xl flex items-center justify-center">
                  <Target className="text-green-400" size={20} />
                </div>
                <CheckCircle className="text-green-400" size={20} />
              </div>
              <h3 className="text-3xl font-bold mb-1">{stats.completionRate}%</h3>
              <p className="text-sm text-gray-400">Completion Rate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-cyan-400 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-cyan-400/20 rounded-lg flex items-center justify-center">
                    <LogIn className="text-cyan-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Join Classroom</h2>
                </div>
                <p className="text-sm text-gray-400 mb-4">
                  Enter the code provided by your instructor
                </p>
                <form onSubmit={handleJoinClassroom} className="space-y-3">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    placeholder="ENTER CODE"
                    className="w-full p-3 rounded-lg text-center text-lg font-mono tracking-widest uppercase bg-[#0d1625]/60 border border-[#00D4FF]/20 text-white focus:border-cyan-400 focus:outline-none"
                    maxLength={8}
                  />
                  <button
                    type="submit"
                    disabled={isJoining || !joinCode.trim()}
                    className="w-full py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500"
                  >
                    {isJoining ? 'Joining...' : 'Join Now'}
                  </button>
                </form>

                <div className="mt-6">
                  <h3 className="text-sm text-gray-400 mb-2">Available Classes</h3>
                  <div 
                    className="space-y-2 overflow-y-auto pr-2"
                    style={{ 
                      height: '176px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(34, 211, 238, 0.5) transparent'
                    }}
                  >
                    {dummyJoinableClasses.map((cls) => (
                      <button
                        key={cls.code}
                        onClick={() => handleDummyClick(cls.code)}
                        className="w-full text-left px-3 py-2 rounded-lg border border-[#00D4FF]/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all bg-[#0d1625]/40 text-sm flex justify-between items-center"
                      >
                        <span className="font-medium truncate">{cls.name}</span>
                        <span className="font-mono text-cyan-400">{cls.code}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6 hover:border-purple-400 transition-all flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-purple-400/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Award className="text-purple-400" size={48} />
                  </div>
                  <h3 className="text-lg font-bold mb-1">Keep Learning!</h3>
                  <p className="text-sm text-gray-400">Complete more assignments to unlock achievements</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6" ref={rightBoxRef}>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-teal-400/20 rounded-lg flex items-center justify-center">
                      <BookOpen className="text-teal-400" size={20} />
                    </div>
                    <h2 className="text-xl font-bold">Your Classrooms</h2>
                  </div>
                  <button className="text-sm text-cyan-400 hover:text-teal-400 flex items-center gap-1 transition-colors">
                    View All <ArrowRight size={16} />
                  </button>
                </div>

                {classrooms.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="mx-auto mb-4 text-gray-600" size={48} />
                    <p className="text-gray-400">
                      No classrooms yet. Join one using a code above!
                    </p>
                  </div>
                ) : (
                  <div 
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto pr-2"
                    style={{ 
                      maxHeight: '500px',
                      scrollbarWidth: 'thin',
                      scrollbarColor: 'rgba(34, 211, 238, 0.5) transparent'
                    }}
                  >
                    {classrooms.map((classroom, idx) => (
                      <div key={classroom._id}>
                        <div
                          className="block bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-4 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50 group cursor-pointer"
                          onClick={() => handleClassClick(classroom.name)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg mb-1 truncate">{classroom.name}</h3>
                              <p className="text-sm text-gray-400">{classroom.course}</p>
                            </div>
                            <ArrowRight className="text-gray-600 group-hover:text-cyan-400 transition-colors" size={20} />
                          </div>
                        </div>

                        {selectedClass === classroom.name && (
                          <div className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl mt-2 p-4">
                            <h4 className="text-md font-semibold mb-3 text-cyan-400">Assignments</h4>
                            <div 
                              className="space-y-2 overflow-y-auto pr-2"
                              style={{ 
                                maxHeight: '200px',
                                scrollbarWidth: 'thin',
                                scrollbarColor: 'rgba(20, 184, 166, 0.5) transparent'
                              }}
                            >
                              {(dummyAssignments[classroom.name] || []).map((a, i) => (
                                <div
                                  key={i}
                                  onClick={() => handleAssignmentClick({ ...a, class: classroom.name })}
                                  className="flex justify-between items-center px-3 py-2 rounded-lg border border-[#00D4FF]/20 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/50 cursor-pointer transition-all"
                                >
                                  <span className="truncate">{a.title}</span>
                                  <span className="text-xs text-gray-400">Due {a.due}</span>
                                </div>
                              ))}
                              {!(dummyAssignments[classroom.name] || []).length && (
                                <p className="text-sm text-gray-400">No assignments yet.</p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="bg-gradient-to-br from-[#0d1625]/70 to-[#080f1a]/70 backdrop-blur-sm border border-[#00D4FF]/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-400/20 rounded-lg flex items-center justify-center">
                    <Zap className="text-green-400" size={20} />
                  </div>
                  <h2 className="text-xl font-bold">Quick Actions</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-5 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50 group text-left">
                    <Trello className="text-2xl text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1">New Circuit</h3>
                    <p className="text-sm text-gray-400">Start a new simulation project</p>
                  </button>

                  <button className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-5 hover:border-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/50 group text-left">
                    <Activity className="text-2xl text-teal-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1">My Projects</h3>
                    <p className="text-sm text-gray-400">View all your circuits</p>
                  </button>

                  <button className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-5 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/50 group text-left">
                    <BookOpen className="text-2xl text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1">Classrooms</h3>
                    <p className="text-sm text-gray-400">Access your learning spaces</p>
                  </button>

                  <button className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-5 hover:border-green-400 transition-all hover:shadow-lg hover:shadow-green-500/50 group text-left">
                    <Users className="text-2xl text-green-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1">About Us</h3>
                    <p className="text-sm text-gray-400">Learn about ProtoVolt</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAssignment && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-[#0d1625]/90 to-[#080f1a]/90 backdrop-blur-sm border border-[#00D4FF]/30 rounded-2xl p-6 w-[90%] max-w-2xl relative">
            <button
              onClick={() => setSelectedAssignment(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-cyan-400"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold mb-2">{selectedAssignment.title}</h3>
            <p className="text-sm text-gray-400 mb-4">
              Class: {selectedAssignment.class} • Due: {selectedAssignment.due}
            </p>

            <div 
              className="border-t border-[#00D4FF]/20 pt-4 space-y-2 overflow-y-auto pr-2"
              style={{ 
                maxHeight: '256px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(34, 211, 238, 0.5) transparent'
              }}
            >
              {dummyStudents.map((student, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg p-3"
                >
                  <span>{student.name}</span>
                  <span
                    className={`text-sm ${
                      student.status === 'Submitted'
                        ? 'text-green-400'
                        : student.status === 'Pending'
                        ? 'text-yellow-400'
                        : 'text-red-400'
                    }`}
                  >
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;