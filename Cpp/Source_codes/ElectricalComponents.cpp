#include <bits/stdc++.h>
using namespace std;

//----------------- BASIC CLASSES -----------------
class pos {
public:
    int x, y;
    pos(int x = 0, int y = 0): x(x), y(y) {}
};

class nodes {
private:
    string id;
    pos position;
public:
    nodes(string id = "", pos position = {}): id(id), position(position) {}
};

class terminal {
private:
    string id;
    nodes node;
public:
    terminal(string id = "", nodes node = {}): id(id), node(node) {}
};

//----------------- ELECTRICAL QUANTITIES -----------------
class voltage {
public:
    double value;
    string unit;
    void setVoltage(double v, string u){ value = v; unit = u; }
};

class current {
public:
    double value;
    string unit;
    void setCurrent(double i, string u){ value = i; unit = u; }
};

class charge {
public:
    double value;
    string unit;
    void setCharge(double q, string u){ value = q; unit = u; }
};

class frequency {
public:
    double value;
    string unit;
    void setFrequency(double f, string u){ value = f; unit = u; }
};

class beta {
public:
    double value;
    string unit;
    void setBeta(double b, string u) { this->value = b; this->unit = u; }
};

class resistance {
public:
    double value;
    string unit;
    void setResistance(double r, string u){ value = r; unit = u; }
};

class capacitance {
public:
    double value;
    string unit;
    void setCapacitance(double c, string u){ value = c; unit = u; }
};

class inductance {
public:
    double value;
    string unit;
    void setInductance(double l, string u){ value = l; unit = u; }
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
    component(string id, string type, string label, pos position, vector<terminal> terminals)
        : id(id), type(type), label(label), position(position), terminals(terminals) {}

    virtual void display() {
        cout << "ID: " << id << " | Type: " << type << " | Label: " << label
             << " | pos: (" << position.x << "," << position.y << ")" << endl;
    }

    virtual ~component() = default; // important for polymorphism
};

//----------------- RESISTOR -----------------
class resistor_properties {
private:
    resistance R;
    voltage V;
    current I;
public:
    void show() {
        cout << "Resistance: " << R.value << " " << R.unit << endl;
        cout << "Voltage: " << V.value << " " << V.unit << endl;
        cout << "Current: " << I.value << " " << I.unit << endl;
    }
    void setResistance(double r, string u){ R.setResistance(r, u); }
    void setVoltage(double v, string u){ V.setVoltage(v, u); }
    void setCurrent(double i, string u){ I.setCurrent(i, u); }
};

class resistor : public component {
private:
    resistor_properties properties;
public:
    resistor(string id, string type, string label, pos position, vector<terminal> terminals, resistor_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- CAPACITOR -----------------
class capacitor_properties {
private:
    capacitance C;
    voltage V;
    charge Q;
public:
    void show() {
        cout << "Capacitance: " << C.value << " " << C.unit << endl;
        cout << "Voltage: " << V.value << " " << V.unit << endl;
        cout << "Charge: " << Q.value << " " << Q.unit << endl;
    }
};

class capacitor : public component {
private:
    capacitor_properties properties;
public:
    capacitor(string id, string type, string label, pos position, vector<terminal> terminals, capacitor_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- INDUCTOR -----------------
class inductor_properties {
private:
    inductance L;
    current I;
    voltage V;
public:
    void show() {
        cout << "Inductance: " << L.value << " " << L.unit << endl;
        cout << "Voltage: " << V.value << " " << V.unit << endl;
        cout << "Current: " << I.value << " " << I.unit << endl;
    }
};

class inductor : public component {
private:
    inductor_properties properties;
public:
    inductor(string id, string type, string label, pos position, vector<terminal> terminals, inductor_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- DC SOURCE -----------------
class dcsource_properties {
private:
    voltage V;
    resistance r;
public:
    void show() {
        cout << "Voltage: " << V.value << " " << V.unit << endl;
        cout << "Internal Resistance: " << r.value << " " << r.unit << endl;
    }
};

class dc_source : public component {
private:
    dcsource_properties properties;
public:
    dc_source(string id, string type, string label, pos position, vector<terminal> terminals, dcsource_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- AC SOURCE -----------------
class acsource_properties {
private:
    voltage V;
    frequency f;
public:
    void show() {
        cout << "Voltage: " << V.value << " " << V.unit << endl;
        cout << "Frequency: " << f.value << " " << f.unit << endl;
    }
};

class ac_source : public component {
private:
    acsource_properties properties;
public:
    ac_source(string id, string type, string label, pos position, vector<terminal> terminals, acsource_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- GROUND -----------------
class ground : public component {
public:
    ground(string id, string type, string label, pos position, vector<terminal> terminals)
        : component(id, type, label, position, terminals) {}

    void display() override {
        component::display();
        cout << "Ground component" << endl;
    }
};

//----------------- TRANSISTOR NPN -----------------
class transistor_npn_properties {
private:
   beta B;
public:
    void show() {
        cout << "Beta: " << B.value << " " << B.unit << endl;
    }
};

class transistor_npn : public component {
private:
    transistor_npn_properties properties;
public:
    transistor_npn(string id, string type, string label, pos position, vector<terminal> terminals, transistor_npn_properties props)
        : component(id, type, label, position, terminals), properties(props) {}

    void display() override {
        component::display();
        properties.show();
    }
};

//----------------- UNION FOR COMPONENTS -----------------
union ComponentsStack {
    resistor* res;
    capacitor* cap;
    inductor* ind;
    dc_source* dc;
    ac_source* ac;
    ground* grd;
    transistor_npn* tnpn;
    component* base;

    ComponentsStack() { base = nullptr; }
};

//----------------- CIRCUIT -----------------
class Circuit {
private:
    string name;
    bool analyzed;
    vector<shared_ptr<component>> comps;
public:
    Circuit(string name): name(name), analyzed(false) {}

    void addComponent(shared_ptr<component> comp) {
        comps.push_back(comp);
    }

    void showCircuit() {
        cout << "Circuit: " << name << endl;
        for (auto &c : comps) {
            c->display();
            cout << "-------------------------" << endl;
        }
    }
};


