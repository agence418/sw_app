export const getCurrentDay = () => {
    const currentTime = new Date();
    const currentDay = currentTime.toLocaleDateString('fr-FR', { weekday: 'long' }).toLowerCase();
    const currentTimeStr = currentTime.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

    return currentDay;
};
