export interface Exercise {
  id: number;
  title: string;
  path: string;
}

export const introductoryExercises: Exercise[] = [
  { 
    id: 1, 
    title: 'التمرين التمهيدي عدد 01', 
    path: '/exercises/year1/reading/introductory/exercise1'
  },

{ 
  id: 2, 
  title: 'التمرين التمهيدي عدد 02', 
  path: '/exercises/year1/reading/introductory/exercise2'
},

{ 
  id: 3, 
  title: 'التمرين التمهيدي عدد 03', 
  path: '/exercises/year1/reading/introductory/exercise3'
},
];