import React, { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import "./AnimatedCountup.css";
import classnames from 'classnames';
export default function AnimatedCountup({
  countUp,
  icon,
  label,
  className,
  unit,
  ...props
}) {
  const [counter, setCounter] = useState(0);
  const counterRef = useRef(null);
  const intervalRef = useRef(null);
  const progressRef = useRef(1);

  // FONCTIONNE :
  const animateCounter = () => {
    const difference = countUp - counter;

    // Ajustez cette valeur pour contrôler l'effet d'interpolation logarithmique
    const easingFactor = 0.2;

    setCounter(counter + difference * easingFactor);
  };

  useEffect(() => {
    let interval;

    const handleIntersect = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Commencer le décompte lorsque l'élément devient visible
          interval = setInterval(() => {
            animateCounter();
          }, 100); // Ajustez la durée de l'incrément selon vos besoins
          console.log("countup is visible");

          // Nettoyer l'intervalle lorsque l'élément n'est plus visible
          return () => {
            clearInterval(interval);
          };
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "0px",
      threshold: 0.8,
    });

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => {
      clearInterval(interval);
      if (counterRef.current) {
        observer.unobserve(counterRef.current);
      }
    };
  }, [counter, countUp]);

  const animatedCounterClassname = classnames(`animated-counter-container`, className);

  return (
    <>
      <div className={animatedCounterClassname} ref={counterRef} {...props}>
        <i className={`count-up-icon ${icon}`}></i>
        <div className="count-up-number">
          <p>
            <span className="count-up-value">{Math.round(counter)} </span>
            {unit && <span className="count-up-additional-unit fs-4">{unit}</span>}
          </p>
        </div>
        <span className="count-up-text">{label}</span>
      </div>
    </>
  );
}

AnimatedCountup.defaultProps = {
  countUp: 100,
  label: "Count up label",
  icon: "fas fa-hand",
  unit: undefined,
  className: '',
};
