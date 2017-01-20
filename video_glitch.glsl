
#pragma glslify: snoise = require(glsl-noise/simplex/2d)

float rand(vec2 co)
{
   return fract(sin(dot(co.xy,vec2(12.9898,78.233))) * 43758.5453);
}


vec4 glitch(sampler2D texture, vec2 uv, float strength)
{
    vec4 fragColor;
    // Create large, incidental noise waves
    float noise = max(0.0, snoise(vec2(time, uv.y * 0.3)) - 0.3) * (1.0 / 0.7);

    // Offset by smaller, constant noise waves
    noise = noise + (snoise(vec2(time*10.0, uv.y * 2.4)) - 0.5) * 0.15;

    noise *= strength;

    // Apply the noise as x displacement for every line
    float xpos = uv.x - noise * noise * 0.25;
	  fragColor = texture2D(texture, vec2(xpos, uv.y));

    // Mix in some random interference for lines
    fragColor.rgb = mix(fragColor.rgb, vec3(rand(vec2(uv.y * time))), noise * 0.3).rgb;

    // Apply a line pattern every 4 pixels
    if (floor(mod(gl_FragCoord.y * 0.25, 2.0)) == 0.0)
    {
        fragColor.rgb *= 1.0 - (0.15 * noise);
    }

    // Shift green/blue channels (using the red channel)
    fragColor.g = mix(texture2D(texture, vec2(xpos + noise * 0.05, uv.y)).g, fragColor.r, strength*0.25);
    fragColor.b = mix(texture2D(texture, vec2(xpos - noise * 0.05, uv.y)).b, fragColor.r, strength*0.25);

    return fragColor;
}

#pragma glslify: export(glitch)
