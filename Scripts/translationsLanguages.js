// Scripts/translationsLanguages.js 

const ru = "ru";
const sr = "sr";
const en = "en";
const es = "es";
const zh_CN = "zh-CN";
const fr = "fr";
const de = "de";
const ja = "ja";
const pt_BR = "pt-BR";
const ar = "ar";
const tr = "tr";

export const translations = {
    "title": {
        [ru] : "Магический Куб",
        [sr] : "Магична коцка",
        [en] : "The Magic Cube",
        [es] : "Cubo mágico",
        [zh_CN] : "魔方",
        [fr] : "Cube magique",
        [de] : "Magisch Würfel",
        [ja] : "マジックキューブ",
        [pt_BR] : "O Cubo Mágico",
        [ar] : "المكعب السحري",
        [tr] : "Sihirli küp"
    },
    "playGameModeBtn": {
        [ru] : "Играть",
        [sr] : "Играј",
        [en] : "Play",
        [es] : "Jugar",
        [zh_CN] : "游戏",
        [fr] : "Jouer",
        [de] : "Spielen",
        [ja] :"プレイ",
        [pt_BR] : "Play",
        [ar] : "لعب",
        [tr] : "Oynamak",
    },
    "trainingMode": {
        [ru] : "Обучение",
        [sr] : "Режим обуке",
        [en] : "Training mode",
        [es] : "Modo de entrenamiento",
        [zh_CN]: "训练模式",
        [fr]: "Mode d'entraînement",
        [de] : "Trainingsmodus",
        [ja]: "トレーニングモード",
        [pt_BR]: "Modo de treino",
        [ar] : "وضع التدريب",
        [tr] : "Eğitim modu",
    }, 

    "normalMode": {
        [ru] : "Обычный режим",
        [sr] : "Нормалан режим",
        [en] : "Normal Mode",
        [es] : "Modo Normal",
        [zh_CN] : "普通模式",
        [fr] : "Mode Normal",
        [de] : "Normaler Modus",
        [ja] : "通常モード",
        [pt_BR] : "Modo Normal",
        [ar] : "الوضع العادي",
        [tr] : "Normal Mod"
    },
    "freeMode": {
        [ru] : "Свободный режим",
        [sr] : "Слободан режим",
        [en] : "Free Mode",
        [es] : "Modo Libre ",
        [zh_CN] : "自由模式",
        [fr] : "Modo Libre",
        [de] : "Freier Modus",
        [ja] : "フリーモード",
        [pt_BR] : "Modo Livre",
        [ar] : "الوضع الحر",
        [tr] : "Serbest Mod",
    },
    "helpBtn": {
        [ru] : "Помощь",
        [sr] : "Помоћ",
        [en] : "Help",
        [es] : "Ayuda",
        [zh_CN] : "帮助",
        [fr] : "Aide",
        [de] : "Hilfe",
        [ja] : "ヘルプ",
        [pt_BR] : "Ajuda",
        [ar] : "مساعدة",
        [tr] : "Yardım",
    },
    "settingsBtn": {
        [ru] : "Настройки",
        [sr] : "Подешавања",
        [en] : "Settings",
        [es] : "Configuración",
        [zh_CN] : "设置",
        [fr] : "Paramètres",
        [de] : "Einstellungen",
        [ja] : "設定",
        [pt_BR] : "Configurações",
        [ar] : "إعدادات",
        [tr] : "Ayarlar",
    },
    "creatorBtn": {
        [ru] : "Создатель",
        [sr] : "Развијач",
        [en] : "Creator",
        [es] : "Desarrollador",
        [zh_CN] : "開發者 / 开发人",
        [fr] : "Développeur",
        [de] : "Entwickler",
        [ja] : "開発者",
        [pt_BR] : "Desenvolvedor",
        [ar] : "المطور",
        [tr] : "Geliştirici",
    },
    "supportBtn": {
        [ru] : "Поддержать автора",
        [sr] : "Подржи аутора",
        [en] : "Support the author", // Или "Donate to the author"
        [es] : "Apoyar al autor",
        [zh_CN] : "支持作者",
        [fr] : "Soutenir l'auteur",
        [de] : "Den Autor unterstützen",
        [ja] : "作者を支援する",
        [pt_BR] : "Apoiar o autor",
        [ar] : "ادعم المؤلف",
        [tr] : "Yazarı destekle"
    },
    // кнопки меню ⏫
    // модальные окна ⏬
    "congrats": {
        [ru] : "🎉 Поздравляем 🎉",
        [sr] : "🎉 Честитам 🎉", // Čestitam
        [en] : "🎉 Congratulations 🎉",
        [es] : "🎉 ¡Felicidades! 🎉",
        [zh_CN] : "🎉 恭喜 🎉", // Gōngxǐ
        [fr] : "🎉 Félicitations 🎉",
        [de] : "🎉 Glückwunsch 🎉",
        [ja] : "🎉 おめでとうございます 🎉", // Omedetō gozaimasu
        [pt_BR] : "🎉 Parabéns 🎉",
        [ar] : "🎉 مبروك 🎉", // Mubārak
        [tr] : "🎉 Tebrikler 🎉"
    },
    "resetBtn": {
        [ru] : "Собрать заново", 
        [sr] : "Поново састави", // "Собрать заново" на сербском
        [en] : "Solve Again", // Более естественный вариант для "Собрать заново" в контексте головоломки
        [es] : "Resolver de nuevo", // "Собрать заново" / "Решить снова"
        [zh_CN] : "重新解决", // "Решить снова"
        [fr] : "Résoudre à nouveau", // "Решить снова"
        [de] : "Neu lösen", // "Решить снова" / "Ново решити"
        [ja] : "再解決", // "Решить снова"
        [pt_BR] : "Resolver novamente", // "Решить снова"
        [ar] : "حل مرة أخرى", // "Решить снова"
        [tr] : "Yeniden çöz" // "Решить снова"
    },
    "BackToMenuBtn": {
        [ru] : "Назад в меню",
        [sr] : "Назад у мени",
        [en] : "Back to Menu",
        [es] : "Volver al menú",
        [zh_CN] : "返回菜单",
        [fr] : "Retour au menu",
        [de] : "Zurück zum Menü",
        [ja] : "メニューに戻る",
        [pt_BR] : "Voltar ao menu",
        [ar] : "العودة إلى القائمة",
        [tr] : "Menüye Dön",
    },
    "helpbyCont": {
        [ru] : "📚 Помощь по управлению",
        [sr] : "📚 Помоћ у вези са управљањем",
        [en] : "📚 Help with Controls",
        [es] : "📚 Ayuda con los controles",
        [zh_CN] : "📚 控制帮助",
        [fr] : "📚 Aide sur les commandes",
        [de] : "📚 Hilfe zu den Steuerungen",
        [ja] : "📚 操作方法のヘルプ",
        [pt_BR] : "📚 Ajuda com os controles",
        [ar] : "📚 مساعدة في التحكم",
        [tr] : "📚 Kontrollerle ilgili yardım"
    },
    "maincontrol": {
        [ru] : "🛠 Основное управление 🛠",
        [sr] : "🛠 Основно управљање 🛠",
        [en] : "🛠 Main Controls 🛠",
        [es] : "🛠 Controles principales 🛠",
        [zh_CN] : "🛠 主要控制 🛠",
        [fr] : "🛠 Commandes principales 🛠",
        [de] : "🛠 Hauptsteuerungen 🛠",
        [ja] : "🛠 メインコントロール 🛠",
        [pt_BR] : "🛠 Controles principais 🛠",
        [ar] : "🛠 عناصر التحكم الرئيسية 🛠",
        [tr] : "🛠 Ana Kontroller 🛠"
    },

    "importantText": {
        [ru] : "⚠️ (cенсорное уст.) Чтобы вращать камеру нажать '💫', если горит '❌' значит вращение включено ⚠️",
        [sr] : "⚠️ (чулно уста.) Да бисте ротирали камеру притисните ' 💫 'ако је укључено' ❌ ' значи ротација је укључена ⚠️",
        [en] : "⚠️ (sensor device) To rotate the camera, press '💫'; if '❌' is lit, it means rotation is enabled ⚠️",
        [es] : "⚠️ (Dispositivo sensorial) Para girar la cámara, presione '💫'; si brilla '❌', significa que el giratorio está activado ⚠️",
        [zh_CN] : "⚠️（传感器装置）要旋转摄像头，请按下 '💫' 键；若显示 '❌'，则表示旋转功能已开启。⚠️",
        [fr] : "⚠️ (Appareil à toucher) Pour faire tourner la caméra, appuyer sur '💫' ; si '❌' est en lumière, c'est que le tour est activé ⚠️",
        [de] : "️️⚠️ (berührungsempfindlicher Mund.) Um die Kamera zu drehen, drücken Sie '💫', wenn '❌' leuchtet, bedeutet das Drehen ⚠️",
        [ja] : "⚠️ カメラを回転させるには、'💫' を押します。'❌' が点灯している場合は、回転がオンになっています ⚠️",
        [pt_BR] : "⚠️ (dispositivo de toque) para girar a câmera, pressione '💫', se '❌' estiver aceso, a rotação está ligada ⚠️",
        [ar] : "⚠️ (جهاز اللمس) لتدوير الكاميرا ، اضغط على '💫'، إذا كانت '❌' مضاءة، فإن الدوران قيد التشغيل ⚠️",
        [tr] : "⚠️ (sensörlü cihaz)  Kamerayı döndürmek için '💫' tuşuna basın, eğer '❌' yanıyorsa döndürme etkin demektir ⚠️"
    },

    "dls": { 
        [ru] : "◽ПКМ - правая кнопка мыши, ЛКМ - левая кнопка мыши",
        [sr] : "◽Десни клик - десни тастер миша, Леви клик - леви тастер миша",
        [en] : "◽RMB - Right Mouse Button, LMB - Left Mouse Button",
        [es] : "◽RMB - Botón Derecho del Ratón, LMB - Botón Izquierdo del Ratón",
        [zh_CN] : "◽RMB - 鼠标右键, LMB - 鼠标左键",
        [fr] : "◽RMB - Bouton droit de la souris, LMB - Bouton gauche de la souris",
        [de] : "◽RMB - Rechte Maustaste, LMB - Linke Maustaste",
        [ja] : "◽RMB - マウス右ボタン, LMB - マウス左ボタン",
        [pt_BR] : "◽RMB - Botão Direito do Mouse, LMB - Botão Esquerdo do Mouse",
        [ar] : "◽RMB - زر الماوس الأيمن، LMB - زر الماус الأيسر",
        [tr] : "◽SAK - Sağ Fare Düğmesi, LAK - Sol Fare Düğmesi"
    },
    "dls2": {
        [ru] : "◽Раскладка для горячих клавиш кнопка одна (rus/eng)",
        [sr] : "◽Дугме за пречице је исто (руск/енгл)",
        [en] : "◽Hotkey button is the same (rus/eng)",
        [es] : "◽El botón de atajo es el mismo (rus/eng)",
        [zh_CN] : "◽热键按钮相同 (rus/eng)",
        [fr] : "◽Le bouton de raccourci est le même (rus/eng)",
        [de] : "◽Hotkey-Taste ist dieselbe (rus/eng)",
        [ja] : "◽ホットキーのボタンは同じ (rus/eng)",
        [pt_BR] : "◽O botão de atalho é o mesmo (rus/eng)",
        [ar] : "◽زر المفتاح السريع هو نفسه (rus/eng)",
        [tr] : "◽Kısayol tuşu aynıdır (rus/eng)"
    },
    "dls3": {
        [ru] : "✅ Кубик считается собранным если (верх(⬜), перед(🟩), бок(🟥))",
        [sr] : "✅ Коцка је решена ако је (горе(⬜), напред(🟩), страна(🟥))",
        [en] : "✅ Cube is solved if (top(⬜), front(🟩), side(🟥))",
        [es] : "✅ El cubo está resuelto si (arriba(⬜), frente(🟩), lado(🟥))",
        [zh_CN] : "✅ 如果（顶部(⬜), 前面(🟩), 侧面(🟥)）则魔方已解决",
        [fr] : "✅ Le cube est résolu si (haut(⬜), face(🟩), côté(🟥))",
        [de] : "✅ Würfel ist gelöst, wenn (oben(⬜), vorne(🟩), Seite(🟥))",
        [ja] : "✅ 以下の場合キューブは解決されます (上面(⬜), 手前(🟩), 側面(🟥))",
        [pt_BR] : "✅ O cubo está resolvido se (topo(⬜), frente(🟩), lado(🟥))",
        [ar] : "✅ يُحل المكعب إذا كان (الأعلى(⬜)، الأمام(🟩)، الجانب(🟥))",
        [tr] : "✅ Küp çözüldüyse (üst(⬜), ön(🟩), yan(🟥))"
    },
    "mcText4": {
        [ru] : "ПКМ + тащить - вращение камеры (орбита вкл)",
        [sr] : "Десни клик + превуци - ротација камере (орбита укљ.)",
        [en] : "RMB + drag - camera rotation (orbit on)",
        [es] : "RMB + arrastrar - rotación de cámara (órbita activada)",
        [zh_CN] : "右键 + 拖拽 - 相能旋转 (轨道开启)",
        [fr] : "Clic droit + glisser - rotation de la caméra (orbite activée)",
        [de] : "RMB + ziehen - Kameradrehung (Orbit an)",
        [ja] : "右クリック + ドラッグ - カメラ回転 (軌道オン)",
        [pt_BR] : "Botão direito + arrastar - rotação da câmera (órbita ativada)",
        [ar] : "زر الماوس الأيمن + سحب - تدوير الكاميرا (ال궤道 مفعل)",
        [tr] : "SAK + sürükle - kamera döndürme (yörünge açık)"
    },
    "mcText5": {
        [ru] : "Щ/o - включить/выключить орбиту",
        [sr] : "Щ/O - укључи/искључи орбиту",
        [en] : "Щ/O - turn orbit on/off",
        [es] : "Щ/O - activar/desactivar órbita",
        [zh_CN] : "Щ/O - 开启/关闭轨道",
        [fr] : "Щ/O - activer/désactiver l'orbite",
        [de] : "Щ/O - Orbit ein/aus",
        [ja] : "Щ/O - 軌道のオン/オフ",
        [pt_BR] : "Щ/O - ativar/desativar órbita",
        [ar] : "Щ/O - تشغيل/إيقاف ال궤道",
        [tr] : "Щ/O - yörüngeyi aç/kapat"
    },
    "mcText6": {
        [ru] : "Колесико мыши - зум (орбита вкл(on))",
        [sr] : "Точкић миша - зум (орбита укљ.)",
        [en] : "Mouse wheel - zoom (orbit on)",
        [es] : "Rueda del ratón - zoom (órbita activada)",
        [zh_CN] : "鼠标滚轮 - 缩放 (轨道开启)",
        [fr] : "Molette de la souris - zoom (orbite activée)",
        [de] : "Mausrad - Zoom (Orbit an)",
        [ja] : "マウスホイール - ズーム (軌道オン)",
        [pt_BR] : "Roda do mouse - zoom (órbita ativada)",
        [ar] : "عجلة الماوس - تكبير (ال궤道 مفعل)",
        [tr] : "Fare tekerleği - yakınlaştırma (yörünge açık)"
    },
    "mcText7": {
        [ru] : "K/r - сброс камеры",
        [sr] : "K/r - ресет камере",
        [en] : "K/r - reset camera",
        [es] : "K/r - restablecer cámara",
        [zh_CN] : "K/r - 重置相机",
        [fr] : "K/r - réinitialiser la caméra",
        [de] : "K/r - Kamera zurücksetzen",
        [ja] : "K/r - カメラリセット",
        [pt_BR] : "K/r - redefinir câmera",
        [ar] : "K/r - إعادة تعيين الكاميرا",
        [tr] : "K/r - kamerayı sıfırla"
    },
    "mcText8": {
        [ru] : "C/с - автосборка в 'Свободном режиме'",
        [sr] : "C/с - аутоматско решавање у 'Слободном режиму'",
        [en] : "C/с - auto-solve in 'Free Mode'",
        [es] : "C/с - auto-resolver en 'Modo Libre'",
        [zh_CN] : "C/с - '自由模式'下的自动解决",
        [fr] : "C/с - résolution automatique en 'Mode Libre'",
        [de] : "C/с - automatisch lösen im 'Freien Modus'",
        [ja] : "C/с - 「フリーモード」で自動解決",
        [pt_BR] : "C/с - auto-resolver no 'Modo Livre'",
        [ar] : "C/с - الحل التلقائي في 'الوضع الحر'",
        [tr] : "C/с - 'Serbest Mod'da otomatik çözüm"
    },
    "mcText9": {
        [ru] : "Ы/s - разборка кубика",
        [sr] : "Ы/s - мешање коцке",
        [en] : "Ы/s - scramble cube",
        [es] : "Ы/s - desordenar cubo",
        [zh_CN] : "Ы/s - 打乱魔方",
        [fr] : "Ы/s - mélanger le cube",
        [de] : "Ы/s - Würfel mischen",
        [ja] : "Ы/s - キューブをシャッフル",
        [pt_BR] : "Ы/s - embaralhar cubo",
        [ar] : "Ы/s - خلط المكعب",
        [tr] : "Ы/s - küpü karıştır"
    },
    "tm_text1": {
        [ru] : "Двигайте пальцем по экрану - вращение грани в направлении движения",
        [sr] : "Померајте прст по екрану - ротација стране у правцу кретања",
        [en] : "Move your finger across the screen - rotate the face in the direction of movement",
        [es] : "Mueva su dedo por la pantalla - gire la cara en la dirección del movimiento",
        [zh_CN] : "用手指在屏幕上滑动 - 按移动方向旋转面",
        [fr] : "Déplacez votre doigt sur l'écran - faites tourner la face dans la direction du mouvement",
        [de] : "Bewegen Sie Ihren Finger über den Bildschirm - Drehen Sie die Seite in Bewegungsrichtung",
        [ja] : "画面を指でスライド - 移動方向に面を回転",
        [pt_BR] : "Mova seu dedo pela tela - gire a face na direção do movimento",
        [ar] : "حرك إصبعك عبر الشاشة - دور الوجه في اتجاه الحركة",
        [tr] : "Parmakla ekranı kaydır - hareket yönünde yüzü döndür"
    },
    "tm_text2": {
        [ru] : "Движение пальца по оси X/Y - поворот по вертикали/горизонтали",
        [sr] : "Кретање прста по X/Y оси - ротација вертикално/хоризонтално",
        [en] : "Finger movement along X/Y axis - rotation vertically/horizontally",
        [es] : "Movimiento del dedo a lo largo del eje X/Y - rotación vertical/horizontal",
        [zh_CN] : "手指沿 X/Y 轴移动 - 垂直/水平旋转",
        [fr] : "Mouvement du doigt selon l'axe X/Y - rotation verticale/horizontale",
        [de] : "Fingerbewegung entlang der X/Y-Achse - Drehung vertikal/horizontal",
        [ja] : "指のX/Y軸方向の移動 - 垂直/水平回転",
        [pt_BR] : "Movimento do dedo ao longo do eixo X/Y - rotação vertical/horizontal",
        [ar] : "حركة الإصبع على طول المحور X/Y - تدوير عمودي/أفقي",
        [tr] : "Parmak hareketi X/Y ekseni boyunca - dikey/yatay döndürme"
    },
    "tm_text3": {
        [ru] : "На грани сверху управление может быть инвертировано.",
        [sr] : "На горњој страни контроле могу бити обрнуте.",
        [en] : "Controls on the top face may be inverted.",
        [es] : "Los controles en la cara superior pueden estar invertidos.",
        [zh_CN] : "顶部面的控制可能被反转。",
        [fr] : "Les contrôles sur la face supérieure peuvent être inversés.",
        [de] : "Die Steuerung auf der oberen Seite kann invertiert sein.",
        [ja] : "上面の操作が反転している場合があります。",
        [pt_BR] : "Os controles na face superior podem estar invertidos.",
        [ar] : "قد تكون عناصر التحكم على الوجه العلوي معكوسة.",
        [tr] : "Üst yüze ait kontroller ters çevrilmiş olabilir."
    },
    "tt_text1": {
        [ru] : "Нажать на экран и держать, навести палец точно на стрелки и отпустить - поворот грани",
        [sr] : "Додирните екран и држите, пређите прстом тачно преко стрелица и отпустите - ротација стране",
        [en] : "Tap and hold the screen, hover your finger precisely over the arrows and release - rotate the face",
        [es] : "Toque y mantenga presionada la pantalla, desplace su dedo exactamente sobre las flechas y suéltelo - gire la cara",
        [zh_CN] : "点击并按住屏幕，将手指精确悬停在箭头上并松开 - 旋转面",
        [fr] : "Appuyez et maintenez l'écran, placez précisément votre doigt sur les flèches et relâchez - faites tourner la face",
        [de] : "Tippen und halten Sie den Bildschirm, bewegen Sie Ihren Finger präzise über die Pfeile und lassen Sie los - drehen Sie die Seite",
        [ja] : "画面をタップして押し続け、指を矢印の上に正確に置き、離す - 面を回転",
        [pt_BR] : "Toque e segure a tela, posicione o dedo exatamente sobre as setas e solte - gire a face",
        [ar] : "اضغط مع الاستمرار على الشاشة، مرر إصبعك بدقة فوق الأسهم ثم ارفعه - دور الوجه",
        [tr] : "Ekrana dokunun ve basılı tutun, parmağınızı tam olarak okların üzerine getirip bırakın - yüzü döndür"
    },
    "tt_text2": {
        [ru] : "Нажать на экран и держать, навести палец на шар и отпустить - поворот передней грани",
        [sr] : "Додирните екран и држите, пређите прстом преко лопте и отпустите - ротација предње стране",
        [en] : "Tap and hold the screen, hover your finger over the sphere and release - rotate the front face",
        [es] : "Toque y mantenga presionada la pantalla, desplace su dedo sobre la esfera y suéltelo - gire la cara frontal",
        [zh_CN] : "点击并按住屏幕，将手指悬停在球体上并松开 - 旋转前面",
        [fr] : "Appuyez et maintenez l'écran, placez votre doigt sur la sphère et relâchez - faites tourner la face avant",
        [de] : "Tippen und halten Sie den Bildschirm, bewegen Sie Ihren Finger über die Kugel und lassen Sie los - drehen Sie die Vorderseite",
        [ja] : "画面をタップして押し続け、指を球の上に置き、離す - 手前を回転",
        [pt_BR] : "Toque e segure a tela, posicione o dedo sobre a esfera e solte - gire a face frontal",
        [ar] : "اضغط مع الاستمرار على الشاشة، مرر إصبعك فوق الكرة ثم ارفعه - دور الوجه الأمامي",
        [tr] : "Ekrana dokunun ve basılı tutun, parmağınızı küre üzerine getirip bırakın - ön yüzü döndür"
    },
    "tt_text3": {
        [ru] : "Стрелки - это поворот кубика полностью",
        [sr] : "Стрелице - то је ротација целог коцке",
        [en] : "Arrows - this rotates the entire cube",
        [es] : "Flechas - esto gira todo el cubo",
        [zh_CN] : "箭头 - 这会旋转整个魔方",
        [fr] : "Flèches - cela fait tourner l'ensemble du cube",
        [de] : "Pfeile - dadurch wird der gesamte Würfel gedreht",
        [ja] : "矢印 - これによりキューブ全体が回転します",
        [pt_BR] : "Setas - isso gira o cubo inteiro",
        [ar] : "الأسهم - هذا يدور المكعب بالكامل",
        [tr] : "Oklar - bu, tüm küpü döndürür"
    },
    "ca_text1": {
        [ru] : "Зажать ПКМ и навести точно на стрелки - поворот грани (обрита выкл)",
        [sr] : "Десни клик и пређите тачно преко стрелица - ротација стране (орбита искљ.)",
        [en] : "Hold RMB and hover precisely over the arrows - rotate the face (orbit off)",
        [es] : "Mantenga presionado el botón derecho del ratón y desplace el cursor exactamente sobre las flechas - gire la cara (órbita desactivada)",
        [zh_CN] : "按住鼠标右键并精确悬停在箭头上 - 旋转面 (轨道关闭)",
        [fr] : "Maintenez le clic droit et survolez précisément les flèches - faites tourner la face (orbite désactivée)",
        [de] : "Halten Sie die rechte Maustaste gedrückt und bewegen Sie den Cursor präzise über die Pfeile - drehen Sie die Seite (Orbit aus)",
        [ja] : "右クリックを押しながら矢印の上に正確にカーソルを合わせる - 面を回転 (軌道オフ)",
        [pt_BR] : "Segure o botão direito do mouse e posicione o cursor exatamente sobre as setas - gire a face (órbita desativada)",
        [ar] : "اضغط مع الاستمرار على الزر الأيمن للفأرة ومرر المؤشر بدقة فوق الأسهم - دور الوجه (ال궤道 معطل)",
        [tr] : "SAK'ya basılı tutun ve imleci okların üzerine tam olarak getirin - yüzü döndür (yörünge kapalı)"
    },
    "ca_text2": {
        [ru] : "Зажать ПКМ и навести на шар - поворот передней грани (орбита выкл)",
        [sr] : "Десни клик и пређите преко лопте - ротација предње стране (орбита искљ.)",
        [en] : "Hold RMB and hover over the sphere - rotate the front face (orbit off)",
        [es] : "Mantenga presionado el botón derecho del ratón y desplace el cursor sobre la esfera - gire la cara frontal (órbita desactivada)",
        [zh_CN] : "按住鼠标右键并悬停在球体上 - 旋转前面 (轨道关闭)",
        [fr] : "Maintenez le clic droit et survolez la sphère - faites tourner la face avant (orbite désactivée)",
        [de] : "Halten Sie die rechte Maustaste gedrückt und bewegen Sie den Cursor über die Kugel - drehen Sie die Vorderseite (Orbit aus)",
        [ja] : "右クリックを押しながら球の上にカーソルを合わせる - 手前を回転 (軌道オフ)",
        [pt_BR] : "Segure o botão direito do mouse e posicione o cursor sobre a esfera - gire a face frontal (órbita desativada)",
        [ar] : "اضغط مع الاستمرار على الزر الأيمن للفأرة ومرر المؤشر فوق الكرة - دور الوجه الأمامي (ال궤道 معطل)",
        [tr] : "SAK'ya basılı tutun ve imleci küre üzerine getirin - ön yüzü döndür (yörünge kapalı)"
    },
    "ca_text3": {
        [ru] : "Стрелки на клавиатуре - это поворот кубика полностью",
        [sr] : "Стрелице на тастатури - то је ротација целог коцке",
        [en] : "Keyboard arrows - this rotates the entire cube",
        [es] : "Flechas del teclado - esto gira todo el cubo",
        [zh_CN] : "键盘箭头 - 这会旋转整个魔方",
        [fr] : "Flèches du clavier - cela fait tourner l'ensemble du cube",
        [de] : "Tastaturpfeile - dadurch wird der gesamte Würfel gedreht",
        [ja] : "キーボードの矢印 - これによりキューブ全体が回転します",
        [pt_BR] : "Setas do teclado - isso gira o cubo inteiro",
        [ar] : "مفاتيح الأسهم - هذا يدور المكعب بالكامل",
        [tr] : "Klavye okları - bu, tüm küpü döndürür"
    },
    "ttm_text1": {
        [ru] : "Зажать ПКМ и двигать мышь - вращение грани в направлении движения",
        [sr] : "Десни клик и померајте миша - ротација стране у правцу кретања",
        [en] : "Hold RMB and move the mouse - rotate the face in the direction of movement",
        [es] : "Mantenga presionado el botón derecho del ratón y mueva el ratón - gire la cara en la dirección del movimiento",
        [zh_CN] : "按住鼠标右键并移动鼠标 - 按移动方向旋转面",
        [fr] : "Maintenez le clic droit et déplacez la souris - faites tourner la face dans la direction du mouvement",
        [de] : "Halten Sie die rechte Maustaste gedrückt und bewegen Sie die Maus - drehen Sie die Seite in Bewegungsrichtung",
        [ja] : "右クリックを押しながらマウスを動かす - 移動方向に面を回転",
        [pt_BR] : "Segure o botão direito do mouse e mova o mouse - gire a face na direção do movimento",
        [ar] : "اضغط مع الاستمرار على الزر الأيمن للفأرة وحرك الفأرة - دور الوجه في اتجاه الحركة",
        [tr] : "SAK'ya basılı tutun ve fareyi hareket ettirin - hareket yönünde yüzü döndür"
    },
    "ttm_text2": {
        [ru] : "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        [sr] : "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        [en] : "Mouse movement along X/Y axis - rotation vertically/horizontally",
        [es] : "Movimiento del ratón a lo largo del eje X/Y - rotación vertical/horizontal",
        [zh_CN] : "鼠标沿 X/Y 轴移动 - 垂直/水平旋转",
        [fr] : "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        [de] : "Mausbewegung entlang der X/Y-Achse - Drehung vertikal/horizontal",
        [ja] : "マウスのX/Y軸方向の移動 - 垂直/水平回転",
        [pt_BR] : "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        [ar] : "حركة الفأرة على طول المحور X/Y - تدوير عمودي/أفقي",
        [tr] : "Fare hareketi X/Y ekseni boyunca - dikey/yatay döndürme"
    },
    "ttm_text3": {
        [ru] : "Однако на грани сверху управление инвертировано вверх = низ, низ = вверх",
        [sr] : "Међутим, на горњој страни контроле су обрнуте горе = доле, доле = горе",
        [en] : "However, on the top face controls are inverted up = down, down = up",
        [es] : "Sin embargo, en la cara superior los controles están invertidos arriba = abajo, abajo = arriba",
        [zh_CN] : "但是，顶部面的控制是反转的，上 = 下，下 = 上",
        [fr] : "Cependant, sur la face supérieure, les contrôles sont inversés haut = bas, bas = haut",
        [de] : "Allerdings ist auf der Oberseite die Steuerung invertiert: Oben = Unten, Unten = Oben",
        [ja] : "ただし、上面では操作が反転しており、上 = 下、下 = 上 になります",
        [pt_BR] : "No entanto, na face superior os controles são invertidos cima = baixo, baixo = cima",
        [ar] : "ومع ذلك، على الوجه العلوي تكون عناصر التحكم معكوسة للأعلى = للأسفل، للأسفل = للأعلى",
        [tr] : "Ancak üst yüze ait kontroller ters çevrilmiştir: yukarı = aşağı, aşağı = yukarı"
    },
    "cmm_text1": {
        [ru] : "Зажать ПКМ и двигать мышь - вращение грани в направлении движения",
        [sr] : "Држати десни клик и померати миш - ротација лица у правцу кретања",
        [en] : "Hold RMB and move mouse - face rotation in movement direction",
        [es] : "Mantener pulsado el botón derecho y mover el ratón - rotación de la cara en la dirección del movimiento",
        [zh_CN] : "按住右键并移动鼠标 - 按移动方向旋转面",
        [fr] : "Maintenir le clic droit et déplacer la souris - rotation de la face dans le sens du mouvement",
        [de] : "Rechte Maustaste halten und Maus bewegen - Drehung der Fläche in Bewegungsrichtung",
        [ja] : "右クリックを押しながらマウスを動かす - 移動方向に応じて面を回転",
        [pt_BR] : "Segurar botão direito e mover o mouse - rotação da face na direção do movimento",
        [ar] : "الضغط مع الاستمرار على الزر الأيمن وتحريك الماوس - تدوير الوجه في اتجاه الحركة",
        [tr] : "Sağ tuşu basılı tutun ve fareyi hareket ettirin - hareket yönünde yüz dönmesi"
    },
    "cmm_text2": {
        [ru] : "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        [sr] : "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        [en] : "Mouse movement along X/Y axis - rotation vertically/horizontally",
        [es] : "Movimiento del ratón a lo largo del eje X/Y - rotación vertical/horizontal",
        [zh_CN] : "鼠标沿X/Y轴移动 - 垂直/水平旋转",
        [fr] : "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        [de] : "Mausbewegung entlang der X/Y-Achse - Rotation vertikal/horizontal",
        [ja] : "マウスのX/Y軸方向の動き - 垂直/水平回転",
        [pt_BR] : "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        [ar] : "حركة الماوس على طول المحور X/Y - تدوير عمودي/أفقي",
        [tr] : "Fare hareketi X/Y ekseni boyunca - dikey/yatay dönüş"
    },
    "cmm_text3": {
        [ru] : "Движение мыши по оси X/Y - поворот по вертикали/горизонтали",
        [sr] : "Кретање миша по X/Y оси - ротација вертикално/хоризонтално",
        [en] : "Mouse movement along X/Y axis - rotation vertically/horizontally",
        [es] : "Movimiento del ratón eje X/Y - rotación vertical/horizontal",
        [zh_CN] : "鼠标沿X/Y轴移动 - 垂直/水平旋转",
        [fr] : "Mouvement de la souris selon l'axe X/Y - rotation verticale/horizontale",
        [de] : "Mausbewegung entlang der X/Y-Achse - Rotation vertikal/horizontal",
        [ja] : "マウスのX/Y軸方向の動き - 垂直/水平回転",
        [pt_BR] : "Movimento do mouse ao longo do eixo X/Y - rotação vertical/horizontal",
        [ar] : "حركة الماوس على طول المحور X/Y - تدوير عمودي/أفقي",
        [tr] : "Fare hareketi X/Y ekseni boyunca - dikey/yatay dönüş"
    },
    "OrbitConText": {
        [ru] : "кнп. Щ(вкл(on)/выкл(off))",
        [sr] : "дугме. O (укључено / искључено)",
        [en] : "button. O (on/off)",
        [es] : "botón. O (encendido/apagado)",
        [zh_CN] : "按钮。O（开/关）",
        [fr] : "bouton. O (marche/arrêt)",
        [de] : "Ein-/Ausschalter O (Ein/Aus)",
        [ja] : "Oボタン（オン/オフ）",
        [pt_BR] : "Botão O (on / off)",
        [ar] : "س زر (تشغيل / إيقاف)",
        [tr] : "O düğmesi (açık/kapalı)",
    },
    "name_textures": {
        [ru] : "Текстуры",
        [sr] : "Текстуре",
        [en] : "Textures",
        [es] : "Texturas",
        [zh_CN] : "纹理",
        [fr] : "Textures",
        [de] : "Texturen",
        [ja] : "テクスチャ",
        [pt_BR] : "Texturas",
        [ar] : "القوالب",
        [tr] : "Dokular"
    },
    "color_theme_textures": {
        [ru] : "Цветовая тема",
        [sr] : "Боја теме",
        [en] : "Color Theme",
        [es] : "Tema de color",
        [zh_CN] : "色彩主题",
        [fr] : "Thème de couleur",
        [de] : "Farbthema",
        [ja] : "カラーテーマ",
        [pt_BR] : "Tema de cor",
        [ar] : "سمة اللون",
        [tr] : "Renk Teması"
    },
    "default": { // Для опции "По умолчанию"
        [ru] : "По умолчанию",
        [sr] : "Подразумевано",
        [en] : "Default",
        [es] : "Predeterminado",
        [zh_CN] : "默认",
        [fr] : "Par défaut",
        [de] : "Standard",
        [ja] : "デフォルト",
        [pt_BR] : "Padrão",
        [ar] : "الافتراضي",
        [tr] : "Varsayılan"
    },
    "classic": { // Для опции "Классическая"
        [ru] : "Классическая",
        [sr] : "Класична",
        [en] : "Classic",
        [es] : "Clásico",
        [zh_CN] : "经典",
        [fr] : "Classique",
        [de] : "Klassisch",
        [ja] : "クラシック",
        [pt_BR] : "Clássico",
        [ar] : "كلاسيكي",
        [tr] : "Klasik"
    },
    "neon": { // Для опции "Неон"
        [ru] : "Неон",
        [sr] : "Неон",
        [en] : "Neon",
        [es] : "Neón",
        [zh_CN] : "霓虹",
        [fr] : "Néon",
        [de] : "Neon",
        [ja] : "ネオン",
        [pt_BR] : "Neon",
        [ar] : "نيون",
        [tr] : "Neon"
    },
    "monochrome": { // Для опции "Монохром"
        [ru] : "Монохром",
        [sr] : "Монохром",
        [en] : "Monochrome",
        [es] : "Monocromo",
        [zh_CN] : "单色",
        [fr] : "Monochrome",
        [de] : "Monochrom",
        [ja] : "モノクローム",
        [pt_BR] : "Monocromático",
        [ar] : "أحادي اللون",
        [tr] : "Tek Renkli"
    },
    "name_mode": {
        [ru] : "Режим управления вращения",
        [sr] : "Режим контроле ротације",
        [en] : "Rotation Control Mode",
        [es] : "Modo de control de rotación",
        [zh_CN] : "旋转控制模式",
        [fr] : "Mode de contrôle de rotation",
        [de] : "Rotationssteuerungsmodus",
        [ja] : "回転制御モード",
        [pt_BR] : "Modo de controle de rotação",
        [ar] : "وضع التحكم في الدوران",
        [tr] : "Döndürme Kontrol Modu"
    },
    "control_arrows": { // Для опции "Триггерами на кубе"
        [ru] : "Триггерами на кубе",
        [sr] : "Окидачима на коцки",
        [en] : "Triggers on cube",
        [es] : "Disparadores en el cubo",
        [zh_CN] : "魔方上的触发器",
        [fr] : "Déclencheurs sur le cube",
        [de] : "Trigger auf dem Würfel",
        [ja] : "キューブ上のトリガー",
        [pt_BR] : "Gatilhos no cubo",
        [ar] : "الزناد على المكعب",
        [tr] : "Küpte tetikler"
    },
    "control_mouse_move": { // Для опции "Движением мыши"
        [ru] : "Движением мыши",
        [sr] : "Померањем миша",
        [en] : "Mouse movement",
        [es] : "Movimiento del ratón",
        [zh_CN] : "鼠标移动",
        [fr] : "Mouvement de la souris",
        [de] : "Mausbewegung",
        [ja] : "マウスの移動",
        [pt_BR] : "Movimento do mouse",
        [ar] : "حركة الماوس",
        [tr] : "Fare hareketi"
    },
    "name_sound": {
        [ru] : "Звук",
        [sr] : "Звук",
        [en] : "Sound",
        [es] : "Sonido",
        [zh_CN] : "声音",
        [fr] : "Son",
        [de] : "Ton",
        [ja] : "音",
        [pt_BR] : "Som",
        [ar] : "الصوت",
        [tr] : "Ses"
    },
    "music_name": {
        [ru] : "Музыка",
        [sr] : "Музика",
        [en] : "Music",
        [es] : "Música",
        [zh_CN] : "音乐",
        [fr] : "Musique",
        [de] : "Musik",
        [ja] : "音楽",
        [pt_BR] : "Música",
        [ar] : "الموسيقى",
        [tr] : "Müzik"
    },
    "sound_name": {
        [ru] : "Звук",
        [sr] : "Звук",
        [en] : "Sound",
        [es] : "Sonido",
        [zh_CN] : "音效",
        [fr] : "Son",
        [de] : "Ton",
        [ja] : "効果音",
        [pt_BR] : "Efeitos sonoros",
        [ar] : "الصوت",
        [tr] : "Ses"
    },
    "supportId": {
        [ru] : "ПОДДЕРЖКА АВТОРА",
        [sr] : "ПОДРШКА АУТОРА",
        [en] : "SUPPORT AUTHOR",
        [es] : "SOPORTE AL AUTOR",
        [zh_CN] : "支持作者",
        [fr] : "SOUTIEN À L'AUTEUR",
        [de] : "AUTOR UNTERSTÜTZEN",
        [ja] : "著者をサポート",
        [pt_BR] : "APOIO AO AUTOR",
        [ar] : "دعم المؤلف",
        [tr] : "YAZARI DESTEKLE"
    },
    "supportHowHelp": {
        [ru] : "Как вы можете поддержать проект:",
        [sr] : "Како можете подржати пројекат:",
        [en] : "How you can support the project:",
        [es] : "Cómo puedes apoyar el proyecto:",
        [zh_CN] : "您如何支持项目：",
        [fr] : "Comment vous pouvez soutenir le projet :",
        [de] : "Wie Sie das Projekt unterstützen können:",
        [ja] : "プロジェクトをサポートする方法：",
        [pt_BR] : "Como você pode apoiar o projeto:",
        [ar] : "كيف يمكنك دعم المشروع:",
        [tr] : "Projeyi nasıl destekleyebilirsiniz:"
    },
    "tellUs": {
        [ru] : "Рассказать друзьям о приложении! 🗣️",
        [sr] : "Реците пријатељима за апликацију! 🗣️",
        [en] : "Tell friends about the app! 🗣️",
        [es] : "¡Cuéntale a tus amigos sobre la aplicación! 🗣️",
        [zh_CN] : "告诉朋友这个应用！ 🗣️",
        [fr] : "Parlez-en à vos amis ! 🗣️",
        [de] : "Erzähle Freunden von der App! 🗣️",
        [ja] : "アプリについて友達に話してください！ 🗣️",
        [pt_BR] : "Conte aos amigos sobre o app! 🗣️",
        [ar] : "أخبر الأصدقاء عن التطبيق! 🗣️",
        [tr] : "Arkadaşlarınıza uygulamadan bahsedin! 🗣️"
    },
    "thanksForSupport": {
        [ru] : "Спасибо за использование приложения! Любая поддержка мотивирует на развитие проекта дальше.",
        [sr] : "Хвала вам што користите апликацију! Свака подршка мотивише даљи развој пројекта.",
        [en] : "Thank you for using the app! Any support motivates further development.",
        [es] : "¡Gracias por usar la aplicación! Cualquier apoyo motiva el desarrollo futuro.",
        [zh_CN] : "感谢您使用此应用程序！任何支持都会激励我继续开发。",
        [fr] : "Merci d'utiliser l'application ! Tout soutien motive le développement futur.",
        [de] : "Vielen Dank, dass Sie die App verwenden! Jede Unterstützung motiviert zur Weiterentwicklung.",
        [ja] : "アプリをご利用いただきありがとうございます！ご支援は今後の開発の励みになります。",
        [pt_BR] : "Obrigado por usar o app! Qualquer apoio motiva o desenvolvimento futuro.",
        [ar] : "شكرًا لاستخدامك التطبيق! أي دعم يشجع على تطوير المشروع في المستقبل.",
        [tr] : "Uygulamayı kullandığınız için teşekkür ederiz! Herhangi bir destek, gelecekteki gelişimi motive eder."
    },
    // --- Комплексные переводы с HTML ---
    "putStar": {
        [ru] : "Поставить звезду на <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [sr] : "Дајте звездицу на <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [en] : "Star on <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [es] : "Dar una estrella en <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [zh_CN] : "在 <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> 上点赞 ⭐",
        [fr] : "Donnez une étoile sur <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [de] : "Stern auf <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> geben ⭐",
        [ja] : "<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> でスターをつける ⭐",
        [pt_BR] : "Dê uma estrela no <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [ar] : "ضع نجمة على <a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a> ⭐",
        [tr] : "<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika' target='_blank' style='color: #00aaff;'>GitHub</a>'da yıldız ver ⭐"
    },
    "putStarYa": {
        [ru]: "Поставьте <b>5 звезд</b> и напишите отзыв в Яндекс Играх! <br> Это лучшая поддержка ⭐",
        [sr]: "Оцените са <b>5 звездица</b> и напишите рецензију у Яндекс Играма! <br> То је најбоља подршка ⭐",
        [en]: "Rate us with <b>5 stars</b> and leave a review in Yandex Games! <br> This is the best support ⭐",
        [es]: "¡Califícanos con <b>5 estrellas</b> y deja una reseña en Yandex Games! <br>  Este es el mejor apoyo ⭐",
        [zh_CN]: "请在 Yandex Games 给我们 <b>5星</b> 好评并留下评论！<br> 这是最好的支持 ⭐",
        [fr]: "Notez-nous avec <b>5 étoiles</b> et laissez un avis sur Yandex Games ! <br> C'est le meilleur soutien ⭐",
        [de]: "Bewerten Sie uns mit <b>5 Sternen</b> und schreiben Sie eine Bewertung in Yandex Games! <br> Das ist die beste Unterstützung ⭐",
        [ja]: "Yandex Games で <b>5つ星</b> の評価とレビューをお願いします！ <br>これが最高のサポートです ⭐",
        [pt_BR]: "Avalie com <b>5 estrelas</b> e deixe um comentário no Yandex Games! <br> Este é o melhor apoio ⭐",
        [ar]: "قيّمنا بـ <b>5 نجوم</b> واكتب مراجعة في Yandex Games! <br> هذا هو أفضل دعم ⭐ ",
        [tr]: "Bizi Yandex Games'te <b>5 yıldız</b> ile değerlendirin ve yorum yazın! <br> Bu en iyi destektir ⭐"
    },
    "financialHelpWallet": {
        [ru] : "Финансовая поддержка через кошелёк (wallet) <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [sr] : "Финансијска подршка преко новчаника (wallet) <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [en] : "Financial support via wallet <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [es] : "Apoyo financiero a través de la billetera <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [zh_CN] : "通过钱包提供财务支持 <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [fr] : "Soutien financier via le portefeuille <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [de] : "Finanzielle Unterstützung über Wallet <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [ja] : "ウォレット経由の金銭的支援 <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [pt_BR] : "Apoio financeiro via carteira <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [ar] : "الدعم المالي عبر المحفظة <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰",
        [tr] : "Cüzdan aracılığıyla maddi destek <a href='https://yoomoney.ru/to/410015336126322' target='_blank' rel='noopener noreferrer' style='color: #00aaff;'>YooMoney</a> 💰"
    },
    "financialHelpBoosty": {
        [ru] : "Финансовая поддержка: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [sr] : "Финансијска подршка: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [en] : "Financial support: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [es] : "Apoyo financiero: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [zh_CN] : "财务支持： <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [fr] : "Soutien financier : <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [de] : "Finanzielle Unterstützung: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [ja] : "金銭的支援： <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [pt_BR] : "Apoio financeiro: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [ar] : "الدعم المالي: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰",
        [tr] : "Maddi destek: <a href='https://boosty.to/ghostwarriorxz/donate' target='_blank' style='color: #00aaff;'>Boosty</a> 💰"
    },
    "financialHelpDonationAlerts": {
        [ru] : "Финансовая поддержка (иностранные пользователи) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [sr] : "Финансијска подршка (корисници из других земаља) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [en] : "Financial support (foreign users) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [es] : "Apoyo financiero (usuarios extranjeros) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [zh_CN] : "财务支持（外国用户） <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [fr] : "Soutien financier (utilisateurs étrangers) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [de] : "Finanzielle Unterstützung (ausländische Benutzer) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [ja] : "金銭的支援（海外ユーザー） <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [pt_BR] : "Apoio financeiro (usuários estrangeiros) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [ar] : "الدعم المالي (للمستخدمين الأجانب) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰",
        [tr] : "Maddi destek (yabancı kullanıcılar için) <a href='https://www.donationalerts.com/r/ghostwarriorxz' target='_blank' style='color: #FF0FA0;'>donationalerts</a> 💰"
    },
    "reportError": {
        [ru] : "Сообщить об ошибках или предложить идеи (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues на GitHub</a>)",
        [sr] : "Пријавите грешке или предложите идеје (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues на GitHub</a>)",
        [en] : "Report errors or suggest ideas (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues on GitHub</a>)",
        [es] : "Reportar errores o sugerir ideas (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues en GitHub</a>)",
        [zh_CN] : "报告错误或提出建议 (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub 上的 Issues</a>)",
        [fr] : "Signaler des erreurs ou suggérer des idées (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues sur GitHub</a>)",
        [de] : "Fehler melden oder Ideen vorschlagen (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues auf GitHub</a>)",
        [ja] : "エラーを報告するか、アイデアを提案してください (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub 上の Issues</a>)",
        [pt_BR] : "Relatar erros ou sugerir ideias (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues no GitHub</a>)",
        [ar] : "الإبلاغ عن الأخطاء أو اقتراح الأفكار (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>Issues على GitHub</a>)",
        [tr] : "Hataları bildirin veya fikir önerin (<a href='https://github.com/Maksim2021-whiteHAKER/Cubik_rubika/issues' target='_blank' style='color: #00aaff;'>GitHub'daki Issues</a>)"
    },
    // модальные ⏫ особый случай ⏬
    "cube_control_base": {
        [ru] : "Управление кубиком",
        [sr] : "Управљање коцком",
        [en] : "Cube Controls",
        [es] : "Control de cubo",
        [zh_CN] : "方体控制",
        [fr] : "Contrôle du cube",
        [de] : "Würfel verwalten",
        [ja] : "キューブ管理",
        [pt_BR] : "Cube management",
        [ar] : "إدارة المكعب",
        [tr] : "Zar yönetimi",
    },
    "control_suffix_arrows": {
        [ru] : " (стрелки)",
        [sr] : " (стрелице)",
        [en] : " (arrows)",
        [es] : " (flechas)",
        [zh_CN] : " (箭头)",
        [fr] : " (flèches)",
        [de] : " (Pfeile)",
        [ja] : " (矢印)",
        [pt_BR] : " (setas)",
        [ar] : " (الأسهم)",
        [tr] : " (oklar)"
    },
    "control_suffix_mouse_move": {
        [ru] : " (мышь)",
        [sr] : " (миш)",
        [en] : " (mouse)",
        [es] : " (ratón)",
        [zh_CN] : " (鼠标)",
        [fr] : " (souris)",
        [de] : " (Maus)",
        [ja] : " (マウス)",
        [pt_BR] : " (mouse)",
        [ar] : " (الفأرة)",
        [tr] : " (fare)"
    },
    "control_suffix_touch_move": {
        [ru] : " (сенсор)",
        [sr] : " (сензор)",
        [en] : " (touch)",
        [es] : " (táctil)",
        [zh_CN] : " (触摸)",
        [fr] : " (tactile)",
        [de] : " (Touch)",
        [ja] : " (タッチ)",
        [pt_BR] : " (toque)",
        [ar] : " (اللمس)",
        [tr] : " (dokunmatik)"
    },
    "control_suffix_touch_trigger": {
        [ru] : " (сенсор-стрелки)",
        [sr] : " (сензор-стрелице)",
        [en] : " (touch-arrows)",
        [es] : " (flechas táctiles)",
        [zh_CN] : " (触摸箭头)",
        [fr] : " (flèches tactiles)",
        [de] : " (Touch-Pfeile)",
        [ja] : " (タッチ矢印)",
        [pt_BR] : " (setas de toque)",
        [ar] : " (المس-الأسهم)",
        [tr] : " (dokunmatik-oklar)"
    },
    // особые ⏫ прочие ⏬
    "pause": {
        [ru] : "Пауза",
        [sr] : "Пауза",
        [en] : "Pause",
        [es] : "Pausa",
        [zh_CN] : "",
        [fr] : "Pause",
        [de] : "Pause",
        [ja] : "一時停止",
        [pt_BR] : "Pausa",
        [ar] : "وقفة",
        [tr] : "Duraklama",
    },
    "resumeBtn": {
        [ru] : "Вернуться", // или "Продолжить", если это "Продолжить игру"
        [sr] : "Повратак",
        [en] : "Resume", // или "Return" - Resume более типично для "продолжить"
        [es] : "Regresar", // или "Reanudar"
        [zh_CN] : "返回",
        [fr] : "Revenir", // или "Reprendre"
        [de] : "Zurückkehren", // или "Fortfahren"
        [ja] : "戻る", // или "再開" (さいかい) - Resume
        [pt_BR] : "Retomar", // или "Voltar" - Resume/Return
        [ar] : "للعودة", // или "استئناف" - Resume
        [tr] : "Geri dön", // или "Devam et" - Resume
    },
    "resetAndExitBtn": {
        [ru] : "Сбросить и выйти",
        [sr] : "Ресетујте и изађите",
        [en] : "Reset and Exit",
        [es] : "Restablecer y salir",
        [zh_CN] : "重置和退出",
        [fr] : "Réinitialiser et quitter",
        [de] : "Zurücksetzen und Beenden",
        [ja] : "リセットと終了",
        [pt_BR] : "Redefinir e sair", // Это правильно
        [ar] : "إعادة تعيين والخروج",
        [tr] : "Sıfırla ve çık",
    },
    "mcTextPhone": {
        [ru] : "◽ Жест одним пальцем - при отключённой орбите — вращение кубика, при включённой — вращение камеры по орбите вокруг кубика.<br>◽ Жест двумя пальцами - автовкл орбиты, масштабирование (зум)<br>◽ Жест тремя пальцами или нажать на кнопку '💫' - переключатель выкл/вкл орбиты",
        [sr] : "◽ Покрет једним прстом - када је орбита искључена: окретање коцке, када је орбита укључена: окретање камере око коцке.<br>◽ Покрет двома прстима - аутоматско укључивање орбите, зум<br>◽ Покрет три прста или додир дугмета '💫' - укљ./искљ. орбиту",
        [en] : "◽ One-finger gesture - when orbit is off: rotate cube, when orbit is on: rotate camera around cube.<br>◽ Two-finger gesture - auto-enable orbit, zoom<br>◽ Three-finger gesture or tap '💫' button - toggle orbit on/off",
        [es] : "◽ Gestualidad de un dedo - con órbita desactivada: girar cubo, con órbita activada: girar cámara alrededor del cubo.<br>◽ Gestualidad de dos dedos - activación automática de órbita, zoom<br>◽ Gestualidad de tres dedos o tocar el botón '💫' - alternar órbita on/off",
        [zh_CN] : "◽ 单指手势 - 轨道关闭时：旋转魔方，轨道开启时：围绕魔方旋转相机。<br>◽ 双指手势 - 自动开启轨道，缩放，<br>◽ 三指手势或点击 '💫' 按钮 - 切换轨道 开/关",
        [fr] : "◽ Gestuelle d'un doigt - lorsque l'orbite est désactivée : rotation du cube, lorsque l'orbite est activée : rotation de la caméra autour du cube.<br>◽ Gestuelle de deux doigts - activation automatique de l'orbite, zoom,<br>◽ Gestuelle de trois doigts ou appui sur le bouton '💫' - basculer l'orbite activée/désactivée",
        [de] : "◽ Ein-Finger-Geste - bei deaktivierter Umlaufbahn: Würfel drehen, bei aktivierter Umlaufbahn: Kamera um Würfel drehen.<br>◽ Zwei-Finger-Geste - Umlaufbahn automatisch aktivieren, Zoom<br>◽ Drei-Finger-Geste oder '💫'-Taste drücken - Umlaufbahn ein/aus schalten",
        [ja] : "◽ 1本指のジェスチャー - 軌道がオフのとき：キューブを回転、軌道がオンのとき：キューブの周りをカメラが回転。<br>◽ 2本指のジェスチャー - 軌道を自動的に有効化、ズーム、<br>◽ 3本指のジェスチャーまたは'💫'ボタンをタップ - 軌道のオン/オフ切り替え",
        [pt_BR] : "◽ Gestualidade com um dedo - com órbita desligada: girar cubo, com órbita ligada: girar câmera em torno do cubo.<br>◽ Gestualidade com dois dedos - ativar órbita automaticamente, zoom<br>◽ Gestualidade com três dedos ou tocar no botão '💫' - alternar órbita ligar/desligar",
        [ar] : "◽ إيماءة بإصبع واحد - عندما تكون المدار مُعطلًا: تدوير المكعب، عندما يكون المدار مُفعلًا: تدوير الكاميرا حول المكعب.<br>◽ إيماءة بإصبعين - تفعيل المدار تلقائيًا، تكبير/تصغير،<br>◽ إيماءة بثلاثة أصابع أو نقر زر '💫' - تبديل تشغيل/إيقاف المدار",
        [tr] : "◽ Tek parmak hareketi - yörünge kapalıyken: küpü döndür, yörünge açıkken: kamerayı küp etrafında döndür.<br>◽ İki parmak hareketi - yörüngeyi otomatik etkinleştir, yakınlaştır<br>◽ Üç parmak hareketi veya '💫' düğmesine dokunun - yörüngeyi aç/kapat",
    },
    "data_management": {
        [ru] : "Управление данными",
        [sr] : "Управљање подацима",
        [en] : "Data Management",
        [es] : "Gestión de datos",
        [zh_CN] : "数据管理",
        [fr] : "Gestion des données",
        [de] : "Datenverwaltung",
        [ja] : "データ管理",
        [pt_BR] : "Gerenciamento de dados",
        [ar] : "إدارة البيانات",
        [tr] : "Veri Yönetimi"
    },
    "clearCustomThemes": {
        [ru] : "🗑️ Очистить разблокированные темы",
        [sr] : "🗑️ Обришите откључане теме",
        [en] : "🗑️ Clear unlocked themes",
        [es] : "🗑️ Borrar temas desbloqueados",
        [zh_CN] : "🗑️ 清除已解锁主题",
        [fr] : "🗑️ Effacer les thèmes débloqués",
        [de] : "🗑️ Entsperrte Themen löschen",
        [ja] : "🗑️ ロック解除されたテーマをクリア",
        [pt_BR] : "🗑️ Limpar temas desbloqueados",
        [ar] : "🗑️ مسح السمات غير المقفلة",
        [tr] : "🗑️ Kilidi açılan temaları temizle"
    },
    "clearAllData": {
        [ru] : "⚠️ Сбросить все настройки",
        [sr] : "⚠️ Ресетујте сва подешавања",
        [en] : "⚠️ Reset all settings",
        [es] : "⚠️ Restablecer toda la configuración",
        [zh_CN] : "⚠️ 重置所有设置",
        [fr] : "⚠️ Réinitialiser tous les paramètres",
        [de] : "⚠️ Alle Einstellungen zurücksetzen",
        [ja] : "⚠️ すべての設定をリセット",
        [pt_BR] : "⚠️ Redefinir todas as configurações",
        [ar] : "⚠️ إعادة تعيين جميع الإعدادات",
        [tr] : "⚠️ Tüm ayarları sıfırla"
    },
    "clearWarning": {
        [ru] : "Внимание: это действие нельзя отменить!",
        [sr] : "Пажња: ову радњу није могуће опозвати!",
        [en] : "Warning: this action cannot be undone!",
        [es] : "Advertencia: ¡esta acción no se puede deshacer!",
        [zh_CN] : "警告：此操作无法撤消！",
        [fr] : "Attention : cette action est irréversible !",
        [de] : "Warnung: Diese Aktion kann nicht rückgängig gemacht werden!",
        [ja] : "警告：この操作は取り消せません！",
        [pt_BR] : "Aviso: esta ação não pode ser desfeita!",
        [ar] : "تحذير: لا يمكن التراجع عن هذا الإجراء!",
        [tr] : "Uyarı: bu işlem geri alınamaz!"
    },
    "setTextures": {
        [ru] : "🎨 Текстуры",
        [sr] : "🎨 Текстуре",
        [en] : "🎨 Textures",
        [es] : "🎨 Texturas",
        [zh_CN] : "🎨 圖案",
        [fr] : "🎨 Textures",
        [de] : "🎨 Texturen",
        [ja] : "🎨 テクスチャ",
        [pt_BR] : "🎨 Texturas",
        [ar] : "🎨 القوام", // Правильно: "القوام" или "الTextures" - оба варианта используются
        [tr] : "🎨 Dokular" // Правильно: "Dokular" (множественное число от "doku")
    },
    "setControls": {
        [ru] : "🎮 Управление",
        [sr] : "🎮 Управљање",
        [en] : "🎮 Controls",
        [es] : "🎮 Controles", // Исправлено: "Gestión" означает "управление/администрирование", а не "контролы/управление"
        [zh_CN] : "🎮 控制", // Исправлено: "管理层" - это управление компанией, а "控制" - контроль/управление системой
        [fr] : "🎮 Commandes", // Исправлено: "Contrôle" - это проверка, а "Commandes" - элементы управления
        [de] : "🎮 Steuerung",
        [ja] : "🎮 コントロール", // Исправлено: "マネジメント" - это управление, а не контроль/управление
        [pt_BR] : "🎮 Controles", // Исправлено: как в испанском
        [ar] : "🎮 عناصر التحكم", // Исправлено: "الإدارة" - управление, а не контроль
        [tr] : "🎮 Kontroller" // Исправлено: "Yönetim" - управление, а не элементы управления
    },
    "setSound": {
        [ru] : "🔊 Звук",
        [sr] : "🔊 Звук",
        [en] : "🔊 Sound",
        [es] : "🔊 Sonido",
        [zh_CN] : "🔊 声音",
        [fr] : "🔊 Son",
        [de] : "🔊 Ton", // Можно и "Audio", но "Ton" тоже правильный вариант
        [ja] : "🔊 音",
        [pt_BR] : "🔊 Som",
        [ar] : "🔊 الصوت",
        [tr] : "🔊 Ses"
    },
    "setData": {
        [ru] : "🗃️ Данные",
        [sr] : "🗃️ Подаци",
        [en] : "🗃️ Data",
        [es] : "🗃️ Datos",
        [zh_CN] : "🗃️ 資料",
        [fr] : "🗃️ Données",
        [de] : "🗃️ Daten", 
        [ja] : "🗃️ データ",
        [pt_BR] : "🗃️ Dados",
        [ar] : "🗃️ البيانات",
        [tr] : "🗃️ Veriler"
    },
    "settings-info": {
        [ru] : "Настройки",
        [sr] : "Подешавања",
        [en] : "Settings",
        [es] : "Configuración",
        [zh_CN] : "设置",
        [fr] : "Paramètres",
        [de] : "Einstellungen",
        [ja] : "設定",
        [pt_BR] : "Configurações",
        [ar] : "إعدادات",
        [tr] : "Ayarlar",
    },
    "customThemeTextLabel": {
        [ru]: "Пользовательская тема:",
        [sr]: "Корисничка тема:",
        [en]: "Custom theme:",
        [es]: "Tema personalizado:",
        [zh_CN]: "自定义主题：",
        [fr]: "Thème personnalisé :",
        [de]: "Eigenes Design:",
        [ja]: "カスタムテーマ：",
        [pt_BR]: "Tema personalizado:",
        [ar]: "سمة مخصصة:",
        [tr]: "Özel tema:"
    },
    "textCustomLocked": {
        [ru]: "ЗАБЛОКИРОВАНО",
        [sr]: "ЗАКЉУЧАНО",
        [en]: "LOCKED",
        [es]: "BLOQUEADO",
        [zh_CN]: "已锁定",
        [fr]: "VERROUILLÉ",
        [de]: "GESPERRT",
        [ja]: "ロック中",
        [pt_BR]: "BLOQUEADO",
        [ar]: "مغلق",
        [tr]: "KİLİTLİ"
    },
    "textCustomUnlocked": {
        [ru]: "РАЗБЛОКИРОВАНО",
        [sr]: "ОТКЉУЧАНО",
        [en]: "UNLOCKED",
        [es]: "DESBLOQUEADO",
        [zh_CN]: "已解锁",
        [fr]: "DÉVERROUILLÉ",
        [de]: "FREIGESCHALTET",
        [ja]: "アンロック済み",
        [pt_BR]: "DESBLOQUEADO",
        [ar]: "مفتوح",
        [tr]: "KİLİT AÇIK"
    },
    "hintCustomTheme": {
        [ru]: "Нажмите на грань, чтобы загрузить изображение. Можно загрузить от 1 до 6 картинок.",
        [sr]: "Кликните на страну да бисте учитали слику. Можете учитати од 1 до 6 слика.",
        [en]: "Click on a face to upload an image. You can upload 1 to 6 images.",
        [es]: "Haz clic en una cara para subir una imagen. Puedes subir de 1 a 6 imágenes.",
        [zh_CN]: "点击面以上传图片。您可以上传 1 到 6 张图片。",
        [fr]: "Cliquez sur une face pour télécharger une image. Vous pouvez en télécharger de 1 à 6.",
        [de]: "Klicke auf eine Seite, um ein Bild hochzuladen. Du kannst 1 bis 6 Bilder hochladen.",
        [ja]: "面をクリックして画像をアップロードしてください。1〜6枚の画像をアップロードできます。",
        [pt_BR]: "Clique em uma face para enviar uma imagem. Você pode enviar de 1 a 6 imagens.",
        [ar]: "انقر على الوجه لتحميل صورة. يمكنك تحميل من 1 إلى 6 صور.",
        [tr]: "Resim yüklemek için bir yüze tıklayın. 1 ila 6 resim yükleyebilirsiniz."
    },
    "applyCustomTexturesBtn": {
        [ru]: "✅ Применить и списать 50 м",
        [sr]: "✅ Примени и одбиј 50 м",
        [en]: "✅ Apply and deduct 50 c",
        [es]: "✅ Aplicar y descontar 50 m",
        [zh_CN]: "✅ 应用并扣除 50 币",
        [fr]: "✅ Appliquer et déduire 50 m",
        [de]: "✅ Anwenden und 50 m abziehen",
        [ja]: "✅ 適用して50コイン消費",
        [pt_BR]: "✅ Aplicar e deduzir 50 m",
        [ar]: "✅ تطبيق وخصم 50 ع",
        [tr]: "✅ Uygula ve 50 m düş"
    },
    "cancelCustomTexturesBtn": {
        [ru]: "Отмена",
        [sr]: "Откажи",
        [en]: "Cancel",
        [es]: "Cancelar",
        [zh_CN]: "取消",
        [fr]: "Annuler",
        [de]: "Abbrechen",
        [ja]: "キャンセル",
        [pt_BR]: "Cancelar",
        [ar]: "إلغاء",
        [tr]: "İptal"
    },
    "wheelEmptySegment": {
        [ru]: "Пусто",
        [sr]: "Празно",
        [en]: "Empty",
        [es]: "Vacío",
        [zh_CN]: "空",
        [fr]: "Vide",
        [de]: "Leer",
        [ja]: "空",
        [pt_BR]: "Vazio",
        [ar]: "فارغ",
        [tr]: "Boş"
    },
    "wheelSpinTitle": {
        [ru]: "🎡 Крутить колесо!",
        [sr]: "🎡 Заврти точак!",
        [en]: "🎡 Spin the Wheel!",
        [es]: "🎡 ¡Gira la rueda!",
        [zh_CN]: "🎡 转动轮盘！",
        [fr]: "🎡 Tournez la roue !",
        [de]: "🎡 Rad drehen!",
        [ja]: "🎡 輪盤を回す！",
        [pt_BR]: "🎡 Girar a roleta!",
        [ar]: "🎡 تدوير العجلة!",
        [tr]: "🎡 Çarkı Çevir!"
    },
    "wheelYourBalance": {
        [ru]: "Ваш баланс:",
        [sr]: "Ваш баланс:",
        [en]: "Your balance:",
        [es]: "Tu saldo:",
        [zh_CN]: "您的余额：",
        [fr]: "Votre solde :",
        [de]: "Dein Guthaben:",
        [ja]: "残高：",
        [pt_BR]: "Seu saldo:",
        [ar]: "رصيدك:",
        [tr]: "Bakiyeniz:"
    },
    "uploadThemeBtn": {
        [ru]: "📥 Меню загрузки моей текстуры",
        [sr]: "📥 Мени за учитавање моје текстуре",
        [en]: "📥 My Texture loading menu",
        [es]: "📥 Menú de carga de mi textura",
        [zh_CN]: "📥 我的纹理加载菜单",
        [fr]: "📥Menu de chargement de ma texture",
        [de]: "📥 Mein Texturlademenü",
        [ja]: "📥 私のテクスチャローディングメニュー",
        [pt_BR]: "📥 Meu Menu de carregamento de textura",
        [ar]: "📥 قائمة تحميل الملمس الخاصة بي",
        [tr]: "📥 Dokumun önyükleme menüsü",
    },
    "wheelSpinCost": {
        [ru]: "Стоимость вращения:",
        [sr]: "Цена окретања:",
        [en]: "Spin cost:",
        [es]: "Costo de giro:",
        [zh_CN]: "旋转成本：",
        [fr]: "Coût du tour :",
        [de]: "Drehkosten:",
        [ja]: "スピンコスト：",
        [pt_BR]: "Custo do giro:",
        [ar]: "تكلفة الدوران:",
        [tr]: "Döndürme ücreti:"
    },
    "wheelPayCoins": {
        [ru]: "💰 Оплатить {{cost}} монет",
        [sr]: "💰 Плати {{cost}} новчића",
        [en]: "💰 Pay {{cost}} coins",
        [es]: "💰 Pagar {{cost}} monedas",
        [zh_CN]: "💰 支付 {{cost}} 币",
        [fr]: "💰 Payer {{cost}} pièces",
        [de]: "💰 {{cost}} Münzen zahlen",
        [ja]: "💰 {{cost}}コイン支払う",
        [pt_BR]: "💰 Pagar {{cost}} moedas",
        [ar]: "💰 ادفع {{cost}} عملة",
        [tr]: "💰 {{cost}} madeni para öde"
    },
    "wheelWatchAd": {
        [ru]: "📺 Посмотреть рекламу (Бесплатно)",
        [sr]: "📺 Погледајте рекламу (Бесплатно)",
        [en]: "📺 Watch ad (Free)",
        [es]: "📺 Ver anuncio (Gratis)",
        [zh_CN]: "📺 观看广告（免费）",
        [fr]: "📺 Regarder une pub (Gratuit)",
        [de]: "📺 Werbung ansehen (Kostenlos)",
        [ja]: "📺 広告を見る（無料）",
        [pt_BR]: "📺 Assistir anúncio (Grátis)",
        [ar]: "📺 شاهد إعلاناً (مجاناً)",
        [tr]: "📺 Reklam izle (Ücretsiz)"
    },
    "wheelCancel": {
        [ru]: "Отмена",
        [sr]: "Откажи",
        [en]: "Cancel",
        [es]: "Cancelar",
        [zh_CN]: "取消",
        [fr]: "Annuler",
        [de]: "Abbrechen",
        [ja]: "キャンセル",
        [pt_BR]: "Cancelar",
        [ar]: "إلغاء",
        [tr]: "İptal"
    },
    "wheelNotEnoughCoins": {
        [ru]: "Недостаточно монет!",
        [sr]: "Нема довољно новчића!",
        [en]: "Not enough coins!",
        [es]: "¡No hay suficientes monedas!",
        [zh_CN]: "金币不足！",
        [fr]: "Pas assez de pièces !",
        [de]: "Nicht genug Münzen!",
        [ja]: "コインが不足しています！",
        [pt_BR]: "Moedas insuficientes!",
        [ar]: "عملات غير كافية!",
        [tr]: "Yeterli madeni para yok!"
    },
    "wheelGotTheme": {
        [ru]: "🎉 Вы получили тему:",
        [sr]: "🎉 Добили сте тему:",
        [en]: "🎉 You got the theme:",
        [es]: "🎉 ¡Obtuviste el tema:",
        [zh_CN]: "🎉 您获得了主题：",
        [fr]: "🎉 Vous avez obtenu le thème :",
        [de]: "🎉 Du hast das Design erhalten:",
        [ja]: "🎉 テーマを獲得しました：",
        [pt_BR]: "🎉 Você ganhou o tema:",
        [ar]: "🎉 لقد حصلت على السمة:",
        [tr]: "🎉 Temayı kazandınız:"
    },

// study
    "welcomeToTrainingMode": {
        [ru]: "🎓 Режим Обучения",
        [en]: "🎓 Training Mode",
        [sr]: "🎓 Режим тренинга",
        [es]: "🎓 Modo de entrenamiento",
        [zh_CN]: "🎓 训练模式",
        [fr]: "🎓 Mode d’entraînement",
        [de]: "🎓 Trainingsmodus",
        [ja]: "🎓 トレーニングモード",
        [pt_BR]: "🎓 Modo de Treinamento",
        [ar]: "🎓 وضع التدريب",
        [tr]: "🎓 Eğitim Modu",
    },

    "aboutThisMode": {
        [ru]: "Добро пожаловать! Этот режим поможет вам понять логику сборки Кубика.",
        [en]: "Welcome! This mode will help you understand the logic of solving the Cube.",
        [sr]: "Добродошли! Овај режим ће вам помоћи да разумете логику решавања коцке.",
        [es]: "¡Bienvenido! Este modo te ayudará a comprender la lógica para resolver el Cubo.",
        [zh_CN]: "欢迎！此模式将帮助你理解魔方的还原逻辑。",
        [fr]: "Bienvenue ! Ce mode vous aidera à comprendre la logique de résolution du Cube.",
        [de]: "Willkommen! Dieser Modus hilft dir, die Logik des Lösens des Würfels zu verstehen.",
        [ja]: "ようこそ！このモードでは、キューブを解く論理を理解できます。",
        [pt_BR]: "Bem-vindo! Este modo ajudará você a entender a lógica de resolver o Cubo.",
        [ar]: "مرحبًا! سيساعدك هذا الوضع على فهم منطق حل المكعب.",
        [tr]: "Hoş geldin! Bu mod, Küpü çözme mantığını anlamana yardımcı olacak.",
    },

    "ul-training": {
        [ru]: `<li><strong>Самостоятельность:</strong> Мы не даём готовых решений. Вам предстоит проявить смекалку и выполнить задания курса своими силами.</li>
                <br>
                <li><strong>Умные подсказки:</strong> Если вы застряли, доступны видео-подсказки. Они покажут <em>направление</em> решения, но не весь алгоритм целиком, чтобы сохранить азарт головоломки.</li>`,
        [en]: `<li><strong>Independence:</strong> We don't give ready-made solutions. You will need to use your ingenuity and complete the course tasks on your own.</li>
                <br>
                <li><strong>Smart hints:</strong> If you get stuck, video hints are available. They show the <em>direction</em> of the solution, but not the whole algorithm, to keep the puzzle excitement.</li>`,
        [sr]: `<li><strong>Самосталност:</strong> Не дајемо готова решења. Треба да покажете сналажљивост и сами обавите задатке курса.</li>
                <br>
                <li><strong>Паметни савети:</strong> Ако се заглавите, доступни су видео-савети. Они ће показати <em>правац</em> решења, али не цео алгоритам, како би сачували узбуђење слагалице.</li>`,
        [es]: `<li><strong>Autonomía:</strong> No damos soluciones hechas. Tendrás que usar tu ingenio y completar las tareas del curso por tu cuenta.</li>
                <br>
                <li><strong>Pistas inteligentes:</strong> Si te quedas atascado, hay pistas en vídeo disponibles. Te mostrarán la <em>dirección</em> de la solución, pero no el algoritmo completo, para mantener la emoción del rompecabezas.</li>`,
        [zh_CN]: `<li><strong>独立性：</strong> 我们不会提供现成答案。你需要发挥聪明才智，依靠自己完成课程任务。</li>
                <br>
                <li><strong>智能提示：</strong> 如果卡住了，可以观看视频提示。它们只会展示解题的<em>方向</em>，而不是完整算法，以保留解谜的乐趣。</li>`,
        [fr]: `<li><strong>Autonomie :</strong> Nous ne donnons pas de solutions toutes faites. À vous de faire preuve d’ingéniosité et d’accomplir les tâches du cours par vous-même.</li>
                <br>
                <li><strong>Indices intelligents :</strong> Si vous êtes bloqué, des indices vidéo sont disponibles. Ils montreront la <em>direction</em> de la solution, mais pas tout l’algorithme, pour préserver le plaisir du puzzle.</li>`,
        [de]: `<li><strong>Selbstständigkeit:</strong> Wir geben keine fertigen Lösungen. Du musst Cleverness zeigen und die Aufgaben des Kurses selbst lösen.</li>
                <br>
                <li><strong>Intelligente Hinweise:</strong> Wenn du feststeckst, stehen Video-Hinweise zur Verfügung. Sie zeigen die <em>Richtung</em> der Lösung, aber nicht den gesamten Algorithmus, um den Rätselspaß zu erhalten.</li>`,
        [ja]: `<li><strong>自主性：</strong> 完成済みの解答は提供しません。工夫して、コースの課題を自分の力で解いてください。</li>
                <br>
                <li><strong>スマートヒント：</strong> 行き詰まったときは、動画ヒントを利用できます。解法の<em>方向性</em>を示しますが、パズルの楽しみを保つため、完全なアルゴリズムは表示しません。</li>`,
        [pt_BR]: `<li><strong>Autonomia:</strong> Não damos soluções prontas. Você precisará usar a criatividade e concluir as tarefas do curso sozinho.</li>
                <br>
                <li><strong>Dicas inteligentes:</strong> Se você ficar preso, há dicas em vídeo disponíveis. Elas mostrarão a <em>direção</em> da solução, mas não o algoritmo completo, para manter a emoção do quebra-cabeça.</li>`,
        [ar]: `<li><strong>الاعتماد على النفس:</strong> نحن لا نقدم حلولًا جاهزة. عليك استخدام ذكائك وإكمال مهام الدورة بنفسك.</li>
                <br>
                <li><strong>تلميحات ذكية:</strong> إذا واجهت صعوبة، تتوفر تلميحات فيديو. ستُظهر <em>اتجاه</em> الحل، وليس الخوارزمية كاملة، للحفاظ على متعة اللغز.</li>`,
        [tr]: `<li><strong>Bağımsızlık:</strong> Hazır çözümler vermiyoruz. Zekânı kullanıp kurs görevlerini kendi başına tamamlaman gerekiyor.</li>
                <br>
                <li><strong>Akıllı ipuçları:</strong> Takılırsan video ipuçları mevcuttur. Çözümün <em>yönünü</em> gösterirler, ancak bulmacanın heyecanını korumak için algoritmanın tamamını göstermezler.</li>`,
    },

    "textGift": {
        [ru]: "🎁 Награда за первое прохождение:",
        [en]: "🎁 Reward for first completion:",
        [sr]: "🎁 Награда за прво завршавање:",
        [es]: "🎁 Recompensa por la primera finalización:",
        [zh_CN]: "🎁 首次完成奖励：",
        [fr]: "🎁 Récompense pour la première réussite :",
        [de]: "🎁 Belohnung für den ersten Abschluss:",
        [ja]: "🎁 初回クリア報酬：",
        [pt_BR]: "🎁 Recompensa pela primeira conclusão:",
        [ar]: "🎁 مكافأة أول إكمال:",
        [tr]: "🎁 İlk tamamlama ödülü:",
    },

    "congratsEndStudy": {
        [ru]: `🎉 Поздравляю с окончанием обучения! 🎉`,
        [en]: `🎉 Congratulations on completing the training! 🎉`,
        [sr]: `🎉 Честитам на завршетку обуке! 🎉`,
        [es]: `🎉 ¡Felicidades por completar el entrenamiento! 🎉`,
        [zh_CN]: `🎉 恭喜完成训练！🎉`,
        [fr]: `🎉 Félicitations pour avoir terminé l’entraînement ! 🎉`,
        [de]: `🎉 Herzlichen Glückwunsch zum Abschluss des Trainings! 🎉`,
        [ja]: `🎉 トレーニング完了おめでとう！🎉`,
        [pt_BR]: `🎉 Parabéns por concluir o treinamento! 🎉`,
        [ar]: `🎉 تهانينا على إكمال التدريب! 🎉`,
        [tr]: `🎉 Eğitimi tamamladığın için tebrikler! 🎉`,
    },

    "textCongratsEndStudyNotGain": {
        [ru]: `Вот обещанная награда: <strong style="color: #f1c40f; font-size: 1.2rem;">150 монет</strong> магического куба!`,
        [en]: `Here is the promised reward: <strong style="color: #f1c40f; font-size: 1.2rem;">150 coins</strong> of the magic cube!`,
        [sr]: `Ево обећане награде: <strong style="color: #f1c40f; font-size: 1.2rem;">150 новчића</strong> магичне коцке!`,
        [es]: `Aquí está la recompensa prometida: <strong style="color: #f1c40f; font-size: 1.2rem;">150 monedas</strong> del cubo mágico!`,
        [zh_CN]: `这是承诺的奖励：<strong style="color: #f1c40f; font-size: 1.2rem;">150 枚</strong>魔法魔方硬币！`,
        [fr]: `Voici la récompense promise : <strong style="color: #f1c40f; font-size: 1.2rem;">150 pièces</strong> du cube magique !`,
        [de]: `Hier ist die versprochene Belohnung: <strong style="color: #f1c40f; font-size: 1.2rem;">150 Münzen</strong> des magischen Würfels!`,
        [ja]: `約束の報酬です：<strong style="color: #f1c40f; font-size: 1.2rem;">150コイン</strong>（マジックキューブ）！`,
        [pt_BR]: `Aqui está a recompensa prometida: <strong style="color: #f1c40f; font-size: 1.2rem;">150 moedas</strong> do cubo mágico!`,
        [ar]: `إليك المكافأة الموعودة: <strong style="color: #f1c40f; font-size: 1.2rem;">150 عملة</strong> لمكعب السحر!`,
        [tr]: `İşte vaat edilen ödül: <strong style="color: #f1c40f; font-size: 1.2rem;">150 sihirli küp jetonu</strong>!`,
    },

    "textCongratsEndStudyAlredyGain": {
        [ru]: `Вы уже получили награду, повторное получение невозможно 😎😁 но рад что вы еще раз прошли обучение`,
        [en]: `You have already received the reward, it cannot be received again 😎😁 but I'm glad you completed the training again`,
        [sr]: `Већ сте добили награду, поновно добијање није могуће 😎😁 али ми је драго да сте поново прошли обуку`,
        [es]: `Ya has recibido la recompensa, no es posible obtenerla de nuevo 😎😁 pero me alegra que hayas completado el entrenamiento otra vez`,
        [zh_CN]: `你已经获得过奖励，无法重复获得 😎😁 但我很高兴你又完成了一次训练`,
        [fr]: `Vous avez déjà reçu la récompense, il est impossible de l’obtenir à nouveau 😎😁 mais je suis content que vous ayez refait l’entraînement`,
        [de]: `Du hast die Belohnung bereits erhalten, eine erneute Vergabe ist nicht möglich 😎😁 aber ich freue mich, dass du das Training noch einmal abgeschlossen hast`,
        [ja]: `報酬はすでに受け取っています。再受取はできません 😎😁 でも、もう一度トレーニングを完了してくれて嬉しいです`,
        [pt_BR]: `Você já recebeu a recompensa, não é possível recebê-la novamente 😎😁 mas fico feliz que você tenha concluído o treinamento de novo`,
        [ar]: `لقد حصلت بالفعل على المكافأة، ولا يمكن الحصول عليها مرة أخرى 😎😁 لكنني سعيد لأنك أكملت التدريب مرة أخرى`,
        [tr]: `Ödülü zaten aldın, tekrar alman mümkün değil 😎😁 ama eğitimi bir kez daha tamamladığın için mutluyum`,
    },

    "startTrainingBtn": {
        [ru]: "Начать обучение",
        [en]: "Start Training",
        [sr]: "Започни тренинг",
        [es]: "Comenzar entrenamiento",
        [zh_CN]: "开始训练",
        [fr]: "Commencer l’entraînement",
        [de]: "Training starten",
        [ja]: "トレーニングを開始",
        [pt_BR]: "Iniciar Treinamento",
        [ar]: "ابدأ التدريب",
        [tr]: "Eğitime Başla",
    },

    "backToMainMenuFromStudy": {
        [ru]: "Вернуться в меню",
        [en]: "Back to Menu",
        [sr]: "Назад у мени",
        [es]: "Volver al menú",
        [zh_CN]: "返回菜单",
        [fr]: "Retour au menu",
        [de]: "Zurück zum Menü",
        [ja]: "メニューに戻る",
        [pt_BR]: "Voltar ao Menu",
        [ar]: "العودة إلى القائمة",
        [tr]: "Menüye Dön",
    },

    "backMenuTrainingBtn": {
        [ru]: "Обратно в меню",
        [en]: "Back to Menu",
        [sr]: "Назад у мени",
        [es]: "Volver al menú",
        [zh_CN]: "返回菜单",
        [fr]: "Retour au menu",
        [de]: "Zurück zum Menü",
        [ja]: "メニューに戻る",
        [pt_BR]: "Voltar ao Menu",
        [ar]: "العودة إلى القائمة",
        [tr]: "Menüye Dön",
    },

    "backBtnStudy": {
        [ru]: "◀ Назад",
        [en]: "◀ Back",
        [sr]: "◀ Назад",
        [es]: "◀ Atrás",
        [zh_CN]: "◀ 返回",
        [fr]: "◀ Retour",
        [de]: "◀ Zurück",
        [ja]: "◀ 戻る",
        [pt_BR]: "◀ Voltar",
        [ar]: "◀ رجوع",
        [tr]: "◀ Geri",
    },

    "nextBtnStudy": {
        [ru]: "Далее ▶",
        [en]: "Next ▶",
        [sr]: "Даље ▶",
        [es]: "Siguiente ▶",
        [zh_CN]: "下一步 ▶",
        [fr]: "Suivant ▶",
        [de]: "Weiter ▶",
        [ja]: "次へ ▶",
        [pt_BR]: "Próximo ▶",
        [ar]: "التالي ▶",
        [tr]: "İleri ▶",
    },

    "videoHintStudy_locked": {
        [ru]: "🎬 Смотреть рекламу за подсказку",
        [en]: "🎬 Watch ad for hint",
        [sr]: "🎬 Погледајте рекламу за савет",
        [es]: "🎬 Ver anuncio para pista",
        [zh_CN]: "🎬 观看广告获取提示",
        [fr]: "🎬 Regarder une pub pour un indice",
        [de]: "🎬 Werbung ansehen für Hinweis",
        [ja]: "🎬 広告を見てヒントを入手",
        [pt_BR]: "🎬 Assistir anúncio para dica",
        [ar]: "🎬 شاهد إعلانًا للحصول على تلميح",
        [tr]: "🎬 İpucu için reklam izle",
    },

    "videoHintStudy_unlocked": {
        [ru]: "💡 Посмотреть подсказку",
        [en]: "💡 Watch hint",
        [sr]: "💡 Погледајте савет",
        [es]: "💡 Ver pista",
        [zh_CN]: "💡 查看提示",
        [fr]: "💡 Voir l’indice",
        [de]: "💡 Hinweis ansehen",
        [ja]: "💡 ヒントを見る",
        [pt_BR]: "💡 Ver dica",
        [ar]: "💡 مشاهدة التلميح",
        [tr]: "💡 İpucunu gör",
    },

    "zeroMessage": {
        [ru]: `Добро пожаловать в обучение! 🎓<br> Сейчас я перемешаю кубик, а вы будете собирать его шаг за шагом.<br><br>
            💡 <em>Если застрянете, кнопка "Подсказка" (после просмотра рекламы) покажет видео-помощь для текущего этапа.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Важное правило игры:</strong><br> Ориентиры фиксированы: <strong>белый всегда сверху, зелёный слева, красный справа.</strong>`,
        [en]: `Welcome to training! 🎓<br> Now I will scramble the cube, and you will solve it step by step.<br><br>
            💡 <em>If you get stuck, the "Hint" button (after watching an ad) will show video help for the current stage.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Important game rule:</strong><br> The reference orientations are fixed: <strong>white always on top, green on the left, red on the right.</strong>`,
        [sr]: `Добро дошли у обуку! 🎓<br> Сада ћу измешати коцку, а ви ћете је решавати корак по корак.<br><br>
            💡 <em>Ако се заглавите, дугме "Савет" (након гледања рекламе) приказаће видео-помоћ за тренутни корак.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Важно правило игре:</strong><br> Референтне оријентације су фиксне: <strong>бело увек горе, зелено лево, црвено десно.</strong>`,
        [es]: `¡Bienvenido al entrenamiento! 🎓<br> Ahora voy a mezclar el cubo y tú lo irás resolviendo paso a paso.<br><br>
            💡 <em>Si te quedas atascado, el botón "Pista" (después de ver un anuncio) mostrará una ayuda en vídeo para la etapa actual.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Regla importante del juego:</strong><br> Los puntos de referencia son fijos: <strong>el blanco siempre arriba, el verde a la izquierda, el rojo a la derecha.</strong>`,
        [zh_CN]: `欢迎来到训练模式！🎓<br> 现在我会打乱魔方，你将一步一步地还原它。<br><br>
            💡 <em>如果卡住了，在观看广告后点击“提示”按钮，会显示当前阶段的视频帮助。</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ 重要游戏规则：</strong><br> 参照方向固定：<strong>白色始终在上，绿色在左，红色在右。</strong>`,
        [fr]: `Bienvenue dans l’entraînement ! 🎓<br> Je vais maintenant mélanger le cube, et vous allez le résoudre étape par étape.<br><br>
            💡 <em>Si vous êtes bloqué, le bouton « Indice » (après avoir regardé une pub) affichera une aide vidéo pour l’étape en cours.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Règle importante du jeu :</strong><br> Les repères sont fixes : <strong>le blanc toujours en haut, le vert à gauche, le rouge à droite.</strong>`,
        [de]: `Willkommen im Training! 🎓<br> Jetzt werde ich den Würfel mischen, und du wirst ihn Schritt für Schritt lösen.<br><br>
            💡 <em>Wenn du feststeckst, zeigt die Schaltfläche „Hinweis“ (nach dem Ansehen einer Werbung) eine Video-Hilfe für den aktuellen Schritt.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Wichtige Spielregel:</strong><br> Die Orientierung ist fest: <strong>Weiß immer oben, Grün links, Rot rechts.</strong>`,
        [ja]: `トレーニングへようこそ！🎓<br> これからキューブをシャッフルします。あなたはそれを一歩ずつ揃えていきます。<br><br>
            💡 <em>行き詰まったら、「ヒント」ボタン（広告視聴後）で現在のステップの動画ヘルプを表示できます。</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ 重要なゲームルール：</strong><br> 基準の向きは固定です：<strong>白は常に上、緑は左、赤は右。</strong>`,
        [pt_BR]: `Bem-vindo ao treinamento! 🎓<br> Agora vou embaralhar o cubo, e você vai resolvê-lo passo a passo.<br><br>
            💡 <em>Se você ficar preso, o botão "Dica" (após assistir a um anúncio) mostrará uma ajuda em vídeo para a etapa atual.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Regra importante do jogo:</strong><br> As referências são fixas: <strong>o branco sempre em cima, o verde à esquerda, o vermelho à direita.</strong>`,
        [ar]: `مرحبًا بك في التدريب! 🎓<br> سأخلط المكعب الآن، وستقوم بحلّه خطوة بخطوة.<br><br>
            💡 <em>إذا واجهت صعوبة، فسيُظهر زر "تلميح" (بعد مشاهدة إعلان) مساعدة فيديو للخطوة الحالية.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ قاعدة مهمة في اللعبة:</strong><br> الاتجاهات ثابتة: <strong>الأبيض دائمًا في الأعلى، والأخضر على اليسار، والأحمر على اليمين.</strong>`,
        [tr]: `Eğitime hoş geldin! 🎓<br> Şimdi küpü karıştıracağım, sen de onu adım adım çözeceksin.<br><br>
            💡 <em>Takılırsan, "İpucu" düğmesi (reklam izledikten sonra) geçerli adım için video yardımı gösterecek.</em><br><br>
               <strong id="zeroMessageImp" style="color: #ff9800;">⚠️ Önemli oyun kuralı:</strong><br> Referanslar sabittir: <strong>beyaz her zaman üstte, yeşil solda, kırmızı sağda.</strong>`,
    },

    "oneMessage": {
        [ru]: `<strong>Шаг 1. Белый центр.</strong><br> Найдите кубик с белым центром и поверните весь кубик или центральную грань так, <br>
              чтобы этот белый центр смотрел строго вверх. Это наша база для сборки.`,
        [en]: `<strong>Step 1. White center.</strong><br> Find the cube with the white center and rotate the whole cube or the central face so that <br>
              this white center points strictly upward. This is our base for solving.`,
        [sr]: `<strong>Корак 1. Бели центар.</strong><br> Пронађите коцку са белим центром и окрените целу коцку или централну страну тако <br>
              да овај бели центар гледа строго нагоре. То је наша основа за решавање.`,
        [es]: `<strong>Paso 1. Centro blanco.</strong><br> Encuentra el cubo con el centro blanco y gira todo el cubo o la cara central para que <br>
              ese centro blanco mire estrictamente hacia arriba. Esta es nuestra base para resolver.`,
        [zh_CN]: `<strong>第 1 步。白色中心。</strong><br> 找到带有白色中心的方块，转动整个魔方或中心面，<br>
              让这个白色中心正朝上方。这是我们还原的基础。`,
        [fr]: `<strong>Étape 1. Centre blanc.</strong><br> Trouvez le cube avec le centre blanc et tournez tout le cube ou la face centrale afin que <br>
              ce centre blanc regarde strictement vers le haut. C’est notre base pour la résolution.`,
        [de]: `<strong>Schritt 1. Weißes Zentrum.</strong><br> Finde den Würfel mit dem weißen Zentrum und drehe den ganzen Würfel oder die mittlere Fläche so, <br>
              dass dieses weiße Zentrum genau nach oben zeigt. Das ist unsere Grundlage für die Lösung.`,
        [ja]: `<strong>ステップ1。白センター。</strong><br> 白いセンターがあるキューブを見つけ、キューブ全体または中央面を回して、<br>
              この白いセンターが真上を向くようにします。これが揃えるための土台です。`,
        [pt_BR]: `<strong>Passo 1. Centro branco.</strong><br> Encontre o cubo com o centro branco e gire todo o cubo ou a face central para que <br>
              esse centro branco aponte estritamente para cima. Esta é a nossa base para resolver.`,
        [ar]: `<strong>الخطوة 1. المركز الأبيض.</strong><br> ابحث عن المكعب الذي يحتوي على المركز الأبيض، ثم أدر المكعب كاملًا أو الوجه المركزي بحيث <br>
              يتجه هذا المركز الأبيض إلى الأعلى تمامًا. هذه هي قاعدتنا للحل.`,
        [tr]: `<strong>Adım 1. Beyaz merkez.</strong><br> Beyaz merkezi olan küpü bulun ve tüm küpü ya da orta yüzü, <br>
              bu beyaz merkez tam olarak yukarı bakacak şekilde döndürün. Bu, çözüm için temelimizdir.`,
    },

    "twoMessage": {
        [ru]: `<strong>Шаг 2. Белая прямая.</strong><br>
            Соберите линию из белого центра и двух боковых элементов.<br><br>
         💡 <em>Хитрость:</em> боковые цвета белой грани — это синий, зелёный, красный и оранжевый. А напротив белого центра <strong>всегда</strong> находится жёлтый.
         🎯 <em>Главное правило:</em> боковой цвет ребра должен совпадать с центром соседней грани. Например, бело-синий элемент должен стыковаться именно с синим центром.</div>`,
        [en]: `<strong>Step 2. White line.</strong><br>
            Make a line from the white center and two side elements.<br><br>
         💡 <em>Trick:</em> the side colors of the white face are blue, green, red, and orange. And opposite the white center there is <strong>always</strong> yellow.
         🎯 <em>Main rule:</em> the side color of the edge must match the center of the neighboring face. For example, the white-blue piece must connect specifically with the blue center.</div>`,
        [sr]: `<strong>Корак 2. Бела линија.</strong><br>
            Саставите линију од белог центра и два бочна елемента.<br><br>
         💡 <em>Трик:</em> бочне боје беле стране су плава, зелена, црвена и наранџаста. А наспрам белог центра <strong>увек</strong> је жуто.
         🎯 <em>Главно правило:</em> бочна боја ивице мора да се поклопи са центром суседне стране. На пример, бело-плави елемент мора да се споји управо са плавим центром.</div>`,
        [es]: `<strong>Paso 2. Línea blanca.</strong><br>
            Forma una línea con el centro blanco y dos elementos laterales.<br><br>
         💡 <em>Truco:</em> los colores laterales de la cara blanca son azul, verde, rojo y naranja. Y frente al centro blanco <strong>siempre</strong> está el amarillo.
         🎯 <em>Regla principal:</em> el color lateral de la arista debe coincidir con el centro de la cara vecina. Por ejemplo, la pieza blanco-azul debe unirse precisamente con el centro azul.</div>`,
        [zh_CN]: `<strong>第 2 步。白色直线。</strong><br>
            用白色中心和两个侧边块组成一条线。<br><br>
         💡 <em>小技巧：</em> 白色面的侧边颜色是蓝色、绿色、红色和橙色。而白色中心的对面<strong>始终</strong>是黄色。
         🎯 <em>主要规则：</em> 棱块的侧边颜色必须与相邻面的中心颜色一致。例如，白蓝棱块必须与蓝色中心相接。</div>`,
        [fr]: `<strong>Étape 2. Ligne blanche.</strong><br>
            Formez une ligne avec le centre blanc et deux éléments latéraux.<br><br>
         💡 <em>Astuce :</em> les couleurs latérales de la face blanche sont le bleu, le vert, le rouge et l’orange. Et face au centre blanc se trouve <strong>toujours</strong> le jaune.
         🎯 <em>Règle principale :</em> la couleur latérale de l’arête doit correspondre au centre de la face voisine. Par exemple, la pièce blanc-bleu doit s’assembler précisément avec le centre bleu.</div>`,
        [de]: `<strong>Schritt 2. Weiße Linie.</strong><br>
            Bilde eine Linie aus dem weißen Zentrum und zwei Seitenelementen.<br><br>
         💡 <em>Trick:</em> Die Seitenfarben der weißen Fläche sind Blau, Grün, Rot und Orange. Und gegenüber dem weißen Zentrum ist <strong>immer</strong> Gelb.
         🎯 <em>Hauptregel:</em> Die Seitenfarbe der Kante muss mit dem Zentrum der angrenzenden Fläche übereinstimmen. Zum Beispiel muss das weiß-blaue Element genau an das blaue Zentrum anschließen.</div>`,
        [ja]: `<strong>ステップ2。白の直線。</strong><br>
            白センターと2つのサイドパーツで線を作ります。<br><br>
         💡 <em>コツ：</em> 白面の側面カラーは青、緑、赤、オレンジです。そして白センターの反対側は<strong>常に</strong>黄色です。
         🎯 <em>重要なルール：</em> エッジの側面カラーは隣接する面のセンターと一致させる必要があります。たとえば、白青エッジは青センターとぴったり合うようにします。</div>`,
        [pt_BR]: `<strong>Passo 2. Linha branca.</strong><br>
            Monte uma linha com o centro branco e dois elementos laterais.<br><br>
         💡 <em>Truque:</em> as cores laterais da face branca são azul, verde, vermelho e laranja. E oposto ao centro branco <strong>sempre</strong> está o amarelo.
         🎯 <em>Regra principal:</em> a cor lateral da aresta deve coincidir com o centro da face vizinha. Por exemplo, a peça branco-azul deve se encaixar exatamente com o centro azul.</div>`,
        [ar]: `<strong>الخطوة 2. الخط الأبيض.</strong><br>
            كوّن خطًا من المركز الأبيض وعنصرين جانبيين.<br><br>
         💡 <em>حيلة:</em> الألوان الجانبية للوجه الأبيض هي الأزرق والأخضر والأحمر والبرتقالي. ومقابل المركز الأبيض <strong>دائمًا</strong> يوجد الأصفر.
         🎯 <em>القاعدة الأساسية:</em> يجب أن يتطابق اللون الجانبي للحافة مع مركز الوجه المجاور. على سبيل المثال، يجب أن تتصل قطعة الأبيض-الأزرق بالمركز الأزرق تحديدًا.</div>`,
        [tr]: `<strong>Adım 2. Beyaz çizgi.</strong><br>
            Beyaz merkez ve iki yan parçayla bir çizgi oluşturun.<br><br>
         💡 <em>İpucu:</em> beyaz yüzün yan renkleri mavi, yeşil, kırmızı ve turuncudur. Beyaz merkezin karşısında ise <strong>her zaman</strong> sarı bulunur.
         🎯 <em>Ana kural:</em> kenarın yan rengi, komşu yüzün merkeziyle eşleşmelidir. Örneğin, beyaz-mavi parça tam olarak mavi merkezle birleşmelidir.</div>`,
    },

    "threeMessage": {
        [ru]: `<strong>Шаг 3. Белый крест.</strong><br> Добавьте оставшиеся два бело-цветных элемента, чтобы получился полный крест.<br><br>`,
        [en]: `<strong>Step 3. White cross.</strong><br> Add the remaining two white-colored elements to form a complete cross.<br><br>`,
        [sr]: `<strong>Корак 3. Бели крст.</strong><br> Додајте преостала два бело-обојена елемента да бисте добили пун крст.<br><br>`,
        [es]: `<strong>Paso 3. Cruz blanca.</strong><br> Añade los dos elementos blanco-color restantes para formar una cruz completa.<br><br>`,
        [zh_CN]: `<strong>第 3 步。白色十字。</strong><br> 添加剩下的两个白彩棱块，组成完整的十字。<br><br>`,
        [fr]: `<strong>Étape 3. Croix blanche.</strong><br> Ajoutez les deux éléments blanc-couleur restants pour former une croix complète.<br><br>`,
        [de]: `<strong>Schritt 3. Weißes Kreuz.</strong><br> Füge die beiden verbleibenden weiß-farbigen Elemente hinzu, um ein vollständiges Kreuz zu bilden.<br><br>`,
        [ja]: `<strong>ステップ3。白十字。</strong><br> 残り2つの白・色付きエッジを追加して、完全な十字を作ります。<br><br>`,
        [pt_BR]: `<strong>Passo 3. Cruz branca.</strong><br> Adicione os dois elementos branco-coloridos restantes para formar uma cruz completa.<br><br>`,
        [ar]: `<strong>الخطوة 3. الصليب الأبيض.</strong><br> أضف العنصرين المتبقيين بالأبيض والألوان لتكوين صليب كامل.<br><br>`,
        [tr]: `<strong>Adım 3. Beyaz haç.</strong><br> Kalan iki beyaz-renkli parçayı ekleyerek tam bir haç oluşturun.<br><br>`,
    },

    "fourMessage": {
        [ru]: `<strong>Шаг 4. Белые углы.</strong><br> Задача: поставить 4 угловых элемента с белым цветом на свои места.<br><br>
              🧩 <em>Принцип «Пятнашек»:</em> иногда нужно временно «разобрать» собранный крест, чтобы завести угол на место, а затем вернуть крест обратно. Попробуйте найти эту последовательность сами!`,
        [en]: `<strong>Step 4. White corners.</strong><br> Goal: place 4 corner pieces with white into their places.<br><br>
              🧩 <em>The "15-puzzle" principle:</em> sometimes you need to temporarily "disassemble" the completed cross to bring a corner into place, and then restore the cross. Try to find this sequence yourself!`,
        [sr]: `<strong>Корак 4. Бели углови.</strong><br> Задатак: поставити 4 угла са белом бојом на њихова места.<br><br>
              🧩 <em>Принцип „петнаест“ слагалице:</em> понекад треба привремено „раставити“ састављени крст да би се угао довео на место, а затим вратити крст. Покушајте сами да пронађете тај низ!`,
        [es]: `<strong>Paso 4. Esquinas blancas.</strong><br> Objetivo: colocar 4 esquinas con blanco en su sitio.<br><br>
              🧩 <em>Principio del «puzle de 15»:</em> a veces hay que «desarmar» temporalmente la cruz ya resuelta para colocar una esquina en su lugar y luego devolver la cruz. ¡Intenta encontrar esa secuencia tú mismo!`,
        [zh_CN]: `<strong>第 4 步。白色角块。</strong><br> 目标：把 4 个带白色的角块放到正确位置。<br><br>
              🧩 <em>类似“十五数码”的原则：</em> 有时需要暂时“拆开”已完成的十字，把角块送入位置，然后再把十字还原。试着自己找到这个步骤！`,
        [fr]: `<strong>Étape 4. Coins blancs.</strong><br> Objectif : placer 4 coins avec du blanc à leur place.<br><br>
              🧩 <em>Principe du « taquin » :</em> il faut parfois « démonter » temporairement la croix déjà formée pour amener un coin à sa place, puis remettre la croix. Essayez de trouver cette séquence vous-même !`,
        [de]: `<strong>Schritt 4. Weiße Ecken.</strong><br> Aufgabe: Bringe 4 Ecksteine mit Weiß an ihren Platz.<br><br>
              🧩 <em>Prinzip des „Schiebepuzzles“:</em> Manchmal muss man das fertige Kreuz vorübergehend „auseinandernehmen“, um eine Ecke an ihren Platz zu bringen, und das Kreuz dann zurückbauen. Versuche, diese Sequenz selbst zu finden!`,
        [ja]: `<strong>ステップ4。白いコーナー。</strong><br> 目標：白を含む4つのコーナーパーツを正しい位置に置きます。<br><br>
              🧩 <em>「15パズル」の原理：</em> 完成した十字を一時的に「崩して」コーナーを所定位置に導き、その後で十字を戻すことがあります。この手順を自分で見つけてみましょう！`,
        [pt_BR]: `<strong>Passo 4. Cantos brancos.</strong><br> Objetivo: colocar 4 cantos com branco em seus lugares.<br><br>
              🧩 <em>Princípio do «quebra-cabeça de 15»:</em> às vezes é preciso «desmontar» temporariamente a cruz montada para levar um canto ao lugar e depois recolocar a cruz. Tente encontrar essa sequência sozinho!`,
        [ar]: `<strong>الخطوة 4. الزوايا البيضاء.</strong><br> المهمة: وضع 4 قطع زاوية تحتوي على الأبيض في أماكنها الصحيحة.<br><br>
              🧩 <em>مبدأ «لعبة الخمسة عشر»:</em> أحيانًا نحتاج إلى «تفكيك» الصليب المكتمل مؤقتًا لإدخال زاوية إلى مكانها، ثم إعادة الصليب كما كان. حاول أن تجد هذا التسلسل بنفسك!`,
        [tr]: `<strong>Adım 4. Beyaz köşeler.</strong><br> Görev: beyaz içeren 4 köşe parçasını doğru yerlerine yerleştirmek.<br><br>
              🧩 <em>«15'li bulmaca» ilkesi:</em> bazen bir köşeyi yerine getirmek için tamamlanmış haçı geçici olarak «dağıtmak», sonra haçı geri getirmek gerekir. Bu diziyi kendin bulmayı dene!`,
    },

    "fiveMessage": {
        [ru]: `<strong>Шаг 5. Второй слой.</strong><br>
            😀 Моя рекомендация: перевернуть куб, но когда завершишь 2 слой верни положение куба в изначальное состояние, чтобы перейти на следующий шаг <br>
            Теперь наша цель — средний ярус. Белый слой должен остаться снизу нетронутым.<br><br>
            🧠 <em>Пища для размышлений:</em><br>
            1. Найдите на верхнем (жёлтом) слое ребро, на котором <strong>нет жёлтого цвета</strong>.<br>
            2. Поверните верх, чтобы боковой цвет этого ребра совпал с центром грани, образуя перевернутую букву "Т".<br>
            3. <em>Вопрос:</em> как опустить это ребро вниз, не разрушив белый слой?<br>
            💡 <em>Подсказка в видео:</em> обратите внимание, как кубик временно "разбирается", чтобы пропустить элемент, а затем собирается обратно.`,
        [en]: `<strong>Step 5. Second layer.</strong><br>
            😀 My recommendation: turn the cube over, but when you finish the 2nd layer, return the cube to its original position to move on to the next step <br>
            Now our goal is the middle layer. The white layer must remain untouched at the bottom.<br><br>
            🧠 <em>Food for thought:</em><br>
            1. Find an edge in the top (yellow) layer that <strong>has no yellow</strong>.<br>
            2. Turn the top so that the side color of this edge matches the center of the face, forming an upside-down "T".<br>
            3. <em>Question:</em> how can you lower this edge without destroying the white layer?<br>
            💡 <em>Video hint:</em> pay attention to how the cube is temporarily "disassembled" to let the piece through, and then assembled back.`,
        [sr]: `<strong>Корак 5. Други слој.</strong><br>
            😀 Моја препорука: окрените коцку, али када завршите 2. слој, вратите коцку у почетни положај да бисте прешли на следећи корак <br>
            Сада је наш циљ средњи слој. Бели слој мора да остане нетакнут на дну.<br><br>
            🧠 <em>Храна за размишљање:</em><br>
            1. Пронађите на горњем (жутом) слоју ивицу која <strong>нема жуту боју</strong>.<br>
            2. Окрените горњи слој тако да се бочна боја ове ивице поклопи са центром стране, формирајући обрнуто слово "Т".<br>
            3. <em>Питање:</em> како спустити ову ивицу доле, а да не уништите бели слој?<br>
            💡 <em>Савет у видеу:</em> обратите пажњу како се коцка привремено „раставља“ да пропусти елемент, а затим поново саставља.`,
        [es]: `<strong>Paso 5. Segunda capa.</strong><br>
            😀 Mi recomendación: girar el cubo, pero cuando termines la 2.ª capa, devuelve el cubo a su posición inicial para pasar al siguiente paso <br>
            Ahora nuestro objetivo es la capa intermedia. La capa blanca debe permanecer intacta abajo.<br><br>
            🧠 <em>Para reflexionar:</em><br>
            1. Encuentra en la capa superior (amarilla) una arista que <strong>no tenga amarillo</strong>.<br>
            2. Gira la parte superior para que el color lateral de esa arista coincida con el centro de la cara, formando una "T" invertida.<br>
            3. <em>Pregunta:</em> ¿cómo bajar esa arista sin destruir la capa blanca?<br>
            💡 <em>Pista en el vídeo:</em> observa cómo el cubo se "desarma" temporalmente para insertar la pieza y luego se vuelve a armar.`,
        [zh_CN]: `<strong>第 5 步。第二层。</strong><br>
            😀 我的建议：把魔方翻转过来，但完成第 2 层后，要把魔方恢复到初始方向，以便进入下一步 <br>
            现在目标是中间层。白色层应保持在底部不受影响。<br><br>
            🧠 <em>思考一下：</em><br>
            1. 在上层（黄色层）找到一块<strong>没有黄色</strong>的棱块。<br>
            2. 转动顶层，使这块棱块的侧边颜色与所在面的中心颜色一致，形成倒“T”字。<br>
            3. <em>问题：</em> 如何在不破坏白色层的情况下，把这块棱块放下去？<br>
            💡 <em>视频提示：</em> 注意魔方如何被暂时“拆开”来让棱块通过，然后再复原。`,
        [fr]: `<strong>Étape 5. Deuxième couche.</strong><br>
            😀 Ma recommandation : retourner le cube, mais lorsque vous terminez la 2e couche, remettez le cube dans sa position initiale pour passer à l’étape suivante <br>
            Maintenant, notre objectif est la couche intermédiaire. La couche blanche doit rester intacte en bas.<br><br>
            🧠 <em>À méditer :</em><br>
            1. Trouvez sur la couche supérieure (jaune) une arête qui <strong>n’a pas de jaune</strong>.<br>
            2. Tournez le haut pour que la couleur latérale de cette arête corresponde au centre de la face, formant un « T » inversé.<br>
            3. <em>Question :</em> comment descendre cette arête sans détruire la couche blanche ?<br>
            💡 <em>Indice vidéo :</em> observez comment le cube est temporairement « démonté » pour laisser passer la pièce, puis remonté.`,
        [de]: `<strong>Schritt 5. Zweite Ebene.</strong><br>
            😀 Meine Empfehlung: Drehe den Würfel, aber wenn du die 2. Ebene fertigstellst, bringe den Würfel in die ursprüngliche Position zurück, um zum nächsten Schritt überzugehen <br>
            Jetzt ist unser Ziel die mittlere Ebene. Die weiße Ebene muss unten unberührt bleiben.<br><br>
            🧠 <em>Denkanstoß:</em><br>
            1. Finde in der oberen (gelben) Ebene eine Kante, die <strong>kein Gelb enthält</strong>.<br>
            2. Drehe die Oberseite, sodass die Seitenfarbe dieser Kante mit dem Zentrum der Fläche übereinstimmt und ein umgekehrtes „T“ entsteht.<br>
            3. <em>Frage:</em> Wie kann man diese Kante nach unten bringen, ohne die weiße Ebene zu zerstören?<br>
            💡 <em>Hinweis im Video:</em> Achte darauf, wie der Würfel vorübergehend „auseinandergenommen“ wird, um das Element durchzulassen, und dann wieder zusammengesetzt wird.`,
        [ja]: `<strong>ステップ5。2層目。</strong><br>
            😀 私のおすすめ：キューブを反転させますが、2層目を完成させたら、次のステップに進むためにキューブを元の向きに戻してください <br>
            次の中間層が目標です。白の層は下のまま崩さないようにします。<br><br>
            🧠 <em>考えてみましょう：</em><br>
            1. 上層（黄色）で、<strong>黄色がない</strong>エッジを見つけます。<br>
            2. 上層を回して、そのエッジの側面カラーが面のセンターと一致し、逆「T」字を作ります。<br>
            3. <em>質問：</em> 白い層を壊さずに、このエッジを下ろすにはどうすればよいでしょうか？<br>
            💡 <em>動画のヒント：</em> キューブが一時的に「崩れて」パーツを通し、その後戻る様子に注目してください。`,
        [pt_BR]: `<strong>Passo 5. Segunda camada.</strong><br>
            😀 Minha recomendação: virar o cubo, mas ao terminar a 2ª camada, retorne o cubo à posição inicial para passar ao próximo passo <br>
            Agora nosso objetivo é a camada intermediária. A camada branca deve permanecer intacta embaixo.<br><br>
            🧠 <em>Para refletir:</em><br>
            1. Encontre na camada superior (amarela) uma aresta que <strong>não tenha amarelo</strong>.<br>
            2. Gire o topo para que a cor lateral dessa aresta coincida com o centro da face, formando um "T" invertido.<br>
            3. <em>Pergunta:</em> como descer essa aresta sem destruir a camada branca?<br>
            💡 <em>Dica no vídeo:</em> observe como o cubo é temporariamente "desmontado" para deixar a peça passar e depois é montado de volta.`,
        [ar]: `<strong>الخطوة 5. الطبقة الثانية.</strong><br>
            😀 توصيتي: اقلب المكعب، ولكن عندما تُكمل الطبقة الثانية أعد المكعب إلى وضعه الأصلي للانتقال إلى الخطوة التالية <br>
            الآن هدفنا هو الطبقة الوسطى. يجب أن تبقى الطبقة البيضاء في الأسفل دون أن تتأثر.<br><br>
            🧠 <em>موضوع للتفكير:</em><br>
            1. ابحث في الطبقة العليا (الصفراء) عن حافة <strong>لا تحتوي على الأصفر</strong>.<br>
            2. أدر الطبقة العليا بحيث يتطابق اللون الجانبي لهذه الحافة مع مركز الوجه، لتشكّل حرف "T" مقلوبًا.<br>
            3. <em>سؤال:</em> كيف ننزل هذه الحافة دون تدمير الطبقة البيضاء؟<br>
            💡 <em>تلميح في الفيديو:</em> لاحظ كيف "يُفكك" المكعب مؤقتًا لتمرير القطعة ثم يُعاد تركيبه.`,
        [tr]: `<strong>Adım 5. İkinci katman.</strong><br>
            😀 Tavsiyem: küpü ters çevir, ancak 2. katmanı bitirdiğinde bir sonraki adıma geçmek için küpü başlangıç konumuna geri getir <br>
            Şimdi hedefimiz orta katman. Beyaz katman altta bozulmadan kalmalı.<br><br>
            🧠 <em>Düşünmek için:</em><br>
            1. Üst (sarı) katmanda <strong>sarı içermeyen</strong> bir kenar bul.<br>
            2. Üst katmanı, bu kenarın yan rengi yüzün merkeziyle eşleşecek ve ters "T" harfi oluşturacak şekilde döndür.<br>
            3. <em>Soru:</em> beyaz katmanı bozmadan bu kenarı nasıl aşağı indirebiliriz?<br>
            💡 <em>Videodaki ipucu:</em> küpün parçayı geçirmek için geçici olarak nasıl "dağıtıldığına" ve sonra yeniden toplandığına dikkat et.`,
    },

    "sixMessage": {
        [ru]: `<strong>Шаг 6. Жёлтый крест.</strong><br>
              Переверните кубик жёлтым центром вверх. Теперь собираем крест на верхней грани.<br><br>
              🔍 <em>Найдите паттерн:</em> игнорируйте углы, смотрите только на жёлтые рёбра. Вы увидите одну из трёх фигур:<br>
               • <strong>Точка</strong> (только центр)<br>
               • <strong>Галочка</strong> (уголок, как стрелка часов на 9:00)<br>
               • <strong>Линия</strong> (горизонтальная полоса)<br><br>
              🧠 <em>Задача:</em> существует одна универсальная последовательность из 6 ходов, которая превращает Точку → в Галочку → в Линию → в Крест. Попробуйте найти её, сохраняя нижние два слоя собранными!<br><br>
              ⚠️ <em>Важно:</em> ориентация рёбер пока не важна — главное, чтобы жёлтые наклейки смотрели вверх.`,
        [en]: `<strong>Step 6. Yellow cross.</strong><br>
              Turn the cube with the yellow center up. Now we make a cross on the top face.<br><br>
              🔍 <em>Find the pattern:</em> ignore the corners, look only at the yellow edges. You will see one of three shapes:<br>
               • <strong>Dot</strong> (only the center)<br>
               • <strong>Hook</strong> (a corner, like a clock hand at 9:00)<br>
               • <strong>Line</strong> (a horizontal bar)<br><br>
              🧠 <em>Task:</em> there is one universal 6-move sequence that turns Dot → Hook → Line → Cross. Try to find it while keeping the bottom two layers solved!<br><br>
              ⚠️ <em>Important:</em> the orientation of the edges is not important yet — the main thing is that the yellow stickers face up.`,
        [sr]: `<strong>Корак 6. Жути крст.</strong><br>
              Окрените коцку жутим центром нагоре. Сада правимо крст на горњој страни.<br><br>
              🔍 <em>Пронађите образац:</em> игноришите углове, гледајте само жуте ивице. Видећете један од три облика:<br>
               • <strong>Тачка</strong> (само центар)<br>
               • <strong>Кука</strong> (угао, као казаљка на 9:00)<br>
               • <strong>Линија</strong> (хоризонтална трака)<br><br>
              🧠 <em>Задатак:</em> постоји један универзални низ од 6 потеза који претвара Тачку → Куку → Линију → Крст. Покушајте да га пронађете док доња два слоја остају састављена!<br><br>
              ⚠️ <em>Важно:</em> оријентација ивица још није важна — главно је да жуте налепнице гледају нагоре.`,
        [es]: `<strong>Paso 6. Cruz amarilla.</strong><br>
              Gira el cubo con el centro amarillo hacia arriba. Ahora formamos la cruz en la cara superior.<br><br>
              🔍 <em>Encuentra el patrón:</em> ignora las esquinas, mira solo las aristas amarillas. Verás una de estas tres figuras:<br>
               • <strong>Punto</strong> (solo el centro)<br>
               • <strong>Gancho</strong> (una esquina, como la manecilla a las 9:00)<br>
               • <strong>Línea</strong> (una franja horizontal)<br><br>
              🧠 <em>Tarea:</em> existe una secuencia universal de 6 movimientos que convierte Punto → Gancho → Línea → Cruz. ¡Intenta encontrarla manteniendo las dos capas inferiores resueltas!<br><br>
              ⚠️ <em>Importante:</em> la orientación de las aristas aún no importa; lo principal es que las pegatinas amarillas miren hacia arriba.`,
        [zh_CN]: `<strong>第 6 步。黄色十字。</strong><br>
              把魔方翻到黄色中心朝上。现在在上层做十字。<br><br>
              🔍 <em>寻找图案：</em> 忽略角块，只看黄色棱块。你会看到三种形状之一：<br>
               • <strong>点</strong>（只有中心）<br>
               • <strong>勾</strong>（一个角，像指向 9:00 的时针）<br>
               • <strong>线</strong>（水平横条）<br><br>
              🧠 <em>任务：</em> 有一个通用的 6 步序列，可以把点 → 勾 → 线 → 十字。试着在保持下面两层完成的情况下找到它！<br><br>
              ⚠️ <em>重要：</em> 棱块方向暂时不重要——关键是黄色贴纸朝上。`,
        [fr]: `<strong>Étape 6. Croix jaune.</strong><br>
              Retournez le cube avec le centre jaune vers le haut. Nous formons maintenant la croix sur la face supérieure.<br><br>
              🔍 <em>Trouvez le motif :</em> ignorez les coins, regardez seulement les arêtes jaunes. Vous verrez l’une des trois figures :<br>
               • <strong>Point</strong> (seulement le centre)<br>
               • <strong>Crochet</strong> (un coin, comme l’aiguille sur 9:00)<br>
               • <strong>Ligne</strong> (une bande horizontale)<br><br>
              🧠 <em>Tâche :</em> il existe une séquence universelle de 6 mouvements qui transforme Point → Crochet → Ligne → Croix. Essayez de la trouver en gardant les deux couches inférieures résolues !<br><br>
              ⚠️ <em>Important :</em> l’orientation des arêtes n’est pas encore importante — l’essentiel est que les autocollants jaunes regardent vers le haut.`,
        [de]: `<strong>Schritt 6. Gelbes Kreuz.</strong><br>
              Drehe den Würfel mit dem gelben Zentrum nach oben. Jetzt bilden wir das Kreuz auf der oberen Fläche.<br><br>
              🔍 <em>Finde das Muster:</em> Ignoriere die Ecken, schaue nur auf die gelben Kanten. Du siehst eine von drei Figuren:<br>
               • <strong>Punkt</strong> (nur das Zentrum)<br>
               • <strong>Haken</strong> (eine Ecke, wie der Uhrzeiger auf 9:00)<br>
               • <strong>Linie</strong> (ein horizontaler Streifen)<br><br>
              🧠 <em>Aufgabe:</em> Es gibt eine universelle Sequenz aus 6 Zügen, die Punkt → Haken → Linie → Kreuz verwandelt. Versuche, sie zu finden, während die unteren zwei Ebenen gelöst bleiben!<br><br>
              ⚠️ <em>Wichtig:</em> Die Orientierung der Kanten ist noch nicht wichtig — Hauptsache, die gelben Aufkleber zeigen nach oben.`,
        [ja]: `<strong>ステップ6。黄色い十字。</strong><br>
              黄色センターが上になるようにキューブを反転します。次に上面で十字を作ります。<br><br>
              🔍 <em>パターンを見つける：</em> コーナーは無視し、黄色いエッジだけを見ます。次の3つの形のどれかになります：<br>
               • <strong>点</strong>（センターのみ）<br>
               • <strong>フック</strong>（9時の時計針のような角）<br>
               • <strong>線</strong>（横棒）<br><br>
              🧠 <em>課題：</em> 点 → フック → 線 → 十字 に変える、6手の万能シーケンスが1つあります。下2層を揃えたまま、それを見つけてみましょう！<br><br>
              ⚠️ <em>重要：</em> エッジの向きはまだ重要ではありません——黄色いステッカーが上を向いていれば大丈夫です。`,
        [pt_BR]: `<strong>Passo 6. Cruz amarela.</strong><br>
              Vire o cubo com o centro amarelo para cima. Agora montamos a cruz na face superior.<br><br>
              🔍 <em>Encontre o padrão:</em> ignore os cantos, olhe apenas para as arestas amarelas. Você verá uma destas três figuras:<br>
               • <strong>Ponto</strong> (apenas o centro)<br>
               • <strong>Gancho</strong> (um canto, como o ponteiro às 9:00)<br>
               • <strong>Linha</strong> (uma faixa horizontal)<br><br>
              🧠 <em>Tarefa:</em> existe uma sequência universal de 6 movimentos que transforma Ponto → Gancho → Linha → Cruz. Tente encontrá-la mantendo as duas camadas de baixo resolvidas!<br><br>
              ⚠️ <em>Importante:</em> a orientação das arestas ainda não importa — o principal é que os adesivos amarelos apontem para cima.`,
        [ar]: `<strong>الخطوة 6. الصليب الأصفر.</strong><br>
              اقلب المكعب بحيث يكون المركز الأصفر في الأعلى. الآن نكوّن الصليب على الوجه العلوي.<br><br>
              🔍 <em>ابحث عن النمط:</em> تجاهل الزوايا، وانظر فقط إلى الحواف الصفراء. سترى أحد الأشكال الثلاثة:<br>
               • <strong>نقطة</strong> (المركز فقط)<br>
               • <strong>خطاف</strong> (زاوية، مثل عقرب الساعة عند 9:00)<br>
               • <strong>خط</strong> (شريط أفقي)<br><br>
              🧠 <em>المهمة:</em> يوجد تسلسل عالمي من 6 حركات يحوّل النقطة → الخطاف → الخط → الصليب. حاول العثور عليه مع إبقاء الطبقتين السفليتين مكتملتين!<br><br>
              ⚠️ <em>مهم:</em> اتجاه الحواف غير مهم الآن — الأهم أن تتجه الملصقات الصفراء إلى الأعلى.`,
        [tr]: `<strong>Adım 6. Sarı haç.</strong><br>
              Küpü sarı merkez yukarı bakacak şekilde çevir. Şimdi üst yüzde haç oluşturuyoruz.<br><br>
              🔍 <em>Deseni bul:</em> köşeleri yok say, sadece sarı kenarlara bak. Şu üç şekilden birini göreceksin:<br>
               • <strong>Nokta</strong> (sadece merkez)<br>
               • <strong>Kanca</strong> (saat 9:00 yönündeki ibrik gibi bir köşe)<br>
               • <strong>Çizgi</strong> (yatay şerit)<br><br>
              🧠 <em>Görev:</em> Nokta → Kanca → Çizgi → Haç dönüşümünü sağlayan 6 hamlelik evrensel bir dizi vardır. Alt iki katmanı çözülmüş tutarak onu bulmayı dene!<br><br>
              ⚠️ <em>Önemli:</em> kenarların yönü henüz önemli değil — önemli olan sarı çıkartmaların yukarı bakması.`,
    },

    "sevenMessage": {
        [ru]: `<strong>Шаг 7. Расставить углы.</strong><br>
              Теперь нужно поставить 4 жёлтых угла на <strong>правильные места</strong>.<br><br>
              🎯 <em>Что значит "правильное место"?</em> Угол должен находиться между тремя центрами тех же цветов. Например, красно-сине-жёлтый угол должен стоять на пересечении красного, синего и жёлтого центров.<br><br>
              <em>Подсказка:</em> ориентация угла пока не важна — жёлтый может смотреть куда угодно. Главное, чтобы угол стоял между правильными центрами.<br><br>
              💡 <em>В видео:</em> обратите внимание на алгоритм, который меняет местами 3 угла, не трогая четвёртый.`,
        [en]: `<strong>Step 7. Place the corners.</strong><br>
              Now you need to put the 4 yellow corners in the <strong>correct places</strong>.<br><br>
              🎯 <em>What does "correct place" mean?</em> A corner must be between the three centers of the same colors. For example, the red-blue-yellow corner must be at the intersection of the red, blue, and yellow centers.<br><br>
              <em>Hint:</em> the orientation of the corner is not important yet — yellow can face anywhere. The main thing is that the corner is between the correct centers.<br><br>
              💡 <em>In the video:</em> pay attention to the algorithm that swaps 3 corners without touching the fourth.`,
        [sr]: `<strong>Корак 7. Поставите углове.</strong><br>
              Сада треба поставити 4 жута угла на <strong>правилна места</strong>.<br><br>
              🎯 <em>Шта значи "правилно место"?</em> Угао мора бити између три центра истих боја. На пример, црвено-плаво-жути угао мора стајати на пресеку црвеног, плавог и жутог центра.<br><br>
              <em>Савет:</em> оријентација угла још није важна — жуто може гледати било где. Главно је да угао стоји између правилних центра.<br><br>
              💡 <em>У видеу:</em> обратите пажњу на алгоритам који мења места 3 угла, не дирајући четврти.`,
        [es]: `<strong>Paso 7. Colocar las esquinas.</strong><br>
              Ahora hay que poner las 4 esquinas amarillas en los <strong>lugares correctos</strong>.<br><br>
              🎯 <em>¿Qué significa "lugar correcto"?</em> La esquina debe estar entre los tres centros de sus mismos colores. Por ejemplo, la esquina rojo-azul-amarilla debe estar en la intersección de los centros rojo, azul y amarillo.<br><br>
              <em>Pista:</em> la orientación de la esquina aún no importa — el amarillo puede mirar a cualquier lado. Lo principal es que la esquina esté entre los centros correctos.<br><br>
              💡 <em>En el vídeo:</em> presta atención al algoritmo que intercambia 3 esquinas sin tocar la cuarta.`,
        [zh_CN]: `<strong>第 7 步。放置角块。</strong><br>
              现在需要把 4 个黄色角块放到<strong>正确位置</strong>。<br><br>
              🎯 <em>什么是“正确位置”？</em> 角块必须位于三个相同颜色中心之间。例如，红-蓝-黄角块应位于红色、蓝色和黄色中心的交界处。<br><br>
              <em>提示：</em> 角块方向暂时不重要——黄色可以朝向任意方向。关键是角块要位于正确的中心之间。<br><br>
              💡 <em>视频中：</em> 注意那个交换 3 个角块而不动第 4 个的算法。`,
        [fr]: `<strong>Étape 7. Placer les coins.</strong><br>
              Il faut maintenant placer les 4 coins jaunes aux <strong>bons emplacements</strong>.<br><br>
              🎯 <em>Que signifie « bon emplacement » ?</em> Le coin doit se trouver entre les trois centres de mêmes couleurs. Par exemple, le coin rouge-bleu-jaune doit être à l’intersection des centres rouge, bleu et jaune.<br><br>
              <em>Indice :</em> l’orientation du coin n’est pas encore importante — le jaune peut regarder n’importe où. L’essentiel est que le coin soit entre les bons centres.<br><br>
              💡 <em>Dans la vidéo :</em> observez l’algorithme qui échange 3 coins sans toucher le quatrième.`,
        [de]: `<strong>Schritt 7. Ecken platzieren.</strong><br>
              Jetzt müssen die 4 gelben Ecken an die <strong>richtigen Plätze</strong> gebracht werden.<br><br>
              🎯 <em>Was bedeutet „richtiger Platz“?</em> Die Ecke muss zwischen den drei Zentren derselben Farben liegen. Zum Beispiel muss die rot-blau-gelbe Ecke am Schnittpunkt der roten, blauen und gelben Zentren stehen.<br><br>
              <em>Hinweis:</em> Die Orientierung der Ecke ist noch nicht wichtig — Gelb kann überall hinzeigen. Hauptsache, die Ecke liegt zwischen den richtigen Zentren.<br><br>
              💡 <em>Im Video:</em> Achte auf den Algorithmus, der 3 Ecken vertauscht, ohne die vierte zu berühren.`,
        [ja]: `<strong>ステップ7。コーナーを配置。</strong><br>
              次に、4つの黄色いコーナーを<strong>正しい位置</strong>に置きます。<br><br>
              🎯 <em>「正しい位置」とは？</em> コーナーは、同じ色の3つのセンターの間に来る必要があります。たとえば、赤-青-黄のコーナーは、赤、青、黄のセンターの交点に置きます。<br><br>
              <em>ヒント：</em> コーナーの向きはまだ重要ではありません——黄色はどこを向いていても構いません。大切なのは、正しいセンターの間にあることです。<br><br>
              💡 <em>動画内：</em> 4つ目のコーナーに触れずに3つのコーナーを入れ替えるアルゴリズムに注目してください。`,
        [pt_BR]: `<strong>Passo 7. Posicionar os cantos.</strong><br>
              Agora é preciso colocar os 4 cantos amarelos nos <strong>lugares corretos</strong>.<br><br>
              🎯 <em>O que significa "lugar correto"?</em> O canto deve ficar entre os três centros das mesmas cores. Por exemplo, o canto vermelho-azul-amarelo deve ficar na interseção dos centros vermelho, azul e amarelo.<br><br>
              <em>Dica:</em> a orientação do canto ainda não importa — o amarelo pode apontar para qualquer lado. O principal é que o canto fique entre os centros corretos.<br><br>
              💡 <em>No vídeo:</em> observe o algoritmo que troca 3 cantos sem mexer no quarto.`,
        [ar]: `<strong>الخطوة 7. ترتيب الزوايا.</strong><br>
              الآن يجب وضع الزوايا الصفراء الأربع في <strong>أماكنها الصحيحة</strong>.<br><br>
              🎯 <em>ما معنى "المكان الصحيح"؟</em> يجب أن تكون الزاوية بين ثلاثة مراكز بنفس ألوانها. على سبيل المثال، يجب أن تكون الزاوية الحمراء-الزرقاء-الصفراء عند تقاطع المراكز الأحمر والأزرق والأصفر.<br><br>
              <em>تلميح:</em> اتجاه الزاوية غير مهم حاليًا — يمكن أن يتجه الأصفر إلى أي جهة. الأهم أن تكون الزاوية بين المراكز الصحيحة.<br><br>
              💡 <em>في الفيديو:</em> لاحظ الخوارزمية التي تبدّل 3 زوايا دون المساس بالرابعة.`,
        [tr]: `<strong>Adım 7. Köşeleri yerleştir.</strong><br>
              Şimdi 4 sarı köşeyi <strong>doğru yerlere</strong> koymak gerekiyor.<br><br>
              🎯 <em>"Doğru yer" ne demek?</em> Köşe, aynı renkteki üç merkezin arasında olmalıdır. Örneğin, kırmızı-mavi-sarı köşe, kırmızı, mavi ve sarı merkezlerin kesişiminde olmalıdır.<br><br>
              <em>İpucu:</em> köşenin yönü henüz önemli değil — sarı herhangi bir yöne bakabilir. Önemli olan köşenin doğru merkezler arasında olmasıdır.<br><br>
              💡 <em>Videoda:</em> dördüncü köşeye dokunmadan 3 köşeyi yer değiştiren algoritmaya dikkat et.`,
    },

    "eightMessage": {
        [ru]: `<strong>Шаг 8. Развернуть углы. Финал!</strong><br>
               Последний шаг — развернуть углы так, чтобы жёлтый смотрел вверх.<br><br>
              ⚠️ <em>Внимание:</em> при развороте одного угла нижние слои <strong>временно разрушатся</strong>. Это нормально! Не паникуйте.<br><br>
              <em>Принцип:</em> используйте одну и ту же короткую последовательность (4 хода) для каждого угла. После разворота всех углов кубик магическим образом соберётся сам.<br><br>
              🎉 <em>Поздравляем! После этого шага кубик будет полностью собран!</em>`,
        [sr]: `<strong>Корак 8. Окрените углове. Финале!</strong><br>
               Последњи корак је да окренете углове тако да жуто гледа нагоре.<br><br>
              ⚠️ <em>Пажња:</em> при окретању једног угла, доњи слојеви ће се <strong>привремено разрушити</strong>. То је нормално! Не паничите.<br><br>
              <em>Принцип:</em> користите исти кратак низ (4 потеза) за сваки угао. Након окретања свих углова, коцка ће се магично сама саставити.<br><br>
              🎉 <em>Честитамо! Након овог корака коцка ће бити потпуно састављена!</em>`,
        [en]: `<strong>Step 8. Rotate the corners. Final!</strong><br>
              The last step is to rotate the corners so that yellow faces up.<br><br>
             ⚠️ <em>Attention:</em> when rotating one corner, the lower layers will <strong>temporarily break</strong>. This is normal! Don't panic.<br><br>
             <em>Principle:</em> use the same short sequence (4 moves) for each corner. After rotating all corners, the cube will magically solve itself.<br><br>
             🎉 <em>Congratulations! After this step, the cube will be completely solved!</em>`,
        [es]: `<strong>Paso 8. Girar las esquinas. ¡Final!</strong><br>
               El último paso es girar las esquinas para que el amarillo mire hacia arriba.<br><br>
              ⚠️ <em>Atención:</em> al girar una esquina, las capas inferiores se <strong>romperán temporalmente</strong>. ¡Es normal! No entres en pánico.<br><br>
              <em>Principio:</em> usa la misma secuencia corta (4 movimientos) para cada esquina. Después de girar todas las esquinas, el cubo se resolverá mágicamente solo.<br><br>
              🎉 <em>¡Felicidades! Después de este paso, el cubo estará completamente resuelto.</em>`,
        [zh_CN]: `<strong>第 8 步。翻转角块。最终步！</strong><br>
               最后一步——翻转角块，让黄色朝上。<br><br>
              ⚠️ <em>注意：</em> 翻转一个角块时，下面几层会<strong>暂时被打乱</strong>。这是正常的！不要慌。<br><br>
              <em>原则：</em> 对每个角块使用同一个短序列（4 步）。所有角块翻转完成后，魔方会神奇地自动复原。<br><br>
              🎉 <em>恭喜！完成这一步后，魔方将完全还原！</em>`,
        [fr]: `<strong>Étape 8. Orienter les coins. Final !</strong><br>
               La dernière étape consiste à orienter les coins pour que le jaune regarde vers le haut.<br><br>
              ⚠️ <em>Attention :</em> lorsque vous tournez un coin, les couches inférieures <strong>se cassent temporairement</strong>. C’est normal ! Ne paniquez pas.<br><br>
              <em>Principe :</em> utilisez la même courte séquence (4 mouvements) pour chaque coin. Après avoir orienté tous les coins, le cube se résoudra comme par magie.<br><br>
              🎉 <em>Félicitations ! Après cette étape, le cube sera entièrement résolu !</em>`,
        [de]: `<strong>Schritt 8. Ecken drehen. Finale!</strong><br>
               Der letzte Schritt ist, die Ecken so zu drehen, dass Gelb nach oben zeigt.<br><br>
              ⚠️ <em>Achtung:</em> Beim Drehen einer Ecke werden die unteren Ebenen <strong>vorübergehend zerstört</strong>. Das ist normal! Keine Panik.<br><br>
              <em>Prinzip:</em> Verwende für jede Ecke dieselbe kurze Sequenz (4 Züge). Nach dem Drehen aller Ecken löst sich der Würfel wie von Zauberhand.<br><br>
              🎉 <em>Glückwunsch! Nach diesem Schritt ist der Würfel vollständig gelöst!</em>`,
        [ja]: `<strong>ステップ8。コーナーを回す。フィナーレ！</strong><br>
               最後のステップは、黄色が上を向くようにコーナーを回すことです。<br><br>
              ⚠️ <em>注意：</em> 1つのコーナーを回すと、下の層が<strong>一時的に崩れます</strong>。これは正常です！慌てないでください。<br><br>
              <em>原則：</em> 各コーナーに同じ短い手順（4手）を使います。すべてのコーナーを回し終えると、キューブは魔法のように自然と揃います。<br><br>
              🎉 <em>おめでとうございます！このステップの後、キューブは完全に揃います！</em>`,
        [pt_BR]: `<strong>Passo 8. Girar os cantos. Final!</strong><br>
               O último passo é girar os cantos para que o amarelo aponte para cima.<br><br>
              ⚠️ <em>Atenção:</em> ao girar um canto, as camadas de baixo <strong>se desfazem temporariamente</strong>. Isso é normal! Não entre em pânico.<br><br>
              <em>Princípio:</em> use a mesma sequência curta (4 movimentos) para cada canto. Depois de girar todos os cantos, o cubo se resolve magicamente sozinho.<br><br>
              🎉 <em>Parabéns! Após este passo, o cubo estará completamente resolvido!</em>`,
        [ar]: `<strong>الخطوة 8. تدوير الزوايا. النهاية!</strong><br>
               الخطوة الأخيرة هي تدوير الزوايا بحيث يتجه الأصفر إلى الأعلى.<br><br>
              ⚠️ <em>تنبيه:</em> عند تدوير زاوية واحدة، ستنهار الطبقات السفلية <strong>مؤقتًا</strong>. هذا طبيعي! لا داعي للذعر.<br><br>
              <em>المبدأ:</em> استخدم نفس التسلسل القصير (4 حركات) لكل زاوية. بعد تدوير جميع الزوايا، سيتجمع المكعب من تلقاء نفسه كالسحر.<br><br>
              🎉 <em>تهانينا! بعد هذه الخطوة سيكون المكعب مكتملًا بالكامل!</em>`,
        [tr]: `<strong>Adım 8. Köşeleri döndür. Final!</strong><br>
               Son adım, sarının yukarı bakması için köşeleri döndürmektir.<br><br>
              ⚠️ <em>Dikkat:</em> bir köşeyi döndürürken alt katmanlar <strong>geçici olarak bozulur</strong>. Bu normaldir! Panik yapma.<br><br>
              <em>İlke:</em> her köşe için aynı kısa diziyi (4 hamle) kullan. Tüm köşeler döndürüldükten sonra küp sihirli bir şekilde kendiliğinden çözülür.<br><br>
              🎉 <em>Tebrikler! Bu adımdan sonra küp tamamen çözülmüş olacak!</em>`,
    },
    
    "lb_loading": {
        [ru]: "Загрузка...",
        [sr]: "Учитавање...",
        [en]: "Loading...",
        [es]: "Cargando...",
        [zh_CN]: "加载中...",
        [fr]: "Chargement...",
        [de]: "Laden...",
        [ja]: "読み込み中...",
        [pt_BR]: "Carregando...",
        [ar]: "جارٍ التحميل...",
        [tr]: "Yükleniyor...",
    },

    "lb_unavailable": {
        [ru]: "Недоступно в локальном режиме",
        [sr]: "Недоступно у локалном режиму",
        [en]: "Unavailable in local mode",
        [es]: "No disponible en modo local",
        [zh_CN]: "本地模式下不可用",
        [fr]: "Indisponible en mode local",
        [de]: "Im lokalen Modus nicht verfügbar",
        [ja]: "ローカルモードでは利用できません",
        [pt_BR]: "Indisponível no modo local",
        [ar]: "غير متاح في الوضع المحلي",
        [tr]: "Yerel modda kullanılamaz",
    },

    "lb_no_data": {
        [ru]: "Пока нет записей. Будь первым!",
        [sr]: "Још нема записа. Буди први!",
        [en]: "No records yet. Be the first!",
        [es]: "Aún no hay registros. ¡Sé el primero!",
        [zh_CN]: "暂无记录。成为第一个！",
        [fr]: "Aucun enregistrement pour l'instant. Soyez le premier !",
        [de]: "Noch keine Einträge. Sei der Erste!",
        [ja]: "まだ記録がありません。最初になりましょう！",
        [pt_BR]: "Ainda não há registros. Seja o primeiro!",
        [ar]: "لا توجد سجلات بعد. كن الأول!",
        [tr]: "Henüz kayıt yok. İlk sen ol!",
    },

    "lb_anonymous": {
        [ru]: "Аноним",
        [sr]: "Аноним",
        [en]: "Anonymous",
        [es]: "Anónimo",
        [zh_CN]: "匿名",
        [fr]: "Anonyme",
        [de]: "Anonym",
        [ja]: "匿名",
        [pt_BR]: "Anônimo",
        [ar]: "مجهول",
        [tr]: "Anonim",
    },

    "loadingLeaders": {
        [ru]: "Загрузка...",
        [sr]: "Учитавање...",
        [en]: "Loading...",
        [es]: "Cargando...",
        [zh_CN]: "加载中...",
        [fr]: "Chargement...",
        [de]: "Laden...",
        [ja]: "読み込み中...",
        [pt_BR]: "Carregando...",
        [ar]: "جارٍ التحميل...",
        [tr]: "Yükleniyor...",
    },

    "textHintMusicCircle": {
        [ru]: "Нажми в любом месте чтобы включить музыку",
        [sr]: "Кликните било где да бисте укључили музику",
        [en]: "playing sound after click anyplace",
        [es]: "Haz clic en cualquier lugar para activar la música.",
        [zh_CN]: "点击任意位置即可播放音乐。",
        [fr]: "Cliquez n’importe où pour lancer la musique.",
        [de]: "Klicken Sie irgendwo, um die Musik zu starten.",
        [ja]: "音楽をオンにするには、任意の場所をタップします",
        [pt_BR]: "Toque em qualquer lugar para ligar a música",
        [ar]: "انقر في أي مكان لتشغيل الموسيقى",
        [tr]: "Tıkla herhangi bir yere müziği açmak için",
    }
};