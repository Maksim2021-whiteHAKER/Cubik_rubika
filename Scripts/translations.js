// Scripts/translations.js

let version_game = 'lite'

function getUserLanguage() {
    const browserLang = navigator.language || navigator.userLanguage;
    const langCode = browserLang.split('-')[0].toLowerCase();
    // Проверяем, поддерживаем ли мы этот язык, если нет - используем 'ru' по умолчанию
    return translations['title'] && translations['title'][langCode] ? langCode : 'ru';
}

const translations = {
    "title": {
        "ru": "Кубик-рубика 3D",
        "sr": "Рубикова коцка 3D",
        "en": "The Rubik's cube 3D",
        "es": "El cubo de Rubik 3D",
        "zh-CN": "魔方 3D",
        "fr": "Le cube de Rubik 3D",
        "de": "Der Zauberwürfel 3D",
        "ja": "ルービックキューブ 3D",
        "pt-BR": "O cubo mágico 3D",
        "ar": "مكعب روبيك 3D",
        "tr": "Rubik küpü"
    },
    "normalMode": {
        "ru": "Обычный режим",
        "sr": "Нормалан режим",
        "en": "Normal Mode",
        "es": "Modo Normal",
        "zh-CN": "普通模式",
        "fr": "Mode Normal",
        "de": "Normaler Modus",
        "ja": "通常モード",
        "pt-BR": "Modo Normal",
        "ar": "الوضع العادي",
        "tr": "Normal Mod"
    },
    "freeMode": {
        "ru": "Свободный режим",
        "sr": "Слободан режим",
        "en": "Free Mode",
        "es": "Modo Libre ",
        "zh-CN": "自由模式",
        "fr": "Modo Libre",
        "de": "Freier Modus",
        "ja": "フリーモード",
        "pt-BR": "Modo Livre",
        "ar": "الوضع الحر",
        "tr": "Serbest Mod",
    },
    "helpBtn": {
        "ru": "Помощь",
        "sr": "Помоћ",
        "en": "Help",
        "es": "Ayuda",
        "zh-CN": "帮助",
        "fr": "Aide",
        "de": "Hilfe",
        "ja": "ヘルプ",
        "pt-BR": "Ajuda",
        "ar": "مساعدة",
        "tr": "Yardım",
    },
    "settingsBtn": {
        "ru": "Настройки",
        "sr": "Подешавања",
        "en": "Settings",
        "es": "Configuración",
        "zh-CN": "设置",
        "fr": "Paramètres",
        "de": "Einstellungen",
        "ja": "設定",
        "pt-BR": "Configurações",
        "ar": "إعدادات",
        "tr": "Ayarlar",
    },
    "creatorBtn": {
        "ru": "Создатель",
        "sr": "Развијач",
        "en": "Creator",
        "es": "Desarrollador",
        "zh-CN": "開發者 / 开发人",
        "fr": "Développeur",
        "de": "Entwickler",
        "ja": "開発者",
        "pt-BR": "Desenvolvedor",
        "ar": "المطور",
        "tr": "Geliştirici",
    },
    "supportBtn": {
        "ru": "Поддержать автора",
        "sr": "Подржи аутора",
        "en": "Support the author", // Или "Donate to the author"
        "es": "Apoyar al autor",
        "zh-CN": "支持作者",
        "fr": "Soutenir l'auteur",
        "de": "Den Autor unterstützen",
        "ja": "作者を支援する",
        "pt-BR": "Apoiar o autor",
        "ar": "ادعم المؤلف",
        "tr": "Yazarı destekle"
    },
    // кнопки меню ⏫
    // модальные окна ⏬
    "congrats": {
        "ru": "🎉 Поздравляем 🎉",
        "sr": "🎉 Честитам 🎉", // Čestitam
        "en": "🎉 Congratulations 🎉",
        "es": "🎉 ¡Felicidades! 🎉",
        "zh-CN": "🎉 恭喜 🎉", // Gōngxǐ
        "fr": "🎉 Félicitations 🎉",
        "de": "🎉 Glückwunsch 🎉",
        "ja": "🎉 おめでとうございます 🎉", // Omedetō gozaimasu
        "pt-BR": "🎉 Parabéns 🎉",
        "ar": "🎉 مبروك 🎉", // Mubārak
        "tr": "🎉 Tebrikler 🎉"
    },
    "resetBtn": {
        "ru": "Собрать заново", // Исправлено "заного" на "заново"
        "sr": "Поново састави", // "Собрать заново" на сербском
        "en": "Solve Again", // Более естественный вариант для "Собрать заново" в контексте головоломки
        "es": "Resolver de nuevo", // "Собрать заново" / "Решить снова"
        "zh-CN": "重新解决", // "Решить снова"
        "fr": "Résoudre à nouveau", // "Решить снова"
        "de": "Neu lösen", // "Решить снова" / "Ново решити"
        "ja": "再解決", // "Решить снова"
        "pt-BR": "Resolver novamente", // "Решить снова"
        "ar": "حل مرة أخرى", // "Решить снова"
        "tr": "Yeniden çöz" // "Решить снова"
    },
    "BackToMenuBtn": {
        "ru": "Назад в меню",
        "sr": "Назад у мени",
        "en": "Back to Menu",
        "es": "Volver al menú",
        "zh-CN": "返回菜单",
        "fr": "Retour au menu",
        "de": "Zurück zum Menü",
        "ja": "メニューに戻る",
        "pt-BR": "Voltar ao menu",
        "ar": "العودة إلى القائمة",
        "tr": "Menüye Dön",
    },
    "helpbyCont": {
        "ru": "📚 Помощь по управлению",
        "sr": "📚 Помоћ у вези са управљањем",
        "en": "📚 Help with Controls",
        "es": "📚 Ayuda con los controles",
        "zh-CN": "📚 控制帮助",
        "fr": "📚 Aide sur les commandes",
        "de": "📚 Hilfe zu den Steuerungen",
        "ja": "📚 操作方法のヘルプ",
        "pt-BR": "📚 Ajuda com os controles",
        "ar": "📚 مساعدة في التحكم",
        "tr": "📚 Kontrollerle ilgili yardım"
    },
    "maincontrol": {
        "ru": "🛠 Основное управление 🛠",
        "sr": "🛠 Основно управљање 🛠",
        "en": "🛠 Main Controls 🛠",
        "es": "🛠 Controles principales 🛠",
        "zh-CN": "🛠 主要控制 🛠",
        "fr": "🛠 Commandes principales 🛠",
        "de": "🛠 Hauptsteuerungen 🛠",
        "ja": "🛠 メインコントロール 🛠",
        "pt-BR": "🛠 Controles principais 🛠",
        "ar": "🛠 عناصر التحكم الرئيسية 🛠",
        "tr": "🛠 Ana Kontroller 🛠"
    },
    "dls": { 
        "ru": "◽ПКМ - правая кнопка мыши, ЛКМ - левая кнопка мыши",
        "sr": "◽Десни клик - десни тастер миша, Леви клик - леви тастер миша",
        "en": "◽RMB - Right Mouse Button, LMB - Left Mouse Button",
        "es": "◽RMB - Botón Derecho del Ratón, LMB - Botón Izquierdo del Ratón",
        "zh-CN": "◽RMB - 鼠标右键, LMB - 鼠标左键",
        "fr": "◽RMB - Bouton droit de la souris, LMB - Bouton gauche de la souris",
        "de": "◽RMB - Rechte Maustaste, LMB - Linke Maustaste",
        "ja": "◽RMB - マウス右ボタン, LMB - マウス左ボタン",
        "pt-BR": "◽RMB - Botão Direito do Mouse, LMB - Botão Esquerdo do Mouse",
        "ar": "◽RMB - زر الماوس الأيمن، LMB - زر الماус الأيسر",
        "tr": "◽SAK - Sağ Fare Düğmesi, LAK - Sol Fare Düğmesi"
    },
    "dls2": {
        "ru": "◽Раскладка для горячих клавиш кнопка одна (rus/eng)",
        "sr": "◽Дугме за пречице је исто (руск/енгл)",
        "en": "◽Hotkey button is the same (rus/eng)",
        "es": "◽El botón de atajo es el mismo (rus/eng)",
        "zh-CN": "◽热键按钮相同 (rus/eng)",
        "fr": "◽Le bouton de raccourci est le même (rus/eng)",
        "de": "◽Hotkey-Taste ist dieselbe (rus/eng)",
        "ja": "◽ホットキーのボタンは同じ (rus/eng)",
        "pt-BR": "◽O botão de atalho é o mesmo (rus/eng)",
        "ar": "◽زر المفتاح السريع هو نفسه (rus/eng)",
        "tr": "◽Kısayol tuşu aynıdır (rus/eng)"
    },
    "dls3": {
        "ru": "✅ Кубик считается собранным если (верх(⬜), перед(🟩), бок(🟥))",
        "sr": "✅ Коцка је решена ако је (горе(⬜), напред(🟩), страна(🟥))",
        "en": "✅ Cube is solved if (top(⬜), front(🟩), side(🟥))",
        "es": "✅ El cubo está resuelto si (arriba(⬜), frente(🟩), lado(🟥))",
        "zh-CN": "✅ 如果（顶部(⬜), 前面(🟩), 侧面(🟥)）则魔方已解决",
        "fr": "✅ Le cube est résolu si (haut(⬜), face(🟩), côté(🟥))",
        "de": "✅ Würfel ist gelöst, wenn (oben(⬜), vorne(🟩), Seite(🟥))",
        "ja": "✅ 以下の場合キューブは解決されます (上面(⬜), 手前(🟩), 側面(🟥))",
        "pt-BR": "✅ O cubo está resolvido se (topo(⬜), frente(🟩), lado(🟥))",
        "ar": "✅ يُحل المكعب إذا كان (الأعلى(⬜)، الأمام(🟩)، الجانب(🟥))",
        "tr": "✅ Küp çözüldüyse (üst(⬜), ön(🟩), yan(🟥))"
    },
    "mcText4": {
        "ru": "ПКМ + тащить - вращение камеры (орбита вкл)",
        "sr": "Десни клик + превуци - ротација камере (орбита укљ.)",
        "en": "RMB + drag - camera rotation (orbit on)",
        "es": "RMB + arrastrar - rotación de cámara (órbita activada)",
        "zh-CN": "右键 + 拖拽 - 相能旋转 (轨道开启)",
        "fr": "Clic droit + glisser - rotation de la caméra (orbite activée)",
        "de": "RMB + ziehen - Kameradrehung (Orbit an)",
        "ja": "右クリック + ドラッグ - カメラ回転 (軌道オン)",
        "pt-BR": "Botão direito + arrastar - rotação da câmera (órbita ativada)",
        "ar": "زر الماوس الأيمن + سحب - تدوير الكاميرا (ال궤道 مفعل)",
        "tr": "SAK + sürükle - kamera döndürme (yörünge açık)"
    },
    "mcText5": {
        "ru": "Щ/o - включить/выключить орбиту",
        "sr": "Щ/O - укључи/искључи орбиту",
        "en": "Щ/O - turn orbit on/off",
        "es": "Щ/O - activar/desactivar órbita",
        "zh-CN": "Щ/O - 开启/关闭轨道",
        "fr": "Щ/O - activer/désactiver l'orbite",
        "de": "Щ/O - Orbit ein/aus",
        "ja": "Щ/O - 軌道のオン/オフ",
        "pt-BR": "Щ/O - ativar/desativar órbita",
        "ar": "Щ/O - تشغيل/إيقاف ال궤道",
        "tr": "Щ/O - yörüngeyi aç/kapat"
    },
    "mcText6": {
        "ru": "Колесико мыши - зум (орбита вкл)",
        "sr": "Точкић миша - зум (орбита укљ.)",
        "en": "Mouse wheel - zoom (orbit on)",
        "es": "Rueda del ratón - zoom (órbita activada)",
        "zh-CN": "鼠标滚轮 - 缩放 (轨道开启)",
        "fr": "Molette de la souris - zoom (orbite activée)",
        "de": "Mausrad - Zoom (Orbit an)",
        "ja": "マウスホイール - ズーム (軌道オン)",
        "pt-BR": "Roda do mouse - zoom (órbita ativada)",
        "ar": "عجلة الماوس - تكبير (ال궤道 مفعل)",
        "tr": "Fare tekerleği - yakınlaştırma (yörünge açık)"
    },
    "mcText7": {
        "ru": "K/r - сброс камеры",
        "sr": "K/r - ресет камере",
        "en": "K/r - reset camera",
        "es": "K/r - restablecer cámara",
        "zh-CN": "K/r - 重置相机",
        "fr": "K/r - réinitialiser la caméra",
        "de": "K/r - Kamera zurücksetzen",
        "ja": "K/r - カメラリセット",
        "pt-BR": "K/r - redefinir câmera",
        "ar": "K/r - إعادة تعيين الكاميرا",
        "tr": "K/r - kamerayı sıfırla"
    },
    "mcText8": {
        "ru": "C/с - автосборка в 'Свободном режиме'",
        "sr": "C/с - аутоматско решавање у 'Слободном режиму'",
        "en": "C/с - auto-solve in 'Free Mode'",
        "es": "C/с - auto-resolver en 'Modo Libre'",
        "zh-CN": "C/с - '自由模式'下的自动解决",
        "fr": "C/с - résolution automatique en 'Mode Libre'",
        "de": "C/с - automatisch lösen im 'Freien Modus'",
        "ja": "C/с - 「フリーモード」で自動解決",
        "pt-BR": "C/с - auto-resolver no 'Modo Livre'",
        "ar": "C/с - الحل التلقائي في 'الوضع الحر'",
        "tr": "C/с - 'Serbest Mod'da otomatik çözüm"
    },
    "mcText9": {
        "ru": "Ы/s - разборка кубика",
        "sr": "Ы/s - мешање коцке",
        "en": "Ы/s - scramble cube",
        "es": "Ы/s - desordenar cubo",
        "zh-CN": "Ы/s - 打乱魔方",
        "fr": "Ы/s - mélanger le cube",
        "de": "Ы/s - Würfel mischen",
        "ja": "Ы/s - キューブをシャッフル",
        "pt-BR": "Ы/s - embaralhar cubo",
        "ar": "Ы/s - خلط المكعب",
        "tr": "Ы/s - küpü karıştır"
    },
    "tm_text1": {
        "ru": "Двигайте пальцем по экрану - вращение грани в направлении движения",
        "sr": "Померајте прст по екрану - ротација стране у правцу кретања",
        "en": "Move your finger across the screen - rotate the face in the direction of movement",
        "es": "Mueva su dedo por la pantalla - gire la cara en la dirección del movimiento",
        "zh-CN": "用手指在屏幕上滑动 - 按移动方向旋转面",
        "fr": "Déplacez votre doigt sur l'écran - faites tourner la face dans la direction du mouvement",
        "de": "Bewegen Sie Ihren Finger über den Bildschirm - Drehen Sie die Seite in Bewegungsrichtung",
        "ja": "画面を指でスライド - 移動方向に面を回転",
        "pt-BR": "Mova seu dedo pela tela - gire a face na direção do movimento",
        "ar": "حرك إصبعك عبر الشاشة - دور الوجه في اتجاه الحركة",
        "tr": "Parmakla ekranı kaydır - hareket yönünde yüzü döndür"
    },
    "tm_text2": {
        "ru": "Движение пальца по оси X/Y - поворот по вертикали/горизонтали",
        "sr": "Кретање прста по X/Y оси - ротација вертикално/хоризонтално",
        "en": "Finger movement along X/Y axis - rotation vertically/horizontally",
        "es": "Movimiento del dedo a lo largo del eje X/Y - rotación vertical/horizontal",
        "zh-CN": "手指沿 X/Y 轴移动 - 垂直/水平旋转",
        "fr": "Mouvement du doigt selon l'axe X/Y - rotation verticale/horizontale",
        "de": "Fingerbewegung entlang der X/Y-Achse - Drehung vertikal/horizontal",
        "ja": "指のX/Y軸方向の移動 - 垂直/水平回転",
        "pt-BR": "Movimento do dedo ao longo do eixo X/Y - rotação vertical/horizontal",
        "ar": "حركة الإصبع على طول المحور X/Y - تدوير عمودي/أفقي",
        "tr": "Parmak hareketi X/Y ekseni boyunca - dikey/yatay döndürme"
    },
    "tm_text3": {
        "ru": "На грани сверху управление может быть инвертировано.",
        "sr": "На горњој страни контроле могу бити обрнуте.",
        "en": "Controls on the top face may be inverted.",
        "es": "Los controles en la cara superior pueden estar invertidos.",
        "zh-CN": "顶部面的控制可能被反转。",
        "fr": "Les contrôles sur la face supérieure peuvent être inversés.",
        "de": "Die Steuerung auf der oberen Seite kann invertiert sein.",
        "ja": "上面の操作が反転している場合があります。",
        "pt-BR": "Os controles na face superior podem estar invertidos.",
        "ar": "قد تكون عناصر التحكم على الوجه العلوي معكوسة.",
        "tr": "Üst yüze ait kontroller ters çevrilmiş olabilir."
    },
    "tt_text1": {
        "ru": "Нажать на экран и держать, навести палец точно на стрелки и отпустить - поворот грани",
        "sr": "Додирните екран и држите, пређите прстом тачно преко стрелица и отпустите - ротација стране",
        "en": "Tap and hold the screen, hover your finger precisely over the arrows and release - rotate the face",
        "es": "Toque y mantenga presionada la pantalla, desplace su dedo exactamente sobre las flechas y suéltelo - gire la cara",
        "zh-CN": "点击并按住屏幕，将手指精确悬停在箭头上并松开 - 旋转面",
        "fr": "Appuyez et maintenez l'écran, placez précisément votre doigt sur les flèches et relâchez - faites tourner la face",
        "de": "Tippen und halten Sie den Bildschirm, bewegen Sie Ihren Finger präzise über die Pfeile und lassen Sie los - drehen Sie die Seite",
        "ja": "画面をタップして押し続け、指を矢印の上に正確に置き、離す - 面を回転",
        "pt-BR": "Toque e segure a tela, posicione o dedo exatamente sobre as setas e solte - gire a face",
        "ar": "اضغط مع الاستمرار على الشاشة، مرر إصبعك بدقة فوق الأسهم ثم ارفعه - دور الوجه",
        "tr": "Ekrana dokunun ve basılı tutun, parmağınızı tam olarak okların üzerine getirip bırakın - yüzü döndür"
    },
    "tt_text2": {
        "ru": "Нажать на экран и держать, навести палец на шар и отпустить - поворот передней грани",
        "sr": "Додирните екран и држите, пређите прстом преко лопте и отпустите - ротација предње стране",
        "en": "Tap and hold the screen, hover your finger over the sphere and release - rotate the front face",
        "es": "Toque y mantenga presionada la pantalla, desplace su dedo sobre la esfera y suéltelo - gire la cara frontal",
        "zh-CN": "点击并按住屏幕，将手指悬停在球体上并松开 - 旋转前面",
        "fr": "Appuyez et maintenez l'écran, placez votre doigt sur la sphère et relâchez - faites tourner la face avant",
        "de": "Tippen und halten Sie den Bildschirm, bewegen Sie Ihren Finger über die Kugel und lassen Sie los - drehen Sie die Vorderseite",
        "ja": "画面をタップして押し続け、指を球の上に置き、離す - 手前を回転",
        "pt-BR": "Toque e segure a tela, posicione o dedo sobre a esfera e solte - gire a face frontal",
        "ar": "اضغط مع الاستمرار على الشاشة، مرر إصبعك فوق الكرة ثم ارفعه - دور الوجه الأمامي",
        "tr": "Ekrana dokunun ve basılı tutun, parmağınızı küre üzerine getirip bırakın - ön yüzü döndür"
    },
    "tt_text3": {
        "ru": "Стрелки - это поворот кубика полностью",
        "sr": "Стрелице - то је ротација целог коцке",
        "en": "Arrows - this rotates the entire cube",
        "es": "Flechas - esto gira todo el cubo",
        "zh-CN": "箭头 - 这会旋转整个魔方",
        "fr": "Flèches - cela fait tourner l'ensemble du cube",
        "de": "Pfeile - dadurch wird der gesamte Würfel gedreht",
        "ja": "矢印 - これによりキューブ全体が回転します",
        "pt-BR": "Setas - isso gira o cubo inteiro",
        "ar": "الأسهم - هذا يدور المكعب بالكامل",
        "tr": "Oklar - bu, tüm küpü döndürür"
    },
    "ca_text1": {
        "ru": "Зажать ПКМ и навести точно на стрелки - поворот грани (обрита выкл)",
        "sr": "Десни клик и пређите тачно преко стрелица - ротација стране (орбита искљ.)",
        "en": "Hold RMB and hover precisely over the arrows - rotate the face (orbit off)",
        "es": "Mantenga presionado el botón derecho del ratón y desplace el cursor exactamente sobre las flechas - gire la cara (órbita desactivada)",
        "zh-CN": "按住鼠标右键并精确悬停在箭头上 - 旋转面 (轨道关闭)",
        "fr": "Maintenez le clic droit et survolez précisément les flèches - faites tourner la face (orbite désactivée)",
        "de": "Halten Sie die rechte Maustaste gedrückt und bewegen Sie den Cursor präzise über die Pfeile - drehen Sie die Seite (Orbit aus)",
        "ja": "右クリックを押しながら矢印の上に正確にカーソルを合わせる - 面を回転 (軌道オフ)",
        "pt-BR": "Segure o botão direito do mouse e posicione o cursor exatamente sobre as setas - gire a face (órbita desativada)",
        "ar": "اضغط مع الاستمرار على الزر الأيمن للفأرة ومرر المؤشر بدقة فوق الأسهم - دور الوجه (ال궤道 معطل)",
        "tr": "SAK'ya basılı tutun ve imleci okların üzerine tam olarak getirin - yüzü döndür (yörünge kapalı)"
    },
    "ca_text2": {
        "ru": "Зажать ПКМ и навести на шар - поворот передней грани (орбита выкл)",
        "sr": "Десни клик и пређите преко лопте - ротација предње стране (орбита искљ.)",
        "en": "Hold RMB and hover over the sphere - rotate the front face (orbit off)",
        "es": "Mantenga presionado el botón derecho del ratón y desplace el cursor sobre la esfera - gire la cara frontal (órbita desactivada)",
        "zh-CN": "按住鼠标右键并悬停在球体上 - 旋转前面 (轨道关闭)",
        "fr": "Maintenez le clic droit et survolez la sphère - faites tourner la face avant (orbite désactivée)",
        "de": "Halten Sie die rechte Maustaste gedrückt und bewegen Sie den Cursor über die Kugel - drehen Sie die Vorderseite (Orbit aus)",
        "ja": "右クリックを押しながら球の上にカーソルを合わせる - 手前を回転 (軌道オフ)",
        "pt-BR": "Segure o botão direito do mouse e posicione o cursor sobre a esfera - gire a face frontal (órbita desativada)",
        "ar": "اضغط مع الاستمرار على الزر الأيمن للفأرة ومرر المؤشر فوق الكرة - دور الوجه الأمامي (ال궤道 معطل)",
        "tr": "SAK'ya basılı tutun ve imleci küre üzerine getirin - ön yüzü döndür (yörünge kapalı)"
    },
    "ca_text3": {
        "ru": "Стрелки на клавиатуре - это поворот кубика полностью",
        "sr": "Стрелице на тастатури - то је ротација целог коцке",
        "en": "Keyboard arrows - this rotates the entire cube",
        "es": "Flechas del teclado - esto gira todo el cubo",
        "zh-CN": "键盘箭头 - 这会旋转整个魔方",
        "fr": "Flèches du clavier - cela fait tourner l'ensemble du cube",
        "de": "Tastaturpfeile - dadurch wird der gesamte Würfel gedreht",
        "ja": "キーボードの矢印 - これによりキューブ全体が回転します",
        "pt-BR": "Setas do teclado - isso gira o cubo inteiro",
        "ar": "مفاتيح الأسهم - هذا يدور المكعب بالكامل",
        "tr": "Klavye okları - bu, tüm küpü döndürür"
    },
    "ttm_text1": {
        "ru": "Зажать ПКМ и двигать мышь - вращение грани в направлении движения",
        "sr": "Десни клик и померајте миша - ротација стране у правцу кретања",
        "en": "Hold RMB and move the mouse - rotate the face in the direction of movement",
        "es": "Mantenga presionado el botón derecho del ratón y mueva el ratón - gire la cara en la dirección del movimiento",
        "zh-CN": "按住鼠标右键并移动鼠标 - 按移动方向旋转面",
        "fr": "Maintenez le clic droit et déplacez la souris - faites tourner la face dans la direction du mouvement",
        "de": "Halten Sie die rechte Maustaste gedrückt und bewegen Sie die Maus - drehen Sie die Seite in Bewegungsrichtung",
        "ja": "右クリックを押しながらマウスを動かす - 移動方向に面を回転",
        "pt-BR": "Segure o botão direito do mouse e mova o mouse - gire a face na direção do movimento",
        "ar": "اضغط مع الاستمرار على الزر الأيمن للفأرة وحرك الفأرة - دور الوجه في اتجاه الحركة",
        "tr": "SAK'ya basılı tutun ve fareyi hareket ettirin - hareket yönünde yüzü döndür"
    },
    "ttm_text2": {
        "ru": "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        "sr": "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        "en": "Mouse movement along X/Y axis - rotation vertically/horizontally",
        "es": "Movimiento del ratón a lo largo del eje X/Y - rotación vertical/horizontal",
        "zh-CN": "鼠标沿 X/Y 轴移动 - 垂直/水平旋转",
        "fr": "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        "de": "Mausbewegung entlang der X/Y-Achse - Drehung vertikal/horizontal",
        "ja": "マウスのX/Y軸方向の移動 - 垂直/水平回転",
        "pt-BR": "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        "ar": "حركة الفأرة على طول المحور X/Y - تدوير عمودي/أفقي",
        "tr": "Fare hareketi X/Y ekseni boyunca - dikey/yatay döndürme"
    },
    "ttm_text3": {
        "ru": "Однако на грани сверху управление инвертировано вверх = низ, низ = вверх",
        "sr": "Међутим, на горњој страни контроле су обрнуте горе = доле, доле = горе",
        "en": "However, on the top face controls are inverted up = down, down = up",
        "es": "Sin embargo, en la cara superior los controles están invertidos arriba = abajo, abajo = arriba",
        "zh-CN": "但是，顶部面的控制是反转的，上 = 下，下 = 上",
        "fr": "Cependant, sur la face supérieure, les contrôles sont inversés haut = bas, bas = haut",
        "de": "Allerdings ist auf der Oberseite die Steuerung invertiert: Oben = Unten, Unten = Oben",
        "ja": "ただし、上面では操作が反転しており、上 = 下、下 = 上 になります",
        "pt-BR": "No entanto, na face superior os controles são invertidos cima = baixo, baixo = cima",
        "ar": "ومع ذلك، على الوجه العلوي تكون عناصر التحكم معكوسة للأعلى = للأسفل، للأسفل = للأعلى",
        "tr": "Ancak üst yüze ait kontroller ters çevrilmiştir: yukarı = aşağı, aşağı = yukarı"
    },
    "cmm_text1": {
        "ru": "Зажать ПКМ и двигать мышь - вращение грани в направлении движения",
        "sr": "Држати десни клик и померати миш - ротација лица у правцу кретања",
        "en": "Hold RMB and move mouse - face rotation in movement direction",
        "es": "Mantener pulsado el botón derecho y mover el ratón - rotación de la cara en la dirección del movimiento",
        "zh-CN": "按住右键并移动鼠标 - 按移动方向旋转面",
        "fr": "Maintenir le clic droit et déplacer la souris - rotation de la face dans le sens du mouvement",
        "de": "Rechte Maustaste halten und Maus bewegen - Drehung der Fläche in Bewegungsrichtung",
        "ja": "右クリックを押しながらマウスを動かす - 移動方向に応じて面を回転",
        "pt-BR": "Segurar botão direito e mover o mouse - rotação da face na direção do movimento",
        "ar": "الضغط مع الاستمرار على الزر الأيمن وتحريك الماوس - تدوير الوجه في اتجاه الحركة",
        "tr": "Sağ tuşu basılı tutun ve fareyi hareket ettirin - hareket yönünde yüz dönmesi"
    },
    "cmm_text2": {
        "ru": "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        "sr": "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        "en": "Mouse movement along X/Y axis - rotation vertically/horizontally",
        "es": "Movimiento del ratón a lo largo del eje X/Y - rotación vertical/horizontal",
        "zh-CN": "鼠标沿X/Y轴移动 - 垂直/水平旋转",
        "fr": "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        "de": "Mausbewegung entlang der X/Y-Achse - Rotation vertikal/horizontal",
        "ja": "マウスのX/Y軸方向の動き - 垂直/水平回転",
        "pt-BR": "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        "ar": "حركة الماوس على طول المحور X/Y - تدوير عمودي/أفقي",
        "tr": "Fare hareketi X/Y ekseni boyunca - dikey/yatay dönüş"
    },
    "cmm_text3": {
        "ru": "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        "sr": "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        "en": "Mouse movement along X/Y axis - rotation vertically/horizontally",
        "es": "Movimiento del ratón eje X/Y - rotación vertical/horizontal",
        "zh-CN": "鼠标沿X/Y轴移动 - 垂直/水平旋转",
        "fr": "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        "de": "Mausbewegung entlang der X/Y-Achse - Rotation vertikal/horizontal",
        "ja": "マウスのX/Y軸方向の動き - 垂直/水平回転",
        "pt-BR": "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        "ar": "حركة الماوس على طول المحور X/Y - تدوير عمودي/أفقي",
        "tr": "Fare hareketi X/Y ekseni boyunca - dikey/yatay dönüş"
    },
    "name_textures": {
        "ru": "Текстуры",
        "sr": "Текстуре",
        "en": "Textures",
        "es": "Texturas",
        "zh-CN": "纹理",
        "fr": "Textures",
        "de": "Texturen",
        "ja": "テクスチャ",
        "pt-BR": "Texturas",
        "ar": "القوالب",
        "tr": "Dokular"
    },
    "color_theme_textures": {
        "ru": "Цветовая тема",
        "sr": "Боја теме",
        "en": "Color Theme",
        "es": "Tema de color",
        "zh-CN": "色彩主题",
        "fr": "Thème de couleur",
        "de": "Farbthema",
        "ja": "カラーテーマ",
        "pt-BR": "Tema de cor",
        "ar": "سمة اللون",
        "tr": "Renk Teması"
    },
    "default": { // Для опции "По умолчанию"
        "ru": "По умолчанию",
        "sr": "Подразумевано",
        "en": "Default",
        "es": "Predeterminado",
        "zh-CN": "默认",
        "fr": "Par défaut",
        "de": "Standard",
        "ja": "デフォルト",
        "pt-BR": "Padrão",
        "ar": "الافتراضي",
        "tr": "Varsayılan"
    },
    "classic": { // Для опции "Классическая"
        "ru": "Классическая",
        "sr": "Класична",
        "en": "Classic",
        "es": "Clásico",
        "zh-CN": "经典",
        "fr": "Classique",
        "de": "Klassisch",
        "ja": "クラシック",
        "pt-BR": "Clássico",
        "ar": "كلاسيكي",
        "tr": "Klasik"
    },
    "neon": { // Для опции "Неон"
        "ru": "Неон",
        "sr": "Неон",
        "en": "Neon",
        "es": "Neón",
        "zh-CN": "霓虹",
        "fr": "Néon",
        "de": "Neon",
        "ja": "ネオン",
        "pt-BR": "Neon",
        "ar": "نيون",
        "tr": "Neon"
    },
    "monochrome": { // Для опции "Монохром"
        "ru": "Монохром",
        "sr": "Монохром",
        "en": "Monochrome",
        "es": "Monocromo",
        "zh-CN": "单色",
        "fr": "Monochrome",
        "de": "Monochrom",
        "ja": "モノクローム",
        "pt-BR": "Monocromático",
        "ar": "أحادي اللون",
        "tr": "Tek Renkli"
    },
    "name_mode": {
        "ru": "Режим управления вращения",
        "sr": "Режим контроле ротације",
        "en": "Rotation Control Mode",
        "es": "Modo de control de rotación",
        "zh-CN": "旋转控制模式",
        "fr": "Mode de contrôle de rotation",
        "de": "Rotationssteuerungsmodus",
        "ja": "回転制御モード",
        "pt-BR": "Modo de controle de rotação",
        "ar": "وضع التحكم في الدوران",
        "tr": "Döndürme Kontrol Modu"
    },
    "control_arrows": { // Для опции "Триггерами на кубе"
        "ru": "Триггерами на кубе",
        "sr": "Окидачима на коцки",
        "en": "Triggers on cube",
        "es": "Disparadores en el cubo",
        "zh-CN": "魔方上的触发器",
        "fr": "Déclencheurs sur le cube",
        "de": "Trigger auf dem Würfel",
        "ja": "キューブ上のトリガー",
        "pt-BR": "Gatilhos no cubo",
        "ar": "الزناد على المكعب",
        "tr": "Küpte tetikler"
    },
    "control_mouse_move": { // Для опции "Движением мыши"
        "ru": "Движением мыши",
        "sr": "Померањем миша",
        "en": "Mouse movement",
        "es": "Movimiento del ratón",
        "zh-CN": "鼠标移动",
        "fr": "Mouvement de la souris",
        "de": "Mausbewegung",
        "ja": "マウスの移動",
        "pt-BR": "Movimento do mouse",
        "ar": "حركة الماوس",
        "tr": "Fare hareketi"
    },
    "name_sound": {
        "ru": "Звук",
        "sr": "Звук",
        "en": "Sound",
        "es": "Sonido",
        "zh-CN": "声音",
        "fr": "Son",
        "de": "Ton",
        "ja": "音",
        "pt-BR": "Som",
        "ar": "الصوت",
        "tr": "Ses"
    },
    "music_name": {
        "ru": "Музыка",
        "sr": "Музика",
        "en": "Music",
        "es": "Música",
        "zh-CN": "音乐",
        "fr": "Musique",
        "de": "Musik",
        "ja": "音楽",
        "pt-BR": "Música",
        "ar": "الموسيقى",
        "tr": "Müzik"
    },
    "sound_name": {
        "ru": "Звук",
        "sr": "Звук",
        "en": "Sound",
        "es": "Sonido",
        "zh-CN": "音效",
        "fr": "Son",
        "de": "Ton",
        "ja": "効果音",
        "pt-BR": "Efeitos sonoros",
        "ar": "الصوت",
        "tr": "Ses"
    },
    "supportId": {
        "ru": "ПОДДЕРЖКА АВТОРА",
        "sr": "ПОДРШКА АУТОРА",
        "en": "SUPPORT AUTHOR",
        "es": "SOPORTE AL AUTOR",
        "zh-CN": "支持作者",
        "fr": "SOUTIEN À L'AUTEUR",
        "de": "AUTOR UNTERSTÜTZEN",
        "ja": "著者をサポート",
        "pt-BR": "APOIO AO AUTOR",
        "ar": "دعم المؤلف",
        "tr": "YAZARI DESTEKLE"
    },
    "supportHowHelp": {
        "ru": "Как вы можете поддержать проект:",
        "sr": "Како можете подржати пројекат:",
        "en": "How you can support the project:",
        "es": "Cómo puedes apoyar el proyecto:",
        "zh-CN": "您如何支持项目：",
        "fr": "Comment vous pouvez soutenir le projet :",
        "de": "Wie Sie das Projekt unterstützen können:",
        "ja": "プロジェクトをサポートする方法：",
        "pt-BR": "Como você pode apoiar o projeto:",
        "ar": "كيف يمكنك دعم المشروع:",
        "tr": "Projeyi nasıl destekleyebilirsiniz:"
    },
    "tellUs": {
        "ru": "Рассказать друзьям о приложении! 🗣️",
        "sr": "Реците пријатељима за апликацију! 🗣️",
        "en": "Tell friends about the app! 🗣️",
        "es": "¡Cuéntale a tus amigos sobre la aplicación! 🗣️",
        "zh-CN": "告诉朋友这个应用！ 🗣️",
        "fr": "Parlez-en à vos amis ! 🗣️",
        "de": "Erzähle Freunden von der App! 🗣️",
        "ja": "アプリについて友達に話してください！ 🗣️",
        "pt-BR": "Conte aos amigos sobre o app! 🗣️",
        "ar": "أخبر الأصدقاء عن التطبيق! 🗣️",
        "tr": "Arkadaşlarınıza uygulamadan bahsedin! 🗣️"
    },
    "thanksForSupport": {
        "ru": "Спасибо за использование приложения! Любая поддержка мотивирует на развитие проекта дальше.",
        "sr": "Хвала вам што користите апликацију! Свака подршка мотивише даљи развој пројекта.",
        "en": "Thank you for using the app! Any support motivates further development.",
        "es": "¡Gracias por usar la aplicación! Cualquier apoyo motiva el desarrollo futuro.",
        "zh-CN": "感谢您使用此应用程序！任何支持都会激励我继续开发。",
        "fr": "Merci d'utiliser l'application ! Tout soutien motive le développement futur.",
        "de": "Vielen Dank, dass Sie die App verwenden! Jede Unterstützung motiviert zur Weiterentwicklung.",
        "ja": "アプリをご利用いただきありがとうございます！ご支援は今後の開発の励みになります。",
        "pt-BR": "Obrigado por usar o app! Qualquer apoio motiva o desenvolvimento futuro.",
        "ar": "شكرًا لاستخدامك التطبيق! أي دعم يشجع على تطوير المشروع في المستقبل.",
        "tr": "Uygulamayı kullandığınız için teşekkür ederiz! Herhangi bir destek, gelecekteki gelişimi motive eder."
    },
    // --- Комплексные переводы с HTML ---
    "putStar": {
        "ru": "Поставить звезду на <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "sr": "Дајте звездицу на <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "en": "Star on <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "es": "Dar una estrella en <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "zh-CN": "在 <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> 上点赞 ⭐",
        "fr": "Donnez une étoile sur <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "de": "Stern auf <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> geben ⭐",
        "ja": "<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> でスターをつける ⭐",
        "pt-BR": "Dê uma estrela no <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "ar": "ضع نجمة على <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        "tr": "<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a>'da yıldız ver ⭐"
    },
    "financialHelpWallet": {
        "ru": "Финансовая поддержка через кошелёк (wallet) <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "sr": "Финансијска подршка преко новчаника (wallet) <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "en": "Financial support via wallet <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "es": "Apoyo financiero a través de la billetera <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "zh-CN": "通过钱包提供财务支持 <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "fr": "Soutien financier via le portefeuille <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "de": "Finanzielle Unterstützung über Wallet <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "ja": "ウォレット経由の金銭的支援 <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "pt-BR": "Apoio financeiro via carteira <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "ar": "الدعم المالي عبر المحفظة <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        "tr": "Cüzdan aracılığıyla maddi destek <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰"
    },
    "financialHelpBoosty": {
        "ru": "Финансовая поддержка: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "sr": "Финансијска подршка: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "en": "Financial support: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "es": "Apoyo financiero: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "zh-CN": "财务支持： <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "fr": "Soutien financier : <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "de": "Finanzielle Unterstützung: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "ja": "金銭的支援： <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "pt-BR": "Apoio financeiro: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "ar": "الدعم المالي: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        "tr": "Maddi destek: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰"
    },
    "financialHelpDonationAlerts": {
        "ru": "Финансовая поддержка (иностранные пользователи) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "sr": "Финансијска подршка (корисници из других земаља) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "en": "Financial support (foreign users) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "es": "Apoyo financiero (usuarios extranjeros) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "zh-CN": "财务支持（外国用户） <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "fr": "Soutien financier (utilisateurs étrangers) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "de": "Finanzielle Unterstützung (ausländische Benutzer) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "ja": "金銭的支援（海外ユーザー） <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "pt-BR": "Apoio financeiro (usuários estrangeiros) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "ar": "الدعم المالي (للمستخدمين الأجانب) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        "tr": "Maddi destek (yabancı kullanıcılar için) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰"
    },
    "reportError": {
        "ru": "Сообщить об ошибках или предложить идеи (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues на GitHub</a>)",
        "sr": "Пријавите грешке или предложите идеје (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues на GitHub</a>)",
        "en": "Report errors or suggest ideas (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues on GitHub</a>)",
        "es": "Reportar errores o sugerir ideas (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues en GitHub</a>)",
        "zh-CN": "报告错误或提出建议 (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub 上的 Issues</a>)",
        "fr": "Signaler des erreurs ou suggérer des idées (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues sur GitHub</a>)",
        "de": "Fehler melden oder Ideen vorschlagen (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues auf GitHub</a>)",
        "ja": "エラーを報告するか、アイデアを提案してください (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub 上の Issues</a>)",
        "pt-BR": "Relatar erros ou sugerir ideias (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues no GitHub</a>)",
        "ar": "الإبلاغ عن الأخطاء أو اقتراح الأفكار (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues على GitHub</a>)",
        "tr": "Hataları bildirin veya fikir önerin (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub'daki Issues</a>)"
    },
    // модальные ⏫ особый случай ⏬
    "cube_control_base": {
        "ru": "Управление кубиком",
        "sr": "Управљање коцком",
        "en": "Cube Controls",
        "es": "Control de cubo",
        "zh-CN": "方体控制",
        "fr": "Contrôle du cube",
        "de": "Würfel verwalten",
        "ja": "キューブ管理",
        "pt-BR": "Cube management",
        "ar": "إدارة المكعب",
        "tr": "Zar yönetimi",
    },
    "control_suffix_arrows": {
        "ru": " (стрелки)",
        "sr": " (стрелице)",
        "en": " (arrows)",
        "es": " (flechas)",
        "zh-CN": " (箭头)",
        "fr": " (flèches)",
        "de": " (Pfeile)",
        "ja": " (矢印)",
        "pt-BR": " (setas)",
        "ar": " (الأسهم)",
        "tr": " (oklar)"
    },
    "control_suffix_mouse_move": {
        "ru": " (мышь)",
        "sr": " (миш)",
        "en": " (mouse)",
        "es": " (ratón)",
        "zh-CN": " (鼠标)",
        "fr": " (souris)",
        "de": " (Maus)",
        "ja": " (マウス)",
        "pt-BR": " (mouse)",
        "ar": " (الفأرة)",
        "tr": " (fare)"
    },
    "control_suffix_touch_move": {
        "ru": " (сенсор)",
        "sr": " (сензор)",
        "en": " (touch)",
        "es": " (táctil)",
        "zh-CN": " (触摸)",
        "fr": " (tactile)",
        "de": " (Touch)",
        "ja": " (タッチ)",
        "pt-BR": " (toque)",
        "ar": " (اللمس)",
        "tr": " (dokunmatik)"
    },
    "control_suffix_touch_trigger": {
        "ru": " (сенсор-стрелки)",
        "sr": " (сензор-стрелице)",
        "en": " (touch-arrows)",
        "es": " (flechas táctiles)",
        "zh-CN": " (触摸箭头)",
        "fr": " (flèches tactiles)",
        "de": " (Touch-Pfeile)",
        "ja": " (タッチ矢印)",
        "pt-BR": " (setas de toque)",
        "ar": " (المس-الأسهم)",
        "tr": " (dokunmatik-oklar)"
    },
    // особые ⏫ прочие ⏬
    "pause": {
        "ru": "Пауза",
        "sr": "Пауза",
        "en": "Pause",
        "es": "Pausa",
        "zh-CN": "",
        "fr": "Pause",
        "de": "Pause",
        "ja": "一時停止",
        "pt-BR": "Pausa",
        "ar": "وقفة",
        "tr": "Duraklama",
    },
    "resumeBtn": {
        "ru": "Вернуться", // или "Продолжить", если это "Продолжить игру"
        "sr": "Повратак",
        "en": "Resume", // или "Return" - Resume более типично для "продолжить"
        "es": "Regresar", // или "Reanudar"
        "zh-CN": "返回",
        "fr": "Revenir", // или "Reprendre"
        "de": "Zurückkehren", // или "Fortfahren"
        "ja": "戻る", // или "再開" (さいかい) - Resume
        "pt-BR": "Retomar", // или "Voltar" - Resume/Return
        "ar": "للعودة", // или "استئناف" - Resume
        "tr": "Geri dön", // или "Devam et" - Resume
    },
    "resetAndExitBtn": {
        "ru": "Сбросить и выйти",
        "sr": "Ресетујте и изађите",
        "en": "Reset and Exit",
        "es": "Restablecer y salir",
        "zh-CN": "重置和退出",
        "fr": "Réinitialiser et quitter",
        "de": "Zurücksetzen und Beenden",
        "ja": "リセットと終了",
        "pt-BR": "Redefinir e sair", // Это правильно
        "ar": "إعادة تعيين والخروج",
        "tr": "Sıfırla ve çık",
    },
    "mcTextPhone": {
        "ru": "◽ Жест одним пальцем - при отключённой орбите — вращение кубика, при включённой — вращение камеры по орбите вокруг кубика.<br>◽ Жест двумя пальцами - автовкл орбиты, масштабирование (зум)<br>◽ Жест тремя пальцами или нажать на кнопку '💫' - переключатель выкл/вкл орбиты",
        "sr": "◽ Покрет једним прстом - када је орбита искључена: окретање коцке, када је орбита укључена: окретање камере око коцке.<br>◽ Покрет двома прстима - аутоматско укључивање орбите, зум<br>◽ Покрет три прста или додир дугмета '💫' - укљ./искљ. орбиту",
        "en": "◽ One-finger gesture - when orbit is off: rotate cube, when orbit is on: rotate camera around cube.<br>◽ Two-finger gesture - auto-enable orbit, zoom<br>◽ Three-finger gesture or tap '💫' button - toggle orbit on/off",
        "es": "◽ Gestualidad de un dedo - con órbita desactivada: girar cubo, con órbita activada: girar cámara alrededor del cubo.<br>◽ Gestualidad de dos dedos - activación automática de órbita, zoom<br>◽ Gestualidad de tres dedos o tocar el botón '💫' - alternar órbita on/off",
        "zh-CN": "◽ 单指手势 - 轨道关闭时：旋转魔方，轨道开启时：围绕魔方旋转相机。<br>◽ 双指手势 - 自动开启轨道，缩放，<br>◽ 三指手势或点击 '💫' 按钮 - 切换轨道 开/关",
        "fr": "◽ Gestuelle d'un doigt - lorsque l'orbite est désactivée : rotation du cube, lorsque l'orbite est activée : rotation de la caméra autour du cube.<br>◽ Gestuelle de deux doigts - activation automatique de l'orbite, zoom,<br>◽ Gestuelle de trois doigts ou appui sur le bouton '💫' - basculer l'orbite activée/désactivée",
        "de": "◽ Ein-Finger-Geste - bei deaktivierter Umlaufbahn: Würfel drehen, bei aktivierter Umlaufbahn: Kamera um Würfel drehen.<br>◽ Zwei-Finger-Geste - Umlaufbahn automatisch aktivieren, Zoom<br>◽ Drei-Finger-Geste oder '💫'-Taste drücken - Umlaufbahn ein/aus schalten",
        "ja": "◽ 1本指のジェスチャー - 軌道がオフのとき：キューブを回転、軌道がオンのとき：キューブの周りをカメラが回転。<br>◽ 2本指のジェスチャー - 軌道を自動的に有効化、ズーム、<br>◽ 3本指のジェスチャーまたは'💫'ボタンをタップ - 軌道のオン/オフ切り替え",
        "pt-BR": "◽ Gestualidade com um dedo - com órbita desligada: girar cubo, com órbita ligada: girar câmera em torno do cubo.<br>◽ Gestualidade com dois dedos - ativar órbita automaticamente, zoom<br>◽ Gestualidade com três dedos ou tocar no botão '💫' - alternar órbita ligar/desligar",
        "ar": "◽ إيماءة بإصبع واحد - عندما تكون المدار مُعطلًا: تدوير المكعب، عندما يكون المدار مُفعلًا: تدوير الكاميرا حول المكعب.<br>◽ إيماءة بإصبعين - تفعيل المدار تلقائيًا، تكبير/تصغير،<br>◽ إيماءة بثلاثة أصابع أو نقر زر '💫' - تبديل تشغيل/إيقاف المدار",
        "tr": "◽ Tek parmak hareketi - yörünge kapalıyken: küpü döndür, yörünge açıkken: kamerayı küp etrafında döndür.<br>◽ İki parmak hareketi - yörüngeyi otomatik etkinleştir, yakınlaştır<br>◽ Üç parmak hareketi veya '💫' düğmesine dokunun - yörüngeyi aç/kapat",
    },
    "data_management": {
        "ru": "Управление данными",
        "sr": "Управљање подацима",
        "en": "Data Management",
        "es": "Gestión de datos",
        "zh-CN": "数据管理",
        "fr": "Gestion des données",
        "de": "Datenverwaltung",
        "ja": "データ管理",
        "pt-BR": "Gerenciamento de dados",
        "ar": "إدارة البيانات",
        "tr": "Veri Yönetimi"
    },
    "clearCustomThemes": {
        "ru": "🗑️ Очистить разблокированные темы",
        "sr": "🗑️ Обришите откључане теме",
        "en": "🗑️ Clear unlocked themes",
        "es": "🗑️ Borrar temas desbloqueados",
        "zh-CN": "🗑️ 清除已解锁主题",
        "fr": "🗑️ Effacer les thèmes débloqués",
        "de": "🗑️ Entsperrte Themen löschen",
        "ja": "🗑️ ロック解除されたテーマをクリア",
        "pt-BR": "🗑️ Limpar temas desbloqueados",
        "ar": "🗑️ مسح السمات غير المقفلة",
        "tr": "🗑️ Kilidi açılan temaları temizle"
    },
    "clearAllData": {
        "ru": "⚠️ Сбросить все настройки",
        "sr": "⚠️ Ресетујте сва подешавања",
        "en": "⚠️ Reset all settings",
        "es": "⚠️ Restablecer toda la configuración",
        "zh-CN": "⚠️ 重置所有设置",
        "fr": "⚠️ Réinitialiser tous les paramètres",
        "de": "⚠️ Alle Einstellungen zurücksetzen",
        "ja": "⚠️ すべての設定をリセット",
        "pt-BR": "⚠️ Redefinir todas as configurações",
        "ar": "⚠️ إعادة تعيين جميع الإعدادات",
        "tr": "⚠️ Tüm ayarları sıfırla"
    },
    "clearWarning": {
        "ru": "Внимание: это действие нельзя отменить!",
        "sr": "Пажња: ову радњу није могуће опозвати!",
        "en": "Warning: this action cannot be undone!",
        "es": "Advertencia: ¡esta acción no se puede deshacer!",
        "zh-CN": "警告：此操作无法撤消！",
        "fr": "Attention : cette action est irréversible !",
        "de": "Warnung: Diese Aktion kann nicht rückgängig gemacht werden!",
        "ja": "警告：この操作は取り消せません！",
        "pt-BR": "Aviso: esta ação não pode ser desfeita!",
        "ar": "تحذير: لا يمكن التراجع عن هذا الإجراء!",
        "tr": "Uyarı: bu işlem geri alınamaz!"
    },
    "setTextures": {
        "ru": "🎨 Текстуры",
        "sr": "🎨 Текстуре",
        "en": "🎨 Textures",
        "es": "🎨 Texturas",
        "zh-CN": "🎨 圖案",
        "fr": "🎨 Textures",
        "de": "🎨 Texturen",
        "ja": "🎨 テクスチャ",
        "pt-BR": "🎨 Texturas",
        "ar": "🎨 القوام", // Правильно: "القوام" или "الTextures" - оба варианта используются
        "tr": "🎨 Dokular" // Правильно: "Dokular" (множественное число от "doku")
    },
    "setControls": {
        "ru": "🎮 Управление",
        "sr": "🎮 Управљање",
        "en": "🎮 Controls",
        "es": "🎮 Controles", // Исправлено: "Gestión" означает "управление/администрирование", а не "контролы/управление"
        "zh-CN": "🎮 控制", // Исправлено: "管理层" - это управление компанией, а "控制" - контроль/управление системой
        "fr": "🎮 Commandes", // Исправлено: "Contrôle" - это проверка, а "Commandes" - элементы управления
        "de": "🎮 Steuerung",
        "ja": "🎮 コントロール", // Исправлено: "マネジメント" - это управление, а не контроль/управление
        "pt-BR": "🎮 Controles", // Исправлено: как в испанском
        "ar": "🎮 عناصر التحكم", // Исправлено: "الإدارة" - управление, а не контроль
        "tr": "🎮 Kontroller" // Исправлено: "Yönetim" - управление, а не элементы управления
    },
    "setSound": {
        "ru": "🔊 Звук",
        "sr": "🔊 Звук",
        "en": "🔊 Sound",
        "es": "🔊 Sonido",
        "zh-CN": "🔊 声音",
        "fr": "🔊 Son",
        "de": "🔊 Ton", // Можно и "Audio", но "Ton" тоже правильный вариант
        "ja": "🔊 音",
        "pt-BR": "🔊 Som",
        "ar": "🔊 الصوت",
        "tr": "🔊 Ses"
    },
    "setData": {
        "ru": "🗃️ Данные",
        "sr": "🗃️ Подаци",
        "en": "🗃️ Data",
        "es": "🗃️ Datos",
        "zh-CN": "🗃️ 資料",
        "fr": "🗃️ Données",
        "de": "🗃️ Daten", 
        "ja": "🗃️ データ",
        "pt-BR": "🗃️ Dados",
        "ar": "🗃️ البيانات",
        "tr": "🗃️ Veriler"
    },
    "settings-info": {
        "ru": "Настройки",
        "sr": "Подешавања",
        "en": "Settings",
        "es": "Configuración",
        "zh-CN": "设置",
        "fr": "Paramètres",
        "de": "Einstellungen",
        "ja": "設定",
        "pt-BR": "Configurações",
        "ar": "إعدادات",
        "tr": "Ayarlar",
    },
};

