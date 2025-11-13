#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <map>
#include <memory>
#include <algorithm>
#include "json.hpp"

using namespace std;
using json = nlohmann::json;


double safeStod(const string& str) {
    if (str.empty()) return 0.0;
    try {
        return stod(str);
    } catch (...) {
        return 0.0;
    }
}

struct Position {
    double x, y;
};

struct Terminal {
    string id;    
    string nodeId;
};

void from_json(const json& j, Position& p) {
    j.at("x").get_to(p.x);
    j.at("y").get_to(p.y);
}

void from_json(const json& j, Terminal& t) {
    j.at("id").get_to(t.id);
    j.at("nodeId").get_to(t.nodeId);
}


class Component {
protected:
    string id;
    string type;
    string label;
    Position position;
    vector<Terminal> terminals;

public:
    Component(string id, string type, string lbl, Position pos, vector<Terminal> terms)
        : id(id), type(type), label(lbl), position(pos), terminals(terms) {}

    virtual ~Component() = default;

    string getType() const { return type; }
    const vector<Terminal>& getTerminals() const { return terminals; }
};

// --- PASSIVE COMPONENTS ---
class Resistor : public Component {
    double resistance;
public:
    Resistor(string id, string lbl, Position pos, vector<Terminal> terms, double r)
        : Component(id, "resistor", lbl, pos, terms), resistance(r) {}
};

class Capacitor : public Component {
    double capacitance;
public:
    Capacitor(string id, string lbl, Position pos, vector<Terminal> terms, double c)
        : Component(id, "capacitor", lbl, pos, terms), capacitance(c) {}
};

class Inductor : public Component {
    double inductance;
public:
    Inductor(string id, string lbl, Position pos, vector<Terminal> terms, double l)
        : Component(id, "inductor", lbl, pos, terms), inductance(l) {}
};

// --- SOURCES ---
class DCSource : public Component {
    double voltage;
public:
    DCSource(string id, string lbl, Position pos, vector<Terminal> terms, double v)
        : Component(id, "dc-source", lbl, pos, terms), voltage(v) {}
};

class ACSource : public Component {
    double voltage;
    double frequency;
public:
    ACSource(string id, string lbl, Position pos, vector<Terminal> terms, double v, double f)
        : Component(id, "ac-source", lbl, pos, terms), voltage(v), frequency(f) {}
};

// --- SEMICONDUCTORS ---
class Transistor : public Component {
    double beta;
public:
    Transistor(string id, string type, string lbl, Position pos, vector<Terminal> terms, double b)
        : Component(id, type, lbl, pos, terms), beta(b) {}
};

// --- METERS & MISC ---
class Meter : public Component {
public:
    Meter(string id, string type, string lbl, Position pos, vector<Terminal> terms)
        : Component(id, type, lbl, pos, terms) {}
};

class Ground : public Component {
public:
    Ground(string id, string lbl, Position pos, vector<Terminal> terms)
        : Component(id, "ground", lbl, pos, terms) {}
};

// --- LOGIC GATES ---
class LogicGate : public Component {
    string logicState; // e.g., HIGH/LOW or numeric
public:
    LogicGate(string id, string type, string lbl, Position pos, vector<Terminal> terms, string state)
        : Component(id, type, lbl, pos, terms), logicState(state) {}
};


