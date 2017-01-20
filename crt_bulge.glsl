

vec2 crt_bulge(vec2 uv) {
  vec2 p = 2.*uv - 1.;
  p *= 1. - .1*sqrt((1.-p.x*p.x)*(1.-p.y*p.y));
  return .5*p + .5;
}

#pragma glslify: export(crt_bulge)
