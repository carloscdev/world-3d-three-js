varying vec3 vertexNormal;

void main() {
  float intensity = pow(0.75 - dot(vertexNormal, vec3(0, 0, 1.0)), 7.0);
  gl_FragColor = vec4(0.1333, 0.1490, 0.2392, 0.7) * intensity;
}
