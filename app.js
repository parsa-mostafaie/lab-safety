// داده‌ها و کلیدواژه‌های هوشمند
const symbols = [
    { id: 1, name: 'سمی', keywords: ['سم'], image: 'toxic.png' },
    { id: 2, name: 'مواد خورنده', keywords: ['خورنده'], image: 'corrosive.png' },
    { id: 3, name: 'مواد آتش زا', keywords: ['آتش'], image: 'flammable.png' },
    { id: 4, name: 'اکسید کننده', keywords: ['اکسید'], image: 'oxidizing.png' },
    { id: 5, name: 'خطر انفجار', keywords: ['انفجار'], image: 'explosive.png' },
    { id: 6, name: 'تهدید زیستی', keywords: ['زیستی', 'بیولوژیک'], image: 'biohazard.png' },
    { id: 7, name: 'خطرناک برای محیط زیست', keywords: ['محیط', 'زیست'], image: 'environmental.png' },
    { id: 8, name: 'هشدار عمومی', keywords: ['هشدار', 'احتیاط'], image: 'warning.png' },
    { id: 9, name: 'محرک', keywords: ['محرک'], image: 'irritant.png' },
    { id: 10, name: 'سطح بسیار داغ', keywords: ['داغ', 'گرما'], image: 'hot_surface.png' },
    { id: 11, name: 'خطر تابش لیزر', keywords: ['لیزر'], image: 'laser.png' },
    { id: 12, name: 'خطر تابش های نوری', keywords: ['نوری', 'نور'], image: 'light_radiation.png' },
    { id: 13, name: 'ولتاژ بالا', keywords: ['ولتاژ', 'برق', 'الکتریسیته'], image: 'high_voltage.png' },
    { id: 14, name: 'اشعه غیر یونیزه کننده', keywords: ['یونیزه'], image: 'non_ionizing.png' },
    { id: 15, name: 'خطر تابش', keywords: ['تابش'], image: 'radiation.png' },
    { id: 16, name: 'میدان مغناطیس قوی', keywords: ['مغناطیس', 'مگنت'], image: 'magnetic_field.png' },
    { id: 17, name: 'دمای پایین', keywords: ['پایین', 'سرما'], image: 'low_temp.png' }
];

// لیست فیلترهای عجیب و غریب و رندوم
const filters = [
    'blur(2px) contrast(150%)',
    'hue-rotate(90deg) saturate(300%)',
    'invert(1) sepia(1)',
    'brightness(50%) contrast(200%)',
    'blur(1px) drop-shadow(0 0 10px red)',
    'grayscale(100%) invert(1)',
    'hue-rotate(180deg) saturate(200%)',
    'contrast(50%) blur(0.5px)',
    'sepia(1) contrast(200%)',
    'rotate(5deg) scale(1.1)'
];

let currentQuestion = null;
let correctCount = 0;
let wrongCount = 0;
let isAnswered = false;
let pool = [];
let autoTimer = null;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function showToast(message, type = 'info', duration = 4000) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = 'show ' + type;

    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => {
        toast.className = '';
    }, duration);
}

function applyRandomFilter() {
    const img = document.getElementById('symbolImg');
    const isChecked = document.getElementById('filterToggle').checked;

    if (isChecked) {
        const randomFilter = filters[Math.floor(Math.random() * filters.length)];
        img.style.filter = randomFilter;
    } else {
        img.style.filter = 'none';
    }
}

function toggleFilter() {
    applyRandomFilter();
}

function loadQuestion() {
    clearTimeout(autoTimer);

    if (pool.length === 0) pool = shuffle([...symbols]);
    if (pool.length === 0) {
        showToast("🎉 پایان آزمون! شما همه علامت‌ها را دیدید.", "success", 5000);
        document.getElementById('checkBtn').classList.add('disabled');
        document.getElementById('answerInput').disabled = true;
        return;
    }

    currentQuestion = pool.pop();
    isAnswered = false;

    const img = document.getElementById('symbolImg');
    img.src = 'images/' + currentQuestion.image;
    img.onerror = function () {
        this.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48cG9seWdvbiBwb2ludHM9IjEwMCwyMCAxODAsMTgwIDIwLDE4MCIgZmlsbD0iI0ZGRDcwMCIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjYiLz48dGV4dCB4PSIxMDAiIHk9IjExMCIgZm9udC1zaXplPSI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzAwMCIgZm9udC13ZWlnaHQ9ImJvbGQiPiE8L3RleHQ+PC9zdmc+';
    };
    applyRandomFilter();

    document.getElementById('answerInput').value = '';
    document.getElementById('answerInput').disabled = false;
    document.getElementById('checkBtn').classList.remove('disabled');
    document.getElementById('answerInput').focus();

    updateScore();
}

function checkAnswer() {
    if (isAnswered) return;
    const input = document.getElementById('answerInput');
    let userAnswer = input.value.trim();

    if (!userAnswer) {
        showToast("لطفاً نام علامت را تایپ کنید!", "error", 2500);
        return;
    }

    const normalize = (str) => str.replace(/\s/g, '').toLowerCase();
    const normalizedUserAnswer = normalize(userAnswer);
    const normalizedCorrectName = normalize(currentQuestion.name);

    let isCorrect = normalizedCorrectName == normalizedUserAnswer;
    //if (normalizedCorrectName.includes(normalizedUserAnswer) || normalizedUserAnswer.includes(normalizedCorrectName)) {
    //    isCorrect = true;
    //} else {
    // بررسی کلمات کلیدی
    //    for (let keyword of currentQuestion.keywords) {
    //        if (normalize(keyword).includes(normalizedUserAnswer) || normalizedUserAnswer.includes(normalize(keyword))) {
    //            isCorrect = true;
    //            break;
    //        }
    //    }
    //}

    // پردازش نتیجه
    if (isCorrect) {
        correctCount++;
        showToast(`✅ کاملاً درست! شما پاسخ صحیح "${currentQuestion.name}" را تشخیص دادید. انتقال به سوال بعدی در ۵ ثانیه...`, "success", 5000);
        isAnswered = true;
        document.getElementById('checkBtn').classList.add('disabled');
        document.getElementById('answerInput').disabled = true;

        // شروع تایمر 5 ثانیه‌ای
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
            loadQuestion();
        }, 5000);
    } else {
        wrongCount++;
        showToast(`❌ پاسخ شما نادرست است. پاسخ صحیح "${currentQuestion.name}" بود. دوباره تلاش کنید یا دکمه شروع مجدد را بزنید.`, "error", 4000);
        input.focus();
        input.select();
    }
    updateScore();
}

function resetGame() {
    clearTimeout(autoTimer);
    correctCount = 0;
    wrongCount = 0;
    pool = [];
    document.getElementById('checkBtn').classList.remove('disabled');
    document.getElementById('answerInput').disabled = false;
    showToast("بازی مجدداً شروع شد!", "info", 2000);
    loadQuestion();
}

function updateScore() {
    const total = correctCount + wrongCount;
    document.getElementById('correctDisplay').textContent = correctCount;
    document.getElementById('wrongDisplay').textContent = wrongCount;
    let percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    document.getElementById('percentDisplay').textContent = percent + '%';
}

document.getElementById('answerInput').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('checkBtn').click();
    }
});

window.onload = function () {
    resetGame();
    showToast('تهیه‌کننده: پارسا مصطفائی', type="success")
};
