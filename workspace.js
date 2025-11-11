const fs = require("fs");
const { execFile } = require("child_process");

const data = {
  nodes: [
    { id: "node-n1", position: { x: 100, y: 100 } },
    { id: "node-n2", position: { x: 200, y: 100 } },
    { id: "node-n3", position: { x: 300, y: 100 } },
    { id: "node-n4", position: { x: 400, y: 100 } },
    { id: "node-n5", position: { x: 500, y: 100 } }
  ],
  components: [
    {
      id: "r1",
      type: "resistor",
      label: "R1",
      position: { x: 150, y: 100 },
      properties: { resistance: { value: "100", unit: "Ω" } },
      terminals: [
        { id: "t1", nodeId: "node-n1" },
        { id: "t2", nodeId: "node-n2" }
      ]
    },
    {
      id: "r2",
      type: "resistor",
      label: "R2",
      position: { x: 250, y: 100 },
      properties: { resistance: { value: "150", unit: "Ω" } },
      terminals: [
        { id: "t1", nodeId: "node-n2" },
        { id: "t2", nodeId: "node-n3" }
      ]
    },
    {
      id: "r3",
      type: "resistor",
      label: "R3",
      position: { x: 350, y: 100 },
      properties: { resistance: { value: "200", unit: "Ω" } },
      terminals: [
        { id: "t1", nodeId: "node-n3" },
        { id: "t2", nodeId: "node-n4" }
      ]
    },
    {
      id: "l1",
      type: "inductor",
      label: "L1",
      position: { x: 450, y: 100 },
      properties: { inductance: { value: "5", unit: "H" } },
      terminals: [
        { id: "t1", nodeId: "node-n4" },
        { id: "t2", nodeId: "node-n5" }
      ]
    },
    {
      id: "l2",
      type: "inductor",
      label: "L2",
      position: { x: 550, y: 100 },
      properties: { inductance: { value: "10", unit: "H" } },
      terminals: [
        { id: "t1", nodeId: "node-n5" },
        { id: "t2", nodeId: "node-n1" }
      ]
    }
  ]
};

const filename = "circuit_input.json";
fs.writeFileSync(filename, JSON.stringify(data, null, 2), "utf8");
console.log(`✅ Written circuit JSON to ${filename}`);

const enginePath = "C:/Users/HP/Desktop/cpp_project/test.exe";

execFile(enginePath, [filename], (error, stdout, stderr) => {
  if (error) {
    console.error("❌ Engine error:", error);
  }
  if (stderr) console.error("⚠️ Engine stderr:", stderr);

  try {
    const result = JSON.parse(stdout);
    console.log("⚡ Engine output:", result);
  } catch (e) {
    console.error("❌ Could not parse output:", stdout);
  }

  // cleanup
  try {
    fs.unlinkSync(filename);
    console.log(`🧹 Cleaned up ${filename}`);
  } catch (err) {
    console.error("⚠️ Cleanup failed:", err);
  }
});
