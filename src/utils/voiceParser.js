// Voice input parser — maps spoken words to app selections.
// Handles English, Mandarin (simplified + traditional + homophones), and
// common Singlish phrases. Returns { zodiac, horoscope, dreams, mood, gameType }.

import { CHINESE_ZODIAC, WESTERN_ZODIAC } from '../data/zodiac.js'
import { dreamCategories } from '../data/dreams.js'
import { moods } from '../data/moods.js'

const ALL_DREAMS = dreamCategories.flatMap(c => c.items)

// ── Keyword maps ──────────────────────────────────────────────────────────────
// Latin keys are matched as whole words; CJK keys as substrings.

const ZODIAC_KW = {
  // English
  rat:'rat', mouse:'rat', mice:'rat',
  ox:'ox', cow:'ox', bull:'ox', cattle:'ox', buffalo:'ox',
  tiger:'tiger',
  rabbit:'rabbit', bunny:'rabbit', hare:'rabbit',
  dragon:'dragon',
  snake:'snake', serpent:'snake',
  horse:'horse',
  goat:'goat', sheep:'goat', ram:'goat', lamb:'goat',
  monkey:'monkey', ape:'monkey',
  rooster:'rooster', chicken:'rooster', hen:'rooster', cock:'rooster',
  dog:'dog', puppy:'dog', hound:'dog',
  pig:'pig', boar:'pig', hog:'pig',
  // Mandarin — simplified, traditional, common phrasings & homophones
  '鼠':'rat','老鼠':'rat','耗子':'rat','子鼠':'rat','鼠年':'rat',
  '牛':'ox','水牛':'ox','黄牛':'ox','丑牛':'ox','牛年':'ox',
  '虎':'tiger','老虎':'tiger','寅虎':'tiger','虎年':'tiger',
  '兔':'rabbit','兔子':'rabbit','玉兔':'rabbit','卯兔':'rabbit','兔年':'rabbit',
  '龙':'dragon','龍':'dragon','神龙':'dragon','辰龙':'dragon','龙年':'dragon','龍年':'dragon',
  '蛇':'snake','巳蛇':'snake','蛇年':'snake',
  '马':'horse','馬':'horse','午马':'horse','马年':'horse','馬年':'horse',
  '羊':'goat','山羊':'goat','绵羊':'goat','綿羊':'goat','未羊':'goat','羊年':'goat',
  '猴':'monkey','猴子':'monkey','申猴':'monkey','猴年':'monkey',
  '鸡':'rooster','雞':'rooster','鷄':'rooster','酉鸡':'rooster','公鸡':'rooster','鸡年':'rooster','雞年':'rooster',
  '狗':'dog','小狗':'dog','戌狗':'dog','狗年':'dog',
  '猪':'pig','豬':'pig','亥猪':'pig','猪年':'pig','豬年':'pig',
}

