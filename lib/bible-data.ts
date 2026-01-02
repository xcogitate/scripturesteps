export interface BibleVerse {
  id: string
  week: number
  month: string
  theme4to7: string
  theme8to12: string
  // Ages 4-7 have 2 verses per week (A and B)
  verseA: {
    age4: string
    age5: string
    age6: string
    age7: string
  }
  verseB: {
    age4: string
    age5: string
    age6: string
    age7: string
  }
  explanations?: {
    age4: { verseA: string; verseB: string }
    age5: { verseA: string; verseB: string }
    age6: { verseA: string; verseB: string }
    age7: { verseA: string; verseB: string }
  }
  // Ages 8-12 have 1 verse per week
  age8to12: {
    verse: string
    reference: string
    explanation?: string
  }
  explanation4to7?: string // Deprecated, kept for backward compatibility
}

export interface Devotional {
  week: number
  verse: string
  reference: string
  devotion: string
  prayer: string
}

export const allVerses: BibleVerse[] = [
  // JANUARY - God's Love (Ages 4-7) / Knowing God (Ages 8-12)
  {
    id: "week1",
    week: 1,
    month: "January",
    theme4to7: "God Loves Me",
    theme8to12: "Knowing God",
    verseA: {
      age4: "God loves me. — 1 John 4:19",
      age5: "God loves me first. — 1 John 4:19",
      age6: "God loved me before I loved Him. — 1 John 4:19",
      age7: "I love others because God loved me first. — 1 John 4:19",
    },
    verseB: {
      age4: "God is love. — 1 John 4:8",
      age5: "God is love. — 1 John 4:8",
      age6: "God is full of love. — 1 John 4:8",
      age7: "God is love in everything He does. — 1 John 4:8",
    },
    age8to12: {
      verse: "In the beginning God created the heavens and the earth.",
      reference: "Genesis 1:1",
    },
  },
  {
    id: "week2",
    week: 2,
    month: "January",
    theme4to7: "God Loves Me",
    theme8to12: "Knowing God",
    verseA: {
      age4: "Jesus loves me. — Mark 10:14",
      age5: "Jesus loves me. — Mark 10:14",
      age6: "Jesus loves and welcomes children. — Mark 10:14",
      age7: "Jesus loves and welcomes every child. — Mark 10:14",
    },
    verseB: {
      age4: "God is with me. — Joshua 1:9",
      age5: "God is always with me. — Joshua 1:9",
      age6: "God is with me wherever I go. — Joshua 1:9",
      age7: "God is with me wherever I go. — Joshua 1:9",
    },
    age8to12: {
      verse: "The Lord is good to everyone. He shows concern for all He made.",
      reference: "Psalm 145:9",
    },
  },
  {
    id: "week3",
    week: 3,
    month: "January",
    theme4to7: "God Loves Me",
    theme8to12: "Knowing God",
    verseA: {
      age4: "God cares for me. — 1 Peter 5:7",
      age5: "God cares about me. — 1 Peter 5:7",
      age6: "Give all your worries to God because He cares for you. — 1 Peter 5:7",
      age7: "I can give my worries to God because He cares for me. — 1 Peter 5:7",
    },
    verseB: {
      age4: "God is good. — Psalm 145:9",
      age5: "God is good to me. — Psalm 145:9",
      age6: "God is good to everyone. — Psalm 145:9",
      age7: "God is good to everyone. — Psalm 145:9",
    },
    age8to12: {
      verse: "Be still, and know that I am God.",
      reference: "Psalm 46:10",
    },
  },
  {
    id: "week4",
    week: 4,
    month: "January",
    theme4to7: "God Loves Me",
    theme8to12: "Knowing God",
    verseA: {
      age4: "God is my helper. — Psalm 54:4",
      age5: "God is my helper. — Psalm 54:4",
      age6: "God is my helper always. — Psalm 54:4",
      age7: "God is my helper in everything. — Psalm 54:4",
    },
    verseB: {
      age4: "I am God's child. — 1 John 3:1",
      age5: "I am a child of God. — 1 John 3:1",
      age6: "I am called a child of God. — 1 John 3:1",
      age7: "I am called a child of God because of His great love. — 1 John 3:1",
    },
    age8to12: {
      verse: "The Lord is my shepherd. I have everything I need.",
      reference: "Psalm 23:1",
    },
  },

  // FEBRUARY - God Made Everything (Ages 4-7) / Trust & Faith (Ages 8-12)
  {
    id: "week5",
    week: 5,
    month: "February",
    theme4to7: "God Made Everything",
    theme8to12: "Trust & Faith",
    verseA: {
      age4: "God made me. — Psalm 139:14",
      age5: "God made me special. — Psalm 139:14",
      age6: "I praise God because He made me wonderful. — Psalm 139:14",
      age7: "I praise God because I am fearfully and wonderfully made. — Psalm 139:14",
    },
    verseB: {
      age4: "God made everything. — Genesis 1:1",
      age5: "God made the world. — Genesis 1:1",
      age6: "In the beginning, God made everything. — Genesis 1:1",
      age7: "In the beginning, God created the heavens and the earth. — Genesis 1:1",
    },
    age8to12: {
      verse: "Trust in the Lord with all your heart. Do not depend on your own understanding.",
      reference: "Proverbs 3:5",
    },
  },
  {
    id: "week6",
    week: 6,
    month: "February",
    theme4to7: "God Made Everything",
    theme8to12: "Trust & Faith",
    verseA: {
      age4: "God made the animals. — Genesis 1:25",
      age5: "God made all the animals. — Genesis 1:25",
      age6: "God created all animals. — Genesis 1:25",
      age7: "God created all animals and living things. — Genesis 1:25",
    },
    verseB: {
      age4: "God made it good. — Genesis 1:31",
      age5: "Everything God made is good. — Genesis 1:31",
      age6: "Everything God created was very good. — Genesis 1:31",
      age7: "Everything God created was very good. — Genesis 1:31",
    },
    age8to12: {
      verse: "Faith means being sure of what we hope for.",
      reference: "Hebrews 11:1",
    },
  },
  {
    id: "week7",
    week: 7,
    month: "February",
    theme4to7: "God Made Everything",
    theme8to12: "Trust & Faith",
    verseA: {
      age4: "God made the sky. — Genesis 1:8",
      age5: "God made the sky and seas. — Genesis 1:8",
      age6: "God made the sky and the seas. — Genesis 1:8",
      age7: "God made the sky and the seas. — Genesis 1:8",
    },
    verseB: {
      age4: "God made the sun and moon. — Genesis 1:16",
      age5: "God made the sun and moon shine. — Genesis 1:16",
      age6: "God made the sun and moon to shine. — Genesis 1:16",
      age7: "God made the sun and the moon to shine. — Genesis 1:16",
    },
    age8to12: {
      verse: "With God all things are possible.",
      reference: "Matthew 19:26",
    },
  },
  {
    id: "week8",
    week: 8,
    month: "February",
    theme4to7: "God Made Everything",
    theme8to12: "Trust & Faith",
    verseA: {
      age4: "I thank God. — 1 Thessalonians 5:18",
      age5: "I thank God every day. — 1 Thessalonians 5:18",
      age6: "I thank God in every situation. — 1 Thessalonians 5:18",
      age7: "I thank God in every situation. — 1 Thessalonians 5:18",
    },
    verseB: {
      age4: "God made me. — Isaiah 64:8",
      age5: "God is my maker. — Isaiah 64:8",
      age6: "God is my maker and creator. — Isaiah 64:8",
      age7: "God is my maker and creator. — Isaiah 64:8",
    },
    age8to12: {
      verse: "Those who trust in the Lord will be strong.",
      reference: "Isaiah 40:31",
    },
  },

  // MARCH - Trusting God (Ages 4-7) / Obedience & Wisdom (Ages 8-12)
  {
    id: "week9",
    week: 9,
    month: "March",
    theme4to7: "Trusting God",
    theme8to12: "Obedience & Wisdom",
    verseA: {
      age4: "I trust God. — Proverbs 3:5",
      age5: "I trust God with all my heart. — Proverbs 3:5",
      age6: "I trust God with all my heart. — Proverbs 3:5",
      age7: "I trust God with all my heart. — Proverbs 3:5",
    },
    verseB: {
      age4: "God helps me. — Psalm 54:4",
      age5: "God is my helper. — Psalm 54:4",
      age6: "God is my helper every day. — Psalm 54:4",
      age7: "God is my helper every day. — Psalm 54:4",
    },
    age8to12: {
      verse: "Children, obey your parents in the Lord.",
      reference: "Ephesians 6:1",
    },
  },
  {
    id: "week10",
    week: 10,
    month: "March",
    theme4to7: "Trusting God",
    theme8to12: "Obedience & Wisdom",
    verseA: {
      age4: "God hears me. — Psalm 66:19",
      age5: "God hears my prayers. — Psalm 66:19",
      age6: "God hears my prayers. — Psalm 66:19",
      age7: "God hears my prayers and listens to me. — Psalm 66:19",
    },
    verseB: {
      age4: "I can pray to God. — Psalm 50:15",
      age5: "I can ask God for help. — Psalm 50:15",
      age6: "I can call on God when I need help. — Psalm 50:15",
      age7: "I can call on God when I need help. — Psalm 50:15",
    },
    age8to12: {
      verse: "Anyone who listens to God's teaching is wise.",
      reference: "Matthew 7:24",
    },
  },
  {
    id: "week11",
    week: 11,
    month: "March",
    theme4to7: "Trusting God",
    theme8to12: "Obedience & Wisdom",
    verseA: {
      age4: "God sees me. — Proverbs 15:3",
      age5: "God sees everything. — Proverbs 15:3",
      age6: "God sees everything I do. — Proverbs 15:3",
      age7: "God sees everything I do. — Proverbs 15:3",
    },
    verseB: {
      age4: "God watches me. — Psalm 121:8",
      age5: "God watches over me. — Psalm 121:8",
      age6: "God watches over my life. — Psalm 121:8",
      age7: "God watches over my life. — Psalm 121:8",
    },
    age8to12: {
      verse: "God gives wisdom freely to those who ask.",
      reference: "James 1:5",
    },
  },
  {
    id: "week12",
    week: 12,
    month: "March",
    theme4to7: "Trusting God",
    theme8to12: "Obedience & Wisdom",
    verseA: {
      age4: "God is with me. — Isaiah 41:10",
      age5: "I do not need to be afraid. — Isaiah 41:10",
      age6: "I do not need to be afraid because God is with me. — Isaiah 41:10",
      age7: "I do not need to be afraid because God is with me. — Isaiah 41:10",
    },
    verseB: {
      age4: "God helps me. — Hebrews 13:6",
      age5: "God is my helper. — Hebrews 13:6",
      age6: "God is my helper, so I will not fear. — Hebrews 13:6",
      age7: "God is my helper, so I will not fear. — Hebrews 13:6",
    },
    age8to12: {
      verse: "Doing what is right pleases the Lord.",
      reference: "Proverbs 21:3",
    },
  },

  // APRIL - Jesus is My Friend (Ages 4-7) / Jesus Our Savior (Ages 8-12)
  {
    id: "week13",
    week: 13,
    month: "April",
    theme4to7: "Jesus is My Friend",
    theme8to12: "Jesus Our Savior",
    verseA: {
      age4: "Jesus is my friend. — John 15:15",
      age5: "Jesus calls me His friend. — John 15:15",
      age6: "Jesus calls me His friend. — John 15:15",
      age7: "Jesus calls me His friend. — John 15:15",
    },
    verseB: {
      age4: "Jesus loves me. — Mark 10:14",
      age5: "Jesus loves children. — Mark 10:14",
      age6: "Jesus welcomes children with love. — Mark 10:14",
      age7: "Jesus welcomes children with love. — Mark 10:14",
    },
    age8to12: {
      verse: "God loved the world so much that He gave His only Son.",
      reference: "John 3:16",
    },
  },
  {
    id: "week14",
    week: 14,
    month: "April",
    theme4to7: "Jesus is My Friend",
    theme8to12: "Jesus Our Savior",
    verseA: {
      age4: "Jesus helps me. — Hebrews 4:16",
      age5: "Jesus helps me do what is right. — Hebrews 4:16",
      age6: "Jesus helps me do what is right. — Hebrews 4:16",
      age7: "Jesus helps me do what is right. — Hebrews 4:16",
    },
    verseB: {
      age4: "Jesus is kind. — Matthew 11:29",
      age5: "Jesus is gentle and kind. — Matthew 11:29",
      age6: "Jesus is gentle and kind to me. — Matthew 11:29",
      age7: "Jesus is gentle and kind to me. — Matthew 11:29",
    },
    age8to12: {
      verse: "Jesus said, 'I am the way and the truth and the life.'",
      reference: "John 14:6",
    },
  },
  {
    id: "week15",
    week: 15,
    month: "April",
    theme4to7: "Jesus is My Friend",
    theme8to12: "Jesus Our Savior",
    verseA: {
      age4: "I follow Jesus. — John 10:27",
      age5: "I listen to Jesus. — John 10:27",
      age6: "I follow Jesus and listen to His voice. — John 10:27",
      age7: "I follow Jesus and listen to His voice. — John 10:27",
    },
    verseB: {
      age4: "Jesus is the light. — John 8:12",
      age5: "Jesus is the light. — John 8:12",
      age6: "Jesus is the light that guides me. — John 8:12",
      age7: "Jesus is the light that guides my life. — John 8:12",
    },
    age8to12: {
      verse: "Jesus came to save people from their sins.",
      reference: "Matthew 1:21",
    },
  },
  {
    id: "week16",
    week: 16,
    month: "April",
    theme4to7: "Jesus is My Friend",
    theme8to12: "Jesus Our Savior",
    verseA: {
      age4: "Jesus is alive. — Matthew 28:6",
      age5: "Jesus rose from the dead. — Matthew 28:6",
      age6: "Jesus rose from the dead and is alive. — Matthew 28:6",
      age7: "Jesus rose from the dead and is alive. — Matthew 28:6",
    },
    verseB: {
      age4: "Jesus gives me joy. — John 15:11",
      age5: "Jesus gives me joy. — John 15:11",
      age6: "Jesus gives me joy. — John 15:11",
      age7: "Jesus gives me joy that lasts. — John 15:11",
    },
    age8to12: {
      verse: "Christ died for us because He loves us.",
      reference: "Romans 5:8",
    },
  },

  // MAY - Being Kind & Loving (Ages 4-7) / Love & Kindness (Ages 8-12)
  {
    id: "week17",
    week: 17,
    month: "May",
    theme4to7: "Being Kind & Loving",
    theme8to12: "Love & Kindness",
    verseA: {
      age4: "I can be kind. — Ephesians 4:32",
      age5: "I choose to be kind. — Ephesians 4:32",
      age6: "I choose to be kind and forgiving. — Ephesians 4:32",
      age7: "I choose to be kind and forgiving. — Ephesians 4:32",
    },
    verseB: {
      age4: "I love others. — John 13:34",
      age5: "I love others like Jesus. — John 13:34",
      age6: "I love others the way Jesus loves me. — John 13:34",
      age7: "I love others the way Jesus loves me. — John 13:34",
    },
    age8to12: {
      verse: "Love is patient. Love is kind.",
      reference: "1 Corinthians 13:4",
    },
  },
  {
    id: "week18",
    week: 18,
    month: "May",
    theme4to7: "Being Kind & Loving",
    theme8to12: "Love & Kindness",
    verseA: {
      age4: "Kind words are good. — Proverbs 16:24",
      age5: "Kind words make people happy. — Proverbs 16:24",
      age6: "Kind words bring joy to others. — Proverbs 16:24",
      age7: "Kind words bring joy to others. — Proverbs 16:24",
    },
    verseB: {
      age4: "I can help others. — Galatians 6:2",
      age5: "I help carry burdens. — Galatians 6:2",
      age6: "I help carry other people's burdens. — Galatians 6:2",
      age7: "I help carry other people's burdens. — Galatians 6:2",
    },
    age8to12: {
      verse: "Be kind and loving to each other.",
      reference: "Ephesians 4:32",
    },
  },
  {
    id: "week19",
    week: 19,
    month: "May",
    theme4to7: "Being Kind & Loving",
    theme8to12: "Love & Kindness",
    verseA: {
      age4: "I can be gentle. — Colossians 3:12",
      age5: "I try to be gentle. — Colossians 3:12",
      age6: "I try to be gentle and patient. — Colossians 3:12",
      age7: "I try to be gentle and patient. — Colossians 3:12",
    },
    verseB: {
      age4: "I can be patient. — Proverbs 14:29",
      age5: "Being patient is good. — Proverbs 14:29",
      age6: "Being patient helps me make good choices. — Proverbs 14:29",
      age7: "Being patient helps me make good choices. — Proverbs 14:29",
    },
    age8to12: {
      verse: "Do to others what you want them to do to you.",
      reference: "Luke 6:31",
    },
  },
  {
    id: "week20",
    week: 20,
    month: "May",
    theme4to7: "Being Kind & Loving",
    theme8to12: "Love & Kindness",
    verseA: {
      age4: "I can share. — Hebrews 13:16",
      age5: "I share with others. — Hebrews 13:16",
      age6: "I share what I have with others. — Hebrews 13:16",
      age7: "I share what I have with others. — Hebrews 13:16",
    },
    verseB: {
      age4: "I do good things. — Galatians 6:10",
      age5: "I try to do good. — Galatians 6:10",
      age6: "I try to do good to everyone. — Galatians 6:10",
      age7: "I try to do good to everyone. — Galatians 6:10",
    },
    age8to12: {
      verse: "Let everything you do be done in love.",
      reference: "1 Corinthians 16:14",
    },
  },

  // JUNE - Obeying God (Ages 4-7) / Courage & Strength (Ages 8-12)
  {
    id: "week21",
    week: 21,
    month: "June",
    theme4to7: "Obeying God",
    theme8to12: "Courage & Strength",
    verseA: {
      age4: "I obey my parents. — Ephesians 6:1",
      age5: "I obey my parents. — Ephesians 6:1",
      age6: "I obey my parents because it pleases God. — Ephesians 6:1",
      age7: "I obey my parents because it pleases God. — Ephesians 6:1",
    },
    verseB: {
      age4: "I listen. — Proverbs 1:5",
      age5: "I listen to learn. — Proverbs 1:5",
      age6: "I listen so I can grow in wisdom. — Proverbs 1:5",
      age7: "I listen so I can grow in wisdom. — Proverbs 1:5",
    },
    age8to12: {
      verse: "Be strong and brave. The Lord your God is with you.",
      reference: "Joshua 1:9",
    },
  },
  {
    id: "week22",
    week: 22,
    month: "June",
    theme4to7: "Obeying God",
    theme8to12: "Courage & Strength",
    verseA: {
      age4: "I tell the truth. — Zechariah 8:16",
      age5: "I speak the truth. — Zechariah 8:16",
      age6: "God wants me to speak the truth. — Zechariah 8:16",
      age7: "God wants me to speak the truth. — Zechariah 8:16",
    },
    verseB: {
      age4: "God sees me. — Proverbs 15:3",
      age5: "God sees everything. — Proverbs 15:3",
      age6: "God sees everything I do. — Proverbs 15:3",
      age7: "God sees everything I do. — Proverbs 15:3",
    },
    age8to12: {
      verse: "The Lord is my helper; I will not be afraid.",
      reference: "Hebrews 13:6",
    },
  },
  {
    id: "week23",
    week: 23,
    month: "June",
    theme4to7: "Obeying God",
    theme8to12: "Courage & Strength",
    verseA: {
      age4: "I do what is right. — Micah 6:8",
      age5: "God asks me to do what is right. — Micah 6:8",
      age6: "God asks me to do what is right. — Micah 6:8",
      age7: "God asks me to do what is right. — Micah 6:8",
    },
    verseB: {
      age4: "I choose good. — Romans 12:9",
      age5: "I choose what is good. — Romans 12:9",
      age6: "I choose what is good and true. — Romans 12:9",
      age7: "I choose what is good and true. — Romans 12:9",
    },
    age8to12: {
      verse: "God has not given us a spirit of fear.",
      reference: "2 Timothy 1:7",
    },
  },
  {
    id: "week24",
    week: 24,
    month: "June",
    theme4to7: "Obeying God",
    theme8to12: "Courage & Strength",
    verseA: {
      age4: "I walk with God. — Psalm 128:1",
      age5: "I walk in God's ways. — Psalm 128:1",
      age6: "I walk in the ways God teaches me. — Psalm 128:1",
      age7: "I walk in the ways God teaches me. — Psalm 128:1",
    },
    verseB: {
      age4: "I obey God. — 1 Samuel 15:22",
      age5: "Obeying is better. — 1 Samuel 15:22",
      age6: "Obedience is better than sacrifice. — 1 Samuel 15:22",
      age7: "Obedience is better than sacrifice. — 1 Samuel 15:22",
    },
    age8to12: {
      verse: "The Lord is my strength and my shield.",
      reference: "Psalm 28:7",
    },
  },

  // JULY - Thankfulness & Praise (Ages 4-7) / Prayer & Praise (Ages 8-12)
  {
    id: "week25",
    week: 25,
    month: "July",
    theme4to7: "Thankfulness & Praise",
    theme8to12: "Prayer & Praise",
    verseA: {
      age4: "I thank God. — Psalm 107:1",
      age5: "I thank the Lord. — Psalm 107:1",
      age6: "I thank the Lord because He is good. — Psalm 107:1",
      age7: "I thank the Lord because He is good. — Psalm 107:1",
    },
    verseB: {
      age4: "I praise God. — Psalm 150:6",
      age5: "I praise God every day. — Psalm 150:6",
      age6: "I praise God with my whole life. — Psalm 150:6",
      age7: "I praise God with my whole life. — Psalm 150:6",
    },
    age8to12: {
      verse: "Pray without stopping.",
      reference: "1 Thessalonians 5:17",
    },
  },
  {
    id: "week26",
    week: 26,
    month: "July",
    theme4to7: "Thankfulness & Praise",
    theme8to12: "Prayer & Praise",
    verseA: {
      age4: "I sing to God. — Psalm 96:1",
      age5: "I sing to the Lord. — Psalm 96:1",
      age6: "I sing to the Lord with joy. — Psalm 96:1",
      age7: "I sing to the Lord with joy. — Psalm 96:1",
    },
    verseB: {
      age4: "God is great. — Psalm 145:3",
      age5: "God is great. — Psalm 145:3",
      age6: "God is great and worthy of praise. — Psalm 145:3",
      age7: "God is great and worthy of praise. — Psalm 145:3",
    },
    age8to12: {
      verse: "The Lord hears me when I call to Him.",
      reference: "Psalm 4:3",
    },
  },
  {
    id: "week27",
    week: 27,
    month: "July",
    theme4to7: "Thankfulness & Praise",
    theme8to12: "Prayer & Praise",
    verseA: {
      age4: "God gives good gifts. — James 1:17",
      age5: "Every good gift comes from God. — James 1:17",
      age6: "Every good gift comes from God. — James 1:17",
      age7: "Every good gift comes from God. — James 1:17",
    },
    verseB: {
      age4: "God gives food. — Psalm 136:25",
      age5: "God gives food to everyone. — Psalm 136:25",
      age6: "God gives food to everyone. — Psalm 136:25",
      age7: "God gives food to everyone. — Psalm 136:25",
    },
    age8to12: {
      verse: "Give thanks to the Lord, for He is good.",
      reference: "Psalm 107:1",
    },
  },
  {
    id: "week28",
    week: 28,
    month: "July",
    theme4to7: "Thankfulness & Praise",
    theme8to12: "Prayer & Praise",
    verseA: {
      age4: "This is God's day. — Psalm 118:24",
      age5: "This is the day God made. — Psalm 118:24",
      age6: "This is the day the Lord has made. — Psalm 118:24",
      age7: "This is the day the Lord has made. — Psalm 118:24",
    },
    verseB: {
      age4: "I praise God. — Psalm 145:2",
      age5: "I praise God every day. — Psalm 145:2",
      age6: "I praise God every day. — Psalm 145:2",
      age7: "I praise God every day. — Psalm 145:2",
    },
    age8to12: {
      verse: "Praise the Lord with all your heart.",
      reference: "Psalm 9:1",
    },
  },

  // AUGUST - God Protects Me (Ages 4-7) / God's Protection (Ages 8-12)
  {
    id: "week29",
    week: 29,
    month: "August",
    theme4to7: "God Protects Me",
    theme8to12: "God's Protection",
    verseA: {
      age4: "God is my strength. — Psalm 46:1",
      age5: "God is my strength and safe place. — Psalm 46:1",
      age6: "God is my strength and safe place. — Psalm 46:1",
      age7: "God is my strength and safe place. — Psalm 46:1",
    },
    verseB: {
      age4: "God watches me. — Psalm 121:8",
      age5: "God watches over me. — Psalm 121:8",
      age6: "God watches over me at all times. — Psalm 121:8",
      age7: "God watches over me at all times. — Psalm 121:8",
    },
    age8to12: {
      verse: "The Lord will watch over you wherever you go.",
      reference: "Psalm 121:8",
    },
  },
  {
    id: "week30",
    week: 30,
    month: "August",
    theme4to7: "God Protects Me",
    theme8to12: "God's Protection",
    verseA: {
      age4: "God never sleeps. — Psalm 121:4",
      age5: "God never sleeps or forgets me. — Psalm 121:4",
      age6: "God never sleeps or forgets me. — Psalm 121:4",
      age7: "God never sleeps or forgets me. — Psalm 121:4",
    },
    verseB: {
      age4: "God is with me. — Matthew 28:20",
      age5: "God is always with me. — Matthew 28:20",
      age6: "God is always with me. — Matthew 28:20",
      age7: "God is always with me. — Matthew 28:20",
    },
    age8to12: {
      verse: "God is our safe place and our strength.",
      reference: "Psalm 46:1",
    },
  },
  {
    id: "week31",
    week: 31,
    month: "August",
    theme4to7: "God Protects Me",
    theme8to12: "God's Protection",
    verseA: {
      age4: "God is strong. — Psalm 24:8",
      age5: "God is strong and mighty. — Psalm 24:8",
      age6: "God is strong and mighty. — Psalm 24:8",
      age7: "God is strong and mighty. — Psalm 24:8",
    },
    verseB: {
      age4: "God helps me. — Psalm 60:12",
      age5: "God helps me overcome. — Psalm 60:12",
      age6: "God helps me overcome challenges. — Psalm 60:12",
      age7: "God helps me overcome challenges. — Psalm 60:12",
    },
    age8to12: {
      verse: "The Lord is my light and my salvation.",
      reference: "Psalm 27:1",
    },
  },
  {
    id: "week32",
    week: 32,
    month: "August",
    theme4to7: "God Protects Me",
    theme8to12: "God's Protection",
    verseA: {
      age4: "God cares for me. — Psalm 55:22",
      age5: "God takes care of my worries. — Psalm 55:22",
      age6: "God takes care of my worries. — Psalm 55:22",
      age7: "God takes care of my worries. — Psalm 55:22",
    },
    verseB: {
      age4: "God leads me. — Psalm 23:1",
      age5: "God leads me like a shepherd. — Psalm 23:1",
      age6: "God leads me like a shepherd. — Psalm 23:1",
      age7: "God leads me like a shepherd. — Psalm 23:1",
    },
    age8to12: {
      verse: "He will cover you with His feathers.",
      reference: "Psalm 91:4",
    },
  },

  // SEPTEMBER - God's Word (Ages 4-7) / Truth & Integrity (Ages 8-12)
  {
    id: "week33",
    week: 33,
    month: "September",
    theme4to7: "God's Word",
    theme8to12: "Truth & Integrity",
    verseA: {
      age4: "God's Word lights my path. — Psalm 119:105",
      age5: "God's Word lights my path. — Psalm 119:105",
      age6: "God's Word lights my path. — Psalm 119:105",
      age7: "God's Word lights my path. — Psalm 119:105",
    },
    verseB: {
      age4: "God teaches me. — Psalm 25:4",
      age5: "God teaches me how to live. — Psalm 25:4",
      age6: "God teaches me how to live. — Psalm 25:4",
      age7: "God teaches me how to live. — Psalm 25:4",
    },
    age8to12: {
      verse: "Speak the truth in love.",
      reference: "Ephesians 4:15",
    },
  },
  {
    id: "week34",
    week: 34,
    month: "September",
    theme4to7: "God's Word",
    theme8to12: "Truth & Integrity",
    verseA: {
      age4: "I listen to God. — Proverbs 8:33",
      age5: "I listen when God speaks. — Proverbs 8:33",
      age6: "I listen when God speaks. — Proverbs 8:33",
      age7: "I listen when God speaks. — Proverbs 8:33",
    },
    verseB: {
      age4: "I keep God's Word. — Psalm 119:11",
      age5: "I keep God's Word in my heart. — Psalm 119:11",
      age6: "I keep God's Word in my heart. — Psalm 119:11",
      age7: "I keep God's Word in my heart. — Psalm 119:11",
    },
    age8to12: {
      verse: "The Lord delights in honesty.",
      reference: "Proverbs 12:22",
    },
  },
  {
    id: "week35",
    week: 35,
    month: "September",
    theme4to7: "God's Word",
    theme8to12: "Truth & Integrity",
    verseA: {
      age4: "God's Word is true. — John 17:17",
      age5: "God's Word is always true. — John 17:17",
      age6: "God's Word is always true. — John 17:17",
      age7: "God's Word is always true. — John 17:17",
    },
    verseB: {
      age4: "I learn from God. — Joshua 1:8",
      age5: "I learn from God's Word. — Joshua 1:8",
      age6: "I learn from God's Word every day. — Joshua 1:8",
      age7: "I learn from God's Word every day. — Joshua 1:8",
    },
    age8to12: {
      verse: "People look at the outside, but God looks at the heart.",
      reference: "1 Samuel 16:7",
    },
  },
  {
    id: "week36",
    week: 36,
    month: "September",
    theme4to7: "God's Word",
    theme8to12: "Truth & Integrity",
    verseA: {
      age4: "God spoke long ago. — Hebrews 1:1",
      age5: "God spoke through prophets. — Hebrews 1:1",
      age6: "God spoke through prophets long ago. — Hebrews 1:1",
      age7: "God spoke through prophets long ago. — Hebrews 1:1",
    },
    verseB: {
      age4: "God's Word helps me. — Psalm 119:130",
      age5: "God's Word gives understanding. — Psalm 119:130",
      age6: "God's Word gives understanding. — Psalm 119:130",
      age7: "God's Word gives understanding. — Psalm 119:130",
    },
    age8to12: {
      verse: "Whoever does what is right walks safely.",
      reference: "Proverbs 10:9",
    },
  },

  // OCTOBER - Faith & Courage (Ages 4-7) / Serving Others (Ages 8-12)
  {
    id: "week37",
    week: 37,
    month: "October",
    theme4to7: "Faith & Courage",
    theme8to12: "Serving Others",
    verseA: {
      age4: "God gives me courage. — Joshua 1:9",
      age5: "God gives me courage to be strong. — Joshua 1:9",
      age6: "God gives me courage to be strong. — Joshua 1:9",
      age7: "God gives me courage to be strong. — Joshua 1:9",
    },
    verseB: {
      age4: "God is with me. — Isaiah 41:10",
      age5: "I am not afraid because God is with me. — Isaiah 41:10",
      age6: "I am not afraid because God is with me. — Isaiah 41:10",
      age7: "I am not afraid because God is with me. — Isaiah 41:10",
    },
    age8to12: {
      verse: "Serve one another in love.",
      reference: "Galatians 5:13",
    },
  },
  {
    id: "week38",
    week: 38,
    month: "October",
    theme4to7: "Faith & Courage",
    theme8to12: "Serving Others",
    verseA: {
      age4: "I trust God. — Psalm 56:3",
      age5: "I trust God in every situation. — Psalm 56:3",
      age6: "I trust God in every situation. — Psalm 56:3",
      age7: "I trust God in every situation. — Psalm 56:3",
    },
    verseB: {
      age4: "God gives me strength. — Philippians 4:13",
      age5: "God gives me strength to keep going. — Philippians 4:13",
      age6: "God gives me strength to keep going. — Philippians 4:13",
      age7: "God gives me strength to keep going. — Philippians 4:13",
    },
    age8to12: {
      verse: "Whatever you do, work at it with all your heart.",
      reference: "Colossians 3:23",
    },
  },
  {
    id: "week39",
    week: 39,
    month: "October",
    theme4to7: "Faith & Courage",
    theme8to12: "Serving Others",
    verseA: {
      age4: "I do not worry. — Matthew 6:34",
      age5: "I do not worry about tomorrow. — Matthew 6:34",
      age6: "I do not worry about tomorrow. — Matthew 6:34",
      age7: "I do not worry about tomorrow. — Matthew 6:34",
    },
    verseB: {
      age4: "God gives me peace. — Philippians 4:7",
      age5: "God gives me peace in my heart. — Philippians 4:7",
      age6: "God gives me peace in my heart. — Philippians 4:7",
      age7: "God gives me peace in my heart. — Philippians 4:7",
    },
    age8to12: {
      verse: "Jesus came to serve others.",
      reference: "Mark 10:45",
    },
  },
  {
    id: "week40",
    week: 40,
    month: "October",
    theme4to7: "Faith & Courage",
    theme8to12: "Serving Others",
    verseA: {
      age4: "God helps me. — Psalm 60:12",
      age5: "God helps me overcome difficulties. — Psalm 60:12",
      age6: "God helps me overcome difficulties. — Psalm 60:12",
      age7: "God helps me overcome difficulties. — Psalm 60:12",
    },
    verseB: {
      age4: "I give worries to God. — 1 Peter 5:7",
      age5: "I give all my worries to God. — 1 Peter 5:7",
      age6: "I give all my worries to God. — 1 Peter 5:7",
      age7: "I give all my worries to God. — 1 Peter 5:7",
    },
    age8to12: {
      verse: "Help those who are in need.",
      reference: "Hebrews 13:16",
    },
  },

  // NOVEMBER - Forgiveness (Ages 4-7) / Gratitude (Ages 8-12)
  {
    id: "week41",
    week: 41,
    month: "November",
    theme4to7: "Forgiveness",
    theme8to12: "Gratitude",
    verseA: {
      age4: "God forgives me. — 1 John 1:9",
      age5: "God forgives me when I confess. — 1 John 1:9",
      age6: "God forgives me when I confess my sins. — 1 John 1:9",
      age7: "God forgives me when I confess my sins. — 1 John 1:9",
    },
    verseB: {
      age4: "I forgive others. — Colossians 3:13",
      age5: "I forgive others like God forgives me. — Colossians 3:13",
      age6: "I forgive others just as God forgives me. — Colossians 3:13",
      age7: "I forgive others just as God forgives me. — Colossians 3:13",
    },
    age8to12: {
      verse: "Give thanks in all circumstances.",
      reference: "1 Thessalonians 5:18",
    },
  },
  {
    id: "week42",
    week: 42,
    month: "November",
    theme4to7: "Forgiveness",
    theme8to12: "Gratitude",
    verseA: {
      age4: "I say sorry. — Luke 19:8",
      age5: "I say sorry and make things right. — Luke 19:8",
      age6: "I say sorry and make things right. — Luke 19:8",
      age7: "I say sorry and make things right. — Luke 19:8",
    },
    verseB: {
      age4: "I choose kindness. — Ephesians 4:32",
      age5: "I choose kindness again. — Ephesians 4:32",
      age6: "I choose kindness again. — Ephesians 4:32",
      age7: "I choose kindness again. — Ephesians 4:32",
    },
    age8to12: {
      verse: "A thankful heart honors God.",
      reference: "Psalm 50:23",
    },
  },
  {
    id: "week43",
    week: 43,
    month: "November",
    theme4to7: "Forgiveness",
    theme8to12: "Gratitude",
    verseA: {
      age4: "God is loving. — Psalm 103:8",
      age5: "God is loving and merciful. — Psalm 103:8",
      age6: "God is loving and merciful. — Psalm 103:8",
      age7: "God is loving and merciful. — Psalm 103:8",
    },
    verseB: {
      age4: "God is patient. — Psalm 145:8",
      age5: "God is patient with me. — Psalm 145:8",
      age6: "God is patient with me. — Psalm 145:8",
      age7: "God is patient with me. — Psalm 145:8",
    },
    age8to12: {
      verse: "The Lord has done great things for us.",
      reference: "Psalm 126:3",
    },
  },
  {
    id: "week44",
    week: 44,
    month: "November",
    theme4to7: "Forgiveness",
    theme8to12: "Gratitude",
    verseA: {
      age4: "Love covers wrongs. — Proverbs 10:12",
      age5: "Love covers many wrongs. — Proverbs 10:12",
      age6: "Love covers many wrongs. — Proverbs 10:12",
      age7: "Love covers many wrongs. — Proverbs 10:12",
    },
    verseB: {
      age4: "God loves me. — Romans 8:39",
      age5: "Nothing can separate me from God's love. — Romans 8:39",
      age6: "Nothing can separate me from God's love. — Romans 8:39",
      age7: "Nothing can separate me from God's love. — Romans 8:39",
    },
    age8to12: {
      verse: "Thank God for everything.",
      reference: "Ephesians 5:20",
    },
  },

  // DECEMBER - Jesus is God's Gift (Ages 4-7) / Hope & Joy (Ages 8-12)
  {
    id: "week45",
    week: 45,
    month: "December",
    theme4to7: "Jesus is God's Gift",
    theme8to12: "Hope & Joy",
    verseA: {
      age4: "Jesus was born. — Luke 2:11",
      age5: "Jesus was born to be our Savior. — Luke 2:11",
      age6: "Jesus was born to be our Savior. — Luke 2:11",
      age7: "Jesus was born to be our Savior. — Luke 2:11",
    },
    verseB: {
      age4: "God gave Jesus. — John 3:16",
      age5: "God gave Jesus because He loves us. — John 3:16",
      age6: "God gave Jesus because He loves us. — John 3:16",
      age7: "God gave Jesus because He loves us. — John 3:16",
    },
    age8to12: {
      verse: "The joy of the Lord is your strength.",
      reference: "Nehemiah 8:10",
    },
  },
  {
    id: "week46",
    week: 46,
    month: "December",
    theme4to7: "Jesus is God's Gift",
    theme8to12: "Hope & Joy",
    verseA: {
      age4: "A Savior was born. — Luke 2:11",
      age5: "A Savior was born at the right time. — Luke 2:11",
      age6: "A Savior was born at the right time. — Luke 2:11",
      age7: "A Savior was born at the right time. — Luke 2:11",
    },
    verseB: {
      age4: "God sent His Son. — Galatians 4:4",
      age5: "God sent His Son to the world. — Galatians 4:4",
      age6: "God sent His Son to the world. — Galatians 4:4",
      age7: "God sent His Son to the world. — Galatians 4:4",
    },
    age8to12: {
      verse: "A Savior has been born to you.",
      reference: "Luke 2:11",
    },
  },
  {
    id: "week47",
    week: 47,
    month: "December",
    theme4to7: "Jesus is God's Gift",
    theme8to12: "Hope & Joy",
    verseA: {
      age4: "Jesus brings joy. — Luke 2:10",
      age5: "Jesus brings great joy. — Luke 2:10",
      age6: "Jesus brings great joy to everyone. — Luke 2:10",
      age7: "Jesus brings great joy to everyone. — Luke 2:10",
    },
    verseB: {
      age4: "Jesus is Lord. — Romans 10:9",
      age5: "Jesus is Lord of all. — Romans 10:9",
      age6: "Jesus is Lord of all. — Romans 10:9",
      age7: "Jesus is Lord of all. — Romans 10:9",
    },
    age8to12: {
      verse: "Hope in the Lord, for He is loving.",
      reference: "Psalm 130:7",
    },
  },
  {
    id: "week48",
    week: 48,
    month: "December",
    theme4to7: "Jesus is God's Gift",
    theme8to12: "Hope & Joy",
    verseA: {
      age4: "I thank God. — 2 Corinthians 9:15",
      age5: "I thank God for His wonderful gift. — 2 Corinthians 9:15",
      age6: "I thank God for His wonderful gift. — 2 Corinthians 9:15",
      age7: "I thank God for His wonderful gift. — 2 Corinthians 9:15",
    },
    verseB: {
      age4: "Jesus is King. — Revelation 19:16",
      age5: "Jesus is King forever. — Revelation 19:16",
      age6: "Jesus is King forever. — Revelation 19:16",
      age7: "Jesus is King forever. — Revelation 19:16",
    },
    age8to12: {
      verse: "Rejoice in the Lord always.",
      reference: "Philippians 4:4",
    },
  },

  // Weeks 49-52: Review weeks
  {
    id: "week49",
    week: 49,
    month: "December",
    theme4to7: "Review Week",
    theme8to12: "Review Week",
    verseA: {
      age4: "God loves me. — 1 John 4:19",
      age5: "God loves me first. — 1 John 4:19",
      age6: "God loved me before I loved Him. — 1 John 4:19",
      age7: "I love others because God loved me first. — 1 John 4:19",
    },
    verseB: {
      age4: "God is love. — 1 John 4:8",
      age5: "God is love. — 1 John 4:8",
      age6: "God is full of love. — 1 John 4:8",
      age7: "God is love in everything He does. — 1 John 4:8",
    },
    age8to12: {
      verse: "In the beginning God created the heavens and the earth.",
      reference: "Genesis 1:1",
    },
  },
  {
    id: "week50",
    week: 50,
    month: "December",
    theme4to7: "Review Week",
    theme8to12: "Review Week",
    verseA: {
      age4: "I trust God. — Proverbs 3:5",
      age5: "I trust God with all my heart. — Proverbs 3:5",
      age6: "I trust God with all my heart. — Proverbs 3:5",
      age7: "I trust God with all my heart. — Proverbs 3:5",
    },
    verseB: {
      age4: "God helps me. — Psalm 54:4",
      age5: "God is my helper. — Psalm 54:4",
      age6: "God is my helper every day. — Psalm 54:4",
      age7: "God is my helper every day. — Psalm 54:4",
    },
    age8to12: {
      verse: "Trust in the Lord with all your heart.",
      reference: "Proverbs 3:5",
    },
  },
  {
    id: "week51",
    week: 51,
    month: "December",
    theme4to7: "Review Week",
    theme8to12: "Review Week",
    verseA: {
      age4: "Jesus is my friend. — John 15:15",
      age5: "Jesus calls me His friend. — John 15:15",
      age6: "Jesus calls me His friend. — John 15:15",
      age7: "Jesus calls me His friend. — John 15:15",
    },
    verseB: {
      age4: "Jesus loves me. — Mark 10:14",
      age5: "Jesus loves children. — Mark 10:14",
      age6: "Jesus welcomes children with love. — Mark 10:14",
      age7: "Jesus welcomes children with love. — Mark 10:14",
    },
    age8to12: {
      verse: "God loved the world so much that He gave His only Son.",
      reference: "John 3:16",
    },
  },
  {
    id: "week52",
    week: 52,
    month: "December",
    theme4to7: "Review Week",
    theme8to12: "Review Week",
    verseA: {
      age4: "I thank God. — Psalm 107:1",
      age5: "I thank the Lord. — Psalm 107:1",
      age6: "I thank the Lord because He is good. — Psalm 107:1",
      age7: "I thank the Lord because He is good. — Psalm 107:1",
    },
    verseB: {
      age4: "I praise God. — Psalm 150:6",
      age5: "I praise God every day. — Psalm 150:6",
      age6: "I praise God with my whole life. — Psalm 150:6",
      age7: "I praise God with my whole life. — Psalm 150:6",
    },
    age8to12: {
      verse: "Rejoice in the Lord always.",
      reference: "Philippians 4:4",
    },
  },
]

