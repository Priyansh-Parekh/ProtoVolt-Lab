#include<bits/stdc++.h>
using namespace std;

// For nodes of Circuit or connectors between two Components
class position{
    public:
        int x;
        int y;
        position(int x,int y){
            this->x = x;
            this->y = y;
        }
};

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


//terminal class
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

// components class
class components{
    private:
        string id;
        string type;
        string label;
        position pos;
        vector<terminal> terminals;
    public:
        void set_data(string id,string type,string label,position pos,vector<terminal> terminals){
            this->id = id;
            this->type = type;
            this->label = label;
            this->pos = pos;
            this->terminals= terminals;
        }
};
// resistor properties
class resistor_properties{
    private:
        int resistance;
        string unit;
    public:
        void setResistance(int resistance,string unit){
            this->resistance = resistance;
            this->unit = unit;
        }
};
// resistor class
class resistor:public components{
    private:
        resistor_properties properties;
    public:
        resistor(string id,
                 string type,
                 string label,
                 position pos,
                 vector<terminal> terminals,
                 resistor_properties properties){
                         this->properties = properties;

            }
        void setResistance(int resistance,string unit){
            this->properties.setResistance(resistance,unit);
        }
        resistor_properties getResistance(){
            return this->properties;
        }
};

// circuit class
class circuit{
    private:
        string name;
        bool analyzed;
        // here is the issue that how we are going to store different
        //compontes in one vector or any other data structure
    public:

};