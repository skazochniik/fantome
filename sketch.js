document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector(".scene");
  const ghost = document.getElementById("ghost");
  const light = document.getElementById("light");

  const fragments = Array.from(
    document.querySelectorAll(".fragment")
  );

  const eyes = Array.from(
    document.querySelectorAll(".eye")
  );

  console.log("GHOST ANIMATION STARTED");

  const baseLightRadius = 170;

  const ghostState = {
    x: -100,
    y: window.innerHeight * 0.52,

    angle: 0,
    scale: 1,

    eyeX: 0,
    eyeY: 0
  };

  let currentTarget = null;

  let lastTargetIndex = -1;

  let pauseUntil = 0;


  function random(min, max) {
    return (
      Math.random() *
        (max - min) +
      min
    );
  }


  function clamp(value, min, max) {
    return Math.max(
      min,
      Math.min(
        max,
        value
      )
    );
  }


  function distance(
    x1,
    y1,
    x2,
    y2
  ) {
    return Math.hypot(
      x2 - x1,
      y2 - y1
    );
  }


  function getTargets() {
    const points = [];


    fragments.forEach(
      (fragment, index) => {

        const rect =
          fragment.getBoundingClientRect();

        points.push({
          type: "text",

          index,

          x:
            rect.left +
            rect.width / 2 +
            random(-55, 55),

          y:
            rect.top +
            rect.height / 2 +
            random(-35, 35)
        });
      }
    );


    points.push(
      {
        type: "free",
        index: -1,

        x:
          window.innerWidth *
          0.16,

        y:
          window.innerHeight *
          0.28
      },

      {
        type: "free",
        index: -2,

        x:
          window.innerWidth *
          0.30,

        y:
          window.innerHeight *
          0.64
      },

      {
        type: "free",
        index: -3,

        x:
          window.innerWidth *
          0.48,

        y:
          window.innerHeight *
          0.42
      },

      {
        type: "free",
        index: -4,

        x:
          window.innerWidth *
          0.67,

        y:
          window.innerHeight *
          0.70
      },

      {
        type: "free",
        index: -5,

        x:
          window.innerWidth *
          0.83,

        y:
          window.innerHeight *
          0.30
      }
    );


    return points;
  }



  function chooseRandomTarget() {

    const points =
      getTargets();

    let target;

    let tries = 0;


    do {

      target =
        points[
          Math.floor(
            Math.random() *
            points.length
          )
        ];

      tries++;

    } while (
      target.type === "text" &&
      target.index ===
        lastTargetIndex &&
      tries < 20
    );


    if (
      target.type === "text"
    ) {
      lastTargetIndex =
        target.index;
    }


    return {
      x:
        target.x +
        random(-18, 18),

      y:
        target.y +
        random(-12, 12),

      type:
        target.type,

      index:
        target.index
    };
  }



  function setNextTarget(now) {

    currentTarget =
      chooseRandomTarget();



   pauseUntil =
      now +
      random(
        120,
        350
      );
  }



  setNextTarget(
    performance.now()
  );


  function animate(now) {

    if (
      !currentTarget
    ) {
      setNextTarget(now);
    }


    const dx =
      currentTarget.x -
      ghostState.x;

    const dy =
      currentTarget.y -
      ghostState.y;


    const dist =
      distance(
        ghostState.x,
        ghostState.y,
        currentTarget.x,
        currentTarget.y
      );


  

    ghostState.x +=
      dx * 0.020;

    ghostState.y +=
      dy * 0.017;


    if (
      dist < 28 &&
      now > pauseUntil
    ) {
      setNextTarget(now);
    }



    const floatY =
      Math.sin(
        now * 0.002
      ) * 9
      +
      Math.sin(
        now * 0.0045
      ) * 3;


    const floatX =
      Math.sin(
        now * 0.0013
      ) * 2;


    const finalX =
      ghostState.x +
      floatX;

    const finalY =
      ghostState.y +
      floatY;



    const targetAngle =
      clamp(
        dx * 0.02,
        -6,
        6
      );


  
    ghostState.angle +=
      (
        targetAngle -
        ghostState.angle
      ) *
      0.045;




    const targetScale =
      1 +
      Math.sin(
        now * 0.003
      ) *
      0.03;


    ghostState.scale +=
      (
        targetScale -
        ghostState.scale
      ) *
      0.07;


    

    ghost.style.left =
      `${finalX}px`;

    ghost.style.top =
      `${finalY}px`;


    ghost.style.transform = `
      translate(-50%, -50%)
      scale(${ghostState.scale})
      rotate(${ghostState.angle}deg)
    `;



    light.style.left =
      `${finalX}px`;

    light.style.top =
      `${finalY}px`;


    const lightRadius =
      baseLightRadius +
      Math.sin(
        now * 0.0025
      ) *
      9;


    scene.style.setProperty(
      "--light-x",
      `${finalX}px`
    );


    scene.style.setProperty(
      "--light-y",
      `${finalY}px`
    );


    scene.style.setProperty(
      "--light-radius",
      `${lightRadius}px`
    );


    const targetEyeX =
      clamp(
        dx * 0.012,
        -4,
        4
      );


    const targetEyeY =
      clamp(
        dy * 0.007,
        -2,
        2
      );



    ghostState.eyeX +=
      (
        targetEyeX -
        ghostState.eyeX
      ) *
      0.09;


    ghostState.eyeY +=
      (
        targetEyeY -
        ghostState.eyeY
      ) *
      0.09;



    const blinkCycle =
      now % 5000;


    let blink = 1;


    if (
      blinkCycle > 4780 &&
      blinkCycle < 4920
    ) {

      const blinkProgress =
        (
          blinkCycle -
          4780
        ) /
        140;



      blink =
        0.15 +
        Math.abs(
          blinkProgress -
          0.5
        ) *
        1.7;
    }


    eyes.forEach(
      (eye) => {

        eye.style.transform = `
          translate(
            ${ghostState.eyeX}px,
            ${ghostState.eyeY}px
          )
          scaleY(${blink})
        `;
      }
    );


    requestAnimationFrame(
      animate
    );
  }


  requestAnimationFrame(
    animate
  );


  window.addEventListener(
    "resize",
    () => {

      currentTarget =
        chooseRandomTarget();

    }
  );
});
