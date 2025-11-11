#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <memory>
#include <map>
#include <nlohmann/json.hpp>

using namespace std;
using json = nlohmann::json;

//----------------- BASIC CLASSES -----------------
class pos {
public:
    double x, y;
    pos(double x = 0, double y = 0): x(x), y(y) {}
};

class nodes {
private:
    string id;
    pos position;
public:
    nodes(string id = "", pos position = {}): id(id), position(position) {}
    string getId() const { return id; }
    pos getPos() const { return position; }
};

class terminal {
private:
    string id;
    nodes node;
public:
    terminal(string id = "", nodes node = {}): id(id), node(node) {}
    string getId() const { return id; }
    nodes getNode() const { return node; }
};

//----------------- ELECTRICAL QUANTITIES -----------------
class resistance {
public:
    double value;
    string unit;
    void setResistance(double r, string u){ value = r; unit = u; }
};

class voltage {
public:
    double value;
    string unit;
    void setVoltage(double v, string u){ value = v; unit = u; }
};

class inductance {
public:
    double value;
    string unit;
    void setInductance(double v, string u){ value = v; unit = u; }
};

//----------------- BASE COMPONENT CLASS -----------------
class component {
protected:
    string id;
    string type;
    string label;
    pos position;
    vector<terminal> terminals;
public:
    component(string id = "", string type = "", string label = "", pos position = {}, vector<terminal> terminals = {})
        : id(id), type(type), label(label), position(position), terminals(terminals) {}
    virtual ~component() = default;
    string getType() const { return type; }
    vector<terminal> getTerminals() const { return terminals; }
};

//----------------- RESISTOR -----------------
class resistor_properties {
private:
    resistance R;
public:
    void setResistance(double r, string u){ R.setResistance(r, u); }
};

class resistor : public component {
private:
    resistor_properties properties;
public:
    resistor(string id, string type, string label, pos position, vector<terminal> terminals, resistor_properties props)
        : component(id, type, label, position, terminals), properties(props) {}
};

//----------------- DC SOURCE -----------------
class dcsource_properties {
private:
    voltage V;
public:
    void setVoltage(double v, string u){ V.setVoltage(v, u); }
};

class dc_source : public component {
private:
    dcsource_properties properties;
public:
    dc_source(string id, string type, string label, pos position, vector<terminal> terminals, dcsource_properties props)
        : component(id, type, label, position, terminals), properties(props) {}
};

//----------------- INDUCTOR -----------------
class inductor_properties {
private:
    inductance L;
public:
    void setInductance(double v, string u){ L.setInductance(v, u); }
};

class inductor : public component {
private:
    inductor_properties properties;
public:
    inductor(string id, string type, string label, pos position, vector<terminal> terminals, inductor_properties props)
        : component(id, type, label, position, terminals), properties(props) {}
};

//----------------- CIRCUIT -----------------
class Circuit {
private:
    string name;
    vector<shared_ptr<component>> comps;
public:
    Circuit(string name="Unnamed"): name(name) {}
    void addComponent(shared_ptr<component> comp) {
        comps.push_back(comp);
    }
    int getComponentsCount() const {
        return static_cast<int>(comps.size());
    }
    string getComponentTypesSummary() const {
        if (comps.empty()) {
            return "none";
        }
        map<string,int> typeCounts;
        for (auto &cptr : comps) {
            if (cptr) {
                typeCounts[cptr->getType()] += 1;
            }
        }
        string summary;
        for (auto &p : typeCounts) {
            if (!summary.empty()) summary += ",";
            summary += p.first + ":" + to_string(p.second);
        }
        return summary;
    }

    // NEW: Evaluate open/closed circuit
    string getCircuitStatus() const {
        map<string,int> nodeDegree;
        for (auto &cptr : comps) {
            if (cptr) {
                for (auto &t : cptr->getTerminals()) {
                    string nid = t.getNode().getId();
                    nodeDegree[nid]++;
                }
            }
        }

        if (nodeDegree.empty()) return "open";

        // Simple rule: if any node has <2 connections, it's open
        for (auto &p : nodeDegree) {
            if (p.second < 2) return "open";
        }
        return "closed";
    }
};

//----------------- ADL SERIALIZATION -----------------
void from_json(const json& j, pos& p) {
    j.at("x").get_to(p.x);
    j.at("y").get_to(p.y);
}
void from_json(const json& j, nodes& n) {
    n = nodes(j.at("id").get<string>(), j.at("position").get<pos>());
}
void from_json(const json& j, terminal& t) {
    string nodeId = j.at("nodeId").get<string>();
    nodes nd(nodeId, pos());
    t = terminal(j.at("id").get<string>(), nd);
}
void from_json(const json& j, resistor_properties& rp) {
    if (j.contains("resistance")) {
        double val = stod(j.at("resistance").at("value").get<string>());
        string unit = j.at("resistance").at("unit").get<string>();
        rp.setResistance(val, unit);
    }
}
void from_json(const json& j, dcsource_properties& dp) {
    if (j.contains("voltage")) {
        double val = stod(j.at("voltage").at("value").get<string>());
        string unit = j.at("voltage").at("unit").get<string>();
        dp.setVoltage(val, unit);
    }
}
void from_json(const json& j, inductor_properties& ip) {
    if (j.contains("inductance")) {
        double val = stod(j.at("inductance").at("value").get<string>());
        string unit = j.at("inductance").at("unit").get<string>();
        ip.setInductance(val, unit);
    }
}

//----------------- COMPONENT PARSER -----------------
shared_ptr<component> parse_component(const json& j) {
    string type  = j.at("type").get<string>();
    string id    = j.at("id").get<string>();
    string label = j.at("label").get<string>();
    pos position = j.at("position").get<pos>();
    vector<terminal> terms;
    if (j.contains("terminals")) terms = j.at("terminals").get<vector<terminal>>();

    if (type == "resistor") {
        resistor_properties rp = j.at("properties").get<resistor_properties>();
        return make_shared<resistor>(id, type, label, position, terms, rp);
    } 
    else if (type == "dc-source") {
        dcsource_properties dp = j.at("properties").get<dcsource_properties>();
        return make_shared<dc_source>(id, type, label, position, terms, dp);
    }
    else if (type == "inductor") {
        inductor_properties ip = j.at("properties").get<inductor_properties>();
        return make_shared<inductor>(id, type, label, position, terms, ip);
    } 
    else {
        return make_shared<component>(id, type, label, position, terms);
    }
}

void from_json(const json& j, Circuit& c) {
    Circuit temp("CircuitFromJSON");
    if (j.contains("components")) {
        for (auto &comp : j.at("components")) {
            temp.addComponent(parse_component(comp));
        }
    }
    c = temp;
}

//----------------- MAIN -----------------
int main(int argc, char* argv[]) {
    if (argc < 2) {
        cerr << "Usage: engine <jsonFile>\n";
        return 1;
    }
    string inputFile = argv[1];
    ifstream in(inputFile);
    if (!in) {
        cerr << "Cannot open file " << inputFile << "\n";
        return 2;
    }
    json j;
    try {
        in >> j;
    } catch (exception &e) {
        cerr << "JSON parse error: " << e.what() << "\n";
        return 3;
    }
    Circuit circuit = j.get<Circuit>();

    int count = circuit.getComponentsCount();
    string summary = circuit.getComponentTypesSummary();
    string status = circuit.getCircuitStatus();

    json out;
    out["typeSummary"] = summary;
    out["count"] = count;
    out["status"] = status;

    cout << out.dump() << endl;
    return 0;
}