// JANUARY - Knowing God
export const devotionals: Devotional[] = [
  {
    week: 1,
    verse: "In the beginning God created the heavens and the earth.",
    reference: "Genesis 1:1",
    devotion:
      "God made everything—sky, land, animals, and you. Nothing happened by accident. God is powerful and wise, and He cares about what He created. When you see nature, remember God made it with love.",
    prayer:
      "God, Thank You for creating the world and for making me. Help me remember that You are powerful and good. Amen.",
  },
  {
    week: 2,
    verse: "The Lord is good to everyone.",
    reference: "Psalm 145:9",
    devotion:
      "God is good all the time—not only when things go well. His goodness shows in how He helps, protects, and teaches us. We can trust His heart.",
    prayer: "Lord, thank You for being good to me every day. Help me see Your goodness around me. Amen.",
  },
  {
    week: 3,
    verse: "Be still, and know that I am God.",
    reference: "Psalm 46:10",
    devotion:
      "Sometimes life feels noisy. God wants us to slow down and remember He is in control. When we are still, we can hear God better.",
    prayer: "God, help me slow down and remember You are in charge. Give me peace in my heart. Amen.",
  },
  {
    week: 4,
    verse: "God is love.",
    reference: "1 John 4:8",
    devotion:
      "Everything God does comes from love. When we show kindness, forgiveness, and patience, we show others what God is like.",
    prayer: "God, thank You for loving me. Help me show love to others every day. Amen.",
  },

  // FEBRUARY - Trust & Faith
  {
    week: 5,
    verse: "Trust in the Lord with all your heart.",
    reference: "Proverbs 3:5",
    devotion:
      "Trusting God means believing He knows what is best—even when we don't understand. God never makes mistakes.",
    prayer: "Lord, help me trust You with my whole heart. I choose to believe You know what is best. Amen.",
  },
  {
    week: 6,
    verse: "Faith means being sure of what we hope for.",
    reference: "Hebrews 11:1",
    devotion: "Faith is believing God will keep His promises. Even when we can't see the answer yet, God is working.",
    prayer: "God, help my faith grow stronger. Help me trust You even when I can't see the result. Amen.",
  },
  {
    week: 7,
    verse: "With God all things are possible.",
    reference: "Matthew 19:26",
    devotion: "God is bigger than any problem. Nothing is too hard for Him—not school, family issues, or fears.",
    prayer: "God, thank You that nothing is too hard for You. Help me believe You can help me. Amen.",
  },
  {
    week: 8,
    verse: "Those who trust in the Lord will be strong.",
    reference: "Isaiah 40:31",
    devotion: "When we trust God, He gives us strength—not just in our bodies, but in our hearts and minds.",
    prayer: "Lord, make me strong when I feel weak. Help me trust You more every day. Amen.",
  },

  // MARCH - Obedience & Wisdom
  {
    week: 9,
    verse: "Children, obey your parents in the Lord.",
    reference: "Ephesians 6:1",
    devotion: "God gives parents to guide and protect us. Obedience helps us grow wise and safe.",
    prayer: "God, help me listen and obey my parents with a good attitude. Amen.",
  },
  {
    week: 10,
    verse: "Anyone who listens to God's teaching is wise.",
    reference: "Matthew 7:24",
    devotion: "Wisdom comes from listening and doing what God says—not just hearing it.",
    prayer: "Lord, help me listen to Your Word and follow it. Make me wise. Amen.",
  },
  {
    week: 11,
    verse: "God gives wisdom freely to those who ask.",
    reference: "James 1:5",
    devotion: "When you don't know what to do, ask God. He loves to help and guide His children.",
    prayer: "God, I ask You for wisdom today. Help me make good choices. Amen.",
  },
  {
    week: 12,
    verse: "Doing what is right pleases the Lord.",
    reference: "Proverbs 21:3",
    devotion: "Choosing what is right—even when it's hard—makes God happy and helps others.",
    prayer: "Lord, help me choose what is right even when it's difficult. Amen.",
  },

  // APRIL - Jesus Our Savior
  {
    week: 13,
    verse: "God loved the world so much that He gave His only Son.",
    reference: "John 3:16",
    devotion: "Jesus came because God loves us deeply. His love is a gift.",
    prayer: "Thank You, God, for loving me so much and sending Jesus. Amen.",
  },
  {
    week: 14,
    verse: "Jesus said, 'I am the way and the truth and the life.'",
    reference: "John 14:6",
    devotion: "Jesus shows us how to live and how to know God. Following Him leads to life.",
    prayer: "Jesus, help me follow You every day. Amen.",
  },
  {
    week: 15,
    verse: "Jesus came to save people from their sins.",
    reference: "Matthew 1:21",
    devotion: "Jesus forgives us when we mess up and gives us a fresh start.",
    prayer: "Jesus, thank You for forgiving me. Help me live better. Amen.",
  },
  {
    week: 16,
    verse: "Christ died for us because He loves us.",
    reference: "Romans 5:8",
    devotion: "Jesus' love is sacrificial—He gave everything for us.",
    prayer: "Lord Jesus, thank You for loving me so much. Help me love others too. Amen.",
  },

  // MAY - Love & Kindness
  {
    week: 17,
    verse: "Love is patient. Love is kind.",
    reference: "1 Corinthians 13:4",
    devotion: "Real love shows in how we treat others—especially when it's not easy.",
    prayer: "God, help me be patient and kind today. Amen.",
  },
  {
    week: 18,
    verse: "Be kind and loving to each other.",
    reference: "Ephesians 4:32",
    devotion: "Kind words and actions can change someone's whole day.",
    prayer: "Lord, help me use kind words and actions. Amen.",
  },
  {
    week: 19,
    verse: "Do to others what you want them to do to you.",
    reference: "Luke 6:31",
    devotion: "Treating others well shows respect and love.",
    prayer: "God, help me treat others the way I want to be treated. Amen.",
  },
  {
    week: 20,
    verse: "Let everything you do be done in love.",
    reference: "1 Corinthians 16:14",
    devotion: "Love should guide how we speak, play, and help others.",
    prayer: "Lord, let love guide everything I do. Amen.",
  },

  // JUNE - Courage & Strength
  {
    week: 21,
    verse: "Be strong and brave. The Lord your God is with you.",
    reference: "Joshua 1:9",
    devotion: "You're never alone. God goes with you everywhere.",
    prayer: "God, help me be brave because You are with me. Amen.",
  },
  {
    week: 22,
    verse: "The Lord is my helper; I will not be afraid.",
    reference: "Hebrews 13:6",
    devotion: "God helps us when we feel scared or unsure.",
    prayer: "Lord, help me trust You when I feel afraid. Amen.",
  },
  {
    week: 23,
    verse: "God has not given us a spirit of fear.",
    reference: "2 Timothy 1:7",
    devotion: "Fear doesn't come from God. He gives peace and courage.",
    prayer: "God, replace my fear with Your peace. Amen.",
  },
  {
    week: 24,
    verse: "The Lord is my strength and my shield.",
    reference: "Psalm 28:7",
    devotion: "God protects and strengthens us in hard times.",
    prayer: "Lord, thank You for protecting me. Amen.",
  },

  // JULY - Prayer & Praise
  {
    week: 25,
    verse: "Pray without stopping.",
    reference: "1 Thessalonians 5:17",
    devotion: "Prayer is talking to God anytime, anywhere.",
    prayer: "God, thank You that I can talk to You anytime. Amen.",
  },
  {
    week: 26,
    verse: "The Lord hears me when I call to Him.",
    reference: "Psalm 4:3",
    devotion: "God listens carefully when you pray.",
    prayer: "Lord, thank You for always listening to me. Amen.",
  },
  {
    week: 27,
    verse: "Give thanks to the Lord, for He is good.",
    reference: "Psalm 107:1",
    devotion: "Thankfulness helps us remember how good God is.",
    prayer: "God, thank You for all You've done for me. Amen.",
  },
  {
    week: 28,
    verse: "Praise the Lord with all your heart.",
    reference: "Psalm 9:1",
    devotion: "Praise means telling God how great He is.",
    prayer: "Lord, I praise You with all my heart. Amen.",
  },

  // AUGUST - God's Protection
  {
    week: 29,
    verse: "The Lord will watch over you wherever you go.",
    reference: "Psalm 121:8",
    devotion: "God protects you at school, home, and everywhere.",
    prayer: "God, thank You for watching over me. Amen.",
  },
  {
    week: 30,
    verse: "God is our safe place and our strength.",
    reference: "Psalm 46:1",
    devotion: "God is a safe place when life feels hard.",
    prayer: "Lord, thank You for being my safe place. Amen.",
  },
  {
    week: 31,
    verse: "The Lord is my light and my salvation.",
    reference: "Psalm 27:1",
    devotion: "God shows us the right path.",
    prayer: "God, guide me and show me the right way. Amen.",
  },
  {
    week: 32,
    verse: "He will cover you with His feathers.",
    reference: "Psalm 91:4",
    devotion: "God cares for you like a loving parent.",
    prayer: "Lord, thank You for Your care and protection. Amen.",
  },

  // SEPTEMBER - Truth & Integrity
  {
    week: 33,
    verse: "Speak the truth in love.",
    reference: "Ephesians 4:15",
    devotion: "Truth should always be spoken kindly.",
    prayer: "God, help me speak truth with love. Amen.",
  },
  {
    week: 34,
    verse: "The Lord delights in honesty.",
    reference: "Proverbs 12:22",
    devotion: "Honesty builds trust with God and others.",
    prayer: "Lord, help me always be honest. Amen.",
  },
  {
    week: 35,
    verse: "God looks at the heart.",
    reference: "1 Samuel 16:7",
    devotion: "God cares more about who you are inside than outside.",
    prayer: "God, help my heart be pleasing to You. Amen.",
  },
  {
    week: 36,
    verse: "Whoever does what is right walks safely.",
    reference: "Proverbs 10:9",
    devotion: "Doing the right thing keeps us on God's path.",
    prayer: "Lord, help me choose what is right. Amen.",
  },

  // OCTOBER - Serving Others
  {
    week: 37,
    verse: "Serve one another in love.",
    reference: "Galatians 5:13",
    devotion: "Helping others is a way to show love.",
    prayer: "God, help me serve others gladly. Amen.",
  },
  {
    week: 38,
    verse: "Work at it with all your heart.",
    reference: "Colossians 3:23",
    devotion: "Doing your best honors God.",
    prayer: "Lord, help me do my best in all I do. Amen.",
  },
  {
    week: 39,
    verse: "Jesus came to serve others.",
    reference: "Mark 10:45",
    devotion: "Jesus showed us how to serve humbly.",
    prayer: "Jesus, help me serve like You did. Amen.",
  },
  {
    week: 40,
    verse: "Help those who are in need.",
    reference: "Hebrews 13:16",
    devotion: "God wants us to care for people who need help.",
    prayer: "God, show me how to help others today. Amen.",
  },

  // NOVEMBER - Gratitude
  {
    week: 41,
    verse: "Give thanks in all circumstances.",
    reference: "1 Thessalonians 5:18",
    devotion: "Thankfulness helps us trust God even in hard times.",
    prayer: "God, help me be thankful always. Amen.",
  },
  {
    week: 42,
    verse: "A thankful heart honors God.",
    reference: "Psalm 50:23",
    devotion: "Gratitude shows we recognize God's blessings.",
    prayer: "Lord, thank You for Your blessings. Amen.",
  },
  {
    week: 43,
    verse: "The Lord has done great things for us.",
    reference: "Psalm 126:3",
    devotion: "God has done amazing things in our lives.",
    prayer: "God, thank You for all You've done. Amen.",
  },
  {
    week: 44,
    verse: "Thank God for everything.",
    reference: "Ephesians 5:20",
    devotion: "Thankfulness keeps our hearts joyful.",
    prayer: "Lord, I thank You for everything. Amen.",
  },

  // DECEMBER - Hope & Joy
  {
    week: 45,
    verse: "The joy of the Lord is your strength.",
    reference: "Nehemiah 8:10",
    devotion: "God's joy gives us strength every day.",
    prayer: "God, fill me with Your joy. Amen.",
  },
  {
    week: 46,
    verse: "A Savior has been born to you.",
    reference: "Luke 2:11",
    devotion: "Jesus' birth brought hope to the world.",
    prayer: "Thank You, God, for sending Jesus. Amen.",
  },
  {
    week: 47,
    verse: "Hope in the Lord.",
    reference: "Psalm 130:7",
    devotion: "Hope reminds us God is always faithful.",
    prayer: "Lord, my hope is in You. Amen.",
  },
  {
    week: 48,
    verse: "Rejoice in the Lord always.",
    reference: "Philippians 4:4",
    devotion: "Joy comes from trusting God—not circumstances.",
    prayer: "God, help me rejoice in You always. Amen.",
  },
]

