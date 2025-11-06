#include <iostream>
#include <vector>
#include <memory>
#include <string>
#include <nlohmann/json.hpp>
using json = nlohmann::json;
using namespace std;

//-------------------------------------
// Helper Classes
//-------------------------------------

class Pos {
public:
    double x, y;
    Pos(double x = 0, double y = 0) : x(x), y(y) {}
};

class Terminal {
public:
    int id;
    string connectionType;
    Pos position;

    Terminal(int id = 0, const string& type = "", const Pos& pos = Pos())
        : id(id), connectionType(type), position(pos) {}
};

class Nodes {
public:
    vector<int> nodeIds;

    Nodes() {}
    Nodes(const vector<int>& ids) : nodeIds(ids) {}
};

//-------------------------------------
// Base Component
//-------------------------------------
class Component {
protected:
    string id, name, type;
    Pos position;
    Nodes nodes;
    vector<Terminal> terminals;

public:
    Component(const string& id, const string& name, const string& type, const Pos& pos, const Nodes& n, const vector<Terminal>& t)
        : id(id), name(name), type(type), position(pos), nodes(n), terminals(t) {}

    virtual ~Component() {}
    virtual void display() const = 0;
};

//-------------------------------------
// Properties as Classes
//-------------------------------------
class ResistorProperties {
public:
    double resistance;
    ResistorProperties(double r = 0) : resistance(r) {}
};

class CapacitorProperties {
public:
    double capacitance;
    CapacitorProperties(double c = 0) : capacitance(c) {}
};

class InductorProperties {
public:
    double inductance;
    InductorProperties(double l = 0) : inductance(l) {}
};

class DCSourceProperties {
public:
    double voltage;
    DCSourceProperties(double v = 0) : voltage(v) {}
};

class ACSourceProperties {
public:
    double amplitude, frequency;
    ACSourceProperties(double a = 0, double f = 0) : amplitude(a), frequency(f) {}
};

//-------------------------------------
// Derived Components
//-------------------------------------

class Resistor : public Component {
    ResistorProperties properties;
public:
    Resistor(const string& id, const string& name, const Pos& pos, const Nodes& n, const vector<Terminal>& t, const ResistorProperties& p)
        : Component(id, name, "resistor", pos, n, t), properties(p) {}

    void display() const override {
        cout << "Resistor " << name << " (" << id << ") Resistance: " << properties.resistance << " Ohms\n";
    }
};

class Capacitor : public Component {
    CapacitorProperties properties;
public:
    Capacitor(const string& id, const string& name, const Pos& pos, const Nodes& n, const vector<Terminal>& t, const CapacitorProperties& p)
        : Component(id, name, "capacitor", pos, n, t), properties(p) {}

    void display() const override {
        cout << "Capacitor " << name << " (" << id << ") Capacitance: " << properties.capacitance << " F\n";
    }
};

class Inductor : public Component {
    InductorProperties properties;
public:
    Inductor(const string& id, const string& name, const Pos& pos, const Nodes& n, const vector<Terminal>& t, const InductorProperties& p)
        : Component(id, name, "inductor", pos, n, t), properties(p) {}

    void display() const override {
        cout << "Inductor " << name << " (" << id << ") Inductance: " << properties.inductance << " H\n";
    }
};

class DCSource : public Component {
    DCSourceProperties properties;
public:
    DCSource(const string& id, const string& name, const Pos& pos, const Nodes& n, const vector<Terminal>& t, const DCSourceProperties& p)
        : Component(id, name, "dc_source", pos, n, t), properties(p) {}

    void display() const override {
        cout << "DC Source " << name << " (" << id << ") Voltage: " << properties.voltage << " V\n";
    }
};

class ACSource : public Component {
    ACSourceProperties properties;
public:
    ACSource(const string& id, const string& name, const Pos& pos, const Nodes& n, const vector<Terminal>& t, const ACSourceProperties& p)
        : Component(id, name, "ac_source", pos, n, t), properties(p) {}

    void display() const override {
        cout << "AC Source " << name << " (" << id << ") Amplitude: " << properties.amplitude
             << " V, Frequency: " << properties.frequency << " Hz\n";
    }
};

//-------------------------------------
// Circuit Class
//-------------------------------------
class Circuit {
public:
    vector<shared_ptr<Component>> components;

    void addComponent(shared_ptr<Component> comp) {
        components.push_back(comp);
    }

    void displayAll() const {
        cout << "\n--- Circuit Components ---\n";
        for (const auto& comp : components) comp->display();
    }
};

//-------------------------------------
// JSON Parser Function
//-------------------------------------
Circuit parseCircuitJSON(const string& jsonString) {
    Circuit circuit;
    auto data = json::parse(jsonString);

    for (auto& c : data["components"]) {
        string id = c["id"];
        string name = c["name"];
        string type = c["type"];
        Pos pos(c["position"]["x"], c["position"]["y"]);

        vector<int> nodeIds = c["nodes"].get<vector<int>>();
        Nodes nodes(nodeIds);

        vector<Terminal> terminals;
        for (auto& t : c["terminals"]) {
            terminals.emplace_back(t["id"], t["connectionType"], Pos(t["position"]["x"], t["position"]["y"]));
        }

        if (type == "resistor") {
            double r = c["properties"]["resistance"];
            circuit.addComponent(make_shared<Resistor>(id, name, pos, nodes, terminals, ResistorProperties(r)));
        } 
        else if (type == "capacitor") {
            double cap = c["properties"]["capacitance"];
            circuit.addComponent(make_shared<Capacitor>(id, name, pos, nodes, terminals, CapacitorProperties(cap)));
        } 
        else if (type == "inductor") {
            double ind = c["properties"]["inductance"];
            circuit.addComponent(make_shared<Inductor>(id, name, pos, nodes, terminals, InductorProperties(ind)));
        } 
        else if (type == "dc_source") {
            double v = c["properties"]["voltage"];
            circuit.addComponent(make_shared<DCSource>(id, name, pos, nodes, terminals, DCSourceProperties(v)));
        } 
        else if (type == "ac_source") {
            double amp = c["properties"]["amplitude"];
            double freq = c["properties"]["frequency"];
            circuit.addComponent(make_shared<ACSource>(id, name, pos, nodes, terminals, ACSourceProperties(amp, freq)));
        }
    }

    return circuit;
}

//-------------------------------------
// Example Usage
//-------------------------------------
int main() {
    string jsonData = R"({
        "components": [
            {
                "id": "R1",
                "name": "Res1",
                "type": "resistor",
                "position": {"x": 10, "y": 20},
                "nodes": [1, 2],
                "terminals": [
                    {"id": 1, "connectionType": "input", "position": {"x": 10, "y": 20}},
                    {"id": 2, "connectionType": "output", "position": {"x": 20, "y": 20}}
                ],
                "properties": {"resistance": 1000}
            },
            {
                "id": "V1",
                "name": "Battery",
                "type": "dc_source",
                "position": {"x": 5, "y": 5},
                "nodes": [0, 1],
                "terminals": [
                    {"id": 1, "connectionType": "positive", "position": {"x": 5, "y": 5}},
                    {"id": 2, "connectionType": "negative", "position": {"x": 6, "y": 5}}
                ],
                "properties": {"voltage": 9}
            }
        ]
    })";

    Circuit circuit = parseCircuitJSON(jsonData);
    circuit.displayAll();

    return 0;
}
