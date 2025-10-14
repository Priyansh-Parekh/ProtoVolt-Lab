import React, { useState } from 'react';
import { FiXCircle } from 'react-icons/fi';

//importing utils
import api from '../utils/axios';

// components
import LeftVisualPanel from '../components/createClassroom/leftVisualPanel';

const CreateClassroom = () => {

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [joinCode, setJoinCode] = useState("")
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [prevImage, setPrevImage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.target.disable = true;
    e.target.style.opacity = 0.5;
    //call Api over here;
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("course", course);
      formData.append("description", description);
      formData.append("image", image); // 'image' must match multer field name

      const res = await api.post("/classroom/data/createClassroom", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      if (res.data.success) {
        setIsSubmitted(prev => !prev);
        setJoinCode(res.data.joinCode);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.message);
    }

    
    e.target.disabled = false;
    e.target.style.opacity = 1;
  }

  const removeImage = () => {
    setImage("");
    setPrevImage("");
  }

  const newClassroom = () => {
    setIsSubmitted(false);
    setJoinCode("");
    setName("");
    setCourse("");
    setDescription("");
    setImage("");
    setPrevImage("")
  }

  if (isSubmitted) {
    return (
      <div className='flex'>
        {<LeftVisualPanel />}
        <div className="w-1/2  justify-center items-center py-12  px-4 sm:px-6 lg:px-8 bg-[var(--color-primary)] ">
          <div className="bg-[var(--color-secondary)] mx-auto w-[80%] p-8 md:p-12 rounded-2xl shadow-lg border border-[var(--color-border)]">
            {/* Success Icon */}
            <div className="text-5xl text-[var(--color-accent-green)] mx-auto mb-4">✔️</div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-[var(--color-text-bright)]">
              Classroom Created!
            </h1>

            {/* Description */}
            <p className="mt-2 text-[var(--color-text-light)]">
              Your classroom is now live. Share the code below with your students.
            </p>

            {/* Join code box */}
            <div className="mt-6 bg-[var(--color-primary)] border-2 border-dashed border-[var(--color-border)] rounded-lg p-4">
              <p className="text-sm text-[var(--color-placeholder)]">Join Code</p>
              <p className="text-4xl font-bold tracking-widest text-[var(--color-accent-cyan)]">
                {joinCode}
              </p>
            </div>

            {/* Buttons */}
            <div className="mt-8 space-y-4">
              <a
                href="/classroom"
                className="block w-full py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg text-center"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))",
                  boxShadow: "var(--shadow-neon)",
                }}
              >
                Go to Classroom
              </a>

              <button
                onClick={newClassroom}
                className="block w-full hover:cursor-pointer py-3 rounded-md text-sm font-bold text-[var(--color-accent-cyan)] border border-[var(--color-accent-cyan)] hover:bg-[var(--color-secondary)] transition-all"
              >
                Create Another Classroom
              </button>
            </div>
          </div>
        </div>
      </div>

    );
  }

  return (
    <div className="createclassroom-body text-[var(--color-text-light)]">

      <div className='flex'>
        {<LeftVisualPanel />}
        <div className="w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-primary)] min-h-screen">
          <div className="createclassroom-main-wrapper w-full max-w-2xl animate-fadeIn">
            <div className="createclassroom-form-container bg-[var(--color-secondary)] p-8 md:p-12 rounded-2xl shadow-lg border border-[var(--color-border)]">
              <div className="createclassroom-header text-center mb-8">
                <h1 className="createclassroom-title text-4xl font-bold text-[var(--color-text-bright)]">
                  Create a New <span className="text-[var(--color-accent-cyan)]">Classroom</span>
                </h1>
                <p className="createclassroom-subtitle mt-2 text-[var(--color-text-light)]">
                  Fill in the details below to set up your new learning environment.
                </p>
              </div>

              {/* Form */}
              <form className="createclassroom-form space-y-6" onSubmit={(e) => { handleSubmit(e); }} >
                {/* Classroom Name */}
                <div className="createclassroom-input-group">
                  <label htmlFor="name" className="createclassroom-label block text-sm font-medium mb-1">
                    Classroom Name
                  </label>
                  <input
                    onChange={(e) => { setName(e.target.value); }}
                    type="text"
                    id="name"
                    placeholder="e.g., Analog Circuits 101"
                    className="custom-input w-full p-3 rounded-md text-sm"
                    required
                  />
                </div>

                {/* Course Code */}
                <div className="createclassroom-input-group">
                  <label htmlFor="course" className="createclassroom-label block text-sm font-medium mb-1">
                    Course Code
                  </label>
                  <input
                    onChange={(e) => { setCourse(e.target.value) }}
                    type="text"
                    id="course"
                    placeholder="e.g., EE-101"
                    className="custom-input w-full p-3 rounded-md text-sm"
                    required
                  />
                </div>

                {/* Description */}
                <div className="createclassroom-input-group">
                  <label htmlFor="description" className="createclassroom-label block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    onChange={(e) => { setDescription(e.target.value) }}
                    rows="4"
                    placeholder="A brief summary of what this classroom is about..."
                    className="custom-input w-full p-3 rounded-md text-sm"
                    required
                  ></textarea>
                </div>

                {/* Image Upload */}
                <div className="createclassroom-input-group">
                  <label htmlFor="file-upload" className="createclassroom-label block text-sm font-medium mb-1">
                    Classroom Banner Image (Optional)
                  </label>

                  <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-[var(--color-border)] border-dashed rounded-md">
                    <div className="space-y-1 text-center">

                      {/* Icon when no image */}
                      {!prevImage && (
                        <div className="mx-auto h-12 w-12 text-2xl text-[var(--color-placeholder)]">📤</div>
                      )}

                      <div className="flex text-sm text-[var(--color-text-light)] justify-center">
                        {prevImage ? (
                          <div className="relative mt-2 w-full">
                            <img
                              src={prevImage} // must be a URL
                              alt="Classroom preview"
                              className="w-full h-48 object-cover rounded-md border-2 border-[var(--color-border)]"
                            />
                            <button
                              type="button"
                              onClick={removeImage}
                              className="absolute top-2 right-2 bg-[var(--color-primary)] rounded-full p-1 text-[var(--color-accent-cyan)] hover:text-white"
                            >
                              <FiXCircle className="w-6 h-6" />
                            </button>
                          </div>
                        ) : (
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer bg-[var(--color-secondary)] rounded-md font-medium text-[var(--color-accent-cyan)] hover:text-[var(--color-accent-teal)]"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setImage(file); // store raw file for backend
                                  setPrevImage(URL.createObjectURL(file)); // preview for UI
                                }
                              }}
                            />
                          </label>
                        )}
                        {!prevImage && <p className="pl-1">to make sure</p>}
                      </div>

                      <p className="text-xs text-[var(--color-placeholder)]">PNG, JPG,  10MB</p>
                    </div>
                  </div>
                </div>


                {/* Submit */}
                <div className="createclassroom-submit-container">
                  <button
                    type="submit"
                    className="createclassroom-submit-button w-full mt-4 py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))",
                      boxShadow: "var(--shadow-neon)",
                    }}
                  >
                    Create Classroom
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default CreateClassroom;

