export const LANGUAGE_CATALOG = [
  { code: 'uk', locale: 'uk-UA', name: 'Українська', flag: '🇺🇦' },
  { code: 'en', locale: 'en-US', name: 'English', flag: '🇬🇧' },
  { code: 'pl', locale: 'pl-PL', name: 'Polski', flag: '🇵🇱' },
  { code: 'de', locale: 'de-DE', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', locale: 'fr-FR', name: 'Français', flag: '🇫🇷' },
  { code: 'es', locale: 'es-ES', name: 'Español', flag: '🇪🇸' },
  { code: 'it', locale: 'it-IT', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', locale: 'pt-PT', name: 'Português', flag: '🇵🇹' },
  { code: 'nl', locale: 'nl-NL', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'cs', locale: 'cs-CZ', name: 'Čeština', flag: '🇨🇿' },
  { code: 'sk', locale: 'sk-SK', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'ro', locale: 'ro-RO', name: 'Română', flag: '🇷🇴' },
  { code: 'hu', locale: 'hu-HU', name: 'Magyar', flag: '🇭🇺' },
  { code: 'tr', locale: 'tr-TR', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv', locale: 'sv-SE', name: 'Svenska', flag: '🇸🇪' },
  { code: 'no', locale: 'nb-NO', name: 'Norsk', flag: '🇳🇴' },
  { code: 'da', locale: 'da-DK', name: 'Dansk', flag: '🇩🇰' },
  { code: 'fi', locale: 'fi-FI', name: 'Suomi', flag: '🇫🇮' },
  { code: 'ja', locale: 'ja-JP', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', locale: 'ko-KR', name: '한국어', flag: '🇰🇷' },
  { code: 'zh', locale: 'zh-CN', name: '中文', flag: '🇨🇳' },
  { code: 'ar', locale: 'ar-SA', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', locale: 'hi-IN', name: 'हिन्दी', flag: '🇮🇳' },
];

export function language(code) {
  return LANGUAGE_CATALOG.find(item => item.code === code) || LANGUAGE_CATALOG[0];
}

export function courseKey(source, target) {
  return `${source}-${target}`;
}

export function normalizeQuestion(question) {
  return {
    type: question.type || 'choice',
    q: String(question.q || ''),
    options: Array.isArray(question.options) ? question.options : [],
    answer: String(question.answer || ''),
    sourceText: question.sourceText || null,
    targetText: question.targetText || null,
    audioLanguage: question.audioLanguage || null,
  };
}

export function normalizeLesson(lesson, index) {
  return {
    id: lesson.id ?? index + 1,
    unit: lesson.unit || 'Basics',
    title: lesson.title || `Lesson ${index + 1}`,
    icon: lesson.icon || '📘',
    xp: lesson.xp || 20,
    questions: (lesson.questions || []).map(normalizeQuestion),
  };
}

export function buildCourse({ id, source, target, title, level = 'A1', lessons = [] }) {
  return {
    id: id || courseKey(source, target),
    source,
    target,
    title: title || `${language(source).name} → ${language(target).name}`,
    level,
    lessons: lessons.map(normalizeLesson),
  };
}

export function getCourse(courses, source, target) {
  return courses[courseKey(source, target)] || null;
}

export function getAvailableTargets(courses, source) {
  return Object.values(courses)
    .filter(course => course.source === source)
    .map(course => course.target);
}

export function getAudioLanguage(text, preferredLanguage) {
  if (preferredLanguage) return language(preferredLanguage).locale;
  const value = String(text || '');
  if (/^[\u0400-\u04FF]/.test(value)) return 'uk-UA';
  return 'en-US';
}
