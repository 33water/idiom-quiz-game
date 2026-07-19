const idioms = [
  {
    id: 1,
    word: '画蛇添足',
    pinyin: 'huà shé tiān zú',
    meaning: '画蛇时给蛇添上脚。比喻做了多余的事，反而不恰当。',
    source: '《战国策·齐策二》',
    example: '这篇文章本来写得很好，你最后加的那段完全是画蛇添足。',
    category: '寓言故事',
    difficulty: 2,
    emoji: '🐍',
    riddles: [
      { level: 1, text: '给蛇画脚' },
      { level: 2, text: '多此一举的画家' },
      { level: 3, text: '做完事又白忙活' }
    ],
    synonyms: '多此一举、弄巧成拙',
    antonyms: '画龙点睛、恰到好处',
    wrongOptions: ['画龙点睛', '多此一举', '弄巧成拙']
  },
  {
    id: 2,
    word: '守株待兔',
    pinyin: 'shǒu zhū dài tù',
    meaning: '原比喻希望不经过努力而得到成功的侥幸心理。现也比喻死守狭隘经验，不知变通。',
    source: '《韩非子·五蠹》',
    example: '我们不能守株待兔，要主动出击寻找机会。',
    category: '寓言故事',
    difficulty: 1,
    emoji: '🐰',
    riddles: [
      { level: 1, text: '树桩旁等兔子' },
      { level: 2, text: '不劳而获的农夫' },
      { level: 3, text: '死守经验不知变' }
    ],
    synonyms: '刻舟求剑、墨守成规',
    antonyms: '随机应变、见机行事',
    wrongOptions: ['刻舟求剑', '墨守成规', '随机应变']
  },
  {
    id: 3,
    word: '掩耳盗铃',
    pinyin: 'yǎn ěr dào líng',
    meaning: '捂住自己的耳朵去偷铃铛。比喻自己欺骗自己，明明掩盖不了的事偏要设法掩盖。',
    source: '《吕氏春秋·自知》',
    example: '这种做法无异于掩耳盗铃，自欺欺人。',
    category: '寓言故事',
    difficulty: 2,
    emoji: '🔔',
    riddles: [
      { level: 1, text: '捂着耳朵偷铃铛' },
      { level: 2, text: '自欺欺人的小偷' },
      { level: 3, text: '以为别人听不见' }
    ],
    synonyms: '自欺欺人、欲盖弥彰',
    antonyms: '实事求是、光明磊落',
    wrongOptions: ['自欺欺人', '欲盖弥彰', '实事求是']
  },
  {
    id: 4,
    word: '亡羊补牢',
    pinyin: 'wáng yáng bǔ láo',
    meaning: '羊逃跑了再去修补羊圈，还不算晚。比喻出了问题以后想办法补救，可以防止继续受损失。',
    source: '《战国策·楚策四》',
    example: '虽然这次考试没考好，但亡羊补牢，为时未晚。',
    category: '寓言故事',
    difficulty: 1,
    emoji: '🐑',
    riddles: [
      { level: 1, text: '丢了羊再修圈' },
      { level: 2, text: '事后补救还不晚' },
      { level: 3, text: '知错就改的好办法' }
    ],
    synonyms: '知错就改、迷途知返',
    antonyms: '执迷不悟、一错再错',
    wrongOptions: ['知错就改', '迷途知返', '执迷不悟']
  },
  {
    id: 5,
    word: '刻舟求剑',
    pinyin: 'kè zhōu qiú jiàn',
    meaning: '在船上刻记号来寻找掉入水中的剑。比喻拘泥成例，不知道跟着情势的变化而改变看法或办法。',
    source: '《吕氏春秋·察今》',
    example: '时代在变化，我们不能刻舟求剑，要用发展的眼光看问题。',
    category: '寓言故事',
    difficulty: 2,
    emoji: '⚔️',
    riddles: [
      { level: 1, text: '船上刻字找剑' },
      { level: 2, text: '不知变通的蠢人' },
      { level: 3, text: '用老办法解决新问题' }
    ],
    synonyms: '守株待兔、墨守成规',
    antonyms: '随机应变、见机行事',
    wrongOptions: ['守株待兔', '墨守成规', '随机应变']
  },
  {
    id: 6,
    word: '杯弓蛇影',
    pinyin: 'bēi gōng shé yǐng',
    meaning: '将映在杯中的弓影误认为蛇。比喻因疑神疑鬼而引起恐惧。',
    source: '《晋书·乐广传》',
    example: '他最近总是杯弓蛇影，一点小事就紧张得不行。',
    category: '历史典故',
    difficulty: 4,
    emoji: '🏹',
    riddles: [
      { level: 1, text: '杯子里看到蛇' },
      { level: 2, text: '疑神疑鬼吓自己' },
      { level: 3, text: '弓的影子变蛇影' }
    ],
    synonyms: '草木皆兵、疑神疑鬼',
    antonyms: '处之泰然、安之若素',
    wrongOptions: ['草木皆兵', '疑神疑鬼', '处之泰然']
  },
  {
    id: 7,
    word: '对牛弹琴',
    pinyin: 'duì niú tán qín',
    meaning: '对着牛弹琴。比喻对不懂道理的人讲道理，也用来讥笑人讲话不看对象。',
    source: '《理惑论》',
    example: '跟他讲这些高深的理论，简直是对牛弹琴。',
    category: '寓言故事',
    difficulty: 1,
    emoji: '🎵',
    riddles: [
      { level: 1, text: '给牛弹曲子' },
      { level: 2, text: '说话不看对象' },
      { level: 3, text: '白费口舌没人懂' }
    ],
    synonyms: '白费口舌、鸡同鸭讲',
    antonyms: '对症下药、言简意赅',
    wrongOptions: ['白费口舌', '鸡同鸭讲', '对症下药']
  },
  {
    id: 8,
    word: '狐假虎威',
    pinyin: 'hú jiǎ hǔ wēi',
    meaning: '狐狸假借老虎的威势。比喻依仗别人的势力欺压人。',
    source: '《战国策·楚策一》',
    example: '他不过是狐假虎威，仗着老板的势力欺负同事。',
    category: '寓言故事',
    difficulty: 2,
    emoji: '🦊',
    riddles: [
      { level: 1, text: '狐狸借老虎威风' },
      { level: 2, text: '仗势欺人的小人' },
      { level: 3, text: '借别人的势力吓人' }
    ],
    synonyms: '仗势欺人、狗仗人势',
    antonyms: '独步天下、独立自主',
    wrongOptions: ['仗势欺人', '狗仗人势', '独步天下']
  },
  {
    id: 9,
    word: '井底之蛙',
    pinyin: 'jǐng dǐ zhī wā',
    meaning: '井底的青蛙认为天只有井口那么大。比喻见识狭窄的人。',
    source: '《庄子·秋水》',
    example: '我们要多出去走走，不要做井底之蛙。',
    category: '寓言故事',
    difficulty: 2,
    emoji: '🐸',
    riddles: [
      { level: 1, text: '井里的青蛙' },
      { level: 2, text: '见识短浅的人' },
      { level: 3, text: '以为天只有井口大' }
    ],
    synonyms: '坐井观天、鼠目寸光',
    antonyms: '见多识广、博古通今',
    wrongOptions: ['坐井观天', '鼠目寸光', '见多识广']
  },
  {
    id: 10,
    word: '自相矛盾',
    pinyin: 'zì xiāng máo dùn',
    meaning: '比喻自己说话做事前后抵触。',
    source: '《韩非子·难一》',
    example: '他的说法自相矛盾，前后完全对不上。',
    category: '寓言故事',
    difficulty: 3,
    emoji: '🛡️',
    riddles: [
      { level: 1, text: '矛和盾的故事' },
      { level: 2, text: '前后说话对不上' },
      { level: 3, text: '自己打自己的脸' }
    ],
    synonyms: '前后矛盾、漏洞百出',
    antonyms: '自圆其说、天衣无缝',
    wrongOptions: ['前后矛盾', '漏洞百出', '自圆其说']
  },
  {
    id: 11,
    word: '叶公好龙',
    pinyin: 'yè gōng hào lóng',
    meaning: '比喻口头上说爱好某事物，实际上并不真爱好。',
    source: '《新序·杂事》',
    example: '他说喜欢读书，但买来的书从不翻看，不过是叶公好龙罢了。',
    category: '寓言故事',
    difficulty: 3,
    emoji: '🐉',
    riddles: [
      { level: 1, text: '叶公喜欢龙' },
      { level: 2, text: '嘴上说喜欢实际不爱' },
      { level: 3, text: '假爱好真害怕' }
    ],
    synonyms: '口是心非、言不由衷',
    antonyms: '名副其实、表里如一',
    wrongOptions: ['口是心非', '言不由衷', '名副其实']
  },
  {
    id: 12,
    word: '拔苗助长',
    pinyin: 'bá miáo zhù zhǎng',
    meaning: '把苗拔起来帮助它生长。比喻违反事物发展的客观规律，急于求成，反而把事情弄糟。',
    source: '《孟子·公孙丑上》',
    example: '教育孩子不能拔苗助长，要遵循成长规律。',
    category: '寓言故事',
    difficulty: 3,
    emoji: '🌱',
    riddles: [
      { level: 1, text: '把苗拔高帮它长' },
      { level: 2, text: '急于求成反坏事' },
      { level: 3, text: '违反规律想快长' }
    ],
    synonyms: '急于求成、欲速不达',
    antonyms: '循序渐进、因势利导',
    wrongOptions: ['急于求成', '欲速不达', '循序渐进']
  },
  {
    id: 13,
    word: '卧薪尝胆',
    pinyin: 'wò xīn cháng dǎn',
    meaning: '睡在柴草上，吃饭前先尝苦胆。形容人刻苦自励，发奋图强。',
    source: '《史记·越王勾践世家》',
    example: '他卧薪尝胆十年，终于实现了自己的梦想。',
    category: '历史典故',
    difficulty: 4,
    emoji: '🔥',
    riddles: [
      { level: 1, text: '睡柴草尝苦胆' },
      { level: 2, text: '刻苦自励报大仇' },
      { level: 3, text: '忍辱负重终成功' }
    ],
    synonyms: '发愤图强、忍辱负重',
    antonyms: '自甘堕落、自暴自弃',
    wrongOptions: ['发愤图强', '忍辱负重', '自甘堕落']
  },
  {
    id: 14,
    word: '三顾茅庐',
    pinyin: 'sān gù máo lú',
    meaning: '原为汉末刘备访聘诸葛亮的故事。比喻真心诚意，一再邀请。',
    source: '《三国志·蜀志·诸葛亮传》',
    example: '老板三顾茅庐，终于请来了这位技术专家。',
    category: '历史典故',
    difficulty: 4,
    emoji: '🏠',
    riddles: [
      { level: 1, text: '刘备三次请诸葛' },
      { level: 2, text: '真心诚意请人才' },
      { level: 3, text: '一再邀请显诚意' }
    ],
    synonyms: '诚心诚意、礼贤下士',
    antonyms: '拒人千里、傲慢无礼',
    wrongOptions: ['诚心诚意', '礼贤下士', '拒人千里']
  },
  {
    id: 15,
    word: '完璧归赵',
    pinyin: 'wán bì guī zhào',
    meaning: '本指蔺相如将和氏璧完好地从秦国送回赵国。后比喻把原物完好地归还本人。',
    source: '《史记·廉颇蔺相如列传》',
    example: '请放心把书借给我，我一定会完璧归赵。',
    category: '历史典故',
    difficulty: 4,
    emoji: '💎',
    riddles: [
      { level: 1, text: '完整归还璧玉' },
      { level: 2, text: '原物完好还主人' },
      { level: 3, text: '蔺相如的功劳' }
    ],
    synonyms: '物归原主、完好无损',
    antonyms: '据为己有、损人利己',
    wrongOptions: ['物归原主', '完好无损', '据为己有']
  },
  {
    id: 16,
    word: '负荆请罪',
    pinyin: 'fù jīng qǐng zuì',
    meaning: '背着荆条向对方请罪。表示向人认错赔罪。',
    source: '《史记·廉颇蔺相如列传》',
    example: '他意识到自己错了，决定负荆请罪，向对方道歉。',
    category: '历史典故',
    difficulty: 4,
    emoji: '🙏',
    riddles: [
      { level: 1, text: '背荆条去道歉' },
      { level: 2, text: '主动认错求原谅' },
      { level: 3, text: '廉颇向蔺相如赔罪' }
    ],
    synonyms: '知错就改、幡然悔悟',
    antonyms: '执迷不悟、死不认错',
    wrongOptions: ['知错就改', '执迷不悟', '死不悔改']
  },
  {
    id: 17,
    word: '望梅止渴',
    pinyin: 'wàng méi zhǐ kě',
    meaning: '原意是梅子酸，人想吃梅子就会流涎，因而止渴。后比喻愿望无法实现，用空想安慰自己。',
    source: '《世说新语·假谲》',
    example: '现在说这些不过是望梅止渴，还是想想实际的办法吧。',
    category: '历史典故',
    difficulty: 5,
    emoji: '🍋',
    riddles: [
      { level: 1, text: '看梅子解口渴' },
      { level: 2, text: '空想安慰自己' },
      { level: 3, text: '曹操骗士兵的故事' }
    ],
    synonyms: '画饼充饥、掩耳盗铃',
    antonyms: '实事求是、脚踏实地',
    wrongOptions: ['画饼充饥', '掩耳盗铃', '实事求是']
  },
  {
    id: 18,
    word: '指鹿为马',
    pinyin: 'zhǐ lù wéi mǎ',
    meaning: '指着鹿说是马。比喻故意颠倒黑白，混淆是非。',
    source: '《史记·秦始皇本纪》',
    example: '这种指鹿为马的行为，实在令人不齿。',
    category: '历史典故',
    difficulty: 3,
    emoji: '🦌',
    riddles: [
      { level: 1, text: '指着鹿说是马' },
      { level: 2, text: '故意颠倒黑白' },
      { level: 3, text: '赵高骗秦二世' }
    ],
    synonyms: '颠倒黑白、混淆是非',
    antonyms: '实事求是、是非分明',
    wrongOptions: ['颠倒黑白', '混淆是非', '实事求是']
  },
  {
    id: 19,
    word: '破釜沉舟',
    pinyin: 'pò fǔ chén zhōu',
    meaning: '把饭锅打破，把渡船凿沉。比喻不留退路，非打胜仗不可，下决心不顾一切地干到底。',
    source: '《史记·项羽本纪》',
    example: '这次创业他破釜沉舟，把所有积蓄都投了进去。',
    category: '历史典故',
    difficulty: 5,
    emoji: '⛵',
    riddles: [
      { level: 1, text: '砸锅沉船打仗' },
      { level: 2, text: '不留退路拼到底' },
      { level: 3, text: '项羽的决战决心' }
    ],
    synonyms: '背水一战、义无反顾',
    antonyms: '瞻前顾后、犹豫不决',
    wrongOptions: ['背水一战', '义无反顾', '瞻前顾后']
  },
  {
    id: 20,
    word: '草木皆兵',
    pinyin: 'cǎo mù jiē bīng',
    meaning: '把山上的草木都当作敌兵。形容人在惊慌时疑神疑鬼。',
    source: '《晋书·苻坚载记》',
    example: '失败之后他草木皆兵，对谁都充满戒备。',
    category: '历史典故',
    difficulty: 5,
    emoji: '🌿',
    riddles: [
      { level: 1, text: '草木都当成兵' },
      { level: 2, text: '惊慌时疑神疑鬼' },
      { level: 3, text: '苻坚淝水之战' }
    ],
    synonyms: '杯弓蛇影、疑神疑鬼',
    antonyms: '处之泰然、安之若素',
    wrongOptions: ['杯弓蛇影', '疑神疑鬼', '处之泰然']
  },
  {
    id: 21,
    word: '胸有成竹',
    pinyin: 'xiōng yǒu chéng zhú',
    meaning: '画竹前竹子的完美形象已在胸中。比喻处理事情之前已有完整的谋划打算。',
    source: '宋·苏轼《文与可画筼筜谷偃竹记》',
    example: '看他胸有成竹的样子，这次考试应该没问题。',
    category: '文学艺术',
    difficulty: 3,
    emoji: '🎋',
    riddles: [
      { level: 1, text: '心里有竹子' },
      { level: 2, text: '做事前有完整计划' },
      { level: 3, text: '文与可画竹的故事' }
    ],
    synonyms: '成竹在胸、心中有数',
    antonyms: '心中无数、手足无措',
    wrongOptions: ['成竹在胸', '心中有数', '心中无数']
  },
  {
    id: 22,
    word: '妙笔生花',
    pinyin: 'miào bǐ shēng huā',
    meaning: '比喻杰出的写作才能。',
    source: '五代·王仁裕《开元天宝遗事·梦笔头生花》',
    example: '这位作家妙笔生花，写的每一篇文章都令人赞叹。',
    category: '文学艺术',
    difficulty: 4,
    emoji: '✍️',
    riddles: [
      { level: 1, text: '笔头开出花' },
      { level: 2, text: '写作才能杰出' },
      { level: 3, text: '李白梦笔的故事' }
    ],
    synonyms: '笔走龙蛇、才华横溢',
    antonyms: '平淡无奇、索然无味',
    wrongOptions: ['笔走龙蛇', '才华横溢', '平淡无奇']
  },
  {
    id: 23,
    word: '高山流水',
    pinyin: 'gāo shān liú shuǐ',
    meaning: '比喻知己或知音。也比喻乐曲高妙。',
    source: '《列子·汤问》',
    example: '他们二人真是高山流水，彼此心意相通。',
    category: '文学艺术',
    difficulty: 5,
    emoji: '🎶',
    riddles: [
      { level: 1, text: '高山和流水' },
      { level: 2, text: '知音难觅' },
      { level: 3, text: '伯牙子期的故事' }
    ],
    synonyms: '知音难觅、心有灵犀',
    antonyms: '对牛弹琴、话不投机',
    wrongOptions: ['知音难觅', '心有灵犀', '对牛弹琴']
  },
  {
    id: 24,
    word: '洛阳纸贵',
    pinyin: 'luò yáng zhǐ guì',
    meaning: '比喻著作有价值，流传广。',
    source: '《晋书·左思传》',
    example: '这部小说出版后洛阳纸贵，一书难求。',
    category: '文学艺术',
    difficulty: 5,
    emoji: '📖',
    riddles: [
      { level: 1, text: '洛阳的纸变贵' },
      { level: 2, text: '著作流传很广' },
      { level: 3, text: '左思写三都赋' }
    ],
    synonyms: '风靡一时、有口皆碑',
    antonyms: '无人问津、默默无闻',
    wrongOptions: ['风靡一时', '有口皆碑', '无人问津']
  },
  {
    id: 25,
    word: '马到成功',
    pinyin: 'mǎ dào chéng gōng',
    meaning: '形容工作刚开始就取得成功。',
    source: '元·无名氏《小尉迟》',
    example: '祝你马到成功，早日完成这个项目！',
    category: '祝福吉祥',
    difficulty: 2,
    emoji: '🐴',
    riddles: [
      { level: 1, text: '马到了就成功' },
      { level: 2, text: '一开始就胜利' },
      { level: 3, text: '常用的祝福语' }
    ],
    synonyms: '旗开得胜、一举成功',
    antonyms: '一败涂地、功亏一篑',
    wrongOptions: ['旗开得胜', '一举成功', '一败涂地']
  },
  {
    id: 26,
    word: '龙飞凤舞',
    pinyin: 'lóng fēi fèng wǔ',
    meaning: '原形容山势的蜿蜒雄壮，后也形容书法笔势有力，灵活舒展。',
    source: '宋·苏轼《表忠观碑》',
    example: '他的书法龙飞凤舞，气势磅礴。',
    category: '文学艺术',
    difficulty: 4,
    emoji: '🐲',
    riddles: [
      { level: 1, text: '龙飞起来凤跳舞' },
      { level: 2, text: '书法笔势有力' },
      { level: 3, text: '形容字写得好看' }
    ],
    synonyms: '笔走龙蛇、气势磅礴',
    antonyms: '工整规范、中规中矩',
    wrongOptions: ['笔走龙蛇', '气势磅礴', '工整规范']
  },
  {
    id: 27,
    word: '一帆风顺',
    pinyin: 'yī fān fēng shùn',
    meaning: '船挂着满帆顺风行驶。比喻非常顺利，没有任何阻碍。',
    source: '唐·孟郊《送崔爽之湖南》',
    example: '祝你一路顺风，一帆风顺！',
    category: '祝福吉祥',
    difficulty: 2,
    emoji: '⛵',
    riddles: [
      { level: 1, text: '一帆风就顺' },
      { level: 2, text: '非常顺利没阻碍' },
      { level: 3, text: '常用的祝福语' }
    ],
    synonyms: '一路顺风、万事如意',
    antonyms: '一波三折、困难重重',
    wrongOptions: ['一路顺风', '万事如意', '一波三折']
  },
  {
    id: 28,
    word: '锦上添花',
    pinyin: 'jǐn shàng tiān huā',
    meaning: '在锦上再绣花。比喻好上加好，美上添美。',
    source: '宋·黄庭坚《了了庵颂》',
    example: '你的到来真是锦上添花，让晚会更加精彩。',
    category: '祝福吉祥',
    difficulty: 4,
    emoji: '🌸',
    riddles: [
      { level: 1, text: '锦缎上再绣花' },
      { level: 2, text: '好上加好美更美' },
      { level: 3, text: '不是雪中送炭' }
    ],
    synonyms: '好上加好、精益求精',
    antonyms: '雪上加霜、弄巧成拙',
    wrongOptions: ['好上加好', '精益求精', '雪上加霜']
  },
  {
    id: 29,
    word: '鹏程万里',
    pinyin: 'péng chéng wàn lǐ',
    meaning: '相传鹏鸟能飞万里路程。比喻前程远大。',
    source: '《庄子·逍遥游》',
    example: '祝你鹏程万里，前程似锦！',
    category: '祝福吉祥',
    difficulty: 4,
    emoji: '🦅',
    riddles: [
      { level: 1, text: '大鹏飞万里' },
      { level: 2, text: '前程很远大' },
      { level: 3, text: '庄子逍遥游的故事' }
    ],
    synonyms: '前程似锦、大有可为',
    antonyms: '穷途末路、日暮途穷',
    wrongOptions: ['前程似锦', '大有可为', '穷途末路']
  },
  {
    id: 30,
    word: '心想事成',
    pinyin: 'xīn xiǎng shì chéng',
    meaning: '心里想到的都能成功。多用于祝福语。',
    source: '民间俗语',
    example: '新年到了，祝你心想事成，万事如意！',
    category: '祝福吉祥',
    difficulty: 2,
    emoji: '💫',
    riddles: [
      { level: 1, text: '心里想的事都成' },
      { level: 2, text: '常用的祝福语' },
      { level: 3, text: '新年祝福必备' }
    ],
    synonyms: '万事如意、美梦成真',
    antonyms: '事与愿违、适得其反',
    wrongOptions: ['万事如意', '美梦成真', '事与愿违']
  },
  // ========== 新增成语 31-40 ==========
  {
    id: 31,
    word: '画龙点睛',
    pinyin: 'huà lóng diǎn jīng',
    meaning: '原形容梁代画家张僧繇作画的神妙。后比喻在关键处用几句话点明实质，使内容生动有力。',
    source: '唐·张彦远《历代名画记》',
    example: '文章结尾那句名言，起到了画龙点睛的作用。',
    category: '文学艺术',
    difficulty: 4,
    emoji: '🐲',
    riddles: [
      { level: 1, text: '画完龙点眼睛' },
      { level: 2, text: '关键一笔让作品出彩' },
      { level: 3, text: '张僧繇破壁飞龙的故事' }
    ],
    synonyms: '点睛之笔、锦上添花',
    antonyms: '画蛇添足、多此一举',
    wrongOptions: ['画蛇添足', '多此一举', '锦上添花']
  },
  {
    id: 32,
    word: '开门见山',
    pinyin: 'kāi mén jiàn shān',
    meaning: '打开门就能看到山。比喻说话或写文章直截了当，不拐弯抹角。',
    source: '宋·严羽《沧浪诗话·诗评》',
    example: '我们开门见山地说吧，这件事你到底同意不同意？',
    category: '文学艺术',
    difficulty: 2,
    emoji: '⛰️',
    riddles: [
      { level: 1, text: '一开门见大山' },
      { level: 2, text: '说话直截了当' },
      { level: 3, text: '写作开头不绕弯' }
    ],
    synonyms: '直截了当、单刀直入',
    antonyms: '拐弯抹角、旁敲侧击',
    wrongOptions: ['直截了当', '拐弯抹角', '旁敲侧击']
  },
  {
    id: 33,
    word: '四面楚歌',
    pinyin: 'sì miàn chǔ gē',
    meaning: '比喻陷入四面受敌、孤立无援的境地。',
    source: '《史记·项羽本纪》',
    example: '公司现在四面楚歌，竞争对手纷纷推出类似产品。',
    category: '历史典故',
    difficulty: 5,
    emoji: '⚔️',
    riddles: [
      { level: 1, text: '四周都在唱楚歌' },
      { level: 2, text: '被敌人包围孤立' },
      { level: 3, text: '项羽垓下之围' }
    ],
    synonyms: '腹背受敌、孤立无援',
    antonyms: '左右逢源、八面威风',
    wrongOptions: ['腹背受敌', '孤立无援', '左右逢源']
  },
  {
    id: 34,
    word: '纸上谈兵',
    pinyin: 'zhǐ shàng tán bīng',
    meaning: '在纸面上谈论打仗。比喻空谈理论，不能解决实际问题。也比喻空谈不能成为现实。',
    source: '《史记·廉颇蔺相如列传》',
    example: '光说不练就是纸上谈兵，要有实际行动才行。',
    category: '历史典故',
    difficulty: 4,
    emoji: '📄',
    riddles: [
      { level: 1, text: '在纸上讨论兵法' },
      { level: 2, text: '空谈理论不实践' },
      { level: 3, text: '赵括长平之战的故事' }
    ],
    synonyms: '夸夸其谈、坐而论道',
    antonyms: '身体力行、脚踏实地',
    wrongOptions: ['夸夸其谈', '坐而论道', '身体力行']
  },
  {
    id: 35,
    word: '入木三分',
    pinyin: 'rù mù sān fēn',
    meaning: '形容书法笔力苍劲有力。也比喻分析问题见解深刻。',
    source: '唐·张怀瓘《书断·王羲之》',
    example: '这篇评论入木三分，直击问题的核心。',
    category: '文学艺术',
    difficulty: 5,
    emoji: '✒️',
    riddles: [
      { level: 1, text: '刻进木头三分深' },
      { level: 2, text: '分析问题很透彻' },
      { level: 3, text: '王羲之题板的故事' }
    ],
    synonyms: '力透纸背、鞭辟入里',
    antonyms: '隔靴搔痒、浅尝辄止',
    wrongOptions: ['力透纸背', '隔靴搔痒', '浅尝辄止']
  },
  {
    id: 36,
    word: '鹤立鸡群',
    pinyin: 'hè lì jī qún',
    meaning: '像鹤站在鸡群中一样。比喻一个人的才能或仪表在一群人里头显得很突出。',
    source: '南朝宋·刘义庆《世说新语·容止》',
    example: '她的气质在众人中鹤立鸡群，格外引人注目。',
    category: '文学艺术',
    difficulty: 3,
    emoji: '🦩',
    riddles: [
      { level: 1, text: '鹤站在鸡群里' },
      { level: 2, text: '才能出众很显眼' },
      { level: 3, text: '超群绝伦的比喻' }
    ],
    synonyms: '出类拔萃、卓尔不群',
    antonyms: '泯然众人、相形见绌',
    wrongOptions: ['出类拔萃', '卓尔不群', '相形见绌']
  },
  {
    id: 37,
    word: '一箭双雕',
    pinyin: 'yī jiàn shuāng diāo',
    meaning: '一箭射中两只雕。比喻做一件事达到两个目的。',
    source: '《北史·长孙晟传》',
    example: '这次活动既宣传了产品又筹集了善款，一箭双雕。',
    category: '寓言故事',
    difficulty: 3,
    emoji: '🏹',
    riddles: [
      { level: 1, text: '一箭射中两只鸟' },
      { level: 2, text: '做一件事收两份利' },
      { level: 3, text: '长孙晟射雕的故事' }
    ],
    synonyms: '一举两得、事半功倍',
    antonyms: '事倍功半、得不偿失',
    wrongOptions: ['一举两得', '事半功倍', '事倍功半']
  },
  {
    id: 38,
    word: '水滴石穿',
    pinyin: 'shuǐ dī shí chuān',
    meaning: '水不停地滴，能把石头滴穿。比喻只要有恒心，不断努力，事情就一定能成功。',
    source: '宋·罗大经《鹤林玉露》',
    example: '学习需要水滴石穿的精神，不能三天打鱼两天晒网。',
    category: '寓言故事',
    difficulty: 4,
    emoji: '💧',
    riddles: [
      { level: 1, text: '水滴穿石头' },
      { level: 2, text: '持之以恒终成功' },
      { level: 3, text: '劝学最常用的比喻' }
    ],
    synonyms: '持之以恒、锲而不舍',
    antonyms: '半途而废、一曝十寒',
    wrongOptions: ['持之以恒', '锲而不舍', '半途而废']
  },
  {
    id: 39,
    word: '百发百中',
    pinyin: 'bǎi fā bǎi zhòng',
    meaning: '形容射箭或打枪准确，每次都命中目标。也比喻做事有充分把握。',
    source: '《战国策·西周策》',
    example: '这位老猎手百发百中，从未失手。',
    category: '祝福吉祥',
    difficulty: 3,
    emoji: '🎯',
    riddles: [
      { level: 1, text: '一百次发一百次中' },
      { level: 2, text: '每次都能命中目标' },
      { level: 3, text: '养由基射箭的故事' }
    ],
    synonyms: '弹无虚发、百步穿杨',
    antonyms: '无的放矢、失之毫厘',
    wrongOptions: ['弹无虚发', '百步穿杨', '无的放矢']
  },
  {
    id: 40,
    word: '一举两得',
    pinyin: 'yī jǔ liǎng dé',
    meaning: '做一件事得到两方面的好处。',
    source: '《东观汉记·耿弇传》',
    example: '运动又能健身又能减肥，真是一举两得。',
    category: '祝福吉祥',
    difficulty: 2,
    emoji: '🎁',
    riddles: [
      { level: 1, text: '一次举动两份收获' },
      { level: 2, text: '做一件事得两个好处' },
      { level: 3, text: '常用于推荐好方法' }
    ],
    synonyms: '一箭双雕、事半功倍',
    antonyms: '事倍功半、得不偿失',
    wrongOptions: ['一箭双雕', '事半功倍', '得不偿失']
  }
]

const categories = ['寓言故事', '历史典故', '文学艺术', '祝福吉祥']

export { idioms, categories }