class ComponentFactory {
public:
    static shared_ptr<Component> createComponent(const json& j) {
        string type = j.at("type").get<string>();
        string id = j.at("id").get<string>();
        string label = j.at("label").get<string>();
        Position pos = j.at("position").get<Position>();
        
        vector<Terminal> terminals;
        if (j.contains("terminals")) {
            terminals = j.at("terminals").get<vector<Terminal>>();
        }

        // Helper lambda to extract property value safely
        auto getProp = [&](const string& cat, const string& key) -> double {
            if (j.contains("properties") && j["properties"].contains(cat) && j["properties"][cat].contains(key)) {
                return safeStod(j["properties"][cat][key].get<string>());
            }
            return 0.0;
        };

        if (type == "resistor") {
            return make_shared<Resistor>(id, label, pos, terminals, getProp("resistance", "value"));
        }
        else if (type == "capacitor") {
            return make_shared<Capacitor>(id, label, pos, terminals, getProp("capacitance", "value"));
        }
        else if (type == "inductor") {
            return make_shared<Inductor>(id, label, pos, terminals, getProp("inductance", "value"));
        }
        else if (type == "dc-source") {
            return make_shared<DCSource>(id, label, pos, terminals, getProp("voltage", "value"));
        }
        else if (type == "ac-source") {
            return make_shared<ACSource>(id, label, pos, terminals, getProp("voltage", "value"), getProp("frequency", "value"));
        }
        else if (type == "transistor-npn" || type == "transistor-pnp") {
            return make_shared<Transistor>(id, type, label, pos, terminals, getProp("beta", "value"));
        }
        else if (type == "ground") {
            return make_shared<Ground>(id, label, pos, terminals);
        }
        else if (type == "voltmeter" || type == "ammeter") {
            return make_shared<Meter>(id, type, label, pos, terminals);
        }
        else if (type.find("-gate") != string::npos) {
            // Handles or-gate, and-gate, not-gate, xor-gate
            string state = "";
            if(j.contains("properties") && j["properties"].contains("logicState")) 
                state = j["properties"]["logicState"]["value"];
            return make_shared<LogicGate>(id, type, label, pos, terminals, state);
        }

        // Fallback
        return make_shared<Component>(id, type, label, pos, terminals);
    }
};

class CircuitAnalyzer {
public:
    struct Result {
        bool isOpen;
        vector<string> danglingNodes;
        int componentCount;
    };

    static Result analyze(const vector<shared_ptr<Component>>& components) {
        map<string, int> nodeDegree;

        for (const auto& comp : components) {
            for (const auto& term : comp->getTerminals()) {
                nodeDegree[term.nodeId]++;
            }
        }

        Result res;
        res.isOpen = false;
        res.componentCount = components.size();

        // 2. Check for Open Circuits
        for (const auto& pair : nodeDegree) {
            if (pair.second < 2) {
                res.isOpen = true;
                res.danglingNodes.push_back(pair.first);
            }
        }
            
        return res;
    }
};


int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: engine.exe <json_file>" << endl;
        return 1; // Standard error
    }

    ifstream file(argv[1]);
    if (!file.is_open()) {
        cerr << "Error opening file" << endl;
        return 1; // Standard error
    }

    json jInput;
    try {
        file >> jInput;
    } catch (exception& e) {
        cerr << "JSON Parse Error: " << e.what() << endl;
        return 1; // Standard error
    }

    vector<shared_ptr<Component>> circuit;

    if (jInput.contains("circuit_data") && jInput["circuit_data"].contains("components")) {
        for (const auto& jComp : jInput["circuit_data"]["components"]) {
            circuit.push_back(ComponentFactory::createComponent(jComp));
        }
    }

    auto result = CircuitAnalyzer::analyze(circuit);

    json jOutput;
    jOutput["component_count"] = result.componentCount;
    jOutput["dangling_nodes"] = result.danglingNodes;

    // *** NEW LOGIC ***
    // We create a "report" for the frontend.
    if (result.isOpen) {
        jOutput["status"] = "error";
        jOutput["message"] = "Circuit analysis failed: Circuit is open.";
        jOutput["is_open"] = true;
        
        // Print the error report to stdout
        cout << jOutput.dump(4) << endl;
        
        // Return 1 to signal an "error" (a logical one)
        return 1; 
    } else {
        jOutput["status"] = "ok";
        jOutput["message"] = "Circuit analysis successful.";
        jOutput["is_open"] = false;
        
        // Print the success report to stdout
        cout << jOutput.dump(4) << endl;
        
        // Return 0 to signal success
        return 0;
    }
}