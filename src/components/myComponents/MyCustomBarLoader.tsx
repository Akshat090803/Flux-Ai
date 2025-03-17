
import React from 'react';

const CustomBarLoader = ({ color = 'blue', width = '100%', height = '4px', className = '' }: { color?: string, width?: string, height?: string, className?: string }) => {
  const loaderStyle: React.CSSProperties = {
    width: width,
    height: height,
    backgroundColor: '#222222',
    borderRadius: '2px',
    overflow: 'hidden',
    position: 'relative',
    marginTop: '1rem',
  };

  const animationStyle: React.CSSProperties = {
    position: 'absolute',
    height: '100%',
    width: '30%',
    backgroundColor: color,
    animation: 'barLoaderAnimation 1.3s linear infinite',
    borderRadius: '2px',
  };

  const styleSheet = `
    @keyframes barLoaderAnimation {
      0% {
        left: -30%;
      }
      30% {
        left: 50%;
      }
      70% {
        left: 80%;
      }
       100%{
       left:100%}  
    }
  `;

  return (
    <div style={loaderStyle} className={className}>
      <style>{styleSheet}</style>
      <div style={animationStyle}></div>
    </div>
  );
};

export default CustomBarLoader;