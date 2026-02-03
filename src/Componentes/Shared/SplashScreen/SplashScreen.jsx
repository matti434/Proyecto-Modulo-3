import { useState, useEffect } from 'react';
import './SplashScreen.css';

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onFinish();
      }, 400); 
    }, 1500); 

    return () => clearTimeout(timer);
  }, [onFinish]);

  if (!isVisible) {
    return (
      <div className="splash-screen fade-out">
        <div className="splash-content">
          <div className="splash-logo-text">
            <span className="splash-logo-primary">Rolling</span>
            <span className="splash-logo-secondary">Motor</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="splash-screen">
      <div className="splash-content">
        <div className="splash-logo-text">
          <span className="splash-logo-primary">Rolling</span>
          <span className="splash-logo-secondary">Motor</span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;