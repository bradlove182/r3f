
uniform int attractor;
uniform sampler2D positions;
uniform float time;

varying vec2 vUv;

vec3 lorezAttractor(vec3 pos) {
    // Lorenz Attractor parameters
    float a = 10.0;
    float b = 28.0;
    float c = 2.6666666667;

    // Timestep
    float dt = 0.004;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = dt * (a * (y - x));
    dy = dt * (x * (b - z) - y);
    dz = dt * (x * y - c * z);

    return vec3(dx, dy, dz);
}

vec3 lorezMod2Attractor(vec3 pos) {
    // Lorenz Mod2 Attractor parameters
    float a = 0.9;
    float b = 5.0;
    float c = 9.9;
    float d = 1.0;

    // Timestep
    float dt = 0.0005;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = (-a*x+ y*y - z*z + a *c) * dt;
    dy = (x*(y-b*z)+d)  * dt;
    dz = (-z + x*(b*y +z))  * dt;

    return vec3(dx, dy, dz);
}

vec3 thomasAttractor(vec3 pos) {
    float b = 0.19;

    // Timestep
    float dt = 0.01;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = (-b*x + sin(y)) * dt;
    dy = (-b*y + sin(z)) * dt;
    dz = (-b*z + sin(x)) * dt;

    return vec3(dx, dy, dz);
}

vec3 dequanAttractor(vec3 pos) {
    float a = 40.0;
    float b = 1.833;
    float c = 0.16;
    float d = 0.65;
    float e = 55.0;
    float f = 20.0;

    // Timestep
    float dt = 0.0005;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = ( a*(y-x) + c*x*z) * dt;
    dy = (e*x + f*y - x*z) * dt;
    dz = (b*z + x*y - d*x*x) * dt;

    return vec3(dx, dy, dz);
}

vec3 dradasAttractor(vec3 pos) {
    float a = 3.0;
    float b = 2.7;
    float c = 1.7;
    float d = 2.0;
    float e = 9.0;

    // Timestep
    float dt = 0.0020;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = (y- a*x +b*y*z) * dt;
    dy = (c*y -x*z +z) * dt;
    dz = (d*x*y - e*z) * dt;

    return vec3(dx, dy, dz);
}

vec3 arneodoAttractor(vec3 pos) {
    float a = -5.5;
    float b = 3.5;
    float d = -1.0;

    // Timestep
    float dt = 0.0020;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = y * dt;
    dy = z * dt;
    dz = (-a*x -b*y -z + (d* (pow(x, 3.0)))) * dt;

    return vec3(dx, dy, dz);
}

vec3 aizawaAttractor(vec3 pos) {
    float a = 0.95;
    float b = 0.7;
    float c = 0.6;
    float d = 3.5;
    float e = 0.25;
    float f = 0.1;

    // Timestep
    float dt = 0.003;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = ((z-b) * x - d*y) * dt;
    dy = (d * x + (z-b) * y) * dt;
    dz = (c + a*z - ((z*z*z) / 3.0) - (x*x) + f * z * (x*x*x)) * dt;

    return vec3(dx, dy, dz);
}

vec3 tsucsa(vec3 pos){
    float a = 40.0;
    float b = 0.833;
    float c = 20.0;
    float d = 0.5;
    float e = 0.65;

    // Timestep
    float dt = 0.001;

    float x = pos.x;
    float y = pos.y;
    float z = pos.z;

    float dx, dy, dz;

    dx = (a * (y-x) + d * x * z) * dt;
    dy = (c * y - x * z) * dt;
    dz = (b * z + x * y - e * x * x) * dt;

    return vec3(dx, dy, dz);
}

void main() {
    vec3 pos = texture2D(positions, vUv).xyz;
    vec3 curlPos = texture2D(positions, vUv).xyz;
    vec3 delta;

    if(attractor == 0){
        delta = lorezAttractor(pos);
    }

    if(attractor == 1){
        delta = lorezMod2Attractor(pos);
    }

    if(attractor == 2){
        delta = thomasAttractor(pos);
    }

    if(attractor == 3){
        delta = dequanAttractor(pos);
    }

    if(attractor == 4){
        delta = dradasAttractor(pos);
    }

    if(attractor == 5){
        delta = arneodoAttractor(pos);
    }

    if(attractor == 6){
        delta = aizawaAttractor(pos);
    }

    if(attractor == 7){
        delta = tsucsa(pos);
    }

    //   pos.x += cos(pos.y) / 100.0;
    //   pos.y += tan(pos.x) / 100.0;

    pos += delta;

    gl_FragColor = vec4(pos, 1.0);
}