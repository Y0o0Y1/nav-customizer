import React from 'react';

interface IzamLogoProps {
  width?: number | string;
  height?: number | string;
  className?: string;
}

const IzamLogo: React.FC<IzamLogoProps> = ({
  width = 24,
  height = 24,
  className = ''
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 78 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M0.66543 26V8.64H5.39043V26H0.66543ZM3.04543 6.33C2.1821 6.33 1.47043 6.085 0.91043 5.595C0.373763 5.08167
        0.10543 4.44 0.10543 3.67C0.10543 2.9 0.373763 2.25833 0.91043 1.745C1.47043 1.23167 2.1821 0.974999 3.04543
        0.974999C3.90876 0.974999 4.60876 1.23167 5.14543 1.745C5.6821 2.25833 5.95043 2.9 5.95043 3.67C5.95043 4.44
        5.6821 5.08167 5.14543 5.595C4.60876 6.085 3.90876 6.33 3.04543 6.33ZM25.9857 26L34.1407 1.5H41.1407L49.2257
        26H44.2207L37.6757 5.105H37.5707L30.9207 26H25.9857ZM29.9407 19.42L31.2007 15.745H43.6607L44.8857 19.42H29.9407Z
        M51.1764 26V1.5H57.2314L64.4064 17.425H64.4764L71.5814 1.5H77.6014V26H72.8764V9.095H72.7714L66.6114 22.5H62.1314
        L56.0064 9.095H55.9014V26H51.1764Z" 
        fill="white" 
      />
      <path 
        d="M8.25633 26V22.36L19.3863 5.42H8.32633V1.5H24.8463V5.14L13.6463 22.08H24.8813V26H8.25633Z" 
        fill="#48A74C" 
      />
    </svg>
  );
};

export default IzamLogo; 