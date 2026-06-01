// Voice input parser — maps spoken words to app selections.
// Handles English, Mandarin keywords, and common Singlish phrases.
// Returns: { zodiac, horoscope, dreams, mood, gameType }
//   each field is null / [] if not detected.

import { CHINESE_ZODIAC, WESTERN_ZODIAC } from '../data/zodiac.js'
import { dreamCategories } from '../data/dreams.js'
import { moods } from '../data/moods.js'

const ALL_DREAMS = dreamCategories.flatMap(c => c.items)

// ── Keyword maps ──────────────────────────────────────────────────────────────

const ZODIAC_KW = {
  // English
  rat:'rat', mouse:'rat', mice:'rat',
  ox:'ox', cow:'ox', bull:'ox', cattle:'ox',
  tiger:'tiger',
  rabbit:'rabbit', bunny:'rabbit', hare:'rabbit',
  dragon:'dragon',
  snake:'snake', serpent:'snake',
  horse:'horse',
  goat:'goat', sheep:'goat', ram:'goat',
  monkey:'monkey',
  rooster:'rooster', chicken:'rooster', hen:'rooster', cock:'rooster',
  dog:'dog', puppy:'dog',
  pig:'pig', boar:'pig', hog:'pig',
  // Mandarin
  '鼠':'rat','老鼠':'rat',
  '牛':'ox',
  '虎':'tiger','老虎':'tiger',
  '兔':'rabbit','兔子':'rabbit',
  '龙':'dragon','龍':'dragon',
  '蛇':'snake',
  '马':'horse','馬':'horse',
  '羊':'goat','山羊':'goat',
  '猴':'monkey','猴子':'monkey',
  '鸡':'rooster','鷄':'rooster','雞':'rooster',
  '狗':'dog','小狗':'dog',
  '猪':'pig','豬':'pig',
}

const DREAM_KW = {
  // English
  dragon:'dragon', fish:'fish', bird:'bird', birds:'bird',
  tiger:'tiger', snake:'snake', rabbit:'rabbit', bunny:'rabbit',
  water:'water', sea:'water', ocean:'water', river:'water', rain:'water', flood:'water',
  fire:'fire', flame:'fire', flames:'fire', burning:'fire',
  mountain:'mountain', hill:'mountain', hills:'mountain',
  rainbow:'rainbow',
  lightning:'lightning', thunder:'lightning', storm:'lightning',
  moon:'moon', lunar:'moon',
  gold:'gold', money:'gold', cash:'gold', wealth:'gold', rich:'gold', coins:'gold',
  gems:'gems', gem:'gems', jewel:'gems', jewels:'gems', diamond:'gems', crystal:'gems',
  car:'car', vehicle:'car', drive:'car', driving:'car',
  house:'house', home:'house', building:'house', mansion:'house',
  wedding:'wedding', married:'wedding', marry:'wedding', marriage:'wedding', bride:'wedding',
  baby:'baby', infant:'baby', newborn:'baby', toddler:'baby',
  ancestor:'ancestor', ancestors:'ancestor', grandparent:'ancestor', grandparents:'ancestor',
  stranger:'stranger', strangers:'stranger',
  celebrity:'celebrity', famous:'celebrity', star:'celebrity',
  child:'child', kid:'child', children:'child', kids:'child',
  lover:'lover', love:'lover', girlfriend:'lover', boyfriend:'lover', partner:'lover', husband:'lover', wife:'lover',
  boss:'boss', manager:'boss', employer:'boss', supervisor:'boss',
  // Mandarin
  '鱼':'fish','鱼儿':'fish',
  '鸟':'bird','鸟儿':'bird',
  '水':'water','海':'water','河':'water','雨':'water',
  '火':'fire','火焰':'fire',
  '山':'mountain','高山':'mountain',
  '彩虹':'rainbow',
  '闪电':'lightning','雷':'lightning',
  '月':'moon','月亮':'moon',
  '金':'gold','钱':'gold','财富':'gold',
  '宝石':'gems','钻石':'gems',
  '车':'car','汽车':'car',
  '房':'house','房子':'house','家':'house',
  '婚礼':'wedding','结婚':'wedding',
  '宝宝':'baby','婴儿':'baby','孩子':'baby',
  '祖先':'ancestor','祖宗':'ancestor',
  '陌生人':'stranger',
  '明星':'celebrity','名人':'celebrity',
  '小孩':'child','儿童':'child',
  '爱人':'lover','情人':'lover','老公':'lover','老婆':'lover',
  '老板':'boss','上司':'boss',
}

