export const getDateKey = (date: Date = new Date()): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getDailyPuzzleLevelId = (dateKey: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < dateKey.length; index++) {
    hash = Math.imul(hash ^ dateKey.charCodeAt(index), 16777619);
  }
  return 1 + ((hash >>> 0) % 35);
};
