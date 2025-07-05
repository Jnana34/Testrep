// src/components/ParticlesBackground.js
import React from "react";
import Particles from "react-tsparticles";

const ParticlesBackground = () => {
  return (
    <Particles
      id="tsparticles"
      options={{
        fullScreen: { enable: true, zIndex: -1 },
        background: { color: "#0d0d1d" }, // deep space blue
        particles: {
          number: {
            value: 120,
            density: { enable: true, value_area: 1000 },
          },
          color: {
            value: ["#ffffff", "#ffcc00", "#00ccff", "#cc66ff"], // stars, nebula, etc.
          },
          shape: {
            type: "circle",
          },
          opacity: {
            value: 0.8,
            random: true,
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.3,
              sync: false,
            },
          },
          size: {
            value: { min: 0.5, max: 2.5 },
            random: true,
          },
          move: {
            enable: true,
            speed: 0.2,
            direction: "none",
            outModes: "out",
          },
        },
        interactivity: {
          events: {
            onHover: { enable: true, mode: "grab" },
            onClick: { enable: false },
          },
          modes: {
            grab: {
              distance: 140,
              links: {
                opacity: 0.5,
              },
            },
          },
        },
        detectRetina: true,
      }}
    />
  );
};

export default ParticlesBackground;
