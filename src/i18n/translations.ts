import type { Locale } from "../game/types";

type TranslationKey =
  | "play"
  | "levels"
  | "stats"
  | "settings"
  | "mode"
  | "goal"
  | "hints"
  | "balance"
  | "bestTime"
  | "mistakes"
  | "stars"
  | "reset"
  | "hint"
  | "check"
  | "undo"
  | "howToPlay"
  | "howToPlayBody"
  | "noBest"
  | "language"
  | "theme"
  | "light"
  | "dark"
  | "resetProgress"
  | "resetProgressConfirm"
  | "cancel"
  | "delete"
  | "progressReset"
  | "selected"
  | "completed"
  | "chooseLevel"
  | "ready"
  | "hintApplied"
  | "alreadySolved"
  | "noHintsLeft"
  | "tryAgain"
  | "boardReset"
  | "dailyBoxiq"
  | "dailyStreak"
  | "todayScore"
  | "tutorialTitle"
  | "tutorialStepBalance"
  | "tutorialStepRelations"
  | "tutorialStepCheck"
  | "tutorialStepFillTitle"
  | "tutorialStepFillBody"
  | "tutorialStepEqualTitle"
  | "tutorialStepEqualBody"
  | "tutorialStepCrossTitle"
  | "tutorialStepCrossBody"
  | "tutorialStepCheckTitle"
  | "tutorialStepCheckBody"
  | "gotIt"
  | "next"
  | "later"
  | "back"
  | "skip"
  | "start"
  | "watchTutorial"
  | "firstGuide"
  | "localPlay"
  | "noAccountPlay"
  | "localProgressSaved"
  | "dailyPuzzle"
  | "statsTracked"
  | "privacySupportReady"
  | "filledCell"
  | "hollowCell"
  | "sameClue"
  | "differentClue"
  | "achievements"
  | "firstSolve"
  | "flawless"
  | "underMinute"
  | "noHint"
  | "sevenDayStreak"
  | "soundEffects"
  | "haptics"
  | "timer"
  | "instantFeedback"
  | "instantFeedbackBody"
  | "mistakeLimit"
  | "relaxed"
  | "normal"
  | "hard"
  | "colorBlindMode"
  | "dailyReminder"
  | "dailyReminderTitle"
  | "dailyReminderBody"
  | "undoApplied"
  | "resetBoardConfirm"
  | "resetBoardQuestion"
  | "mistakeLimitReached"
  | "mistakeLimitFailed"
  | "today"
  | "todayCompleted"
  | "todayNone"
  | "todayPrompt"
  | "thisWeekSolved"
  | "difficultyProgress"
  | "mistakeLimitBodyRelaxed"
  | "mistakeLimitBodyNormal"
  | "mistakeLimitBodyHard"
  | "continueLevel"
  | "results"
  | "nextLevel"
  | "replay"
  | "openLevels"
  | "close"
  | "newBest"
  | "completedTitleSuffix"
  | "noHintsUsed"
  | "dailyCompleted"
  | "tomorrowPuzzle"
  | "completedLevels"
  | "totalStars"
  | "completionRate"
  | "hintless"
  | "bestSingle"
  | "bestDaily"
  | "streakBest"
  | "records"
  | "lastSevenDays"
  | "game"
  | "appearance"
  | "accessibility"
  | "notifications"
  | "data"
  | "about"
  | "version"
  | "privacyPolicy"
  | "support"
  | "aboutBody"
  | "resetProgressBody"
  | "open";

