#include <iostream>
#include <string>
using namespace std;

// Position class
class position{
public:
    int x;
    int y;
    position(int x,int y){
        this->x = x;
        this->y = y;
    }
};

// Node class
class nodes{
private:
    string id;
    position pos;
public:
    nodes(string id,position pos){
        this->id = id;
        this->pos = pos;
    }
};

// Terminal class
class terminal{
private:
    string id;
    nodes node;
public:
    terminal(string id,nodes node){
        this->id = id;
        this->node = node;
    }
};

// Base components class
class components{
protected:
    string id;
    string type;
    string label;
    position pos;
    terminal terminals[10];  // fixed size array, can store up to 10 terminals
    int terminalCount;        // actual number of terminals used
public:
    void set_data(string id,string type,string label,position pos,terminal t[], int count){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
    }
};

// Digital component properties
class digital_properties{
private:
    int numInputs;
    int numOutputs;
public:
    digital_properties(int inputs=2,int outputs=1){
        this->numInputs = inputs;
        this->numOutputs = outputs;
    }

    void setInputs(int n){ this->numInputs = n; }
    void setOutputs(int n){ this->numOutputs = n; }

    int getInputs(){ return this->numInputs; }
    int getOutputs(){ return this->numOutputs; }
};

// AND gate
class and_gate : public components{
private:
    digital_properties properties;
public:
    and_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};

// OR gate
class or_gate : public components{
private:
    digital_properties properties;
public:
    or_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};

// NOT gate
class not_gate : public components{
private:
    digital_properties properties;
public:
    not_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};

// XOR gate
class xor_gate : public components{
private:
    digital_properties properties;
public:
    xor_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};

// NAND gate
class nand_gate : public components{
private:
    digital_properties properties;
public:
    nand_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};

// NOR gate
class nor_gate : public components{
private:
    digital_properties properties;
public:
    nor_gate(string id, string type, string label, position pos, terminal t[], int count, digital_properties properties){
        this->id = id;
        this->type = type;
        this->label = label;
        this->pos = pos;
        terminalCount = count;
        for(int i=0;i<count;i++){
            terminals[i] = t[i];
        }
        this->properties = properties;
    }

    void setProperties(int inputs, int outputs){
        properties.setInputs(inputs);
        properties.setOutputs(outputs);
    }

    digital_properties getProperties(){ return properties; }
};
