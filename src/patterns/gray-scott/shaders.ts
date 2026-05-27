export const VERT_SRC = `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`

/**
 * Update shader: reads U/V from prev texture (R = U, G = V), writes next state.
 * Gray-Scott:
 *   dU/dt = Du * lap(U) - U V^2 + F (1 - U)
 *   dV/dt = Dv * lap(V) + U V^2 - (F + k) V
 */
export const UPDATE_FRAG_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_state;
uniform vec2 u_texel;
uniform float u_feed;
uniform float u_kill;
uniform float u_du;
uniform float u_dv;
uniform float u_dt;

void main() {
  vec2 uv = v_uv;
  vec2 c = texture(u_state, uv).rg;
  float u = c.r;
  float v = c.g;

  // 9-point Laplacian (corners weighted 0.05, edges 0.2, center -1).
  vec2 t = u_texel;
  vec2 lap = vec2(0.0);
  lap += texture(u_state, uv + vec2(-t.x, -t.y)).rg * 0.05;
  lap += texture(u_state, uv + vec2( 0.0, -t.y)).rg * 0.20;
  lap += texture(u_state, uv + vec2( t.x, -t.y)).rg * 0.05;
  lap += texture(u_state, uv + vec2(-t.x,  0.0)).rg * 0.20;
  lap += texture(u_state, uv + vec2( t.x,  0.0)).rg * 0.20;
  lap += texture(u_state, uv + vec2(-t.x,  t.y)).rg * 0.05;
  lap += texture(u_state, uv + vec2( 0.0,  t.y)).rg * 0.20;
  lap += texture(u_state, uv + vec2( t.x,  t.y)).rg * 0.05;
  lap -= vec2(u, v);

  float uvv = u * v * v;
  float du = u_du * lap.x - uvv + u_feed * (1.0 - u);
  float dv = u_dv * lap.y + uvv - (u_feed + u_kill) * v;

  float nu = clamp(u + du * u_dt, 0.0, 1.0);
  float nv = clamp(v + dv * u_dt, 0.0, 1.0);
  outColor = vec4(nu, nv, 0.0, 1.0);
}`

/**
 * Display shader. Maps V → colormap.
 */
export const DISPLAY_FRAG_SRC = `#version 300 es
precision highp float;
in vec2 v_uv;
out vec4 outColor;
uniform sampler2D u_state;
uniform int u_palette;

vec3 paletteCool(float t) {
  vec3 a = vec3(0.05, 0.07, 0.12);
  vec3 b = vec3(0.20, 0.45, 0.85);
  vec3 c = vec3(0.85, 0.95, 1.00);
  if (t < 0.5) return mix(a, b, t * 2.0);
  return mix(b, c, (t - 0.5) * 2.0);
}

vec3 paletteFire(float t) {
  vec3 a = vec3(0.02, 0.0, 0.05);
  vec3 b = vec3(0.6, 0.05, 0.2);
  vec3 c = vec3(1.0, 0.85, 0.3);
  if (t < 0.5) return mix(a, b, t * 2.0);
  return mix(b, c, (t - 0.5) * 2.0);
}

vec3 paletteMono(float t) {
  return vec3(t);
}

void main() {
  float v = texture(u_state, v_uv).g;
  float t = clamp(v * 3.5, 0.0, 1.0);
  vec3 col;
  if (u_palette == 0) col = paletteCool(t);
  else if (u_palette == 1) col = paletteFire(t);
  else col = paletteMono(t);
  outColor = vec4(col, 1.0);
}`