const DREAM_KW = {
  // English
  dragon:'dragon', fish:'fish', bird:'bird', birds:'bird',
  tiger:'tiger', snake:'snake', rabbit:'rabbit', bunny:'rabbit',
  water:'water', sea:'water', ocean:'water', river:'water', rain:'water', flood:'water', lake:'water', waterfall:'water',
  fire:'fire', flame:'fire', flames:'fire', burning:'fire', blaze:'fire',
  mountain:'mountain', hill:'mountain', hills:'mountain', mountains:'mountain',
  rainbow:'rainbow',
  lightning:'lightning', thunder:'lightning', storm:'lightning', thunderstorm:'lightning',
  moon:'moon', lunar:'moon', moonlight:'moon',
  gold:'gold', money:'gold', cash:'gold', wealth:'gold', rich:'gold', coins:'gold', riches:'gold', treasure:'gold',
  gems:'gems', gem:'gems', jewel:'gems', jewels:'gems', diamond:'gems', diamonds:'gems', crystal:'gems', jade:'gems',
  car:'car', vehicle:'car', drive:'car', driving:'car',
  house:'house', home:'house', building:'house', mansion:'house', apartment:'house',
  wedding:'wedding', married:'wedding', marry:'wedding', marriage:'wedding', bride:'wedding', groom:'wedding',
  baby:'baby', infant:'baby', newborn:'baby',
  ancestor:'ancestor', ancestors:'ancestor', grandparent:'ancestor', grandparents:'ancestor', grandpa:'ancestor', grandma:'ancestor',
  stranger:'stranger', strangers:'stranger',
  celebrity:'celebrity', famous:'celebrity', star:'celebrity', idol:'celebrity',
  child:'child', kid:'child', children:'child', kids:'child', toddler:'child',
  lover:'lover', girlfriend:'lover', boyfriend:'lover', partner:'lover', husband:'lover', wife:'lover', sweetheart:'lover',
  boss:'boss', manager:'boss', employer:'boss', supervisor:'boss',
  // Mandarin
  '鱼':'fish','魚':'fish','鱼儿':'fish','金鱼':'fish','大鱼':'fish',
  '鸟':'bird','鳥':'bird','鸟儿':'bird','小鸟':'bird','飞鸟':'bird',
  '水':'water','海':'water','河':'water','雨':'water','海水':'water','大海':'water','下雨':'water','洪水':'water','水灾':'water','湖':'water','瀑布':'water','河流':'water',
  '火':'fire','火焰':'fire','大火':'fire','着火':'fire','火灾':'fire','烈火':'fire','火苗':'fire',
  '山':'mountain','高山':'mountain','山峰':'mountain','山岭':'mountain','大山':'mountain',
  '彩虹':'rainbow','虹':'rainbow',
  '闪电':'lightning','雷':'lightning','雷电':'lightning','打雷':'lightning','雷声':'lightning','暴风雨':'lightning',
  '月':'moon','月亮':'moon','月光':'moon','明月':'moon','满月':'moon',
  '金':'gold','钱':'gold','金子':'gold','黄金':'gold','财':'gold','财富':'gold','发财':'gold','金钱':'gold','钞票':'gold','钱财':'gold','金币':'gold',
  '宝石':'gems','钻石':'gems','珠宝':'gems','翡翠':'gems','水晶':'gems','宝玉':'gems',
  '车':'car','汽车':'car','轿车':'car','跑车':'car','开车':'car',
  '房':'house','房子':'house','家':'house','房屋':'house','屋子':'house','楼房':'house','别墅':'house','新房':'house',
  '婚礼':'wedding','结婚':'wedding','婚宴':'wedding','新娘':'wedding','嫁':'wedding','娶':'wedding','喜事':'wedding',
  '宝宝':'baby','婴儿':'baby','婴孩':'baby','小宝宝':'baby',
  '祖先':'ancestor','祖宗':'ancestor','先人':'ancestor','已故':'ancestor','爷爷':'ancestor','奶奶':'ancestor','外公':'ancestor','外婆':'ancestor',
  '陌生人':'stranger','生人':'stranger',
  '明星':'celebrity','名人':'celebrity','偶像':'celebrity','艺人':'celebrity',
  '小孩':'child','儿童':'child','小朋友':'child','孩童':'child','孩子':'child',
  '爱人':'lover','情人':'lover','老公':'lover','老婆':'lover','男友':'lover','女友':'lover','恋人':'lover','伴侣':'lover','男朋友':'lover','女朋友':'lover',
  '老板':'boss','上司':'boss','经理':'boss','领导':'boss','主管':'boss',
}

