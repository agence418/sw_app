export const getCurrentDateTime = () => {
  const currentTime = new Date();
  const currentTimeStr = currentTime.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return currentTimeStr;
};
