

float grid(vec2 uv, vec2 space) {
  vec2 v = abs(mod(uv + .5*space, space) - .5 * space);
  v = smoothstep(.02*space, .03*space, v);
  return v.x*v.y;
}

#pragma glslify: export(grid)