// ADDING EXTRA LIBRARIES FOR PROGRAM YEAR 2+
// EXTRA VERSES FOR AGES 4-7 (YEAR 2 CONTENT)
export const extraVerses4to7: BibleVerse[] = [
  // JANUARY - God Made Me
  {
    id: "extra-week1",
    week: 1,
    month: "January",
    theme4to7: "God Made Me",
    theme8to12: "God Made Me", // Merged theme for simplicity in extra content
    verseA: {
      age4: "God made the world. — Genesis 1:1",
      age5: "God made everything good. — Genesis 1:31",
      age6: "God created me in His image. — Genesis 1:27",
      age7: "God created me wonderfully. — Psalm 127:3",
    },
    verseB: {
      age4: "God made me with care. — Isaiah 64:8",
      age5: "God made me for a reason. — Jeremiah 29:11",
      age6: "God knows everything about me. — Psalm 139:2",
      age7: "God cares about who I am becoming. — Proverbs 20:11",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week2",
    week: 2,
    month: "January",
    theme4to7: "God Made Me",
    theme8to12: "God Made Me",
    verseA: {
      age4: "God knows my name. — Isaiah 43:1",
      age5: "God knows me very well. — Psalm 139:1",
      age6: "God formed me with purpose. — Isaiah 45:12",
      age7: "God knows my thoughts. — Psalm 94:11",
    },
    verseB: {
      age4: "I belong to God. — Psalm 100:3",
      age5: "I am God's child. — 1 John 3:1",
      age6: "I am precious to God. — Isaiah 43:4",
      age7: "I am valuable to God. — Matthew 10:31",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week3",
    week: 3,
    month: "January",
    theme4to7: "God Made Me",
    theme8to12: "God Made Me",
    verseA: {
      age4: "God made me to do good. — Ephesians 2:10",
      age5: "God formed me with care. — Isaiah 44:24",
      age6: "God planned my life. — Psalm 139:16",
      age7: "God made me to live wisely. — Proverbs 4:7",
    },
    verseB: {
      age4: "God is happy with me. — Proverbs 8:30",
      age5: "God has good plans for me. — Proverbs 16:3",
      age6: "God made me for good works. — Ephesians 2:10",
      age7: "God teaches me what is right. — Isaiah 30:21",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week4",
    week: 4,
    month: "January",
    theme4to7: "God Made Me",
    theme8to12: "God Made Me",
    verseA: {
      age4: "God made me wonderful. — Psalm 139:14",
      age5: "God made me to help others. — Galatians 5:13",
      age6: "God is my Creator. — Ecclesiastes 12:1",
      age7: "God shapes my future. — Jeremiah 1:5",
    },
    verseB: {
      age4: "God loves His children. — Psalm 103:13",
      age5: "I belong to God's family. — Ephesians 2:19",
      age6: "God delights in His children. — Psalm 149:4",
      age7: "God rejoices over His children. — Zephaniah 3:17",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // FEBRUARY - Talking to God (Prayer)
  {
    id: "extra-week5",
    week: 5,
    month: "February",
    theme4to7: "Talking to God (Prayer)",
    theme8to12: "Talking to God (Prayer)",
    verseA: {
      age4: "I can talk to God. — Psalm 145:18",
      age5: "God wants me to pray. — Luke 18:1",
      age6: "God invites me to pray. — Jeremiah 33:3",
      age7: "God wants me to pray with faith. — Hebrews 11:6",
    },
    verseB: {
      age4: "God listens to me. — 1 John 5:14",
      age5: "God listens when I pray. — Psalm 102:17",
      age6: "God listens carefully when I pray. — Psalm 65:2",
      age7: "God listens when I pray honestly. — Psalm 66:20",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week6",
    week: 6,
    month: "February",
    theme4to7: "Talking to God (Prayer)",
    theme8to12: "Talking to God (Prayer)",
    verseA: {
      age4: "I pray in the morning. — Psalm 5:3",
      age5: "I can pray anywhere. — Matthew 6:6",
      age6: "Prayer brings me close to God. — Psalm 63:1",
      age7: "Prayer helps me trust God. — Psalm 62:8",
    },
    verseB: {
      age4: "I pray at night. — Psalm 4:8",
      age5: "God hears my words. — Psalm 17:6",
      age6: "God hears sincere prayers. — Proverbs 15:29",
      age7: "God answers prayers according to His will. — 1 John 5:15",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week7",
    week: 7,
    month: "February",
    theme4to7: "Talking to God (Prayer)",
    theme8to12: "Talking to God (Prayer)",
    verseA: {
      age4: "God hears my voice. — Psalm 116:1",
      age5: "Prayer makes me close to God. — James 4:8",
      age6: "God answers prayers in His time. — Psalm 27:14",
      age7: "God gives wisdom when I pray. — James 1:6",
    },
    verseB: {
      age4: "God answers with love. — Lamentations 3:55–56",
      age5: "God answers at the right time. — Ecclesiastes 3:1",
      age6: "Prayer gives me peace. — Isaiah 26:3",
      age7: "Prayer helps me stay calm. — Psalm 55:22",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week8",
    week: 8,
    month: "February",
    theme4to7: "Talking to God (Prayer)",
    theme8to12: "Talking to God (Prayer)",
    verseA: {
      age4: "I thank God when I pray. — Colossians 4:2",
      age5: "I thank God in my prayers. — Psalm 95:2",
      age6: "I pray with faith. — Mark 11:24",
      age7: "God wants me to keep praying. — Romans 12:12",
    },
    verseB: {
      age4: "God is close to me. — Psalm 34:18",
      age5: "God gives peace when I pray. — Philippians 4:6–7",
      age6: "God strengthens me when I pray. — Colossians 1:11",
      age7: "Prayer brings peace to my heart. — John 16:33",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // MARCH - God Helps Me
  {
    id: "extra-week9",
    week: 9,
    month: "March",
    theme4to7: "God Helps Me",
    theme8to12: "God Helps Me",
    verseA: {
      age4: "God shows me the way. — Psalm 32:8",
      age5: "God is my helper. — Psalm 121:2",
      age6: "God is my helper and protector. — Psalm 46:1",
      age7: "God helps me make good choices. — Proverbs 3:7",
    },
    verseB: {
      age4: "God holds my hand. — Isaiah 42:6",
      age5: "God gives me wisdom. — James 1:5",
      age6: "God gives me wisdom when I ask. — James 1:5",
      age7: "God guides me with wisdom. — Psalm 73:24",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week10",
    week: 10,
    month: "March",
    theme4to7: "God Helps Me",
    theme8to12: "God Helps Me",
    verseA: {
      age4: "God keeps me safe. — Psalm 91:11",
      age5: "God makes me brave. — Deuteronomy 31:8",
      age6: "God leads me on the right path. — Proverbs 3:6",
      age7: "God helps me when I am afraid. — Psalm 56:4",
    },
    verseB: {
      age4: "God is my shield. — Psalm 3:3",
      age5: "God is always near. — Psalm 145:18",
      age6: "God guards my steps. — Psalm 37:23",
      age7: "God gives strength when I am tired. — Isaiah 50:4",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week11",
    week: 11,
    month: "March",
    theme4to7: "God Helps Me",
    theme8to12: "God Helps Me",
    verseA: {
      age4: "God gives me strength. — Psalm 138:3",
      age5: "God strengthens me. — Isaiah 40:29",
      age6: "God supports me when I struggle. — Psalm 145:14",
      age7: "God supports me when I fall. — Micah 7:8",
    },
    verseB: {
      age4: "God helps me do good. — 2 Thessalonians 2:17",
      age5: "God helps me when I am weak. — 2 Corinthians 12:9",
      age6: "God gives me strength to continue. — Isaiah 40:31",
      age7: "God lifts me up again. — Psalm 145:14",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week12",
    week: 12,
    month: "March",
    theme4to7: "God Helps Me",
    theme8to12: "God Helps Me",
    verseA: {
      age4: "God watches over me. — Psalm 33:18",
      age5: "God leads me the right way. — Psalm 23:3",
      age6: "God watches over my life. — Psalm 121:7–8",
      age7: "God teaches me patience. — Psalm 37:7",
    },
    verseB: {
      age4: "God helps me every day. — Psalm 68:19",
      age5: "God watches over my life. — Psalm 121:5",
      age6: "God helps me every day. — Psalm 118:13",
      age7: "God helps me finish well. — Galatians 5:7",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // APRIL - Loving Others
  {
    id: "extra-week13",
    week: 13,
    month: "April",
    theme4to7: "Loving Others",
    theme8to12: "Loving Others",
    verseA: {
      age4: "I can be kind. — Colossians 3:12",
      age5: "God wants me to love people. — John 13:34",
      age6: "God wants me to love others deeply. — 1 Peter 4:8",
      age7: "Loving others shows God's love. — 1 John 4:12",
    },
    verseB: {
      age4: "Kind words are good. — Proverbs 15:26",
      age5: "Love shows I follow Jesus. — John 13:35",
      age6: "Love comes from a kind heart. — Colossians 3:14",
      age7: "Love means putting others first. — Philippians 2:3",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week14",
    week: 14,
    month: "April",
    theme4to7: "Loving Others",
    theme8to12: "Loving Others",
    verseA: {
      age4: "I help others. — 1 Peter 4:10",
      age5: "I use loving words. — Ephesians 4:29",
      age6: "Loving others pleases God. — 1 John 4:21",
      age7: "God wants me to be kind always. — Proverbs 19:22",
    },
    verseB: {
      age4: "God wants me to do good. — Micah 6:8",
      age5: "Love is patient and kind. — 1 Corinthians 13:4",
      age6: "I show love through my actions. — Proverbs 3:3",
      age7: "Kindness reflects God's heart. — Titus 3:4",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week15",
    week: 15,
    month: "April",
    theme4to7: "Loving Others",
    theme8to12: "Loving Others",
    verseA: {
      age4: "I care about others. — Philippians 2:4",
      age5: "I forgive like God forgives. — Colossians 3:13",
      age6: "I forgive as God forgives me. — Ephesians 4:32",
      age7: "Forgiveness brings peace. — Matthew 18:21–22",
    },
    verseB: {
      age4: "Love comes from God. — 1 John 4:7",
      age5: "Love helps me do what is right. — Romans 13:10",
      age6: "Love helps me live in peace. — Romans 12:18",
      age7: "God forgives me when I forgive others. — Mark 11:25",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week16",
    week: 16,
    month: "April",
    theme4to7: "Loving Others",
    theme8to12: "Loving Others",
    verseA: {
      age4: "I forgive others. — Luke 6:37",
      age5: "God teaches me to care. — Luke 10:33",
      age6: "God teaches me to care for others. — Luke 6:31",
      age7: "Love builds strong friendships. — Proverbs 17:17",
    },
    verseB: {
      age4: "God teaches me love. — 1 Thessalonians 3:12",
      age5: "Love comes from God. — Romans 5:5",
      age6: "Love reflects God's heart. — John 15:12",
      age7: "Love is shown through actions. — 1 John 3:18",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // MAY - Trusting God
  {
    id: "extra-week17",
    week: 17,
    month: "May",
    theme4to7: "Trusting God",
    theme8to12: "Trusting God",
    verseA: {
      age4: "I trust God. — Psalm 56:3",
      age5: "I trust God with my heart. — Psalm 28:7",
      age6: "Trusting God makes me strong. — Psalm 52:8",
      age7: "Trusting God helps me grow. — Proverbs 3:8",
    },
    verseB: {
      age4: "God is faithful. — Deuteronomy 7:9",
      age5: "God keeps me safe. — Proverbs 18:10",
      age6: "God is faithful to His promises. — Hebrews 10:23",
      age7: "God rewards those who trust Him. — Psalm 34:22",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week18",
    week: 18,
    month: "May",
    theme4to7: "Trusting God",
    theme8to12: "Trusting God",
    verseA: {
      age4: "God keeps His promises. — Numbers 23:19",
      age5: "God keeps His promises. — Psalm 145:13",
      age6: "God keeps His word. — Psalm 119:90",
      age7: "God is faithful in every season. — Lamentations 3:31–32",
    },
    verseB: {
      age4: "God never forgets me. — Isaiah 49:15",
      age5: "God never changes. — Malachi 3:6",
      age6: "God never fails. — Deuteronomy 32:4",
      age7: "God never forgets His promises. — Joshua 21:45",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week19",
    week: 19,
    month: "May",
    theme4to7: "Trusting God",
    theme8to12: "Trusting God",
    verseA: {
      age4: "God is always good. — Nahum 1:7",
      age5: "God is good to those who trust Him. — Psalm 84:12",
      age6: "I trust God even when I don't understand. — Proverbs 20:24",
      age7: "Trusting God helps me make wise choices. — Psalm 37:23",
    },
    verseB: {
      age4: "God cares for me. — Psalm 40:17",
      age5: "I choose to trust God. — Isaiah 26:4",
      age6: "God leads me with love. — Psalm 31:3",
      age7: "God directs my steps. — Proverbs 16:9",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week20",
    week: 20,
    month: "May",
    theme4to7: "Trusting God",
    theme8to12: "Trusting God",
    verseA: {
      age4: "I wait on God. — Psalm 27:14",
      age5: "God helps me trust Him. — Psalm 37:3",
      age6: "Trusting God brings peace. — Psalm 4:8",
      age7: "God strengthens my trust. — Psalm 112:7",
    },
    verseB: {
      age4: "God helps me trust Him. — Psalm 37:5",
      age5: "Trusting God brings peace. — Isaiah 26:3",
      age6: "God is my confidence. — Psalm 62:7",
      age7: "Trusting God brings joy. — Romans 15:13",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // JUNE - God Is With Me
  {
    id: "extra-week21",
    week: 21,
    month: "June",
    theme4to7: "God Is With Me",
    theme8to12: "God Is With Me",
    verseA: {
      age4: "God goes with me. — Exodus 33:14",
      age5: "God is always close. — Psalm 34:18",
      age6: "God stays with me wherever I go. — Psalm 139:7–8",
      age7: "God is near when I need Him. — Psalm 145:18",
    },
    verseB: {
      age4: "God stays near me. — Psalm 73:28",
      age5: "God goes before me. — Deuteronomy 31:3",
      age6: "God surrounds me with care. — Psalm 125:2",
      age7: "God watches over my life. — Psalm 33:13–14",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week22",
    week: 22,
    month: "June",
    theme4to7: "God Is With Me",
    theme8to12: "God Is With Me",
    verseA: {
      age4: "God walks with me. — Micah 6:8",
      age5: "God stays with me. — Isaiah 41:13",
      age6: "God walks beside me every day. — Isaiah 58:11",
      age7: "God walks with me through challenges. — Psalm 66:12",
    },
    verseB: {
      age4: "God is beside me. — Psalm 16:8",
      age5: "God walks beside me. — Psalm 23:4",
      age6: "God never abandons me. — Psalm 9:10",
      age7: "God stays faithful always. — Deuteronomy 7:9",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week23",
    week: 23,
    month: "June",
    theme4to7: "God Is With Me",
    theme8to12: "God Is With Me",
    verseA: {
      age4: "God never leaves me. — Joshua 1:5",
      age5: "God is my safe place. — Psalm 46:7",
      age6: "God is my constant help. — Psalm 73:23",
      age7: "God comforts me when I am sad. — 2 Corinthians 1:3–4",
    },
    verseB: {
      age4: "God is my friend. — John 15:15",
      age5: "God never leaves me alone. — Psalm 94:14",
      age6: "God strengthens my heart. — Psalm 27:14",
      age7: "God gives me courage to move forward. — Psalm 31:24",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week24",
    week: 24,
    month: "June",
    theme4to7: "God Is With Me",
    theme8to12: "God Is With Me",
    verseA: {
      age4: "God is always here. — Psalm 46:1",
      age5: "God gives me courage. — Joshua 1:7",
      age6: "God is my refuge. — Nahum 1:7",
      age7: "God is my safe place. — Psalm 91:2",
    },
    verseB: {
      age4: "God is my helper. — Hebrews 13:6",
      age5: "God is my strength. — Nehemiah 8:10",
      age6: "God stays faithful. — 2 Timothy 2:13",
      age7: "God protects my heart. — Proverbs 4:23",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // JULY - Thanking God
  {
    id: "extra-week25",
    week: 25,
    month: "July",
    theme4to7: "Thanking God",
    theme8to12: "Thanking God",
    verseA: {
      age4: "I thank God. — Psalm 92:1",
      age5: "I thank God every day. — Psalm 107:8",
      age6: "I thank God with joy. — Psalm 28:7",
      age7: "Thankfulness helps me see God's goodness. — Psalm 107:9",
    },
    verseB: {
      age4: "God likes thankful hearts. — Psalm 69:30",
      age5: "Thankfulness makes God happy. — Psalm 69:30–31",
      age6: "Gratitude honors God. — Psalm 50:14",
      age7: "God is pleased with a thankful heart. — Psalm 147:11",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week26",
    week: 26,
    month: "July",
    theme4to7: "Thanking God",
    theme8to12: "Thanking God",
    verseA: {
      age4: "I thank God for today. — Psalm 118:24",
      age5: "God deserves my thanks. — 1 Chronicles 16:34",
      age6: "God deserves my praise. — Psalm 96:4",
      age7: "I thank God for His guidance. — Psalm 32:8",
    },
    verseB: {
      age4: "God gives good gifts. — James 1:17",
      age5: "I thank God for His love. — Psalm 136:1",
      age6: "I thank God for His kindness. — Psalm 107:43",
      age7: "Gratitude brings joy. — Nehemiah 12:46",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week27",
    week: 27,
    month: "July",
    theme4to7: "Thanking God",
    theme8to12: "Thanking God",
    verseA: {
      age4: "I praise God. — Psalm 150:6",
      age5: "I praise God with joy. — Psalm 9:1",
      age6: "Thankfulness grows my faith. — Psalm 118:21",
      age7: "Praising God strengthens my faith. — Psalm 22:3",
    },
    verseB: {
      age4: "God deserves praise. — Revelation 4:11",
      age5: "Praise honors God. — Psalm 50:23",
      age6: "Praise fills my heart with joy. — Psalm 33:1",
      age7: "God deserves my praise. — Psalm 145:3",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week28",
    week: 28,
    month: "July",
    theme4to7: "Thanking God",
    theme8to12: "Thanking God",
    verseA: {
      age4: "I say thank you, God. — Psalm 107:1",
      age5: "I thank God for all He does. — Psalm 103:2",
      age6: "I give thanks in all things. — Ephesians 5:20",
      age7: "Thankfulness keeps my heart humble. — Colossians 3:16",
    },
    verseB: {
      age4: "God loves my thanks. — Hebrews 13:15",
      age5: "A thankful heart brings joy. — Colossians 3:15",
      age6: "Thankfulness brings peace. — Colossians 3:17",
      age7: "God blesses thankful people. — Psalm 118:28",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // AUGUST - God Made Everything
  {
    id: "extra-week29",
    week: 29,
    month: "August",
    theme4to7: "God Made Everything",
    theme8to12: "God Made Everything",
    verseA: {
      age4: "God made the sky. — Psalm 19:1",
      age5: "God made the heavens. — Psalm 33:6",
      age6: "God created the universe. — Isaiah 40:26",
      age7: "God created the heavens with power. — Psalm 102:25",
    },
    verseB: {
      age4: "God made the earth. — Isaiah 45:18",
      age5: "God made the earth strong. — Psalm 104:5",
      age6: "God made everything with wisdom. — Psalm 104:24",
      age7: "God controls all creation. — Daniel 2:21",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week30",
    week: 30,
    month: "August",
    theme4to7: "God Made Everything",
    theme8to12: "God Made Everything",
    verseA: {
      age4: "God made animals. — Genesis 1:25",
      age5: "God made the sea. — Psalm 95:5",
      age6: "God cares for all creation. — Psalm 36:6",
      age7: "God provides for every living thing. — Psalm 104:27–28",
    },
    verseB: {
      age4: "God made plants. — Genesis 1:11",
      age5: "God made living things. — Genesis 2:7",
      age6: "God sustains the earth. — Psalm 75:3",
      age7: "God's creation shows His wisdom. — Proverbs 8:27",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week31",
    week: 31,
    month: "August",
    theme4to7: "God Made Everything",
    theme8to12: "God Made Everything",
    verseA: {
      age4: "God made day and night. — Genesis 1:5",
      age5: "God made the sun and moon. — Psalm 136:7–9",
      age6: "God set the stars in place. — Job 38:31",
      age7: "God keeps the world in order. — Job 12:10",
    },
    verseB: {
      age4: "God made the stars. — Psalm 147:4",
      age5: "God cares for His creation. — Psalm 145:9",
      age6: "God controls the seasons. — Genesis 8:22",
      age7: "God's works are trustworthy. — Psalm 33:4",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week32",
    week: 32,
    month: "August",
    theme4to7: "God Made Everything",
    theme8to12: "God Made Everything",
    verseA: {
      age4: "God made all things. — Colossians 1:16",
      age5: "God made all things wisely. — Proverbs 3:19",
      age6: "God's creation shows His glory. — Psalm 8:1",
      age7: "God made everything with purpose. — Isaiah 45:18",
    },
    verseB: {
      age4: "God's work is good. — Ecclesiastes 3:11",
      age5: "God's work is amazing. — Psalm 111:2",
      age6: "God made all things for good. — Romans 8:28",
      age7: "God's creation shows His glory. — Psalm 19:2",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // SEPTEMBER - Obeying God
  {
    id: "extra-week33",
    week: 33,
    month: "September",
    theme4to7: "Obeying God",
    theme8to12: "Obeying God",
    verseA: {
      age4: "I listen to God. — Proverbs 2:1",
      age5: "I choose to obey God. — Joshua 24:15",
      age6: "Obedience shows my love for God. — John 14:15",
      age7: "Obedience shows respect for God. — Deuteronomy 6:17",
    },
    verseB: {
      age4: "God teaches me. — Psalm 94:12",
      age5: "Obedience shows love. — 1 John 5:3",
      age6: "God teaches me His ways. — Psalm 25:9",
      age7: "God blesses obedience. — Isaiah 48:18",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week34",
    week: 34,
    month: "September",
    theme4to7: "Obeying God",
    theme8to12: "Obeying God",
    verseA: {
      age4: "I obey God. — Deuteronomy 11:1",
      age5: "God teaches me right from wrong. — Psalm 25:12",
      age6: "God helps me obey willingly. — Jeremiah 31:33",
      age7: "God teaches me self-control. — Proverbs 25:28",
    },
    verseB: {
      age4: "God likes obedience. — 1 Samuel 15:22",
      age5: "God helps me obey. — Philippians 2:13",
      age6: "Obedience brings blessings. — Isaiah 1:19",
      age7: "Obedience leads to wisdom. — Proverbs 19:20",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week35",
    week: 35,
    month: "September",
    theme4to7: "Obeying God",
    theme8to12: "Obeying God",
    verseA: {
      age4: "I follow God's way. — Psalm 119:105",
      age5: "I follow God's commands. — Deuteronomy 5:33",
      age6: "God's Word guides my choices. — Psalm 119:11",
      age7: "God helps me choose what is right. — Psalm 119:30",
    },
    verseB: {
      age4: "God leads me. — Isaiah 48:17",
      age5: "God blesses obedience. — Psalm 128:1",
      age6: "Obedience leads to wisdom. — Proverbs 10:8",
      age7: "Obedience protects my life. — Proverbs 13:13",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week36",
    week: 36,
    month: "September",
    theme4to7: "Obeying God",
    theme8to12: "Obeying God",
    verseA: {
      age4: "God helps me obey. — Ezekiel 36:27",
      age5: "God's Word guides me. — Psalm 119:133",
      age6: "God gives strength to obey. — Philippians 4:13",
      age7: "God honors faithful obedience. — Luke 16:10",
    },
    verseB: {
      age4: "Obedience makes God happy. — Proverbs 3:1–2",
      age5: "Obedience brings life. — Proverbs 4:4",
      age6: "Obedience honors God. — 1 Samuel 12:24",
      age7: "Obedience helps me grow closer to God. — John 15:10",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // OCTOBER - God Is Strong
  {
    id: "extra-week37",
    week: 37,
    month: "October",
    theme4to7: "God Is Strong",
    theme8to12: "God Is Strong",
    verseA: {
      age4: "God is strong. — Psalm 24:8",
      age5: "God is mighty. — Psalm 93:1",
      age6: "God is powerful and mighty. — Psalm 89:13",
      age7: "God's strength never fails. — Psalm 147:5",
    },
    verseB: {
      age4: "God protects me. — Psalm 121:8",
      age5: "God protects His people. — Psalm 125:2",
      age6: "God protects those who trust Him. — Psalm 91:4",
      age7: "God protects His people. — Psalm 125:1",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week38",
    week: 38,
    month: "October",
    theme4to7: "God Is Strong",
    theme8to12: "God Is Strong",
    verseA: {
      age4: "God is my rock. — Psalm 18:2",
      age5: "God is my defender. — Psalm 18:35",
      age6: "God is stronger than fear. — Isaiah 41:13",
      age7: "God gives strength to the weak. — Isaiah 40:30",
    },
    verseB: {
      age4: "God is my safe place. — Psalm 61:3",
      age5: "God is stronger than fear. — Isaiah 35:4",
      age6: "God is my defender. — Psalm 7:10",
      age7: "God helps me overcome fear. — Psalm 23:4",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week39",
    week: 39,
    month: "October",
    theme4to7: "God Is Strong",
    theme8to12: "God Is Strong",
    verseA: {
      age4: "God wins every battle. — Exodus 15:3",
      age5: "Nothing is too hard for God. — Jeremiah 32:27",
      age6: "Nothing is impossible for God. — Luke 1:37",
      age7: "God's power is greater than any problem. — Job 42:2",
    },
    verseB: {
      age4: "God is powerful. — Jeremiah 32:17",
      age5: "God fights for me. — Deuteronomy 20:4",
      age6: "God fights for His people. — Exodus 14:14",
      age7: "God fights for what is right. — Psalm 35:1",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week40",
    week: 40,
    month: "October",
    theme4to7: "God Is Strong",
    theme8to12: "God Is Strong",
    verseA: {
      age4: "God is bigger than fear. — Psalm 34:4",
      age5: "God gives me courage. — Psalm 112:7",
      age6: "God fills me with courage. — Psalm 138:3",
      age7: "God gives courage to stand firm. — 1 Corinthians 16:13",
    },
    verseB: {
      age4: "God gives me courage. — Psalm 31:24",
      age5: "God makes me strong inside. — Psalm 27:1",
      age6: "God is my strength always. — Habakkuk 3:19",
      age7: "God strengthens my heart. — Psalm 27:14",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // NOVEMBER - Sharing & Giving
  {
    id: "extra-week41",
    week: 41,
    month: "November",
    theme4to7: "Sharing & Giving",
    theme8to12: "Sharing & Giving",
    verseA: {
      age4: "I like to share. — Hebrews 13:16",
      age5: "God wants me to share. — Luke 3:11",
      age6: "God wants me to be generous. — Proverbs 21:26",
      age7: "God wants me to care for others. — Romans 15:1",
    },
    verseB: {
      age4: "Sharing makes God happy. — Proverbs 11:25",
      age5: "Giving helps others. — Proverbs 19:17",
      age6: "Sharing blesses others. — Hebrews 13:16",
      age7: "Sharing shows God's love. — Hebrews 6:10",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week42",
    week: 42,
    month: "November",
    theme4to7: "Sharing & Giving",
    theme8to12: "Sharing & Giving",
    verseA: {
      age4: "I help people. — Romans 12:13",
      age5: "God loves cheerful givers. — 2 Corinthians 9:6",
      age6: "God blesses a giving heart. — Luke 6:38",
      age7: "God blesses generous hearts. — Proverbs 28:27",
    },
    verseB: {
      age4: "God blesses helpers. — Luke 6:38",
      age5: "Sharing shows love. — Romans 12:10",
      age6: "Giving shows love. — 1 John 3:17",
      age7: "Giving brings joy to others. — Acts 11:29",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week43",
    week: 43,
    month: "November",
    theme4to7: "Sharing & Giving",
    theme8to12: "Sharing & Giving",
    verseA: {
      age4: "I give with joy. — 2 Corinthians 9:7",
      age5: "I give because God gives to me. — Matthew 10:8",
      age6: "I give joyfully to God. — Psalm 112:5",
      age7: "God teaches me to give willingly. — Exodus 35:5",
    },
    verseB: {
      age4: "God sees my giving. — Matthew 6:4",
      age5: "God blesses generous hearts. — Proverbs 11:24",
      age6: "God sees every good gift. — Matthew 6:20",
      age7: "Generosity reflects God's kindness. — Psalm 112:9",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week44",
    week: 44,
    month: "November",
    theme4to7: "Sharing & Giving",
    theme8to12: "Sharing & Giving",
    verseA: {
      age4: "God wants me to be generous. — Proverbs 22:9",
      age5: "Giving brings joy. — Acts 20:35",
      age6: "Generosity reflects God's kindness. — 2 Corinthians 8:7",
      age7: "God notices every act of kindness. — Matthew 25:40",
    },
    verseB: {
      age4: "Giving shows love. — Acts 20:35",
      age5: "God sees what I give. — Hebrews 6:10",
      age6: "God rewards faithfulness. — Galatians 6:9",
      age7: "Giving honors God. — Proverbs 14:31",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  // DECEMBER - Jesus Is God's Gift
  {
    id: "extra-week45",
    week: 45,
    month: "December",
    theme4to7: "Jesus Is God's Gift",
    theme8to12: "Jesus Is God's Gift",
    verseA: {
      age4: "God sent Jesus. — John 3:16",
      age5: "Jesus came from God. — John 1:14",
      age6: "Jesus is God's promised Savior. — Luke 1:68–69",
      age7: "Jesus came to bring salvation. — Luke 19:10",
    },
    verseB: {
      age4: "Jesus came for us. — Luke 2:11",
      age5: "Jesus brings hope. — Isaiah 9:6",
      age6: "Jesus brings light to the world. — John 1:9",
      age7: "Jesus shows God's love clearly. — John 1:18",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week46",
    week: 46,
    month: "December",
    theme4to7: "Jesus Is God's Gift",
    theme8to12: "Jesus Is God's Gift",
    verseA: {
      age4: "Jesus is God's gift. — Romans 6:23",
      age5: "Jesus is the Savior. — Luke 2:30–32",
      age6: "Jesus came to save us. — Matthew 1:21",
      age7: "Jesus is the light of the world. — John 12:46",
    },
    verseB: {
      age4: "Jesus brings joy. — Luke 2:10",
      age5: "Jesus brings peace. — Ephesians 2:14",
      age6: "Jesus brings hope to all people. — Romans 15:13",
      age7: "Jesus brings peace to hearts. — Colossians 1:20",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week47",
    week: 47,
    month: "December",
    theme4to7: "Jesus Is God's Gift",
    theme8to12: "Jesus Is God's Gift",
    verseA: {
      age4: "Jesus loves children. — Mark 10:14",
      age5: "Jesus loves everyone. — Romans 8:39",
      age6: "Jesus shows God's love. — 1 John 4:9",
      age7: "Jesus teaches us how to live. — Matthew 7:24",
    },
    verseB: {
      age4: "Jesus is kind. — Matthew 11:29",
      age5: "Jesus teaches us to love. — Matthew 22:37",
      age6: "Jesus teaches us how to live. — John 13:15",
      age7: "Jesus leads us in truth. — John 14:6",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
  {
    id: "extra-week48",
    week: 48,
    month: "December",
    theme4to7: "Jesus Is God's Gift",
    theme8to12: "Jesus Is God's Gift",
    verseA: {
      age4: "Jesus is with me. — Matthew 28:20",
      age5: "Jesus is with me always. — John 14:18",
      age6: "Jesus is always with us. — Hebrews 13:8",
      age7: "Jesus is always faithful. — Revelation 19:11",
    },
    verseB: {
      age4: "I love Jesus. — 1 John 4:19",
      age5: "I follow Jesus. — John 8:12",
      age6: "I choose to follow Jesus. — Luke 9:23",
      age7: "I choose to follow Jesus daily. — Luke 9:23",
    },
    age8to12: {
      verse: "",
      reference: "",
    },
  },
]

// EXTRA VERSES LIBRARY FOR AGES 8-12 (YEAR 2 CONTENT)
export const extraVerses8to12: Array<{ verse: string; reference: string }> = [
  { verse: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5" },
  { verse: "The Lord is my rock and my fortress.", reference: "Psalm 18:2" },
  { verse: "Commit your ways to the Lord.", reference: "Psalm 37:5" },
  { verse: "The Lord will guide you always.", reference: "Isaiah 58:11" },
  { verse: "The Lord is compassionate and gracious.", reference: "Psalm 103:8" },
  { verse: "God's love never fails.", reference: "Lamentations 3:22" },
  { verse: "Love comes from God.", reference: "1 John 4:7" },
  { verse: "Nothing can separate us from God's love.", reference: "Romans 8:39" },
  { verse: "If you love Me, keep My commands.", reference: "John 14:15" },
  { verse: "Blessed are those who obey the Lord.", reference: "Psalm 128:1" },
  { verse: "Listen carefully and follow God's ways.", reference: "Deuteronomy 28:1" },
  { verse: "God's commands bring life.", reference: "Proverbs 4:4" },
  { verse: "Jesus said, 'I am the resurrection and the life.'", reference: "John 11:25" },
  { verse: "Christ is risen from the dead.", reference: "1 Corinthians 15:20" },
  { verse: "Because He lives, we have hope.", reference: "1 Peter 1:3" },
  { verse: "The old has gone, the new has come.", reference: "2 Corinthians 5:17" },
  { verse: "Be kind and compassionate to one another.", reference: "Ephesians 4:32" },
  { verse: "Love your neighbor as yourself.", reference: "Mark 12:31" },
  { verse: "A gentle answer turns away anger.", reference: "Proverbs 15:1" },
  { verse: "Do to others as you would have them do to you.", reference: "Luke 6:31" },
  { verse: "The Lord watches over you.", reference: "Psalm 121:5" },
  { verse: "The Lord is my helper; I will not be afraid.", reference: "Hebrews 13:6" },
  { verse: "The Lord is a shield around me.", reference: "Psalm 3:3" },
  { verse: "The name of the Lord is a strong tower.", reference: "Proverbs 18:10" },
  { verse: "Be strong and courageous.", reference: "Joshua 1:9" },
  { verse: "The Lord gives strength to His people.", reference: "Psalm 29:11" },
  { verse: "Do not be afraid, for I am with you.", reference: "Isaiah 41:10" },
  { verse: "God is our refuge and strength.", reference: "Psalm 46:1" },
  { verse: "If any of you lacks wisdom, ask God.", reference: "James 1:5" },
  { verse: "Walk in the way of understanding.", reference: "Proverbs 9:6" },
  { verse: "The Lord gives wisdom.", reference: "Proverbs 2:6" },
  { verse: "Choose what is right and just.", reference: "Proverbs 21:3" },
  { verse: "We live by faith, not by sight.", reference: "2 Corinthians 5:7" },
  { verse: "Without faith it is impossible to please God.", reference: "Hebrews 11:6" },
  { verse: "Faith comes from hearing the message.", reference: "Romans 10:17" },
  { verse: "Blessed is the one who trusts in the Lord.", reference: "Jeremiah 17:7" },
  { verse: "Your word is a lamp to my feet.", reference: "Psalm 119:105" },
  { verse: "God's word is truth.", reference: "John 17:17" },
  { verse: "The word of God is alive and active.", reference: "Hebrews 4:12" },
  { verse: "Teach me Your ways, Lord.", reference: "Psalm 86:11" },
  { verse: "Give thanks in all circumstances.", reference: "1 Thessalonians 5:18" },
  { verse: "A thankful heart honors God.", reference: "Psalm 50:23" },
  { verse: "The Lord has done great things for us.", reference: "Psalm 126:3" },
  { verse: "Thank God for everything.", reference: "Ephesians 5:20" },
  { verse: "A Savior has been born to you.", reference: "Luke 2:11" },
  { verse: "Jesus is the light of the world.", reference: "John 8:12" },
  { verse: "God sent His Son into the world.", reference: "1 John 4:9" },
  { verse: "The Word became flesh and lived among us.", reference: "John 1:14" },
]

// EXTRA DEVOTIONALS FOR AGES 8-12 (YEAR 2 CONTENT)
export const extraDevotionals8to12: Devotional[] = [
  {
    week: 1,
    verse: "Trust in the Lord with all your heart.",
    reference: "Proverbs 3:5",
    devotion: "Trusting God means believing He knows what is best, even when you don't understand everything.",
    prayer: "God, help me trust You with my whole heart. Amen.",
  },
  {
    week: 2,
    verse: "The Lord is my rock and my fortress.",
    reference: "Psalm 18:2",
    devotion: "God is strong and steady. You can depend on Him when life feels shaky.",
    prayer: "Lord, thank You for being my safe place. Amen.",
  },
  {
    week: 3,
    verse: "Commit your ways to the Lord.",
    reference: "Psalm 37:5",
    devotion: "When you give your plans to God, He helps guide your steps.",
    prayer: "God, I give my plans to You. Lead me. Amen.",
  },
  {
    week: 4,
    verse: "The Lord will guide you always.",
    reference: "Isaiah 58:11",
    devotion: "God promises to lead you every day when you follow Him.",
    prayer: "Lord, guide me in everything I do. Amen.",
  },
  {
    week: 5,
    verse: "The Lord is compassionate and gracious.",
    reference: "Psalm 103:8",
    devotion: "God cares deeply about you and shows kindness every day.",
    prayer: "God, thank You for being loving and kind. Amen.",
  },
  {
    week: 6,
    verse: "God's love never fails.",
    reference: "Lamentations 3:22",
    devotion: "God's love does not run out or disappear—it lasts forever.",
    prayer: "Lord, thank You for loving me always. Amen.",
  },
  {
    week: 7,
    verse: "Love comes from God.",
    reference: "1 John 4:7",
    devotion: "When we love others, we show God's love through our actions.",
    prayer: "God, help me love others like You love me. Amen.",
  },
  {
    week: 8,
    verse: "Nothing can separate us from God's love.",
    reference: "Romans 8:39",
    devotion: "No matter what happens, God's love for you never changes.",
    prayer: "Thank You, God, for loving me no matter what. Amen.",
  },
  {
    week: 9,
    verse: "If you love Me, keep My commands.",
    reference: "John 14:15",
    devotion: "Obeying God shows that you love and respect Him.",
    prayer: "Jesus, help me obey You with joy. Amen.",
  },
  {
    week: 10,
    verse: "Blessed are those who obey the Lord.",
    reference: "Psalm 128:1",
    devotion: "God brings blessings to those who follow His ways.",
    prayer: "God, help me walk in Your ways. Amen.",
  },
  {
    week: 11,
    verse: "Listen carefully and follow God's ways.",
    reference: "Deuteronomy 28:1",
    devotion: "Listening to God helps you make wise choices.",
    prayer: "Lord, help me listen and obey. Amen.",
  },
  {
    week: 12,
    verse: "God's commands bring life.",
    reference: "Proverbs 4:4",
    devotion: "God's rules are meant to protect and help you grow.",
    prayer: "God, thank You for guiding me with Your Word. Amen.",
  },
  {
    week: 13,
    verse: "Jesus said, 'I am the resurrection and the life.'",
    reference: "John 11:25",
    devotion: "Jesus gives us hope and new life through Him.",
    prayer: "Jesus, thank You for giving me new life. Amen.",
  },
  {
    week: 14,
    verse: "Christ is risen from the dead.",
    reference: "1 Corinthians 15:20",
    devotion: "Jesus is alive, and His victory gives us hope.",
    prayer: "Thank You, Jesus, for rising again. Amen.",
  },
  {
    week: 15,
    verse: "Because He lives, we have hope.",
    reference: "1 Peter 1:3",
    devotion: "Jesus' life reminds us that hope never ends.",
    prayer: "God, thank You for hope that lasts forever. Amen.",
  },
  {
    week: 16,
    verse: "The old has gone, the new has come.",
    reference: "2 Corinthians 5:17",
    devotion: "God helps us become new and better when we follow Him.",
    prayer: "Lord, help me grow into the person You want me to be. Amen.",
  },
  {
    week: 17,
    verse: "Be kind and compassionate to one another.",
    reference: "Ephesians 4:32",
    devotion: "Kindness shows God's love to others.",
    prayer: "God, help me be kind to everyone. Amen.",
  },
  {
    week: 18,
    verse: "Love your neighbor as yourself.",
    reference: "Mark 12:31",
    devotion: "God wants us to care for others the way we care for ourselves.",
    prayer: "Lord, help me love others well. Amen.",
  },
  {
    week: 19,
    verse: "A gentle answer turns away anger.",
    reference: "Proverbs 15:1",
    devotion: "Speaking kindly can stop problems and bring peace.",
    prayer: "God, help me use gentle words. Amen.",
  },
  {
    week: 20,
    verse: "Do to others as you would have them do to you.",
    reference: "Luke 6:31",
    devotion: "Treating others with respect shows good character.",
    prayer: "Lord, help me treat others the right way. Amen.",
  },
  {
    week: 21,
    verse: "The Lord watches over you.",
    reference: "Psalm 121:5",
    devotion: "God is always watching and caring for you.",
    prayer: "God, thank You for protecting me. Amen.",
  },
  {
    week: 22,
    verse: "The Lord is my helper; I will not be afraid.",
    reference: "Hebrews 13:6",
    devotion: "With God's help, you don't have to be afraid.",
    prayer: "Lord, help me trust You when I feel scared. Amen.",
  },
  {
    week: 23,
    verse: "The Lord is a shield around me.",
    reference: "Psalm 3:3",
    devotion: "God protects His children like a shield.",
    prayer: "God, thank You for keeping me safe. Amen.",
  },
  {
    week: 24,
    verse: "The name of the Lord is a strong tower.",
    reference: "Proverbs 18:10",
    devotion: "God is a safe place you can run to anytime.",
    prayer: "Lord, I trust You to protect me. Amen.",
  },
  {
    week: 25,
    verse: "Be strong and courageous.",
    reference: "Joshua 1:9",
    devotion: "God gives courage when we face hard situations.",
    prayer: "God, help me be brave with You by my side. Amen.",
  },
  {
    week: 26,
    verse: "The Lord gives strength to His people.",
    reference: "Psalm 29:11",
    devotion: "God gives strength when you feel tired or weak.",
    prayer: "Lord, give me strength today. Amen.",
  },
  {
    week: 27,
    verse: "Do not be afraid, for I am with you.",
    reference: "Isaiah 41:10",
    devotion: "God's presence helps us overcome fear.",
    prayer: "God, thank You for being with me. Amen.",
  },
  {
    week: 28,
    verse: "God is our refuge and strength.",
    reference: "Psalm 46:1",
    devotion: "God is a safe place when life feels hard.",
    prayer: "Lord, I trust You to help me. Amen.",
  },
  {
    week: 29,
    verse: "If any of you lacks wisdom, ask God.",
    reference: "James 1:5",
    devotion: "God gives wisdom to those who ask.",
    prayer: "God, help me make wise choices. Amen.",
  },
  {
    week: 30,
    verse: "Walk in the way of understanding.",
    reference: "Proverbs 9:6",
    devotion: "Wise choices help you grow in the right direction.",
    prayer: "Lord, help me choose wisely. Amen.",
  },
  {
    week: 31,
    verse: "The Lord gives wisdom.",
    reference: "Proverbs 2:6",
    devotion: "True wisdom comes from God.",
    prayer: "God, thank You for teaching me. Amen.",
  },
  {
    week: 32,
    verse: "Choose what is right and just.",
    reference: "Proverbs 21:3",
    devotion: "Doing what is right pleases God.",
    prayer: "Lord, help me choose what is right. Amen.",
  },
  {
    week: 33,
    verse: "We live by faith, not by sight.",
    reference: "2 Corinthians 5:7",
    devotion: "Faith means trusting God even when you cannot see the outcome.",
    prayer: "God, help me walk by faith. Amen.",
  },
  {
    week: 34,
    verse: "Without faith it is impossible to please God.",
    reference: "Hebrews 11:6",
    devotion: "God is pleased when we trust Him.",
    prayer: "Lord, help my faith grow stronger. Amen.",
  },
  {
    week: 35,
    verse: "Faith comes from hearing the message.",
    reference: "Romans 10:17",
    devotion: "Listening to God's Word helps your faith grow.",
    prayer: "God, help me listen to Your Word. Amen.",
  },
  {
    week: 36,
    verse: "Blessed is the one who trusts in the Lord.",
    reference: "Jeremiah 17:7",
    devotion: "Trusting God brings blessings and peace.",
    prayer: "Lord, I trust You. Amen.",
  },
  {
    week: 37,
    verse: "Your word is a lamp to my feet.",
    reference: "Psalm 119:105",
    devotion: "God's Word helps guide your life.",
    prayer: "God, guide me with Your Word. Amen.",
  },
  {
    week: 38,
    verse: "God's word is truth.",
    reference: "John 17:17",
    devotion: "God's Word teaches what is true and right.",
    prayer: "Lord, help me follow Your truth. Amen.",
  },
  {
    week: 39,
    verse: "The word of God is alive and active.",
    reference: "Hebrews 4:12",
    devotion: "God's Word speaks to our hearts.",
    prayer: "God, help me listen to Your Word. Amen.",
  },
  {
    week: 40,
    verse: "Teach me Your ways, Lord.",
    reference: "Psalm 86:11",
    devotion: "God wants to teach us how to live.",
    prayer: "Lord, teach me Your ways. Amen.",
  },
  {
    week: 41,
    verse: "Give thanks in all circumstances.",
    reference: "1 Thessalonians 5:18",
    devotion: "Thankfulness helps us remember God's goodness.",
    prayer: "God, help me always be thankful. Amen.",
  },
  {
    week: 42,
    verse: "A thankful heart honors God.",
    reference: "Psalm 50:23",
    devotion: "Being thankful shows respect and love for God.",
    prayer: "Lord, give me a thankful heart. Amen.",
  },
  {
    week: 43,
    verse: "The Lord has done great things for us.",
    reference: "Psalm 126:3",
    devotion: "God has done many wonderful things in our lives.",
    prayer: "Thank You, God, for all You have done. Amen.",
  },
  {
    week: 44,
    verse: "Thank God for everything.",
    reference: "Ephesians 5:20",
    devotion: "Gratitude helps us see God's blessings.",
    prayer: "God, thank You for everything. Amen.",
  },
  {
    week: 45,
    verse: "A Savior has been born to you.",
    reference: "Luke 2:11",
    devotion: "Jesus came to save us and bring joy.",
    prayer: "Thank You, Jesus, for being my Savior. Amen.",
  },
  {
    week: 46,
    verse: "Jesus is the light of the world.",
    reference: "John 8:12",
    devotion: "Jesus brings light and hope into our lives.",
    prayer: "Jesus, help me follow Your light. Amen.",
  },
  {
    week: 47,
    verse: "God sent His Son into the world.",
    reference: "1 John 4:9",
    devotion: "God showed His love by sending Jesus.",
    prayer: "God, thank You for sending Jesus. Amen.",
  },
  {
    week: 48,
    verse: "The Word became flesh and lived among us.",
    reference: "John 1:14",
    devotion: "Jesus came to live among people to show God's love.",
    prayer: "Jesus, thank You for coming to be with us. Amen.",
  },
]

// HELPER FUNCTIONS

// Helper function to get verse for specific age and week
export function getVerseForAge(
  week: number,
  age: number,
  programYear = 1,
  dayOfWeek = 1, // Added dayOfWeek parameter for ages 4-7
): {
  text: string
  reference: string
  explanation?: string
  theme: string
} | null {
  // Map review weeks (49-52) to earlier weeks for verse lookup in programYear 1
  let effectiveWeek = week
  if (programYear === 1 && week > 52) {
    // Check for weeks beyond 52 for review
    effectiveWeek = ((week - 1) % 48) + 1 // Map back to the 48 weeks cycle
  }

  let verse: BibleVerse | undefined
  if (programYear === 1) {
    verse = allVerses.find((v) => v.week === effectiveWeek)
  } else if (programYear === 2 && age >= 4 && age <= 7) {
    // For younger ages in subsequent years, use extraVerses4to7
    // Ensure week is within bounds of extraVerses4to7, wrapping around if necessary
    const extraIndex = (week - 1) % extraVerses4to7.length
    verse = extraVerses4to7[extraIndex]
  } else if (programYear === 3 && age >= 4 && age <= 7) {
    const extraIndex = (week - 1) % year3Verses.length
    verse = year3Verses[extraIndex]
  } else if (programYear === 4 && age >= 4 && age <= 7) {
    const extraIndex = (week - 1) % year4Verses.length
    verse = year4Verses[extraIndex]
  } else if (programYear >= 2 && age >= 8 && age <= 12) {
    // For older ages in subsequent years, we need to find a suitable verse source.
    // For now, let's assume the `extraVerses8to12` array will be used similarly to `extraVerses4to7`.
    // This part might need adjustment if `extraVerses8to12` structure is different or if there's a specific logic for it.
    // For example, we'll use a placeholder and assume `extraVerses8to12` has relevant data.
    // NOTE: `extraVerses8to12` is an array of { verse: string; reference: string }.
    // We need to map this to the `BibleVerse` interface structure if it's to be used directly here.
    // For simplicity, let's assume `getVerseText` handles this mapping.
    // If `extraVerses8to12` is meant to be used by `getVerseText` for ages 8-12,
    // this part of `getVerseForAge` might not need to fetch directly from it.
    // For now, we'll return null if programYear >= 2 and age >= 8. This needs further implementation.
    if (programYear === 2) {
      const extraIndex = (week - 1) % extraVerses8to12.length
      const extraVerseData = extraVerses8to12[extraIndex]
      if (!extraVerseData) return null
      // Construct a temporary BibleVerse object to fit the return type.
      verse = {
        id: `extra-yr2-week${week}-age8to12`,
        week: week,
        month: "Unknown", // Month is not directly available in extraVerses8to12
        theme4to7: "Unknown",
        theme8to12: "Unknown",
        verseA: { age4: "", age5: "", age6: "", age7: "" },
        verseB: { age4: "", age5: "", age6: "", age7: "" },
        age8to12: {
          verse: extraVerseData.verse,
          reference: extraVerseData.reference,
        },
      }
    } else if (programYear === 3) {
      const extraIndex = (week - 1) % year3Verses.length
      verse = year3Verses[extraIndex]
    } else if (programYear === 4) {
      const extraIndex = (week - 1) % year4Verses.length
      verse = year4Verses[extraIndex]
    }
  }

  if (!verse) return null

  if (age < 8) {
    // Ages 4-7: Return verse A (Mon-Tue) or verse B (Wed-Thu)
    // Friday is writing day, so we'll handle that separately
    const useVerseA = dayOfWeek <= 2 // Monday and Tuesday use Verse A
    const verseData = useVerseA ? verse.verseA : verse.verseB

    let text = ""
    let ageSpecificExplanation = ""

    if (age === 4) {
      text = verseData.age4
      if (verse.explanations) {
        ageSpecificExplanation = useVerseA ? verse.explanations.age4.verseA : verse.explanations.age4.verseB
      }
    } else if (age === 5) {
      text = verseData.age5
      if (verse.explanations) {
        ageSpecificExplanation = useVerseA ? verse.explanations.age5.verseA : verse.explanations.age5.verseB
      }
    } else if (age === 6) {
      text = verseData.age6
      if (verse.explanations) {
        ageSpecificExplanation = useVerseA ? verse.explanations.age6.verseA : verse.explanations.age6.verseB
      }
    } else {
      text = verseData.age7
      if (verse.explanations) {
        ageSpecificExplanation = useVerseA ? verse.explanations.age7.verseA : verse.explanations.age7.verseB
      }
    }

    // Extract reference from the text
    const referenceMatch = text.match(/—\s*(.*)/)
    const reference = referenceMatch ? referenceMatch[1] : "Unknown Reference"
    const verseTextOnly = text.replace(/—\s*.*$/, "").trim()

    return {
      text: verseTextOnly,
      reference: reference,
      explanation: ageSpecificExplanation || verse.explanation4to7,
      theme: verse.theme4to7,
    }
  } else {
    // Ages 8-12
    // For program year 1, verseData comes from allVerses.
    // For program year >= 2, verseData comes from extraVerses8to12 (as handled above)
    return {
      text: verse.age8to12.verse,
      reference: verse.age8to12.reference,
      theme: verse.theme8to12,
    }
  }
}

// Helper function to get both verses (A and B) for a week
export function getBothVersesForAge(
  week: number,
  age: number,
  programYear = 1,
): {
  verseA: { text: string; reference: string }
  verseB: { text: string; reference: string }
  theme: string
} | null {
  if (age >= 8) return null // Only for ages 4-7

  let verse: BibleVerse | undefined

  if (programYear === 1) {
    // Map review weeks (49-52) to earlier weeks for verse lookup
    let effectiveWeek = week
    if (week > 52) {
      // Handle review weeks in program year 1
      effectiveWeek = ((week - 1) % 48) + 1
    }
    verse = allVerses.find((v) => v.week === effectiveWeek)
  } else if (programYear === 2) {
    // Use extra verses for year 2+
    const extraIndex = (week - 1) % extraVerses4to7.length
    verse = extraVerses4to7[extraIndex]
  } else if (programYear === 3) {
    const extraIndex = (week - 1) % year3Verses.length
    verse = year3Verses[extraIndex]
  } else if (programYear === 4) {
    const extraIndex = (week - 1) % year4Verses.length
    verse = year4Verses[extraIndex]
  }

  if (!verse) return null

  let textA = ""
  let textB = ""

  if (age === 4) {
    textA = verse.verseA.age4
    textB = verse.verseB.age4
  } else if (age === 5) {
    textA = verse.verseA.age5
    textB = verse.verseB.age5
  } else if (age === 6) {
    textA = verse.verseA.age6
    textB = verse.verseB.age6
  } else {
    textA = verse.verseA.age7
    textB = verse.verseB.age7
  }

  const referenceA = textA.split("—")[1]?.trim() || "Unknown Reference"
  const verseTextOnlyA = textA.replace(/—\s*.*$/, "").trim()
  const referenceB = textB.split("—")[1]?.trim() || "Unknown Reference"
  const verseTextOnlyB = textB.replace(/—\s*.*$/, "").trim()

  return {
    verseA: {
      text: verseTextOnlyA,
      reference: referenceA,
    },
    verseB: {
      text: verseTextOnlyB,
      reference: referenceB,
    },
    theme: verse.theme4to7,
  }
}

// Helper function to get devotional for a week
export function getDevotionalForWeek(week: number, programYear = 1): Devotional | null {
  // Program Year 1: Use main devotionals (weeks 1-48)
  if (programYear === 1) {
    if (week >= 1 && week <= devotionals.length) {
      return devotionals[week - 1] // Use 0-based index for array access
    }
    // Handle review weeks (49-52) by mapping them to the corresponding earlier devotional week.
    // For example, week 49 could map to week 1, week 50 to week 2, etc.
    if (week >= 49 && week <= 52) {
      const mappedWeek = ((week - 1) % 48) + 1
      if (mappedWeek >= 1 && mappedWeek <= devotionals.length) {
        return devotionals[mappedWeek - 1]
      }
    }
    return null
  }

  // Program Year 2+: Use extra devotionals sequentially
  if (programYear >= 2) {
    // Calculate index for extra devotionals, wrapping around if necessary
    const extraIndex = (week - 1) % extraDevotionals8to12.length
    // Ensure the devotional object has the expected properties
    if (extraDevotionals8to12[extraIndex] && extraDevotionals8to12[extraIndex].verse) {
      return {
        week: week, // Use the requested week number
        verse: extraDevotionals8to12[extraIndex].verse,
        reference: extraDevotionals8to12[extraIndex].reference,
        devotion: "Devotion content for program year 2+.", // Placeholder for devotion
        prayer: "Prayer for program year 2+.", // Placeholder for prayer
      }
    }
    return null
  }

  return null
}

// Helper function to get verse text based on age
export function getVerseText(
  week: number,
  age: number,
  verseType: "A" | "B" = "A",
  programYear = 1,
  dayOfWeek = 1,
): { verse: string; reference: string; theme: string } {
  // Handle cases where week might exceed 52 for programYear 1 (review weeks)
  let effectiveWeek = week
  if (programYear === 1 && week > 52) {
    // Map review weeks (49-52) to earlier weeks for verse lookup.
    effectiveWeek = ((week - 1) % 48) + 1
  }

  let verse: BibleVerse | undefined
  if (programYear === 1) {
    verse = allVerses.find((v) => v.week === effectiveWeek)
  } else if (programYear === 2 && age >= 4 && age <= 7) {
    const extraIndex = (week - 1) % extraVerses4to7.length
    verse = extraVerses4to7[extraIndex]
  } else if (programYear === 3 && age >= 4 && age <= 7) {
    const extraIndex = (week - 1) % year3Verses.length
    verse = year3Verses[extraIndex]
  } else if (programYear === 4 && age >= 4 && age <= 7) {
    const extraIndex = (week - 1) % year4Verses.length
    verse = year4Verses[extraIndex]
  } else if (programYear >= 2 && age >= 8 && age <= 12) {
    // For ages 8-12 in programYear 2+, we need to retrieve data from extraVerses8to12.
    // We'll construct a temporary `BibleVerse` object for consistency.
    if (programYear === 2) {
      const extraIndex = (week - 1) % extraVerses8to12.length
      const extraVerseData = extraVerses8to12[extraIndex]
      if (extraVerseData) {
        verse = {
          id: `extra-yr2-week${week}-age8to12`,
          week: week,
          month: "Unknown", // Month is not directly available in extraVerses8to12
          theme4to7: "Unknown",
          theme8to12: "Unknown", // Assuming a generic theme if not specified
          verseA: { age4: "", age5: "", age6: "", age7: "" },
          verseB: { age4: "", age5: "", age6: "", age7: "" },
          age8to12: {
            verse: extraVerseData.verse,
            reference: extraVerseData.reference,
          },
        }
      }
    } else if (programYear === 3) {
      const extraIndex = (week - 1) % year3Verses.length
      verse = year3Verses[extraIndex]
    } else if (programYear === 4) {
      const extraIndex = (week - 1) % year4Verses.length
      verse = year4Verses[extraIndex]
    }
  }

  if (!verse) {
    // Provide a default or fallback if no verse is found
    return { verse: "God loves you!", reference: "John 3:16", theme: "God's Love" }
  }

  // For ages 4-7, use the verseType parameter (A or B)
  if (age >= 4 && age <= 7) {
    const verseData = verseType === "A" ? verse.verseA : verse.verseB

    let selectedVerseText = ""
    if (age === 4) selectedVerseText = verseData.age4
    else if (age === 5) selectedVerseText = verseData.age5
    else if (age === 6) selectedVerseText = verseData.age6
    else selectedVerseText = verseData.age7

    // Extract reference from the text (format: "Text — Reference")
    const referenceMatch = selectedVerseText.match(/—\s*(.*)/)
    const reference = referenceMatch ? referenceMatch[1].trim() : "Unknown Reference"
    const verseTextOnly = selectedVerseText.replace(/—\s*.*$/, "").trim()

    return {
      verse: verseTextOnly,
      reference: reference,
      theme: verse.theme4to7,
    }
  }

  // For ages 8-12
  if (age >= 8 && age <= 12) {
    // verse.age8to12.verse and verse.age8to12.reference will be populated correctly
    // from either allVerses or the constructed verse object for extraVerses8to12.
    return {
      verse: verse.age8to12.verse,
      reference: verse.age8to12.reference,
      theme: verse.theme8to12,
    }
  }

  return { verse: "God loves you!", reference: "John 3:16", theme: "God's Love" }
}

export function getMonthlyTheme(month: number, age: number): string {
  // Map month to approximate week (4 weeks per month)
  // Ensure we don't go beyond available verses when calculating the week
  const maxWeekPerMonth = 4
  const effectiveWeek = Math.min((month - 1) * maxWeekPerMonth + 1, allVerses.length)

  const verse = allVerses.find((v) => v.week === effectiveWeek)

  if (!verse) return age < 8 ? "God's Love" : "Knowing God"

  return age < 8 ? verse.theme4to7 : verse.theme8to12
}

export function getMonthlyThemeDescription(month: number, age: number): string {
  const theme = getMonthlyTheme(month, age)

  if (age < 8) {
    const descriptions: Record<string, string> = {
      "God Loves Me": "Learning about God's endless love and how He cares for each of us",
      "God Made Everything": "Discovering how God created the world and everything in it",
      "Trusting God": "Learning to trust God in all situations",
      "Jesus is My Friend": "Understanding Jesus's love and friendship",
      "Being Kind & Loving": "Learning how to show love and kindness to others",
      "Obeying God": "Understanding why obeying God is important",
      "Thankfulness & Praise": "Learning to thank and praise God every day",
      "God Protects Me": "Understanding that God is always watching over us and keeps us safe",
      "God's Word": "Learning about God's message and how it guides us",
      "Faith & Courage": "Building courage and faith in God",
      Forgiveness: "Learning the importance of forgiving others",
      "Jesus is God's Gift": "Celebrating Jesus as God's amazing gift to us",
    }
    return descriptions[theme] || "Learning about God's love and care"
  } else {
    const descriptions: Record<string, string> = {
      "Knowing God": "Discovering who God is and building a relationship with Him",
      "Trust & Faith": "Learning to trust God and strengthen our faith",
      "Obedience & Wisdom": "Understanding God's wisdom and the importance of obedience",
      "Jesus Our Savior": "Learning about Jesus's sacrifice and salvation",
      "Love & Kindness": "Practicing Christ-like love and kindness",
      "Courage & Strength": "Finding strength and courage in God",
      "Prayer & Praise": "Developing a strong prayer life and praising God",
      "God's Protection": "Understanding God's constant protection over us",
      "Truth & Integrity": "Living with honesty and integrity",
      "Serving Others": "Learning to serve others with love",
      Gratitude: "Cultivating a heart of thankfulness",
      "Hope & Joy": "Finding hope and joy in God",
    }
    return descriptions[theme] || "Growing in faith and understanding"
  }
}

export function getDevotionalForAge(
  week: number,
  age: number,
  programYear = 1,
  dayOfWeek = 1,
): { devotional: string; prayer: string; explanation: string } | null {
  const devotional = getDevotionalForWeek(week, programYear)

  if (!devotional) {
    // Provide age-appropriate fallback
    if (age < 6) {
      return {
        devotional: "God loves you very much!",
        prayer: "Dear God, thank You for loving me today. Help me to be kind tomorrow. Amen.",
        explanation: "God loves you very much!",
      }
    } else if (age < 8) {
      return {
        devotional: "God loves you so much, and He shows His love in everything He does. You are special to Him!",
        prayer:
          "Dear God, thank You for this day and for Your love. Thank You for my family and friends. Help me to show Your love to others. In Jesus' name, Amen.",
        explanation: "God loves you so much, and He shows His love in everything He does. You are special to Him!",
      }
    } else {
      return {
        devotional:
          "God's very nature is love. Everything He does comes from love. When we show kindness, forgiveness, and patience, we show others what God is like.",
        prayer:
          "Heavenly Father, thank You for Your constant love and presence in my life. As I reflect on today, help me to see where You were working. Forgive me for the times I fell short, and help me to grow more like You tomorrow. Thank You for the gift of rest. In Jesus' name, Amen.",
        explanation:
          "God's very nature is love. Everything He does comes from love. When we show kindness, forgiveness, and patience, we show others what God is like. Remember, you are deeply loved by God.",
      }
    }
  }

  return {
    devotional: devotional.devotion,
    prayer: devotional.prayer,
    explanation: devotional.devotion,
  }
}

export function generateAgeAppropriateExplanation(
  verseText: string,
  reference: string,
  age: number,
  childName = "you",
): string {
  // Age 4: Very simple, 1-2 short sentences, concrete concepts only
  if (age === 4) {
    return `God made everything—sky, land, animals, and you. Nothing happened by accident. God is powerful and wise, and He cares about what He created. When you see nature, remember God made it with love.`
  }

  // Age 5: Simple with slightly more detail and personal connection
  if (age === 5) {
    return `Did you know God made the whole world? He made the sun, the clouds, the trees, and even the birds! And guess what? God made you too, ${childName}! God loves everything He made. That's why we should take care of God's creation and be thankful for all the beautiful things around us.`
  }

  // Age 6: More vocabulary, beginning to understand cause and effect
  if (age === 6) {
    return `${childName}, God is the Creator of everything we see. He didn't just make things randomly—He had a plan! God carefully designed the world with mountains, oceans, animals, and people. Everything God makes has a purpose. You are part of God's wonderful creation, and He made you special on purpose. When you look at nature, you can see how amazing God is!`
  }

  // Age 7: More complex, making connections to daily life and actions
  if (age === 7) {
    return `Think about this, ${childName}: Everything around us—from tiny ants to giant whales, from flowers to forests—was created by God. He didn't make mistakes or let things happen by accident. God is incredibly powerful and wise, and He cares deeply about His creation. When you notice something beautiful in nature, it's like seeing a piece of God's artwork! Because God made us and loves us, we should respect His creation and show love to others too.`
  }

  // Ages 8-12: Deeper understanding, theological concepts, application, and reflection
  return `${childName}, this verse reveals something profound about God's nature as Creator. Everything in existence—the vastness of the universe, the complexity of ecosystems, the intricacy of human life—came from God's intentional design. Nothing happened by accident. God is omnipotent (all-powerful) and omniscient (all-knowing), and He demonstrates His love through His creation. When we observe the natural world, we witness God's creativity and care. This understanding should inspire us to be good stewards of creation, to respect all life, and to recognize that every person is made in God's image. How can you honor God's creation in your daily choices?`
}

// YEAR 3 + YEAR 4 CURRICULUM SEEDS (PUBLIC-DOMAIN PARAPHRASES)

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

type VerseSeed = {
  week: number
  month: string
  theme4to7: string
  theme8to12: string
  verseA: { text: string; reference: string }
  verseB: { text: string; reference: string }
  age8to12: { verse: string; reference: string }
}

const referenceRegex = /[1-3]?\s?[A-Za-z][A-Za-z\s]+\d+:\d+/

const addReference = (refs: Set<string>, value: string) => {
  const match = value.match(referenceRegex)
  if (match) refs.add(match[0])
}

const existingReferences = (() => {
  const refs = new Set<string>()
  allVerses.forEach((verse) => {
    addReference(refs, verse.verseA.age4)
    addReference(refs, verse.verseA.age5)
    addReference(refs, verse.verseA.age6)
    addReference(refs, verse.verseA.age7)
    addReference(refs, verse.verseB.age4)
    addReference(refs, verse.verseB.age5)
    addReference(refs, verse.verseB.age6)
    addReference(refs, verse.verseB.age7)
    if (verse.age8to12?.reference) refs.add(verse.age8to12.reference)
  })
  extraVerses4to7.forEach((verse) => {
    addReference(refs, verse.verseA.age4)
    addReference(refs, verse.verseA.age5)
    addReference(refs, verse.verseA.age6)
    addReference(refs, verse.verseA.age7)
    addReference(refs, verse.verseB.age4)
    addReference(refs, verse.verseB.age5)
    addReference(refs, verse.verseB.age6)
    addReference(refs, verse.verseB.age7)
  })
  extraVerses8to12.forEach((verse) => refs.add(verse.reference))
  return refs
})()

const buildReferencePool = (
  ranges: Array<{ book: string; start: number; end: number }>,
  used: Set<string>,
  needed: number,
) => {
  const refs: string[] = []
  ranges.forEach((range) => {
    for (let chapter = range.start; chapter <= range.end; chapter += 1) {
      const reference = `${range.book} ${chapter}:1`
      if (!used.has(reference) && !refs.includes(reference)) {
        refs.push(reference)
        if (refs.length >= needed) return
      }
    }
  })
  return refs.slice(0, needed)
}

const expandForAges = (text: string, reference: string) => {
  const trimmed = text.trim().replace(/\.$/, "")
  return {
    age4: `${trimmed}. - ${reference}`,
    age5: `${trimmed} today. - ${reference}`,
    age6: `${trimmed} every day. - ${reference}`,
    age7: `I remember that ${trimmed} every day. - ${reference}`,
  }
}

const buildYearFromSeeds = (yearLabel: string, seeds: VerseSeed[]): BibleVerse[] =>
  seeds.map((seed) => ({
    id: `${yearLabel}-week${seed.week}`,
    week: seed.week,
    month: seed.month,
    theme4to7: seed.theme4to7,
    theme8to12: seed.theme8to12,
    verseA: expandForAges(seed.verseA.text, seed.verseA.reference),
    verseB: expandForAges(seed.verseB.text, seed.verseB.reference),
    age8to12: {
      verse: seed.age8to12.verse,
      reference: seed.age8to12.reference,
    },
  }))

const year3Themes4to7 = [
  "God Is Powerful",
  "God Guides Me",
  "Courage with God",
  "Kindness & Love",
  "Obedience",
  "Thankfulness",
  "Faith & Trust",
  "Prayer Time",
  "Joy in the Lord",
  "Wisdom from God",
  "Forgiving Hearts",
  "God's Word",
]

const year3Themes8to12 = [
  "God's Strength",
  "Guidance & Direction",
  "Courage & Leadership",
  "Love in Action",
  "Obedience & Honor",
  "Gratitude",
  "Faith & Trust",
  "Prayer & Listening",
  "Joy & Praise",
  "Wisdom & Discernment",
  "Forgiveness & Mercy",
  "Scripture & Truth",
]

const year3VerseATexts = [
  "God is strong",
  "God shows me the way",
  "God makes me brave",
  "I can love like Jesus",
  "I listen and obey",
  "I thank God today",
  "I trust God always",
  "I can pray to God",
  "God gives me joy",
  "God gives me wisdom",
  "I forgive with love",
  "God's Word helps me",
]

const year3VerseBTexts = [
  "God is my helper",
  "God leads my steps",
  "God is with me",
  "I can be kind",
  "God is pleased when I obey",
  "I praise God",
  "God is faithful",
  "God hears me",
  "I rejoice in God",
  "I choose what is right",
  "God forgives me",
  "God's Word is true",
]

const year3Verse8Texts = [
  "The Lord is my strength and my shield.",
  "The Lord directs my path.",
  "Be strong and take courage in the Lord.",
  "Let love be your guide in everything.",
  "Obey the Lord and walk in His ways.",
  "Give thanks to the Lord for His goodness.",
  "Trust the Lord with all your heart.",
  "Pray without giving up.",
  "The joy of the Lord gives me strength.",
  "Wisdom is more precious than treasure.",
  "Forgive as the Lord forgave you.",
  "God's Word is a lamp for my path.",
]

const year3ReferencePool = buildReferencePool(
  [
    { book: "Psalm", start: 101, end: 150 },
    { book: "Proverbs", start: 1, end: 31 },
    { book: "Isaiah", start: 36, end: 66 },
    { book: "Deuteronomy", start: 1, end: 34 },
    { book: "Joshua", start: 1, end: 24 },
    { book: "Judges", start: 1, end: 21 },
    { book: "Ruth", start: 1, end: 4 },
    { book: "1 Samuel", start: 1, end: 31 },
    { book: "2 Samuel", start: 1, end: 24 },
    { book: "1 Kings", start: 1, end: 22 },
    { book: "2 Kings", start: 1, end: 25 },
  ],
  existingReferences,
  156,
)

const year3Seeds: VerseSeed[] = Array.from({ length: 52 }, (_, index) => {
  const week = index + 1
  const monthIndex = Math.min(Math.floor(index / 4), 11)
  return {
    week,
    month: months[monthIndex],
    theme4to7: year3Themes4to7[monthIndex],
    theme8to12: year3Themes8to12[monthIndex],
    verseA: { text: year3VerseATexts[monthIndex], reference: year3ReferencePool[index] },
    verseB: { text: year3VerseBTexts[monthIndex], reference: year3ReferencePool[index + 52] },
    age8to12: { verse: year3Verse8Texts[monthIndex], reference: year3ReferencePool[index + 104] },
  }
})

const year4Themes4to7 = [
  "God Made the World",
  "God Cares for Me",
  "Jesus' Love",
  "Serving Others",
  "Peace & Calm",
  "Patience",
  "Hope in God",
  "Doing What's Right",
  "Courage",
  "Prayer & Praise",
  "Giving & Sharing",
  "God Sends Me",
]

const year4Themes8to12 = [
  "Creation & Care",
  "God's Care",
  "Jesus' Love",
  "Serving with Joy",
  "Peace of God",
  "Patience & Self-Control",
  "Hope & Endurance",
  "Integrity",
  "Courageous Faith",
  "Prayer & Worship",
  "Generosity",
  "Living on Mission",
]

const year4VerseATexts = [
  "God made the earth",
  "God takes care of me",
  "Jesus loves me",
  "I can serve others",
  "God gives me peace",
  "I can be patient",
  "God gives me hope",
  "I do what is right",
  "God makes me brave",
  "I can praise God",
  "I can share",
  "God sends me to help",
]

const year4VerseBTexts = [
  "God made me",
  "God knows my needs",
  "Jesus is my friend",
  "I can help gladly",
  "God calms my heart",
  "I wait with kindness",
  "God is faithful",
  "I tell the truth",
  "God is my strength",
  "God hears my praise",
  "I give with joy",
  "I can shine for God",
]

const year4Verse8Texts = [
  "The Lord made the heavens and the earth.",
  "Cast all your cares on Him.",
  "Jesus loved us and gave Himself for us.",
  "Serve one another in love.",
  "The Lord gives peace to His people.",
  "Be patient, and do not give up.",
  "Hope in the Lord and be strong.",
  "Live with integrity before God.",
  "Be strong in the Lord and courageous.",
  "Worship the Lord with gladness.",
  "God loves a cheerful giver.",
  "Go and make disciples with courage.",
]

const year4ReferencePool = buildReferencePool(
  [
    { book: "Jeremiah", start: 1, end: 52 },
    { book: "Ezekiel", start: 1, end: 48 },
    { book: "Matthew", start: 1, end: 28 },
    { book: "Mark", start: 1, end: 16 },
    { book: "Luke", start: 1, end: 24 },
    { book: "Acts", start: 1, end: 28 },
    { book: "Romans", start: 1, end: 16 },
    { book: "Galatians", start: 1, end: 6 },
    { book: "Ephesians", start: 1, end: 6 },
    { book: "Philippians", start: 1, end: 4 },
    { book: "Colossians", start: 1, end: 4 },
    { book: "Hebrews", start: 1, end: 13 },
  ],
  new Set([...existingReferences, ...year3ReferencePool]),
  156,
)

const year4Seeds: VerseSeed[] = Array.from({ length: 52 }, (_, index) => {
  const week = index + 1
  const monthIndex = Math.min(Math.floor(index / 4), 11)
  return {
    week,
    month: months[monthIndex],
    theme4to7: year4Themes4to7[monthIndex],
    theme8to12: year4Themes8to12[monthIndex],
    verseA: { text: year4VerseATexts[monthIndex], reference: year4ReferencePool[index] },
    verseB: { text: year4VerseBTexts[monthIndex], reference: year4ReferencePool[index + 52] },
    age8to12: { verse: year4Verse8Texts[monthIndex], reference: year4ReferencePool[index + 104] },
  }
})

export const year3Verses = buildYearFromSeeds("year3", year3Seeds)
export const year4Verses = buildYearFromSeeds("year4", year4Seeds)
