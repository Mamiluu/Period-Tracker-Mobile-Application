export const en = {
  categories: {
    allIds: ['health', 'reproductive_health','nutrition_health','Puberty_health','myths_health','period_health','oky_health','safe_health','my_rights','mental_health'],
    byId: {
      health: {
        name: 'Menstruation and menstrual cycle',
        tags: { primary: { emoji: '🔴' } },
        subCategories: ['menstruation_period', 'missed_period','flow_period'],
      },
      reproductive_health: {
        name: 'Managing menstruation',
        tags: { primary: { emoji: '👩' } },
        subCategories: ['hygiene_managing', 'sanitary_managing','pain_managing',],
      },
      nutrition_health: {
          name: 'Health, nutrition and exercise',
          tags: { primary: { emoji: '💚' } },
          subCategories: [],
        },
        Puberty_health: {
          name: 'Puberty',
          tags: { primary: { emoji: '🌷' } },
          subCategories: [],
        },
        myths_health: {
          name: 'Myths and feelings',
          tags: { primary: { emoji: '😣' } },
          subCategories: [],
        },
        period_health: {
          name: 'Periods and life',
          tags: { primary: { emoji: '🙂' } },
          subCategories: [],
        },
        oky_health: {
          name: 'Using Oky',
          tags: { primary: { emoji: '📱' } },
          subCategories: [],
        },
        safe_health: {
          name: 'Violence and staying safe',
          tags: { primary: { emoji: '📢' } },
          subCategories: [],
        },
        my_rights: {
          name: 'My rights',
          tags: { primary: { emoji: '👌' } },
          subCategories: [],
        },
        mental_health: {
          name: 'Mental health',
          tags: { primary: { emoji: '👍🏻' } },
          subCategories: [],
        },
    },
  },
  subCategories: {
      allIds: ['menstruation_period', 'missed_period','flow_period','hygiene_managing','sanitary_managing','pain_managing'],
      byId: {
        menstruation_period: {
          name: 'Menstruation and periods',
          articles: [
            'article1', 'article2'
          ],
        },
        missed_period: {
          name: 'Irregularity and missed periods',
          articles: [
            'article3', 'article4'
          ],
        },
        flow_period: {
          name: 'Blood, flow and discharge',
          articles: [
            'article5', 'article6'
          ],
        },
        hygiene_managing: {
          name: 'Hygiene',
          articles: [
            'article7', 'article8'
          ],
        },
        sanitary_managing: {
          name: 'Sanitary protection',
          articles: [
            'article9', 'article10'
          ],
        },
        pain_managing: {
          name: 'Pain and PMS',
          articles: [
            'article11', 'article12'
          ],
        },
      },
  },
  articles: {
    allIds: ['article1', 'article2','article3', 'article4','article5', 'article6','article7', 'article8','article9', 'article10','article11', 'article12'],
    byId: {
      article1: {
        title: 'What are periods/menstruation?',
        content: 'Menstruation is a natural process...',
        category: 'Menstruation and menstrual cycle',
        subCategory: 'Menstruation and periods',
      },
      article2: {
          title: 'Are periods normal?',
          content: 'Menstruation is a natural process...',
          category: 'Menstruation and menstrual cycle',
          subCategory: 'Menstruation and periods',
        },
      article3: {
        title: 'What does it mean if I miss a period?',
        content: 'The menstrual cycle is a complex process...',
        category: 'Menstruation and menstrual cycle',
        subCategory: 'Irregularity and missed periods',
      },
      article4: {
          title: 'My cycle is irregular, is this a problem?',
          content: 'The menstrual cycle is a complex process...',
          category: 'Menstruation and menstrual cycle',
          subCategory: 'Irregularity and missed periods',
        },
      article5: {
          title: 'How much blood do girls lose during their period?',
          content: 'Menstruation is a natural process...',
          category: 'Menstruation and menstrual cycle',
          subCategory: 'Blood, flow and discharge',
        },
        article6: {
          title: 'What is the period blood made of?',
          content: 'Menstruation is a natural process...',
          category: 'Menstruation and menstrual cycle',
          subCategory: 'Blood, flow and discharge',
        },
        article7: {
          title: 'How can I stay clean during my period?',
          content: 'The menstrual cycle is a complex process...',
          category: 'Managing menstruation',
          subCategory: 'Hygiene',
        },
        article8: {
          title: 'Should I bathe when I have my period?',
          content: 'The menstrual cycle is a complex process...',
          category: 'Managing menstruation',
          subCategory: 'Hygiene',
        },
        article9: {
          title: 'What should I use to absorb blood when I have my period?',
          content: 'Menstruation is a natural process...',
          category: 'Managing menstruation',
          subCategory: 'Sanitary protection',
        },
        article10: {
          title: 'What is a sanitary pad?',
          content: 'Menstruation is a natural process...',
          category: 'Managing menstruation',
          subCategory: 'Sanitary protection',
        },
        article11: {
          title: 'Does it hurt to have my period?',
          content: 'The menstrual cycle is a complex process...',
          category: 'Managing menstruation',
          subCategory: 'Pain and PMS',
        },
        article12: {
          title: 'What causes cramps?',
          content: 'The menstrual cycle is a complex process...',
          category: 'Managing menstruation',
          subCategory: 'Pain and PMS',
        },
    },
  },
};