const MOOD_KW = {
  // English
  lucky:'lucky', luck:'lucky', fortunate:'lucky',
  hopeful:'hopeful', hope:'hopeful', optimistic:'hopeful',
  dreamy:'dreamy', daydream:'dreamy',
  adventurous:'adventurous', adventure:'adventurous', brave:'adventurous', daring:'adventurous',
  calm:'calm', relaxed:'calm', serene:'calm', chill:'calm',
  excited:'excited', happy:'excited', joyful:'excited', energetic:'excited', great:'excited',
  spiritual:'spiritual',
  grateful:'grateful', thankful:'grateful', gratitude:'grateful',
  confident:'confident', sure:'confident', bold:'confident',
  romantic:'romantic', loving:'romantic',
  anxious:'anxious', worried:'anxious', nervous:'anxious', stressed:'anxious', stress:'anxious',
  blessed:'blessed', bless:'blessed',
  nostalgic:'nostalgic',
  determined:'determined', focused:'determined', motivated:'determined',
  peaceful:'peaceful',
  mysterious:'mysterious', mystery:'mysterious', curious:'mysterious',
  // Mandarin
  '幸运':'lucky','運氣':'lucky','运气':'lucky','好运':'lucky','走运':'lucky','幸運':'lucky','旺':'lucky',
  '希望':'hopeful','盼望':'hopeful','乐观':'hopeful','期待':'hopeful',
  '梦幻':'dreamy','梦想':'dreamy','幻想':'dreamy','发梦':'dreamy',
  '冒险':'adventurous','勇敢':'adventurous','大胆':'adventurous','探险':'adventurous',
  '平静':'calm','放松':'calm','冷静':'calm','安静':'calm','淡定':'calm',
  '兴奋':'excited','开心':'excited','快乐':'excited','高兴':'excited','激动':'excited','兴奋':'excited',
  '灵性':'spiritual','修行':'spiritual',
  '感恩':'grateful','感激':'grateful','感谢':'grateful',
  '自信':'confident','有信心':'confident',
  '浪漫':'romantic','爱情':'romantic',
  '焦虑':'anxious','担心':'anxious','紧张':'anxious','不安':'anxious','忧虑':'anxious','压力':'anxious',
  '幸福':'blessed','有福':'blessed','福气':'blessed','蒙福':'blessed',
  '怀念':'nostalgic','思念':'nostalgic','怀旧':'nostalgic','想念':'nostalgic',
  '坚定':'determined','专注':'determined','决心':'determined','坚决':'determined',
  '和平':'peaceful','平和':'peaceful','宁静':'peaceful','安宁':'peaceful',
  '神秘':'mysterious','好奇':'mysterious',
}

const HOROSCOPE_KW = {
  aries:'aries', taurus:'taurus', gemini:'gemini', twins:'gemini',
  cancer:'cancer', leo:'leo', lion:'leo', virgo:'virgo',
  libra:'libra', scales:'libra', scorpio:'scorpio', scorpion:'scorpio',
  sagittarius:'sagittarius', sagittarian:'sagittarius', archer:'sagittarius',
  capricorn:'capricorn', capricornus:'capricorn', aquarius:'aquarius', pisces:'pisces',
  '白羊':'aries','牡羊':'aries','金牛':'taurus','双子':'gemini','雙子':'gemini',
  '巨蟹':'cancer','狮子':'leo','獅子':'leo','处女':'virgo','處女':'virgo',
  '天秤':'libra','天平':'libra','天蝎':'scorpio','天蠍':'scorpio',
  '射手':'sagittarius','人马':'sagittarius','摩羯':'capricorn','魔羯':'capricorn',
  '水瓶':'aquarius','宝瓶':'aquarius','双鱼':'pisces','雙魚':'pisces',
}

const GAME_KW = {
  // 4D
  '4d':'4d', '4-d':'4d', '4 d':'4d',
  'four d':'4d', 'four dee':'4d', 'four digit':'4d', 'four digits':'4d',
  'for d':'4d', 'for dee':'4d', 'ford':'4d',
  '四维':'4d','四維':'4d',
  // TOTO
  'toto':'toto', 'lotto':'toto', 'lottery':'toto',
  'to to':'toto', 'toe toe':'toto',
  '多多':'toto','多多博彩':'toto',
  // Both
  'both':'both', 'all':'both', 'everything':'both',
  '两个都':'both','兩個都':'both','全部':'both','都要':'both','全都':'both','两个':'both','兩個':'both',
}

