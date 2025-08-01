const userColors = [
  "#e6194b", "#3cb44b", "#ffe119", "#4363d8", "#f58231",
  "#911eb4", "#46f0f0", "#f032e6", "#bcf60c", "#fabebe",
  "#008080", "#e6beff", "#9a6324", "#fffac8", "#800000",
];

const userColorMap = {};

export function getUserColor(owner) {
  if (!owner) return "#ccc";
  if (!userColorMap[owner]) {
    const index = Object.keys(userColorMap).length % userColors.length;
    userColorMap[owner] = userColors[index];
  }
  return userColorMap[owner];
}