// 3. Глобальная переменная для хранения текущего языка
let currentLanguage = getUserLanguage();

// 4. Функция для получения перевода по ключу
function t(key, params = {}) {
    const translationObj = translations[key];
    if (!translationObj) {
        console.warn(`Translation key '${key}' not found.`);
        return key; // Возвращаем ключ, если перевод не найден
    }

    let translatedText = translationObj[currentLanguage];
    if (translatedText === undefined) {
        console.warn(`Translation for key '${key}' not found for language '${currentLanguage}'.`);
        // Попробуем вернуть перевод на языке по умолчанию (русский)
        translatedText = translationObj['ru'] || key;
    }

    // Заменяем плейсхолдеры {{paramName}} на значения из params
    for (const [paramKey, paramValue] of Object.entries(params)) {
        const placeholder = `{{${paramKey}}}`;
        translatedText = translatedText.replace(new RegExp(placeholder, 'g'), paramValue);
    }

    return translatedText;
}

// 5. УЛУЧШЕННАЯ Функция для применения переводов
function applyTranslations() {
    for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (element) {
                // Получаем перевод
                const translatedText = t(key);

                // Проверяем, содержит ли перевод HTML-теги (например, <a>)
                // Простая проверка: наличие '<' и '>'
                if (translatedText.includes('<') && translatedText.includes('>')) {
                    // Если содержит HTML, используем innerHTML
                    element.innerHTML = translatedText;
                } else {
                    // Если простой текст, используем textContent
                    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                        if (element.hasAttribute('placeholder')) {
                            element.placeholder = translatedText;
                        } else {
                            element.value = translatedText;
                        }
                    } else if (element.tagName === 'IMG') {
                        element.alt = translatedText;
                    } else {
                        element.textContent = translatedText;
                    }
                }
            }
        }
    }
}

