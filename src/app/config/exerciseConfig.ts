// src/app/config/exerciseConfig.ts

export interface ExerciseConfig {
  exerciseId: string;
  title: string;
  questions: QuestionConfig[];
  assets: {
    textImage?: string;
    backgroundImage?: string;
    audioFile?: string;
  };
}

export interface QuestionConfig {
  questionId: string;
  type: 'text-display' | 'matching' | 'drag-drop' | 'mcq' | 'fill-blank' | 'sequence' | 'coloring-boxes'; // ✅ تحديث
  questionNumber: string;
  questionTitle: string;
  content: any; // محتوى ديناميكي حسب نوع السؤال
  assets?: {
    images?: string[];
    audio?: string;
    video?: string;
  };
}

// ملف التكوين للتمارين
export const EXERCISES_CONFIG: { [key: string]: ExerciseConfig } = {
  'exercise1': {
    exerciseId: 'exercise1',
    title: 'التمرين التمهيدي عدد 01',
    assets: {
      textImage: '/exercices/year1/reading/introductory/exercice1/text.png'
    },
    questions: [
      {
        questionId: 'question1',
        type: 'text-display',
        questionNumber: '',
        questionTitle: 'أَقْرَأُ الجُمَلَ التَّالِيَةَ:',
        content: null
      },
      {
        questionId: 'question2',
        type: 'matching',
        questionNumber: '1',
        questionTitle: 'أَرْبُطُ كُلَّ كَلِمَةٍ بِٱلصُّورَةِ ٱلْمُنَاسِبَةِ',
        content: {
          items: [
            { id: 'text1', text: 'تِلْمِيذٌ' },
            { id: 'text2', text: 'تِلْمِيذَةٌ' },
            { id: 'text3', text: 'تَلَامِيذٌ' },
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercice1/studentGirl.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercice1/students.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercice1/studentBoy.png' },
          ]
        }
      }
    ]
  },
  
  'exercise2': {
    exerciseId: 'exercise2',
    title: 'التمرين التمهيدي عدد 02',
    assets: {
      textImage: '/exercices/year1/reading/introductory/exercice2/text.png'
    },
    questions: [
      // السؤال الأول - عرض السند
      {
        questionId: 'question1',
        type: 'text-display',
        questionNumber: '',
        questionTitle: 'أَقْرَأُ الجُمَلَ التَّالِيَةَ:',
        content: null
      },
      // ✅ السؤال الثاني - تلوين المفردات
      {
        questionId: 'question2',
        type: 'coloring-boxes',
        questionNumber: '1',
        questionTitle: 'أُلَوِّنُ الْمُفْرَدَاتِ الْوَارِدَةَ فِي الْجُمْلَةِ التَّالِيَةِ:',
        content: {
          targetSentence: 'أُحِبُّ مُعَلِّمِي وَ مُعَلِّمَتِي.',
          wordBoxes: [
            // المفردات المستهدفة
            { id: 'word1', text: 'مُعَلِّمِي', isTarget: true, color: null },
            { id: 'word2', text: 'أَحْتَرِمُ', isTarget: true, color: null },
            { id: 'word3', text: 'الْقِسْمُ', isTarget: true, color: null },
            { id: 'word4', text: 'مُعَلِّمَتِي', isTarget: true, color: null },
            { id: 'word5', text: 'أُحِبُّ', isTarget: true, color: null },
            { id: 'word6', text: 'وَ', isTarget: true, color: null },
            { id: 'word7', text: 'مَدْرَسَتِي', isTarget: true, color: null }
          ],
          instructions: 'انقر على الكلمات الموجودة في الجملة لتلوينها باللون الأخضر'
        }
      },
      // السؤال الثالث - سحب وإفلات (أصبح رقم 2)
      {
        questionId: 'question3',
        type: 'drag-drop',
        questionNumber: '2',
        questionTitle: 'أَسْحَبُ الكَلِمَاتِ إِلَى مَكَانِهَا الصَّحِيحِ',
        content: {
          draggableItems: [
            { id: 'word1', text: 'شَمْسٌ', category: 'sky' },
            { id: 'word2', text: 'بَحْرٌ', category: 'water' },
            { id: 'word3', text: 'جَبَلٌ', category: 'land' }
          ],
          dropZones: [
            { id: 'sky', label: 'السَّمَاءُ', accepts: ['sky'] },
            { id: 'water', label: 'الْمَاءُ', accepts: ['water'] },
            { id: 'land', label: 'الْأَرْضُ', accepts: ['land'] }
          ]
        }
      },
      // السؤال الرابع - مطابقة (أصبح رقم 3)
      {
        questionId: 'question4',
        type: 'matching',
        questionNumber: '3',
        questionTitle: 'أَرْبُطُ كُلَّ كَلِمَةٍ بِالصُّورَةِ المُنَاسِبَةِ',
        content: {
          items: [
            { id: 'text1', text: 'شَمْسٌ' },
            { id: 'text2', text: 'بَحْرٌ' },
            { id: 'text3', text: 'جَبَلٌ' },
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercice2/sun.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercice2/sea.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercice2/mountain.png' },
          ],
          correctMatches: [
            { textId: 'text1', imageId: 'img1' },
            { textId: 'text2', imageId: 'img2' },
            { textId: 'text3', imageId: 'img3' }
          ]
        }
      }
    ]
  },

  'exercise3': {
    exerciseId: 'exercise3',
    title: 'التمرين التمهيدي عدد 03',
    assets: {},
    questions: [
      {
        questionId: 'question1',
        type: 'mcq',
        questionNumber: '1',
        questionTitle: 'أَخْتَارُ الإِجَابَةَ الصَّحِيحَةَ',
        content: {
          question: 'مَا لَوْنُ الشَّمْسِ؟',
          image: '/exercices/year1/reading/introductory/exercice3/sun.png',
          options: [
            { id: 'a', text: 'أَصْفَرُ', isCorrect: true },
            { id: 'b', text: 'أَزْرَقُ', isCorrect: false },
            { id: 'c', text: 'أَحْمَرُ', isCorrect: false },
            { id: 'd', text: 'أَخْضَرُ', isCorrect: false }
          ]
        }
      }
    ]
  },

  'exercise4': {
    exerciseId: 'exercise4',
    title: 'تمرين الحواس الخمس',
    assets: {
      backgroundImage: '/exercices/year1/science/unit1/exercise1/background.png'
    },
    questions: [
      {
        questionId: 'question1',
        type: 'text-display',
        questionNumber: '',
        questionTitle: 'تَعَرَّفْ عَلَى الحَوَاسِّ الخَمْسِ',
        content: {
          text: 'الحَوَاسُّ الخَمْسُ هِيَ: البَصَرُ وَالسَّمْعُ وَالشَّمُّ وَالذَّوْقُ وَاللَّمْسُ'
        }
      },
      {
        questionId: 'question2',
        type: 'matching',
        questionNumber: '1',
        questionTitle: 'أَرْبُطُ كُلَّ حَاسَّةٍ بِالعُضْوِ المُنَاسِبِ',
        content: {
          items: [
            { id: 'sense1', text: 'البَصَرُ' },
            { id: 'sense2', text: 'السَّمْعُ' },
            { id: 'sense3', text: 'الشَّمُّ' },
            { id: 'sense4', text: 'الذَّوْقُ' },
            { id: 'sense5', text: 'اللَّمْسُ' }
          ],
          images: [
            { id: 'organ1', url: '/exercices/year1/science/unit1/exercise1/eye.png' },
            { id: 'organ2', url: '/exercices/year1/science/unit1/exercise1/ear.png' },
            { id: 'organ3', url: '/exercices/year1/science/unit1/exercise1/nose.png' },
            { id: 'organ4', url: '/exercices/year1/science/unit1/exercise1/tongue.png' },
            { id: 'organ5', url: '/exercices/year1/science/unit1/exercise1/hand.png' }
          ]
        }
      },
      {
        questionId: 'question3',
        type: 'mcq',
        questionNumber: '2',
        questionTitle: 'أَخْتَارُ الإِجَابَةَ الصَّحِيحَةَ',
        content: {
          question: 'أَيُّ عُضْوٍ نَسْتَخْدِمُهُ لِلرُّؤْيَةِ؟',
          image: '/exercices/year1/science/unit1/exercise1/question_eye.png',
          options: [
            { id: 'a', text: 'العَيْنُ', isCorrect: true },
            { id: 'b', text: 'الأُذُنُ', isCorrect: false },
            { id: 'c', text: 'الأَنْفُ', isCorrect: false },
            { id: 'd', text: 'اليَدُ', isCorrect: false }
          ]
        }
      },
      {
        questionId: 'question4',
        type: 'drag-drop',
        questionNumber: '3',
        questionTitle: 'أَضَعُ كُلَّ شَيْءٍ فِي المَجْمُوعَةِ المُنَاسِبَةِ',
        content: {
          draggableItems: [
            { id: 'item1', text: '🌹', category: 'smell' },
            { id: 'item2', text: '🎵', category: 'hearing' },
            { id: 'item3', text: '🍯', category: 'taste' },
            { id: 'item4', text: '🌈', category: 'sight' },
            { id: 'item5', text: '🧊', category: 'touch' },
            { id: 'item6', text: '🍋', category: 'taste' }
          ],
          dropZones: [
            { id: 'sight', label: 'أَشْيَاءُ نَرَاهَا', accepts: ['sight'] },
            { id: 'hearing', label: 'أَشْيَاءُ نَسْمَعُهَا', accepts: ['hearing'] },
            { id: 'smell', label: 'أَشْيَاءُ نَشُمُّهَا', accepts: ['smell'] },
            { id: 'taste', label: 'أَشْيَاءُ نَتَذَوَّقُهَا', accepts: ['taste'] },
            { id: 'touch', label: 'أَشْيَاءُ نَلْمِسُهَا', accepts: ['touch'] }
          ]
        }
      }
    ]
  }
};