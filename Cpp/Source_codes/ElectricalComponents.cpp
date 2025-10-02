#include <bits/stdc++.h>
using namespace std;

class position {
public:
    int x;
    int y;
    position(int x, int y) {
        this->x = x;
        this->y = y;
    }
};

class nodes {
private:
    string id;
    position pos;
public:
    nodes(string id, position pos) {
        this->id = id;
        this->pos = pos;
    }
};

class terminal {
private:
    string id;
    nodes node;
public:
    terminal(string id, nodes node) {
        this->id = id;
        this->node = node;
    }
};

class components {
protected:
    string id;
    string type;
    string label;
    position pos;
    vector<terminal> terminals;
public:
    void set_data(string id, string type, string label, position pos, vector<terminal> terminals) {
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        this->terminals = terminals;
    }
    virtual void display() {
        cout << "ID: " << id << " | Type: " << type << " | Label: " << label
             << " | Position: (" << pos.x << "," << pos.y << ")" << endl;
    }
};

// Capacitor properties
class capacitor_properties {
private:
    double capacitance;
    string unit;
public:
    void setCapacitance(double c, string unit) {
        this->capacitance = c;
        this->unit = unit;
    }
    void show() {
        cout << "Capacitance: " << capacitance << " " << unit << endl;
    }
};

// Capacitor component
class capacitor : public components {
private:
    capacitor_properties properties;
public:
    capacitor(string id, string type, string label, position pos, vector<terminal> terminals, capacitor_properties props) {
        set_data(id, type, label, pos, terminals);
        this->properties = props;
    }
    void display() override {
        components::display();
        properties.show();
    }
};

// Inductor properties
class inductor_properties {
private:
    double inductance;
    string unit;
public:
    void setInductance(double l, string unit) {
        this->inductance = l;
        this->unit = unit;
    }
    void show() {
        cout << "Inductance: " << inductance << " " << unit << endl;
    }
};

// Inductor component
class inductor : public components {
private:
    inductor_properties properties;
public:
    inductor(string id, string type, string label, position pos, vector<terminal> terminals, inductor_properties props) {
        set_data(id, type, label, pos, terminals);
        this->properties = props;
    }
    void display() override {
        components::display();
        properties.show();
    }
};

// DC Source properties
class dcsource_properties {
private:
    double voltage;
    string unit;
public:
    void setVoltage(double v, string unit) {
        this->voltage = v;
        this->unit = unit;
    }
    void show() {
        cout << "Voltage: " << voltage << " " << unit << endl;
    }
};

// DC Source component
class dc_source : public components {
private:
    dcsource_properties properties;
public:
    dc_source(string id, string type, string label, position pos, vector<terminal> terminals, dcsource_properties props) {
        set_data(id, type, label, pos, terminals);
        this->properties = props;
    }
    void display() override {
        components::display();
        properties.show();
    }
};

// AC Source properties
class acsource_properties {
private:
    double voltage;
    double frequency;
    string unit;
public:
    void setValues(double v, double f, string unit) {
        this->voltage = v;
        this->frequency = f;
        this->unit = unit;
    }
    void show() {
        cout << "Voltage: " << voltage << " " << unit
             << " | Frequency: " << frequency << " Hz" << endl;
    }
};

// AC Source component
class ac_source : public components {
private:
    acsource_properties properties;
public:
    ac_source(string id, string type, string label, position pos, vector<terminal> terminals, acsource_properties props) {
        set_data(id, type, label, pos, terminals);
        this->properties = props;
    }
    void display() override {
        components::display();
        properties.show();
    }
};

// Ground component
class ground : public components {
public:
    ground(string id, string type, string label, position pos, vector<terminal> terminals) {
        set_data(id, type, label, pos, terminals);
    }
    void display() override {
        components::display();
        cout << "Ground component" << endl;
    }
};

// Transistor NPN properties
class transistor_npn_properties {
private:
    double beta;
    string unit;
public:
    void setBeta(double b, string unit) {
        this->beta = b;
        this->unit = unit;
    }
    void show() {
        cout << "Beta: " << beta << " " << unit << endl;
    }
};

// Transistor NPN component
class transistor_npn : public components {
private:
    transistor_npn_properties properties;
public:
    transistor_npn(string id, string type, string label, position pos, vector<terminal> terminals, transistor_npn_properties props) {
        set_data(id, type, label, pos, terminals);
        this->properties = props;
    }
    void display() override {
        components::display();
        properties.show();
    }
};

//CIRCUIT CLASS 
class Circuit {
private:
    string name;
    bool analyzed;
    vector<shared_ptr<Component>> components;  // store mixed components
public:
    Circuit(string name): name(name), analyzed(false) {}

    void addComponent(shared_ptr<Component> comp) {
        components.push_back(comp);
    }

    void showCircuit() {
        cout << "Circuit: " << name << endl;
        for(auto &c : components) {
            c->display();
        
        }
    }
};