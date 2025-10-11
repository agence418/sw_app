export const CALENDAR = {
    dimanche: [
        {step: 15, time: '15:00', title: 'Fin du Startup Weekend', duration: 0},
        {step: 14, time: '14:00', title: 'Remise des prix et clôture', duration: 60},
        {step: 13, time: '13:00', title: 'Délibération du jury', duration: 60},
        {step: 12, time: '11:00', title: 'Présentations finales (3 min/équipe)', duration: 120},
        {step: 11, time: '09:00', title: 'Petit-déjeuner et finalisation', duration: 120}
    ],
    samedi: [
        {step: 10, time: '19:30', title: 'Dîner', duration: 60},
        {step: 9, time: '17:30', title: 'Préparation des pitches', duration: 120},
        {step: 8, time: '16:30', title: 'Envoi des présentations PowerPoint', duration: 60},
        {step: 7, time: '13:30', title: 'Coaching et mentoring', duration: 180},
        {step: 6, time: '12:30', title: 'Déjeuner', duration: 60},
        {step: 5, time: '10:00', title: 'Développement des projets', duration: 480},
        {step: 4, time: '09:00', title: 'Petit-déjeuner et début du travail', duration: 60}
    ],
    vendredi: [
        {step: 3, time: '21:00', title: 'Formation des équipes', duration: 60},
        {step: 2, time: '20:00', title: 'Votes des meilleurs idées', duration: 60, nextCTA: 'Valider les projets'},
        {step: 1, time: '18:30', title: 'Présentation des idées (60 secondes/idée)', duration: 60, nextCTA: 'Fin des pitches'},
        {step: 0, time: '18:00', title: 'Accueil et networking', duration: 60, nextCTA: 'Lancer les pitches'}
    ]
}