const MOOD_KW = {
  // English
  lucky:'lucky', luck:'lucky', fortunate:'lucky',
  hopeful:'hopeful', hope:'hopeful', optimistic:'hopeful',
  dreamy:'dreamy', daydream:'dreamy',
  adventurous:'adventurous', adventure:'adventurous', brave:'adventurous', daring:'adventurous',
  calm:'calm', relaxed:'calm', serene:'calm', chill:'calm',
  excited:'excited', happy:'excited', joyful:'excited', energetic:'excited', great:'excited',
  spiritual:'spiritual', blessed:'blessed', bless:'blessed',
  grateful:'grateful', thankful:'grateful', gratitude:'grateful',
  confident:'confident', sure:'confident', bold:'confident',
  romantic:'romantic', loving:'romantic',
  anxious:'anxious', worried:'anxious', nervous:'anxious', stressed:'anxious', stress:'anxious',
  nostalgic:'nostalgic', nostalgic:'nostalgic',
  determined:'determined', focused:'determined', motivated:'determined',
  peaceful:'peaceful', peaceful:'peaceful',
  mysterious:'mysterious', mystery:'mysterious', curious:'mysterious',
  // Mandarin
  '幸运':'lucky','运气':'lucky',
  '希望':'hopeful','乐观':'hopeful',
  '梦幻':'dreamy','梦想':'dreamy',
  '冒险':'adventurous','勇敢':'adventurous',
  '平静':'calm','放松':'calm','冷静':'calm',
  '兴奋':'excited','开心':'excited','快乐':'excited','高兴':'excited',
  '灵性':'spiritual','感恩':'grateful','感激':'grateful',
  '自信':'confident',
  '浪漫':'romantic','爱情':'romantic',
  '焦虑':'anxious','担心':'anxious','紧张':'anxious',
  '幸福':'blessed',
  '怀念':'nostalgic','思念':'nostalgic',
  '坚定':'determined','专注':'determined',
  '和平':'peaceful',
  '神秘':'mysterious',
}

const HOROSCOPE_KW = {
  aries:'aries', 'white sheep':'aries',
  taurus:'taurus', 'golden bull':'taurus',
  gemini:'gemini', 'twins':'gemini',
  cancer:'cancer',
  leo:'leo', 'lion':'leo',
  virgo:'virgo',
  libra:'libra', 'scales':'libra',
  scorpio:'scorpio', 'scorpion':'scorpio',
  sagittarius:'sagittarius', sagittarian:'sagittarius', 'archer':'sagittarius',
  capricorn:'capricorn', capricornus:'capricorn',
  aquarius:'aquarius',
  pisces:'pisces',
  '白羊':'aries','金牛':'taurus','双子':'gemini','巨蟹':'cancer',
  '狮子':'leo','处女':'virgo','天秤':'libra','天蝎':'scorpio',
  '射手':'sagittarius','摩羯':'capricorn','水瓶':'aquarius','双鱼':'pisces',
  '牡羊':'aries',
}

const GAME_KW = {
  '4d':'4d','4-d':'4d','four d':'4d','four digit':'4d','四维':'4d','四d':'4d',
  'toto':'toto','lotto':'toto','多多':'toto','lottery':'toto',
  'both':'both','all':'both','everything':'both','两个':'both','全部':'both',
}

// ── Tokeniser ─────────────────────────────────────────────────────────────────

function tokenise(text) {
  // Return both the full lowercased text (for Chinese substring matching)
  // and split English tokens
  const lower = text.toLowerCase().replace(/[.,!?。！？]/g, ' ')
  const tokens = lower.split(/[\s,，、]+/).filter(Boolean)
  return { lower, tokens }
}

function firstMatch(map, lower, tokens) {
  // Try multi-word phrases first (longer keys first for specificity)
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (lower.includes(key)) return map[key]
  }
  // Fallback: individual tokens
  for (const tok of tokens) {
    if (map[tok]) return map[tok]
  }
  return null
}

function allMatches(map, lower, tokens) {
  const found = new Set()
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) {
    if (lower.includes(key)) found.add(map[key])
  }
  for (const tok of tokens) {
    if (map[tok]) found.add(map[tok])
  }
  return [...found]
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseVoiceInput(transcript) {
  const { lower, tokens } = tokenise(transcript)

  // Zodiac (Chinese animal)
  const zodiacId    = firstMatch(ZODIAC_KW, lower, tokens)
  const zodiac      = zodiacId ? CHINESE_ZODIAC.find(z => z.id === zodiacId) || null : null

  // Western horoscope
  const horoscopeId = firstMatch(HOROSCOPE_KW, lower, tokens)
  const horoscope   = horoscopeId ? WESTERN_ZODIAC.find(z => z.id === horoscopeId) || null : null

  // Dreams (multiple allowed)
  const dreamIds    = allMatches(DREAM_KW, lower, tokens)
  const dreams      = dreamIds.map(id => ALL_DREAMS.find(d => d.id === id)).filter(Boolean)

  // Mood (first match wins)
  const moodId      = firstMatch(MOOD_KW, lower, tokens)
  const mood        = moodId ? moods.find(m => m.id === moodId) || null : null

  // Game type
  const gameType    = firstMatch(GAME_KW, lower, tokens)

  return { zodiac, horoscope, dreams, mood, gameType, transcript }
}

// ── Example phrases for the UI prompt ────────────────────────────────────────

export const VOICE_EXAMPLES = {
  en: [
    'I am a Dragon, feeling lucky',
    'I dreamt of water and gold',
    'Generate TOTO numbers for me',
    'I am a Scorpio, dreamed of fire',
  ],
  zh: [
    '我是龙年出生的，感觉很幸运',
    '我梦见了水和黄金',
    '帮我生成多多号码',
    '我是天蝎座，梦见了火',
  ],
}
