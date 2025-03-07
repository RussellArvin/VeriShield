export const numberShortener = (num: number, digits = 1) => {
    // For numbers less than 1000, return the number as is
    if (num < 1000) {
      return num.toString();
    }
    
    const units = ["K", "M", "B", "T"];
    let unitIndex = -1;
    let value = num;
    
    // Find the appropriate unit
    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      unitIndex++;
    }
    
    // Format the number based on its size
    if (value < 10) {
      // For numbers like 1200 -> 1.2K
      return value.toFixed(digits) + units[unitIndex];
    } else if (value < 100) {
      // For numbers like 12500 -> 12.5K
      return value.toFixed(digits) + units[unitIndex];
    } else {
      // For numbers close to the next unit, round to nearest whole number
      // 995000 -> 995K instead of 1.0M
      return Math.round(value) + (units[unitIndex] || '');
    }
  }