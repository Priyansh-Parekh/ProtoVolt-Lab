import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clipboard, Trello, Activity, CheckCircle, AlertCircle, TrendingUp, Users, Zap, ArrowRight, LogIn, Target, X, Award } from 'lucide-react';
import { error, info, success } from "../utils/toastify.js";
import api from '../utils/axios.js';

const Dashboard = ({ user = { name: 'Student' } }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [circuits, setCircuits] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const [stats, setStats] = useState({
    assignmentsDue: 2,
    completionRate: 88
  });

  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const rightBoxRef = useRef(null);
  const [rightBoxHeight, setRightBoxHeight] = useState('auto');

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

  useEffect(() => {
    const getClassrooms = async () => {
      try {
        const res = await api.get('/user/data/getClassrooms');
        if (res.data.success) {
          setClassrooms(res.data.classrooms);
          setStats(prev => ({
            ...prev,
            totalClassrooms: res.data.classrooms.length
          }));
        } else {
          error(res.data.message);
        }
      } catch (err) {
        console.error("Failed to fetch classrooms:", err);
        error(err.response?.data?.message || err.message || "Failed to load classrooms.");
      } finally {
        setLoading(false);
      }
    }

    const fetchData = async () => {
      try {
        const res = await api.get("/user/data/getCircuits");
        if (res.data.success) setStats(prev => ({
          ...prev,
          totalProjects: res.data.circuits.length
        }));
        else error(res.data.message);
      } catch (err) {
        error("Failed to fetch circuits");
      } finally {
        setLoading(false);
      }
    };

    getClassrooms();
    fetchData();
  }, []);

  const formatDate = (mongoDate) => {
    const date = new Date(mongoDate);
    return date.toLocaleDateString("en-US");
  };

  const handleJoinClassroom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) {
      error('Please enter a join code');
      return;
    }
    setIsJoining(true);
    try {
      const res = await api.post("/classroom/data/joinClassroom", { joinCode });
      if (res.data.success) {
        success(res.data.message);
      } else {
        error(res.data.message);
      }
    } catch (err) {
      error("Server Error");
      console.log(err)
    } finally {
      setJoinCode("")
      setIsJoining(false);
    }
  };

  const handleCopyClick = (joinCode) => {
    navigator.clipboard.writeText(joinCode)
      .then(() => {
        info(`Copied "${joinCode}" to clipboard!`);
      })
      .catch(err => {
        error('Failed to copy text: ', err);
      });
  };

  const handleClassClick = async (c_id, c_name) => {
    setSelectedClass(selectedClass === c_id ? null : c_id);

    if (assignments[c_name]) {
      return;
    }

    try {
      const res = await api.get(`/user/data/getClassAssStudData?c_id=${c_id}`);
      
      if (res.data.success) {
        const formattedAssignments = res.data.assData.map(assignment => ({
          _id: assignment._id, 
          title: assignment.title,
          dueDate: formatDate(assignment.dueDate),
          subStudents: assignment.students
        }));

        setAssignments(prevAssignments => ({
          ...prevAssignments,
          [c_name]: formattedAssignments
        }));

      } else {
        error(res.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch assignments:", err);
      error(err.response?.data?.message || err.message || "Failed to load assignments.");
    }
  };

  const handleAssignmentClick = (assignment) => {
    setSelectedAssignment(assignment);
    setStudents(assignment.subStudents);
    console.log(assignment.subStudents);
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
                <form className="space-y-3">
                  <input
                    type="text"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value)}
                    placeholder="ENTER CODE"
                    className="w-full p-3 rounded-lg text-center text-lg font-mono tracking-widest uppercase bg-[#0d1625]/60 border border-[#00D4FF]/20 text-white focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    onClick={(e) => { handleJoinClassroom(e) }}
                    disabled={isJoining || !joinCode.trim()}
                    className="w-full py-3 rounded-lg hover:cursor-pointer font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500"
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
                    {classrooms.map((cls) => (
                      <button
                        key={cls.joinCode}
                        onClick={() => handleCopyClick(cls.joinCode)}
                        className="w-full text-left px-3 py-2 rounded-lg border border-[#00D4FF]/20 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/50 transition-all bg-[#0d1625]/40 text-sm flex justify-between items-center"
                      >
                        <span className="font-medium truncate">{cls.name}</span>
                        <span className="font-mono text-cyan-400">{cls.joinCode}</span>
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
                          onClick={() => handleClassClick(classroom._id, classroom.name)}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-lg mb-1 truncate">{classroom.name}</h3>
                              <p className="text-sm text-gray-400">{classroom.course}</p>
                            </div>
                            <ArrowRight className="text-gray-600 group-hover:text-cyan-400 transition-colors" size={20} />
                          </div>
                        </div>

                        {selectedClass === classroom._id && (
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
                              {(assignments[classroom.name] || []).map((a) => (
                                <div
                                  key={a._id}
                                  onClick={() => handleAssignmentClick({ ...a, class: classroom.name })}
                                  className="flex justify-between items-center px-3 py-2 rounded-lg border border-[#00D4FF]/20 hover:border-teal-400 hover:shadow-lg hover:shadow-teal-500/50 cursor-pointer transition-all"
                                >
                                  <span className="truncate">{a.title}</span>
                                  <span className="text-xs text-gray-400">Due {a.dueDate}</span>
                                </div>
                              ))}
                              {!(assignments[classroom.name] || []).length && (
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

                  <Link
                    to="/workspace/new"
                    className="bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-xl p-5 hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-500/50 group text-left"
                  >
                    <Trello className="text-2xl text-cyan-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1 text-white">New Circuit</h3>
                    <p className="text-sm text-gray-400">Start a new simulation project</p>
                  </Link>

                  <Link
                    to="/workspace"
                    className="bg-[#0d1625]/40 border hover:cursor-pointer border-[#00D4FF]/20 rounded-xl p-5 hover:border-teal-400 transition-all hover:shadow-lg hover:shadow-teal-500/50 group text-left"
                  >
                    <Activity className="text-2xl text-teal-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1 text-white">My Projects</h3>
                    <p className="text-sm text-gray-400">View all your circuits</p>
                  </Link>

                  <Link
                    to="/classroom"
                    className="bg-[#0d1625]/40 border hover:cursor-pointer border-[#00D4FF]/20 rounded-xl p-5 hover:border-purple-400 transition-all hover:shadow-lg hover:shadow-purple-500/50 group text-left"
                  >
                    <BookOpen className="text-2xl text-purple-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1 text-white">Classrooms</h3>
                    <p className="text-sm text-gray-400">Access your learning spaces</p>
                  </Link>

                  <Link
                    to="/about-us"
                    className="bg-[#0d1625]/40 border hover:cursor-pointer border-[#00D4FF]/20 rounded-xl p-5 hover:border-green-400 transition-all hover:shadow-lg hover:shadow-green-500/50 group text-left"
                  >
                    <Users className="text-2xl text-green-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                    <h3 className="font-semibold mb-1 text-white">About Us</h3>
                    <p className="text-sm text-gray-400">Learn about ProtoVolt</p>
                  </Link>

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
              Class: {selectedAssignment.class} • Due: {selectedAssignment.dueDate}
            </p>

            <div
              className="border-t border-[#00D4FF]/20 pt-4 space-y-2 overflow-y-auto pr-2"
              style={{
                maxHeight: '256px',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(34, 211, 238, 0.5) transparent'
              }}
            >
              {students.map((student) => (
                <div
                  key={student._id}
                  className="flex justify-between items-center bg-[#0d1625]/40 border border-[#00D4FF]/20 rounded-lg p-3"
                >
                  {/* THIS IS THE FIX */}
                  <span>{student.owner.name}</span>
                  
                  <span
                    className={`text-sm ${student.completed 
                        ? 'text-green-400'
                        : student.status === 'Pending'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}
                  >
                    {student.completed ? "Submitted" : "Missing"}
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