export const translations: Record<Locale, Record<TranslationKey, string>> = {
  en: {
    play: "Play",
    levels: "Levels",
    stats: "Stats",
    settings: "Settings",
    mode: "Mode",
    goal: "Goal",
    hints: "Hints",
    balance: "Balance",
    bestTime: "Best time",
    mistakes: "Mistakes",
    stars: "Stars",
    reset: "Reset",
    hint: "Hint",
    check: "Check",
    undo: "Undo",
    howToPlay: "How to Play",
    howToPlayBody:
      "Keep each row and column balanced. Never let three matching symbols touch in a line.",
    noBest: "None",
    language: "Language",
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    resetProgress: "Reset progress",
    resetProgressConfirm: "Delete all saved best times, stars, and completed levels?",
    cancel: "Cancel",
    delete: "Delete",
    progressReset: "Progress reset.",
    selected: "Selected",
    completed: "Completed",
    chooseLevel: "Choose a level",
    ready: "Fill the board, then check your solution.",
    hintApplied: "Hint placed. One square now matches the solution.",
    alreadySolved: "This level is already solved.",
    noHintsLeft: "No hint needed. Every editable square already matches.",
    tryAgain: "Not yet. Check the highlighted rules and try again.",
    boardReset: "Board reset. Fresh eyes, fresh start.",
    dailyBoxiq: "Today's Boxiq",
    dailyStreak: "Daily streak",
    todayScore: "Today",
    tutorialTitle: "First Boxiq",
    tutorialStepBalance: "Place filled and hollow circles so every row and column has a 3 + 3 balance.",
    tutorialStepRelations: "= means neighbors match. × means neighbors are opposite.",
    tutorialStepCheck: "Use Check when the board is full. Hints help, but they lower your star score.",
    tutorialStepFillTitle: "Place the circles",
    tutorialStepFillBody: "Tap a square to cycle empty, filled, and hollow until the row starts to balance.",
    tutorialStepEqualTitle: "Read the = clue",
    tutorialStepEqualBody: "= means both neighboring squares must show the same symbol.",
    tutorialStepCrossTitle: "Read the × clue",
    tutorialStepCrossBody: "× means the two neighboring squares must be opposite.",
    tutorialStepCheckTitle: "Check the board",
    tutorialStepCheckBody: "Fill every square first, then use Check to confirm the whole logic pattern.",
    gotIt: "Got it",
    next: "Next",
    later: "Later",
    back: "Back",
    skip: "Skip",
    start: "Start",
    watchTutorial: "View tutorial",
    firstGuide: "First level guide",
    localPlay: "Local play",
    noAccountPlay: "Play without an account",
    localProgressSaved: "Progress is saved on this device.",
    dailyPuzzle: "A fresh daily puzzle is always ready.",
    statsTracked: "Stats and streaks stay local for now.",
    privacySupportReady: "Privacy policy and support are ready in Settings.",
    filledCell: "Filled cell",
    hollowCell: "Hollow cell",
    sameClue: "Must match",
    differentClue: "Must differ",
    achievements: "Achievements",
    firstSolve: "First solve",
    flawless: "Flawless",
    underMinute: "Under a minute",
    noHint: "No hint",
    sevenDayStreak: "7-day streak",
    soundEffects: "Sound effects",
    haptics: "Haptics",
    timer: "Timer",
    instantFeedback: "Instant feedback",
    instantFeedbackBody: "Show soft warnings when a move already breaks a visible rule.",
    mistakeLimit: "Mistake limit",
    relaxed: "Relaxed",
    normal: "Normal",
    hard: "Hard",
    colorBlindMode: "Color blind mode",
    dailyReminder: "Daily reminder",
    dailyReminderTitle: "Today's Boxiq is ready",
    dailyReminderBody: "A fresh daily logic puzzle is waiting for your next calm round.",
    undoApplied: "One move undone.",
    resetBoardConfirm: "Are you sure you want to reset this board?",
    resetBoardQuestion: "Reset this board and lose the current attempt?",
    mistakeLimitReached: "Mistake limit reached. The board has been reset.",
    mistakeLimitFailed: "Too many mistakes. Try the level again.",
    today: "Today",
    todayCompleted: "Completed",
    todayNone: "None",
    todayPrompt: "You have not solved a puzzle today yet. Start a calm round now.",
    thisWeekSolved: "Solved this week",
    difficultyProgress: "By difficulty",
    mistakeLimitBodyRelaxed: "Relaxed: unlimited mistakes",
    mistakeLimitBodyNormal: "Normal: 3 mistakes",
    mistakeLimitBodyHard: "Hard: 1 mistake",
    continueLevel: "Continue",
    results: "Results",
    nextLevel: "Next level",
    replay: "Replay",
    openLevels: "Levels",
    close: "Close",
    newBest: "New best",
    completedTitleSuffix: "completed",
    noHintsUsed: "No hints used",
    dailyCompleted: "Today's Boxiq is complete",
    tomorrowPuzzle: "A new daily puzzle unlocks tomorrow.",
    completedLevels: "Completed",
    totalStars: "Total stars",
    completionRate: "Completion",
    hintless: "Hintless",
    bestSingle: "Best time",
    bestDaily: "Best daily",
    streakBest: "Longest streak",
    records: "Records",
    lastSevenDays: "Last 7 days",
    game: "Game",
    appearance: "Appearance",
    accessibility: "Accessibility",
    notifications: "Notifications",
    data: "Data",
    about: "About",
    version: "Version",
    privacyPolicy: "Privacy Policy",
    support: "Support",
    aboutBody: "Made for calm daily logic practice.",
    resetProgressBody: "Completed levels, stars, and statistics will be deleted. Your settings stay.",
    open: "Open"
  },
  tr: {
    play: "Oyna",
    levels: "Seviyeler",
    stats: "İstatistikler",
    settings: "Ayarlar",
    mode: "Mod",
    goal: "Hedef",
    hints: "İpuçları",
    balance: "Denge",
    bestTime: "En iyi süre",
    mistakes: "Hata",
    stars: "Yıldız",
    reset: "Sıfırla",
    hint: "İpucu",
    check: "Kontrol",
    undo: "Geri Al",
    howToPlay: "Nasıl Oynanır",
    howToPlayBody:
      "Her satır ve sütunda dengeyi kur. Aynı sembolden üç tane bir çizgide yan yana gelmesin.",
    noBest: "Yok",
    language: "Dil",
    theme: "Tema",
    light: "Açık",
    dark: "Koyu",
    resetProgress: "İlerlemeyi sıfırla",
    resetProgressConfirm: "Tüm en iyi süreler, yıldızlar ve tamamlanan seviyeler silinsin mi?",
    cancel: "Vazgeç",
    delete: "Sil",
    progressReset: "İlerleme sıfırlandı.",
    selected: "Seçili",
    completed: "Tamamlandı",
    chooseLevel: "Bir seviye seç",
    ready: "Tahtayı doldur, sonra çözümünü kontrol et.",
    hintApplied: "İpucu yerleştirildi. Bir kutu artık çözümle eşleşiyor.",
    alreadySolved: "Bu seviye zaten çözüldü.",
    noHintsLeft: "İpucuna gerek yok. Tüm değişebilir kutular doğru.",
    tryAgain: "Henüz değil. Kuralları kontrol edip tekrar dene.",
    boardReset: "Tahta sıfırlandı. Temiz bir başlangıç.",
    dailyBoxiq: "Günün Boxiq'i",
    dailyStreak: "Günlük seri",
    todayScore: "Bugün",
    tutorialTitle: "İlk Boxiq",
    tutorialStepBalance: "Her satır ve sütunda 3 dolu + 3 boş halka olacak şekilde yerleştir.",
    tutorialStepRelations: "= komşular aynı demek. × komşular farklı demek.",
    tutorialStepCheck: "Tahta dolunca Kontrol'e bas. İpuçları yardım eder ama yıldızı azaltır.",
    tutorialStepFillTitle: "Daireleri yerleştir",
    tutorialStepFillBody: "Bir kutuya dokunarak boş, dolu ve boş halka arasında geçiş yap. Dengeyi böyle kurarsın.",
    tutorialStepEqualTitle: "= ipucunu oku",
    tutorialStepEqualBody: "= yan yana iki kutunun aynı sembolü taşıması gerektiğini anlatır.",
    tutorialStepCrossTitle: "× ipucunu oku",
    tutorialStepCrossBody: "× yan yana iki kutunun farklı olması gerektiğini anlatır.",
    tutorialStepCheckTitle: "Kontrol et",
    tutorialStepCheckBody: "Önce tüm kutuları doldur, sonra Kontrol ile tüm mantık zincirini doğrula.",
    gotIt: "Anladım",
    next: "Devam",
    later: "Sonra",
    back: "Geri",
    skip: "Geç",
    start: "Başla",
    watchTutorial: "Tutorial'ı aç",
    firstGuide: "İlk seviye rehberi",
    localPlay: "Yerel oyun",
    noAccountPlay: "Hesapsız oyna",
    localProgressSaved: "İlerleme bu cihazda kaydedilir.",
    dailyPuzzle: "Her gün yeni günlük bulmaca hazırdır.",
    statsTracked: "İstatistikler ve seriler şimdilik yerelde kalır.",
    privacySupportReady: "Gizlilik ve destek bağlantıları Ayarlar'da hazır.",
    filledCell: "Dolu hücre",
    hollowCell: "Boş halka",
    sameClue: "Aynı olmalı",
    differentClue: "Farklı olmalı",
    achievements: "Başarımlar",
    firstSolve: "İlk çözüm",
    flawless: "Hatasız",
    underMinute: "1 dakikanın altında",
    noHint: "İpucusuz",
    sevenDayStreak: "7 günlük seri",
    soundEffects: "Ses efektleri",
    haptics: "Titreşim",
    timer: "Zamanlayıcı",
    instantFeedback: "Anlık uyarı",
    instantFeedbackBody: "Bir hamle görünür bir kuralı bozuyorsa yumuşak uyarı göster.",
    mistakeLimit: "Hata limiti",
    relaxed: "Rahat",
    normal: "Normal",
    hard: "Zor",
    colorBlindMode: "Renk körü modu",
    dailyReminder: "Günlük hatırlatma",
    dailyReminderTitle: "Günün Boxiq'i hazır",
    dailyReminderBody: "Kısa bir mantık turu için yeni günlük bulmaca seni bekliyor.",
    undoApplied: "Bir hamle geri alındı.",
    resetBoardConfirm: "Tüm ilerlemeyi sıfırlamak istediğine emin misin?",
    resetBoardQuestion: "Bu tahtayı sıfırlayıp mevcut denemeyi bırakmak istiyor musun?",
    mistakeLimitReached: "Hata limiti doldu. Tahta sıfırlandı.",
    mistakeLimitFailed: "Çok fazla hata oldu. Seviyeyi tekrar dene.",
    today: "Bugün",
    todayCompleted: "Tamamlandı",
    todayNone: "Yok",
    todayPrompt: "Bugün henüz bir bulmaca çözmedin. Hemen sakin bir tur başlat.",
    thisWeekSolved: "Bu hafta çözdün",
    difficultyProgress: "Zorluğa göre",
    mistakeLimitBodyRelaxed: "Rahat: sınırsız hata",
    mistakeLimitBodyNormal: "Normal: 3 hata",
    mistakeLimitBodyHard: "Zor: 1 hata",
    continueLevel: "Devam et",
    results: "Sonuç",
    nextLevel: "Sonraki seviye",
    replay: "Tekrar oyna",
    openLevels: "Seviyeler",
    close: "Kapat",
    newBest: "Yeni rekor",
    completedTitleSuffix: "tamamlandı",
    noHintsUsed: "İpucu kullanılmadı",
    dailyCompleted: "Bugünün Boxiq'i tamamlandı",
    tomorrowPuzzle: "Yarın yeni günlük bulmaca açılır.",
    completedLevels: "Tamamlanan",
    totalStars: "Toplam yıldız",
    completionRate: "Tamamlanma",
    hintless: "İpucusuz",
    bestSingle: "En iyi süre",
    bestDaily: "En iyi günlük",
    streakBest: "En iyi seri",
    records: "Rekorlar",
    lastSevenDays: "Son 7 gün",
    game: "Oyun",
    appearance: "Görünüm",
    accessibility: "Erişilebilirlik",
    notifications: "Bildirimler",
    data: "Veri",
    about: "Hakkında",
    version: "Sürüm",
    privacyPolicy: "Gizlilik Politikası",
    support: "Destek",
    aboutBody: "Günlük sakin mantık pratiği için tasarlandı.",
    resetProgressBody: "Tamamlanan seviyeler, yıldızlar ve istatistikler silinir. Ayarların korunur.",
    open: "Aç"
  }
};

export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key];
}

export function formatTime(seconds?: number): string {
  if (seconds === undefined) {
    return "--:--";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
}
