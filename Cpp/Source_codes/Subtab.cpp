#include <bits/stdc++.h>
using namespace std;

// Forward declaration of circuit class
class circuit;

class subTab {
private:
    string name;
    circuit* circ; // pointer to associated circuit object

public:
    subTab(string name, circuit* circ) {
        this->name = name;
        this->circ = circ;
    }

    void setData(string name, circuit* circ) {
        this->name = name;
        this->circ = circ;
    }

    string getName() {
        return name;
    }

    circuit* getCircuit() {
        return circ;
    }
};
