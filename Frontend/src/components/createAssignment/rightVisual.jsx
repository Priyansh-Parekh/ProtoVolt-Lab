import React, { useState } from 'react';

const RightVisual = () => {

    let todayDate = new Date(Date.now()).toISOString().split('T')[0];
    let eleComp = ['Resistor', 'Capacitor', 'Inductor', 'DC Source', 'AC Source', 'Ground', 'Transistor'];
    let digComp = ['AND Gate', 'OR Gate', 'NOT Gate', 'XOR Gate', 'NAND Gate', 'NOR Gate'];
    let checkComp = [...eleComp, ...digComp].map(comp => ({ type: comp, check: false }))
    let dataComp = [...eleComp, ...digComp].map(comp => ({ type: comp, qyt: 0 }))

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState(todayDate);
    const [apparatus, setApparatus] = useState(dataComp);
    const [isCheck, setIscheck] = useState(checkComp);
    const [file,setFile]=useState(null);


    const handleSubmit = ()=>{

    }

    return (
        <div className="lg:w-1/3 w-full">
            <div className="bg-[var(--color-secondary)] p-8 rounded-2xl shadow-lg border border-[var(--color-border)]">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {/* Assignment Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium mb-1">
                            Assignment Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            onChange={(e) => { setTitle(e.target.value) }}
                            required
                            placeholder="e.g., Lab 3: RLC Circuit Analysis"
                            className="custom-input w-full p-3 rounded-md text-sm"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="3"
                            onChange={(e) => { setDescription(e.target.value) }}
                            required
                            placeholder="Provide instructions and objectives..."
                            className="custom-input w-full p-3 rounded-md text-sm"
                        />
                    </div>

                    {/* Due Date */}
                    <div>
                        <label htmlFor="dueDate" className="block text-sm font-medium mb-1">
                            Due Date
                        </label>
                        <input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            onChange={(e) => { setDueDate(e.target.value) }}
                            required
                            className="custom-input w-full p-3 rounded-md text-sm"
                        />
                    </div>

                    {/* Apparatus Section */}
                    <div>
                        <label className="block text-sm font-medium mb-2">Apparatus Required</label>
                        <div className="space-y-4 max-h-48 overflow-y-auto p-3 bg-[var(--color-primary)] rounded-md border border-[var(--color-border)]">
                            {/* Analog Components */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-[var(--color-placeholder)] mb-2">Analog</h4>
                                <div className="space-y-2 text-sm">
                                    {eleComp.map(
                                        (item) => (
                                            <div key={item} className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" className="custom-checkbox" onChange={() => {
                                                        setIscheck(prev =>
                                                            prev.map(obj => obj.type === item ? { ...obj, check: !obj.check } : obj)
                                                        );
                                                    }} />
                                                    <span>{item}</span>
                                                </label>
                                                {isCheck.map(obj => (
                                                    obj.type === item && obj.check && (
                                                        <input
                                                            key={obj.type}
                                                            type="number"
                                                            min="1"
                                                            placeholder="Qty"
                                                            required
                                                            className="custom-input w-16 text-center p-1 rounded-md text-xs"
                                                            onChange={(e)=>{
                                                                setApparatus(prev=>
                                                                        prev.map(obj=>obj.type===item?{...obj,qyt: e.target.value}:obj)
                                                                );
                                                            }}
                                                        />
                                                    )
                                                ))}

                                            </div>
                                        )
                                    )}
                                </div>
                            </div>

                            {/* Digital Components */}
                            <div>
                                <h4 className="text-xs font-semibold uppercase text-[var(--color-placeholder)] mb-2 mt-4">
                                    Digital
                                </h4>
                                <div className="space-y-2 text-sm">
                                    {digComp.map((item) => (
                                        <div key={item} className="flex items-center justify-between">
                                                <label className="flex items-center space-x-2">
                                                    <input type="checkbox" className="custom-checkbox" onChange={() => {
                                                        setIscheck(prev =>
                                                            prev.map(obj => obj.type === item ? { ...obj, check: !obj.check } : obj)
                                                        );
                                                    }} />
                                                    <span>{item}</span>
                                                </label>
                                                {isCheck.map(obj => (
                                                    obj.type === item && obj.check && (
                                                        <input
                                                            key={obj.type}
                                                            type="number"
                                                            min="1"
                                                            placeholder="Qty"
                                                            required
                                                            className="custom-input w-16 text-center p-1 rounded-md text-xs"
                                                            onChange={(e)=>{
                                                                setApparatus(prev=>
                                                                        prev.map(obj=>obj.type===item?{...obj,qyt: e.target.value}:obj)
                                                                );
                                                            }}
                                                        />
                                                    )
                                                ))}

                                            </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Include Solution */}
                    <div className="flex items-center pt-2">
                        <input id="includeSolution" name="includeSolution" type="checkbox" className="custom-checkbox" />
                        <label htmlFor="includeSolution" className="ml-3 block text-sm font-medium">
                            Include solution for students to reference
                        </label>
                    </div>

                    {/* File Upload */}
                    <div>
                        <label htmlFor="uploadedFiles" className="block text-sm font-medium mb-1">
                            Attach Files (Optional)
                        </label>
                        <input
                            type="file"
                            id="uploadedFiles"
                            name="uploadedFiles"
                            onChange={(e)=>{setFile(e.target.files[0]); console.log(e.target.files[0])}}
                            className="custom-input file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[var(--color-tertiary)] file:text-[var(--color-accent-cyan)] hover:file:bg-[var(--color-primary)] w-full p-2 rounded-md text-sm"
                        />
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            className="w-full mt-4 py-3 rounded-md text-sm font-bold text-white transition-all hover:shadow-lg"
                            style={{
                                backgroundImage: 'linear-gradient(to right, var(--color-accent-cyan), var(--color-accent-teal), var(--color-accent-green))',
                                boxShadow: 'var(--shadow-neon)',
                            }}
                        >
                            Publish Assignment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RightVisual;
