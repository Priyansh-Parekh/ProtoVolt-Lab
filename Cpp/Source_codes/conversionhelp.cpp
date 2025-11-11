Napi::Array arr = info[0].As<Napi::Array>();
for(uint32_t i = 0; i < arr.Length(); ++i) {
    Napi::Object obj = arr.Get(i).As<Napi::Object>();
    std::string type = obj.Get("type").As<Napi::String>();

    if(type == "capacitor") {
        double cap = obj.Get("capacitance").As<Napi::Number>();
        // create capacitor object in C++
        auto c = std::make_shared<capacitor>(...);
        circuitObj.addComponent(c);
    } else if(type == "ac_source") {
        double v = obj.Get("voltage").As<Napi::Number>();
        // create ac_source object
        auto a = std::make_shared<ac_source>(...);
        circuitObj.addComponent(a);
    }
}
