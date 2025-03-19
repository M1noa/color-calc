import React, { useState, useEffect } from 'react';

const ColorAdjustmentCalculator = () => {
  const [originalColor, setOriginalColor] = useState('#ffffff');
  const [targetColor, setTargetColor] = useState('#ff0000');
  const [adjustments, setAdjustments] = useState({});

  // Convert hex to RGB
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  };

  // Convert RGB to HSL
  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: h = 0;
      }
      
      h /= 6;
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Calculate adjustments needed
  const calculateAdjustments = () => {
    const origRgb = hexToRgb(originalColor);
    const targetRgb = hexToRgb(targetColor);
    
    const origHsl = rgbToHsl(origRgb.r, origRgb.g, origRgb.b);
    const targetHsl = rgbToHsl(targetRgb.r, targetRgb.g, targetRgb.b);

    // Calculate brightness change
    const brightnessDiff = Math.round(targetHsl.l - origHsl.l);
    
    // Calculate contrast change (rough estimation)
    const origLuminance = 0.299 * origRgb.r + 0.587 * origRgb.g + 0.114 * origRgb.b;
    const targetLuminance = 0.299 * targetRgb.r + 0.587 * targetRgb.g + 0.114 * targetRgb.b;
    const contrastChange = Math.round((targetLuminance - origLuminance) / 2.55);
    
    // Calculate hue shift
    let hueShift = Math.round(targetHsl.h - origHsl.h);
    if (hueShift > 180) hueShift -= 360;
    if (hueShift < -180) hueShift += 360;
    
    // Calculate saturation change
    const saturationChange = Math.round(targetHsl.s - origHsl.s);
    
    // RGB channel adjustments
    const redChange = targetRgb.r - origRgb.r;
    const greenChange = targetRgb.g - origRgb.g;
    const blueChange = targetRgb.b - origRgb.b;

    setAdjustments({
      brightness: brightnessDiff,
      contrast: contrastChange,
      hue: hueShift,
      saturation: saturationChange,
      red: redChange,
      green: greenChange,
      blue: blueChange
    });
  };

  useEffect(() => {
    calculateAdjustments();
  }, [originalColor, targetColor]);

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <h1 className="text-xl font-medium text-black mb-4">Color Adjustment Calculator for Photoshop</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Original Color:
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={originalColor}
              onChange={(e) => setOriginalColor(e.target.value)}
              className="h-10 w-10 border border-gray-300 rounded mr-2"
            />
            <input
              type="text"
              value={originalColor}
              onChange={(e) => setOriginalColor(e.target.value)}
              className="border border-gray-300 p-2 text-sm w-full rounded"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Target Color:
          </label>
          <div className="flex items-center">
            <input
              type="color"
              value={targetColor}
              onChange={(e) => setTargetColor(e.target.value)}
              className="h-10 w-10 border border-gray-300 rounded mr-2"
            />
            <input
              type="text"
              value={targetColor}
              onChange={(e) => setTargetColor(e.target.value)}
              className="border border-gray-300 p-2 text-sm w-full rounded"
            />
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h2 className="text-lg font-medium text-black mb-2">Adjustment Values:</h2>
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-y-2 gap-x-4">
            <div>
              <span className="text-sm font-medium">Brightness:</span>
              <span className="ml-2">{adjustments.brightness}%</span>
            </div>
            <div>
              <span className="text-sm font-medium">Contrast:</span>
              <span className="ml-2">{adjustments.contrast}%</span>
            </div>
            <div>
              <span className="text-sm font-medium">Hue:</span>
              <span className="ml-2">{adjustments.hue}°</span>
            </div>
            <div>
              <span className="text-sm font-medium">Saturation:</span>
              <span className="ml-2">{adjustments.saturation}%</span>
            </div>
            <div className="col-span-2 border-t border-gray-300 pt-2 mt-2">
              <span className="text-sm font-medium">RGB Adjustments:</span>
            </div>
            <div>
              <span className="text-sm font-medium text-red-600">Red:</span>
              <span className="ml-2">{adjustments.red}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-green-600">Green:</span>
              <span className="ml-2">{adjustments.green}</span>
            </div>
            <div>
              <span className="text-sm font-medium text-blue-600">Blue:</span>
              <span className="ml-2">{adjustments.blue}</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded border border-gray-300" style={{backgroundColor: originalColor}}></div>
              <div className="mx-2">➡️</div>
              <div className="w-12 h-12 rounded border border-gray-300" style={{backgroundColor: targetColor}}></div>
            </div>
            <button
              onClick={calculateAdjustments}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Recalculate
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Use these values in Photoshop's adjustment layers to transform your original color to the target color.</p>
      </div>
    </div>
  );
};

export default ColorAdjustmentCalculator;
