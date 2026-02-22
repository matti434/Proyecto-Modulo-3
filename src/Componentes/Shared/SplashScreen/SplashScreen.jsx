import { useState, useEffect } from 'react';
import Lottie from 'lottie-react';
import './SplashScreen.css';

const LOTTIE_URL = '/Portada/Motorcycle.json';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(LOTTIE_URL)
      .then((res) => res.json())
      .then(setAnimationData)
      .catch(() => setAnimationData(null));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onFinish();
      }, 400);
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const content = (
    <div className="splash-content">
      {animationData && (
        <Lottie
          animationData={animationData}
          loop
          className="splash-lottie"
        />
      )}
      <div className="splash-logo-text">
        <span className="splash-logo-primary">Rolling</span>
        <span className="splash-logo-secondary">Motor</span>
      </div>
    </div>
  );

  return (
    <div className={`splash-screen ${!isVisible ? 'fade-out' : ''}`}>
      {content}
    </div>
  );
};

export default SplashScreen;