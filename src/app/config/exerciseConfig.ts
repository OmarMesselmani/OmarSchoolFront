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
  type: 'text-display' | 'matching' | 'drag-drop' | 'mcq' | 'fill-blank' | 'sequence' | 'coloring-boxes' | 'cross-out' | 'word-matching';
  questionNumber: string;
  questionTitle: string;
  content: any;
  assets?: {
    images?: string[];
    audio?: string;
    video?: string;
    textImage?: string; // إضافة textImage لدعم السند
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
        questionTitle: 'أَرْبُطُ كُلَّ كَلِمَةٍ بِٱلصُّورَةِ ٱلْمُنَاسِبَةِ:',
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
      {
        questionId: 'question1',
        type: 'text-display',
        questionNumber: '',
        questionTitle: 'أَقْرَأُ الجُمَلَ التَّالِيَةَ:',
        content: null
      },
      {
        questionId: 'question2',
        type: 'coloring-boxes',
        questionNumber: '1',
        questionTitle: 'أُلَوِّنُ الْمُفْرَدَاتِ الْوَارِدَةَ فِي الْجُمْلَةِ التَّالِيَةِ:',
        content: {
          vocabulary: [
            {
              id: "word1",
              text: "مُعَلِّمِي"
            },
            {
              id: "word2", 
              text: "أَحْتَرِمُ"
            },
            {
              id: "word3",
              text: "الْقِسْمُ"
            },
            {
              id: "word4",
              text: "مُعَلِّمَتِي"
            },
            {
              id: "word5",
              text: "أُحِبُّ"
            },
            {
              id: "word6",
              text: "وَ"
            },
            {
              id: "word7",
              text: "مَدْرَسَتِي"
            }
          ],
          targetSentence: "أُحِبُّ مُعَلِّمِي وَ مُعَلِّمَتِي."
        }
      },
      {
        questionId: 'question3',
        type: 'matching',
        questionNumber: '2',
        questionTitle: 'أَصِلُ كُلَّ كَلِمَةٍ بِالْمَشْهَدِ الْمُنَاسِبِ لَهَا:',
        content: {
          items: [
            { id: 'text1', text: 'مُعَلِّمِي' },
            { id: 'text2', text: 'مُعَلِّمَتِي' },
            { id: 'text3', text: 'عَلَمٌ' }
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercice2/femaleTeacher.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercice2/flag.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercice2/teacher.png' }
          ],
          correctMatches: [
            { textId: 'text1', imageId: 'img3' },
            { textId: 'text2', imageId: 'img1' }, 
            { textId: 'text3', imageId: 'img2' }  
          ]
        }
      },
      {
        questionId: 'question4',
        type: 'cross-out',
        questionNumber: '3',
        questionTitle: 'أَشْطُبُ الْخَطَأَ:',
        content: {
          statements: [
            {
              id: 'statement1',
              text: 'سَاحَةُ الْمَدْرَسَةِ ضَيِّقَةٌ.',
              isCorrect: false
            },
            {
              id: 'statement2', 
              text: 'سَاحَةُ الْمَدْرَسَةِ وَاسِعَةٌ.',
              isCorrect: true
            }
          ]
        },
        assets: {
          textImage: '/exercices/year1/reading/introductory/exercice2/text.png'
        }
      },
      {
        questionId: 'question5',
        type: 'coloring-boxes',
        questionNumber: '4',
        questionTitle: 'أُلَوِّنُ الْجُمْلَةَ الْمَوْجُودَةَ فِي النَّصِّ:',
        content: {
          vocabulary: [
            {
              id: "phrase1",
              text: "عَلَمُ بِلَادِي مَرْفُوعٌ"
            },
            {
              id: "phrase2",
              text: "عَلَمُ بِلَادِي يُرَفْرِفُ"
            },
            {
              id: "phrase3",
              text: "عَلَمُ بِلَادِي جَمِيلٌ"
            }
          ]
        },
        assets: {
          textImage: '/exercices/year1/reading/introductory/exercice2/text.png'
        }
      },
      {
        questionId: 'question6',
        type: 'word-matching',
        questionNumber: '5',
        questionTitle: 'أَرْبُطُ الْمُفْرَدَةَ بِمَعْنَاهَا:',
        content: {
          leftWords: [
            { id: 'word1', text: 'وَاسِعَةٌ' }
          ],
          rightWords: [
            { id: 'meaning1', text: 'جَمِيلَةٌ' },
            { id: 'meaning2', text: 'صَغِيرَةٌ' },
            { id: 'meaning3', text: 'شَاسِعَةٌ' }
          ],
          correctMatches: [
            { leftId: 'word1', rightId: 'meaning3' }
          ]
        }
      }
    ]
  },

  'exercise3': {
    exerciseId: 'exercise3',
    title: 'التمرين التمهيدي عدد 03',
    assets: {
      textImage: '/exercices/year1/reading/introductory/exercise3/text.png'
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
        questionTitle: 'أَصِلُ كُلَّ كَلِمَةٍ بِالْمَشْهَدِ الْمُنَاسِبِ لَهَا:',
        content: {
          items: [
            { id: 'text1', text: 'الْقِسْمُ' },
            { id: 'text2', text: 'مَكْتَبُ الْمُدِيرِ' },
            { id: 'text3', text: 'الْعَلَمُ' }
          ],
          images: [
            { id: 'img1', url: '/exercices/year1/reading/introductory/exercise3/flag.png' },
            { id: 'img2', url: '/exercices/year1/reading/introductory/exercise3/classroom.png' },
            { id: 'img3', url: '/exercices/year1/reading/introductory/exercise3/door.png' }
          ],
          correctMatches: [
            { textId: 'text1', imageId: 'img3' }, // أَلْعَبُ ← الملعب
            { textId: 'text2', imageId: 'img2' }, // مَكْتَبُ الْمُدِيرِ ← القسم
            { textId: 'text3', imageId: 'img1' }  // أَلْعَلَمُ ← العلم
          ]
        }
      },
      {
        questionId: 'question3',
        type: 'coloring-boxes',
        questionNumber: '2',
        questionTitle: 'أُلَوِّنُ الْجُمْلَةَ الْمَوْجُودَةَ فِي النَّصِّ:',
        content: {
          vocabulary: [
            {
              id: "phrase1",
              text: "قِسْمُنَا كَبِيرٌ"
            },
            {
              id: "phrase2",
              text: "قِسْمُنَا جَمِيلٌ"
            },
            {
              id: "phrase3",
              text: "قِسْمُنَا مُتَّسِخٌ"
            }
          ]
        },
        assets: {
          textImage: '/exercices/year1/reading/introductory/exercise3/text.png'
        }
      },
      {
        questionId: 'question4',
        type: 'coloring-boxes',
        questionNumber: '3',
        questionTitle: 'أُلَوِّنُ الْجُمْلَةَ الْمَوْجُودَةَ فِي النَّصِّ:',
        content: {
          vocabulary: [
            {
              id: "phrase1",
              text: "تِلْمِيذٌ"
            },
            {
              id: "phrase2",
              text: "ٱلْمَلْعَبُ"
            },
            {
              id: "phrase3",
              text: "ٱلْمُدِيرُ"
            },
            {
              id: "phrase4",
              text: "قِسْمُنَا"
            },
            {
              id: "phrase5",
              text: "مَكْتَبٌ"
            },
            {
              id: "phrase6",
              text: "عَلَمٌ"
            },
            {
              id: "phrase7",
              text: "جَمِيلٌ"
            },
            {
              id: "phrase8",
              text: "وَاسِعَةٌ"
            },
          ]
        },
        assets: {
          textImage: '/exercices/year1/reading/introductory/exercise3/text.png'
        }
      },
      {
        questionId: 'question5',
        type: 'cross-out',
        questionNumber: '4',
        questionTitle: 'أَشْطُبُ الْخَطَأَ:',
        content: {
          statements: [
            {
              id: 'statement1',
              text: 'مَكْتَبُ ٱلْمُدِيرِ قُرْبَ ٱلْبَابِ.',
              isCorrect: false
            },
            {
              id: 'statement2', 
              text: 'مَكْتَبُ ٱلْمُدِيرِ بِجَانِبِ ٱلْقِسْمِ.',
              isCorrect: false
            },
            {
              id: 'statement3', 
              text: 'مَكْتَبُ ٱلْمُدِيرِ قُرْبَ ٱلْعَلَمِ.',
              isCorrect: true
            }
          ]
        },
        assets: {
          textImage: '/exercices/year1/reading/introductory/exercise3/text.png'
        }
      },
      {
        questionId: 'question6',
        type: 'word-matching',
        questionNumber: '5',
        questionTitle: 'أَرْبُطُ الْمُفْرَدَةَ بِمَعْنَاهَا:',
        content: {
          leftWords: [
            { id: 'word1', text: 'جَمِيلٌ' }
          ],
          rightWords: [
            { id: 'meaning1', text: 'رَائِعٌ.' },
            { id: 'meaning2', text: 'صَغِيرٌ.' },
            { id: 'meaning3', text: 'بَعِيدٌ.' }
          ],
          correctMatches: [
            { leftId: 'word1', rightId: 'meaning1' }
          ]
        }
      },
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
  },

  'exercise5': {
    exerciseId: 'exercise5',
    title: 'تمرين الأفعال',
    assets: {
      textImage: '/exercices/year1/grammar/unit1/exercise1/text.png'
    },
    questions: [
      {
        questionId: 'question1',
        type: 'text-display',
        questionNumber: '',
        questionTitle: 'تَعَرَّفْ عَلَى الأَفْعَالِ فِي اللُّغَةِ الْعَرَبِيَّةِ',
        content: {
          text: 'الأَفْعَالُ هِيَ: كَلِمَاتٌ تُعَبِّرُ عَنْ حَدَثٍ مَا، وَتَتَغَيَّرُ نِهَايَتُهَا بِحَسَبِ الضَّمِيرِ وَالزَّمَانِ.'
        }
      },
      {
        questionId: 'question2',
        type: 'matching',
        questionNumber: '1',
        questionTitle: 'أَرْبُطُ كُلَّ فِعْلٍ بِالضَّمِيرِ الْمُنَاسِبِ',
        content: {
          items: [
            { id: 'verb1', text: 'أَكْتُبُ' },
            { id: 'verb2', text: 'تَكْتُبِينَ' },
            { id: 'verb3', text: 'يَكْتُبُ' }
          ],
          images: [
            { id: 'pronoun1', url: '/exercices/year1/grammar/unit1/exercise1/I.png' },
            { id: 'pronoun2', url: '/exercices/year1/grammar/unit1/exercise1/you_female.png' },
            { id: 'pronoun3', url: '/exercices/year1/grammar/unit1/exercise1/he.png' }
          ],
          correctMatches: [
            { verbId: 'verb1', pronounId: 'pronoun1' },
            { verbId: 'verb2', pronounId: 'pronoun2' },
            { verbId: 'verb3', pronounId: 'pronoun3' }
          ]
        }
      },
      {
        questionId: 'question3',
        type: 'fill-blank',
        questionNumber: '2',
        questionTitle: 'أَكْمِلِ الْجُمَلَ التَّالِيَةَ بِالْفِعْلِ الْمُنَاسِبِ',
        content: {
          sentences: [
            {
              id: 'sentence1',
              text: 'أَنَا ___ (يَكْتُبُ) دَرْسِي الْيَوْمَ.'
            },
            {
              id: 'sentence2',
              text: 'هِيَ ___ (تَكْتُبِينَ) رِسَالَةً إِلَى صَدِيقَتِهَا.'
            },
            {
              id: 'sentence3',
              text: 'نَحْنُ ___ (أَكْتُبُ) مَعًا فِي الْمَكْتَبَةِ.'
            }
          ]
        }
      },
      {
        questionId: 'question4',
        type: 'sequence',
        questionNumber: '3',
        questionTitle: 'رَتِّبْ الْأَفْعَالَ حَسَبَ التَّرْتِيبِ الصَّحِيحِ',
        content: {
          items: [
            { id: 'verb1', text: 'أَكْتُبُ' },
            { id: 'verb2', text: 'يَكْتُبُ' },
            { id: 'verb3', text: 'تَكْتُبِينَ' }
          ],
          correctOrder: ['verb1', 'verb3', 'verb2']
        }
      },
      {
        questionId: 'question5',
        type: 'word-matching', // نوع جديد أو استخدام matching مع تعديل
        questionNumber: '5',
        questionTitle: 'أَرْبُطُ الْمُفْرَدَةَ بِمَعْنَاهَا:',
        content: {
          leftWords: [
            { id: 'word1', text: 'وَاسِعَةٌ' }
          ],
          rightWords: [
            { id: 'meaning1', text: 'جَمِيلَةٌ' },
            { id: 'meaning2', text: 'صَغِيرَةٌ' },
            { id: 'meaning3', text: 'شَاسِعَةٌ' }
          ],
          correctMatches: [
            { leftId: 'word1', rightId: 'meaning3' }
          ]
        }
      }
    ]
  }
};