import { Calendar } from '../types/event.type';

export const CALENDAR: Calendar = {
  1: {
    day: 'Vendredi',
    steps: [{ step: 1, time: '18:00', title: 'Accueil et networking' }],
    cta: 'Lancer les pitch',
  },
  2: {
    day: 'Vendredi',
    steps: [{ step: 2, time: '18:30', title: 'Présentation des idées (60 secondes/idée)' }],
    cta: 'Fin des pitch',
  },
  3: {
    day: 'Vendredi',
    steps: [{ step: 3, time: '19:30', title: 'Votes du public !' }],
    cta: 'Valider les projets',
  },
  4: {
    day: 'Samedi',
    steps: [
      { step: 4, time: '20:00', title: 'Formation des équipes', day: 'Vendredi' },
      { step: 4, time: '21:30', title: 'Début du travail', day: 'Vendredi' },
      { step: 5, time: '08:00', title: 'Petit-déjeuner', day: 'Samedi' },
      { step: 5, time: '08:30', title: 'Mot du facilitateur', day: 'Samedi' },
      { step: 6, time: '09:00', title: 'Développement des projets', day: 'Samedi' },
      { step: 8, time: '11:00', title: 'Coaching et mentoring (début)', day: 'Samedi' },
      { step: 8, time: '11:30', title: 'Conférence de la Banque Populaire du sud', day: 'Samedi' },
      { step: 7, time: '12:30', title: 'Déjeuner', day: 'Samedi' },
      { step: 8, time: '13:00', title: 'Coaching et mentoring (suite)', day: 'Samedi' },
      {
        step: 9,
        time: '18:30',
        title: 'Envoi des présentations pour les entrainements',
        day: 'Samedi',
      },
      { step: 11, time: '19:30', title: 'Repas', day: 'Samedi' },
      { step: 12, time: '08:00', title: 'Petit-déjeuner', day: 'Dimanche' },
      { step: 12, time: '08:30', title: 'Mot du facilitateur', day: 'Dimanche' },
      { step: 13, time: '09:00', title: 'Finalisation des projets', day: 'Dimanche' },
      { step: 14, time: '11:00', title: 'Début des entraînements', day: 'Dimanche' },
      { step: 15, time: '12:30', title: 'Déjeuner', day: 'Dimanche' },
      {
        step: 16,
        time: '13:00',
        title: "Fin de l'Envoi des présentations finales",
        day: 'Dimanche',
      },
    ],
    cta: "Vérouiller l'envoie des présentations",
  },
  5: {
    day: 'Dimanche',
    steps: [
      {
        step: 17,
        time: '13:01',
        title: 'Préparation pour les présentations finales',
        day: 'Dimanche',
      },
      {
        step: 18,
        time: '15:30',
        title: 'La Finale !',
        day: 'Dimanche',
      },
      {
        step: 19,
        time: '18:00',
        title: 'Délibération du jury & concert',
        day: 'Dimanche',
      },
      {
        step: 20,
        time: '18:30',
        title: 'Annonce des résultats et remise des prix',
        day: 'Dimanche',
      },
      {
        step: 21,
        time: '19:00',
        title: 'Cocktail de clôture',
        day: 'Dimanche',
      },
      {
        step: 22,
        time: '21:00',
        title: "C'est fini !",
        day: 'Dimanche',
      },
    ],
    cta: 'Fin',
  },
};