function initializeTranslationsOnDOMLoad() {
    if (document.readyState === 'loading') {
        // Если DOM ещё загружается, ждём события
        document.addEventListener('DOMContentLoaded', () => {
            applyTranslations();
            // Вызовем logicSlider после applyTranslations
            if (typeof logicSlider === 'function') {
                logicSlider();
            }
        });
    } else {
        // Если DOM уже загружен, применяем сразу
        applyTranslations();
        if (typeof logicSlider === 'function') {
            logicSlider();
        }
    }
}

// Запускаем инициализацию перевода
initializeTranslationsOnDOMLoad();

// 6. (Опционально) Функция для смены языка
function changeLanguage(newLang) {
    if (translations['title'] && translations['title'][newLang] !== undefined) {
        currentLanguage = newLang;
        applyTranslations();
        // updateVersionDisplay();
        // Если игра запущена, обновляем динамический текст
        if (typeof window.updateHelpContent === 'function') {
            window.updateHelpContent();
        }
    } else {
        console.warn(`Language '${newLang}' is not supported.`);
    }
}

console.log(`Translation system initialized. Current language: ${currentLanguage}`);

// --- НОВОЕ: Данные для слайдера языков ---
// Определим список языков для слайдера в нужном порядке
// Коды языков должны совпадать с теми, что используются в функции changeLanguage
const sliderLanguages = [
    { code: 'ru', name: 'Русский' },
    { code: 'sr', name: 'Српски' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh-CN', name: '中文' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'ja', name: '日本語' },
    { code: 'pt-BR', name: 'Português (Brasil)' },
    { code: 'ar', name: 'العربية' },
    { code: 'tr', name: 'Türkçe' },
];

// зависят от version_game, пусты
let flagImages = {};
let flagEmoji = {};
let flagNames = {};

const emoji = [
    { lang: 'Россия', name: 'ru', symbol: 'RU' },
    { lang: 'Србија', name: 'sr', symbol: 'RS' },
    { lang: 'USA', name: 'en', symbol: 'USA' },
    { lang: 'España', name: 'es', symbol: 'ES' },
    { lang: '中国', name: 'zh-CN', symbol: '中国' },
    { lang: 'France', name: 'fr', symbol: 'FR' },
    { lang: 'Deutschland', name: 'de', symbol: 'DE' },
    { lang: '日本', name: 'ja', symbol: '日本' },
    { lang: 'Brasil', name: 'pt-BR', symbol: 'BR' },
    { lang: 'المملكة العربية السعودية', name: 'ar', symbol: 'AE' },
    { lang: 'Türkiye', name: 'tr', symbol: 'TUR' },
]

function logicSlider() {
    setTimeout(() => {
        const sliderContainer = document.getElementById('languageSliderContainer');
        const sliderFlagsContainer = document.getElementById('sliderFlags');
        const sliderPrevBtn = document.getElementById('sliderPrev');
        const sliderNextBtn = document.getElementById('sliderNext');
        const currentLang = window.currentLanguage || 'ru'; // Получаем текущий язык
        // console.info(`Test 1: ${window.currentLanguage},  Test 2: ${!window.currentLanguage}`)
        if (!window.currentLanguage) {
            import('./menu.js').then(menuModule => { 
                menuModule.showClearNotification(
                    'Language not found in my library, default language is Russian, but you can choose from the suggested languages for now.',
                    'Language help'
            );
        }).catch(error => {
            console.error('ошибка при загрузке menu.js:', error);
        })};
        const typeVersion = document.getElementById('typeVersion');

        if (!sliderContainer || !sliderFlagsContainer || !sliderPrevBtn || !sliderNextBtn) {
            console.warn('Элементы слайдера языка не найдены в DOM.');
            return;
        }

        let currentIndex = sliderLanguages.findIndex(lang => lang.code === currentLang);
        if (currentIndex === -1) currentIndex = 0; // Если текущий язык не в списке, выбираем первый

        // Функция для обновления отображения слайдера
        function updateSlider() {
            sliderFlagsContainer.innerHTML = ''; // Очищаем контейнер

            // Определяем индексы предыдущего, текущего и следующего языков
            const prevIndex = (currentIndex - 1 + sliderLanguages.length) % sliderLanguages.length;
            const nextIndex = (currentIndex + 1) % sliderLanguages.length;

            // Создаем кнопки для флагов
            const flagsToDisplay = [prevIndex, currentIndex, nextIndex];
            flagsToDisplay.forEach((index, position) => {
                const langData = sliderLanguages[index];
                const flagBtn = document.createElement('button');
                flagBtn.className = 'lang-flag-btn';
                if (index === currentIndex) {
                    flagBtn.classList.add('active');
                }
                flagBtn.setAttribute('data-lang', langData.code);
                flagBtn.setAttribute('title', langData.name); // Всплывающая подсказка

                const flagContent = document.createElement('div');
                flagContent.style.display = 'flex';
                flagContent.style.flexDirection = 'column'; // Элементы будут в столбик
                flagContent.style.alignItems = 'center'; // Центрируем по горизонтали
                flagContent.style.justifyContent = 'center'; // Центрируем по вертикали
                flagContent.style.gap = '0.5px'; // Отступ между флагом и названием

                let flagElement;
                if (version_game === 'full' & flagImages[langData.code]) {

                    const flagImg = document.createElement('img');
                    typeVersion.textContent = 'Full';
                    flagImg.className = 'lang-flag-img';
                    flagImg.src = flagImages[langData.code];

                    flagImg.alt = langData.name || langData.code.toUpperCase();

                    flagImg.onerror = function () {
                        console.log(`[${langData.code}] Эмодзи fallback triggered`);
                        this.style.display = 'none';
                        // const flagContainer = this.parentElement;
                        const emojiSpan = document.createElement('span');
                        emojiSpan.className = 'lang-flag-emoji';
                        emojiSpan.textContent = flagEmoji[langData.code] || langData.code.toUpperCase();
                        flagBtn.appendChild(emojiSpan);
                    }

                    flagElement = flagImg;
                } else {
                    const emojiSpan = document.createElement('span');
                    emojiSpan.className = 'lang-flag-emoji';
                    emojiSpan.textContent = flagEmoji[langData.code] || langData.code.toUpperCase();
                    flagElement = emojiSpan;
                }

                flagContent.appendChild(flagElement);

                // Создаем элемент для названия языка
                const nameDiv = document.createElement('div');
                nameDiv.className = 'lang-flag-name';
                nameDiv.textContent = flagNames[langData.code] || langData.name; // Используем название страны или имя языка
                nameDiv.style.fontSize = '15px'; // Размер шрифта для названия
                nameDiv.style.textAlign = 'center'; // Центрируем текст
                nameDiv.style.overflow = 'hidden';
                nameDiv.style.textOverflow = 'ellipsis';
                nameDiv.style.whiteSpace = 'nowrap';
                nameDiv.title = flagNames[langData.code] || langData.name; // Всплывающая подсказка для длинных названий

                // Добавляем название в контейнер (оно будет под флагом/эмодзи)
                flagContent.appendChild(nameDiv);

                // Добавляем контейнер в кнопку
                flagBtn.appendChild(flagContent);

                // Добавляем кнопку в слайдер
                sliderFlagsContainer.appendChild(flagBtn);

                // Добавляем обработчик клика
                flagBtn.addEventListener('click', () => {
                    if (typeof window.changeLanguage === 'function') {
                        window.changeLanguage(langData.code);
                        // Обновляем currentIndex и сам слайдер
                        currentIndex = index;
                        updateSlider();
                    }
                });
            });
        }

        // Обработчики для кнопок навигации
        sliderPrevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + sliderLanguages.length) % sliderLanguages.length;
            updateSlider();
        });

        sliderNextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % sliderLanguages.length;
            updateSlider();
        });

        // Инициализируем слайдер
        updateSlider();

    }, 150); // Небольшая задержка для уверенности в загрузке DOM
}

export { logicSlider, sliderLanguages, emoji, changeLanguage }

window.t = t;
window.applyTranslations = applyTranslations;
window.changeLanguage = changeLanguage;
window.currentLanguage = currentLanguage;