// ── Pre-processing normaliser ─────────────────────────────────────────────────
// Converts common zh-CN speech-recognition manglings into canonical forms.
// Order matters: handle game words BEFORE Chinese-number conversion so phrases
// like 两个 (both) aren't broken into 2个.

function normalizeTranscript(raw) {
  let s = raw

  // 4D — Chinese "four" or Arabic 4 followed by any D-sound character
  s = s.replace(/四\s*[dD地迪底弟的帝第得低滴嘀啲提题]/g, '4d')
  s = s.replace(/4\s*[地迪底弟的帝第得低滴嘀啲提题]/g, '4d')
  // 4D — English phonetic mishearings
  s = s.replace(/\bford\b/gi, '4d')
  s = s.replace(/\bfor\s+d(ee)?\b/gi, '4d')
  s = s.replace(/\bfour\s+d(ee)?\b/gi, '4d')
  s = s.replace(/\b4\s+d(ee)?\b/gi, '4d')

  // TOTO — phonetic variants (do this before any number work)
  s = s.replace(/\bto\s+to\b/gi, 'toto')
  s = s.replace(/妥妥|拖拖|托托|多托|佗佗|哆哆|多度|多朵|多多多/g, 'toto')

  // BOTH — handle multi-char "both" phrases BEFORE number conversion so 两 survives
  s = s.replace(/两个都|兩個都|全部都|全都|两个|兩個/g, ' both ')

  // Chinese number words → Arabic digits (helps 4D etc.). Safe: no keyword
  // above contains these characters.
  s = s.replace(/四/g, '4').replace(/[一壹]/g, '1').replace(/[二贰貳]/g, '2')
       .replace(/[三叁參]/g, '3').replace(/[五伍]/g, '5').replace(/[六陆陸]/g, '6')
       .replace(/[七柒]/g, '7').replace(/[八捌]/g, '8').replace(/[九玖]/g, '9')

  return s.toLowerCase()
}

// ── Matching ───────────────────────────────────────────────────────────────────
// CJK keys: substring match (Chinese has no word spaces).
// Latin keys: whole-word match (avoids false positives like "all" in "ball").

function escapeRe(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function isCJK(str) {
  return /[一-鿿]/.test(str)
}

function keyHit(key, lower) {
  if (isCJK(key)) return lower.includes(key)
  return new RegExp(`(^|[^a-z0-9])${escapeRe(key)}([^a-z0-9]|$)`, 'i').test(lower)
}

function firstMatch(map, lower) {
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) if (keyHit(key, lower)) return map[key]
  return null
}

function allMatches(map, lower) {
  const found = new Set()
  const keys = Object.keys(map).sort((a, b) => b.length - a.length)
  for (const key of keys) if (keyHit(key, lower)) found.add(map[key])
  return [...found]
}

// ── Main parser ───────────────────────────────────────────────────────────────

export function parseVoiceInput(transcript) {
  const lower = normalizeTranscript(transcript)

  const zodiacId    = firstMatch(ZODIAC_KW, lower)
  const zodiac      = zodiacId ? CHINESE_ZODIAC.find(z => z.id === zodiacId) || null : null

  const horoscopeId = firstMatch(HOROSCOPE_KW, lower)
  const horoscope   = horoscopeId ? WESTERN_ZODIAC.find(z => z.id === horoscopeId) || null : null

  const dreamIds    = allMatches(DREAM_KW, lower)
  const dreams      = dreamIds.map(id => ALL_DREAMS.find(d => d.id === id)).filter(Boolean)

  const moodId      = firstMatch(MOOD_KW, lower)
  const mood        = moodId ? moods.find(m => m.id === moodId) || null : null

  const gameType    = firstMatch(GAME_KW, lower)

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
    '我属龙，感觉很幸运',
    '我梦见了水和黄金',
    '帮我生成多多号码',
    '我是天蝎座，梦见了火',
  ],
}
