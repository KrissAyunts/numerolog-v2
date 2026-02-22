console.log('Script loaded! Version 5.0 (Production)');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM ready v5.0');

    // Modal functionality
    const modal = document.getElementById('formModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    const modalClose = document.querySelector('.modal-close');

    window.toggleForm = function (formId) {
        const formContainer = document.getElementById(formId);
        if (!formContainer) return;

        // Set modal title based on form
        const titles = {
            'matrixFormContainer': 'Расчет Матрицы',
            'compatFormContainer': 'Расчет Совместимости',
            'kidsFormContainer': 'Расчет для Детей'
        };
        modalTitle.textContent = titles[formId] || 'Заполните данные';

        // Move form to modal
        modalBody.innerHTML = '';
        modalBody.appendChild(formContainer.cloneNode(true));
        const clonedForm = modalBody.querySelector('.form-container');
        clonedForm.classList.remove('hidden');

        // Store form type for later
        modalBody.dataset.formType = formId;

        // Show modal
        modal.classList.add('active');
    };

    // Close modal
    function closeModal() {
        modal.classList.remove('active');
    }

    if (modalClose) {
        modalClose.addEventListener('click', closeModal);
    }

    // Close on outside click
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Scroll Spy for Navigation
    const sections = document.querySelectorAll('.page-section, .hero-section');
    const navLinks = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        let currentSection = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Set initial active state

    // Mobile Menu Logic
    const toggleBtn = document.querySelector('.nav-toggle');
    const mobileMenu = document.getElementById('navLinks');

    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener('click', function (e) {
            e.preventDefault();
            mobileMenu.classList.toggle('active');
            toggleBtn.classList.toggle('active');
            document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                toggleBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }

    // DOM Elements - Main Calculator
    const form = document.getElementById('calcForm');
    const birthdateInput = document.getElementById('birthdate');
    const dateError = document.getElementById('dateError');
    const resultSection = document.getElementById('resultSection');
    const addNumbersEl = document.getElementById('addNumbers');
    const fateNumberEl = document.getElementById('fateNumber');
    const matrixGrid = document.getElementById('matrixGrid');

    // Navigation Logic
    // Navigation Logic: Removed for Landing Page (Anchor links handled by browser)
    // Smooth scrolling is handled via CSS.

    // --- Core Logic ---

    function sumDigits(num) {
        return String(num).split('').reduce((acc, digit) => acc + parseInt(digit, 10), 0);
    }

    function calculateNumerology(dateStr) {
        const cleanDate = dateStr.replace(/\./g, '');
        const day = parseInt(dateStr.split('.')[0], 10);

        const num1 = sumDigits(cleanDate);
        const num2 = sumDigits(num1);

        // Calculate num3: num1 - (2 * firstDigitOfDay)
        const dayString = String(day);
        const firstDigit = parseInt(dayString[0], 10);
        const num3 = num1 - (2 * firstDigit);

        const num4 = sumDigits(Math.abs(num3));

        const allNumbers = cleanDate + String(num1) + String(num2) + String(num3) + String(num4);

        const matrixCounts = {
            1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0
        };

        for (const char of allNumbers) {
            const digit = parseInt(char, 10);
            if (digit >= 1 && digit <= 9) {
                matrixCounts[digit]++;
            }
        }

        let fate = num2;
        while (fate > 9 && fate !== 11 && fate !== 22 && fate !== 33) {
            fate = sumDigits(fate);
        }

        return {
            additionalNumbers: [num1, num2, num3, num4],
            matrix: matrixCounts,
            fateNumber: fate
        };
    }

    // --- Main Calculator Rendering ---

    function renderResults(data) {
        const matrixLabels = {
            1: 'Характер', 2: 'Энергия', 3: 'Интерес',
            4: 'Здоровье', 5: 'Логика', 6: 'Труд',
            7: 'Удача', 8: 'Долг', 9: 'Память'
        };

        resultSection.classList.remove('hidden');

        // Additional Numbers
        const nums = data.additionalNumbers;
        addNumbersEl.textContent = `${nums[0]} • ${nums[1]} • ${nums[2]} • ${nums[3]}`;

        // Fate Number
        fateNumberEl.textContent = data.fateNumber;

        // Grid
        matrixGrid.innerHTML = '';
        const cellsOrder = [1, 4, 7, 2, 5, 8, 3, 6, 9];

        cellsOrder.forEach(digit => {
            const count = data.matrix[digit];
            // If count > 0 -> produce "111", else "-"
            const valueStr = count > 0 ? String(digit).repeat(count) : '-';

            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.setAttribute('data-label', matrixLabels[digit]);

            const valueEl = document.createElement('div');
            valueEl.className = 'cell-value ' + (count === 0 ? 'cell-empty' : '');
            valueEl.textContent = valueStr;

            cell.appendChild(valueEl);
            matrixGrid.appendChild(cell);
        });

        // Analysis Text
        const analysisContainer = document.getElementById('analysisContent');
        const analysisWrapper = document.getElementById('analysisText');

        // Ensure analysis wrapper exists in HTML or create it dynamically if needed (omitted here as per previous files)
        // Assuming it's not in the main structure anymore based on last HTML read, but keeping logic just in case.

        renderCTA(resultSection);
        // Scroll into view
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function formatAndValidateInput(e) {
        // Allow browser autocomplete to work by not fighting it on every keystroke if it's a massive change (paste/autofill)
        // But for typing we want masks.

        // Simple fix: if inputType is undefined (often autofill), skip or handle gently.
        // Actually, easiest way to enable history is to add name/autocomplete attributes in HTML.

        if (e.inputType === 'insertReplacementText' || !e.inputType) {
            // Likely autofill
            return;
        }

        if (e.inputType !== 'deleteContentBackward') {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 8) val = val.slice(0, 8);

            if (val.length >= 5) {
                val = val.slice(0, 2) + '.' + val.slice(2, 4) + '.' + val.slice(4);
            } else if (val.length >= 3) {
                val = val.slice(0, 2) + '.' + val.slice(2);
            }
            e.target.value = val;
        }
        if (dateError) dateError.textContent = '';
        e.target.style.borderColor = 'var(--glass-border)';
    }

    // Attach Input Formatter to ALL inputs
    document.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', formatAndValidateInput);
    });

    // --- Main Calculation Handler ---

    function handleMainCalculate(e) {
        if (e) e.preventDefault();

        const val = birthdateInput.value;
        const regex = /^(\d{2})\.(\d{2})\.(\d{4})$/;

        if (!regex.test(val)) {
            dateError.textContent = 'Введите полные данные: ДД.ММ.ГГГГ';
            birthdateInput.style.borderColor = '#ef4444';
            return;
        }

        const [_, d, m, y] = val.match(regex);
        if (d > 31 || m > 12) {
            dateError.textContent = 'Некорректная дата';
            return;
        }

        try {
            const results = calculateNumerology(val);
            renderResults(results);
        } catch (err) {
            console.error(err);
            alert('Ошибка расчета: ' + err.message);
        }
    }

    if (form) {
        form.addEventListener('submit', handleMainCalculate);
        const btn = form.querySelector('button[type="submit"]');
        if (btn) btn.addEventListener('click', handleMainCalculate);
    }

    // --- Compatibility Logic ---

    function calculateCompatibilityScore(date1, date2) {
        const p1 = calculateNumerology(date1);
        const p2 = calculateNumerology(date2);

        // Helper: Get value for a cell (default to 0) or sum of cells
        function getVal(m, ...cells) {
            return cells.reduce((acc, c) => acc + (m[c] || 0), 0);
        }

        // Helper: Calculate match percentage based on difference
        // Tuned to be more "forgiving": 
        // 0 diff = 99%
        // 1 diff = 88%
        // 2 diff = 75%
        // 3 diff = 50%
        function calcMatch(v1, v2, maxDiff = 4) {
            const diff = Math.abs(v1 - v2);
            if (diff === 0) return 99;
            if (diff === 1) return 88;
            if (diff === 2) return 75;
            if (diff === 3) return 60;
            // For larger diffs
            const pct = 100 - (diff / maxDiff) * 100;
            return Math.max(20, Math.round(pct));
        }

        // Helper: Custom logic for specific pairings
        function calcPairMatch(v1, v2, type) {
            // type 'complement': high-low is good (e.g. Energy)
            if (type === 'complement') {
                if ((v1 > 2 && v2 < 2) || (v1 < 2 && v2 > 2)) return 95;
                if (v1 === v2) return 60; // Neutral
                return 40; // Clashes
            }
            // type 'similar': similar values are good
            return calcMatch(v1, v2);
        }

        let breakdowns = [];

        // 1. Биоэнергетическая совместимость (Energy - Cell 2)
        // Complementary is best (Donor + Receiver)
        const en1 = getVal(p1.matrix, 2);
        const en2 = getVal(p2.matrix, 2);
        let enPct = 0;
        if ((en1 > 2 && en2 < 2) || (en1 < 2 && en2 > 2)) enPct = 99;
        else if (en1 >= 2 && en2 >= 2) enPct = 85; // Stable
        else enPct = 40; // Double leach
        breakdowns.push({ title: "Биоэнергетическая совместимость", percentage: enPct, text: enPct > 80 ? "Ваш энергообмен идеален." : "Возможен дефицит энергии в паре." });

        // 2. Чувство юмора и радость (Cell 3 + 5)
        const joy1 = getVal(p1.matrix, 3, 5);
        const joy2 = getVal(p2.matrix, 3, 5); // Logic + Interest
        const joyPct = calcMatch(joy1, joy2, 4);
        breakdowns.push({ title: "Чувство юмора", percentage: joyPct, text: "Совпадение кодов юмора и логики." });

        // 3. Совместимость по амбициям (Column 1: 1-2-3 Self? No, Rows usually. Let's use Goal Line 1-4-7)
        const amb1 = p1.additionalNumbers[0]; // Core number correlates often, but let's use matrix line
        const lineAmb1 = getVal(p1.matrix, 1, 4, 7);
        const lineAmb2 = getVal(p2.matrix, 1, 4, 7);
        const ambPct = calcMatch(lineAmb1, lineAmb2, 5);
        breakdowns.push({ title: "Совместимость по амбициям", percentage: ambPct, text: "Насколько синхронны ваши целеустремления." });

        // 4. Нацеленность на личный результат (Line 3-6-9?) -> Stability/Earth
        const res1 = getVal(p1.matrix, 3, 6, 9);
        const res2 = getVal(p2.matrix, 3, 6, 9);
        const resPct = calcMatch(res1, res2, 4);
        breakdowns.push({ title: "Нацеленность на результат", percentage: resPct, text: "Схожесть в методах достижения целей." });

        // 5. Стабильность в отношениях (Line 2-5-8 Family)
        const fam1 = getVal(p1.matrix, 2, 5, 8);
        const fam2 = getVal(p2.matrix, 2, 5, 8);
        const famPct = calcMatch(fam1, fam2, 3);
        breakdowns.push({ title: "Стабильность в отношениях", percentage: famPct, text: famPct > 70 ? "Вы оба цените семью." : "Разное отношение к узам брака." });

        // 6. Представление о родительстве (Closely tied to Family 2-5-8 but maybe Cell 8 Duty)
        const duty1 = getVal(p1.matrix, 8);
        const duty2 = getVal(p2.matrix, 8);
        const parPct = calcMatch(duty1, duty2, 3);
        breakdowns.push({ title: "Представление о родительстве", percentage: parPct, text: "Подход к воспитанию и ответственности." });

        // 7. Опека и контроль (Cell 1 Character + Cell 8 Duty)
        // High 1s + High 8s = Controlling.
        const ctrl1 = getVal(p1.matrix, 1) + getVal(p1.matrix, 8);
        const ctrl2 = getVal(p2.matrix, 1) + getVal(p2.matrix, 8);
        const ctrlPct = calcMatch(ctrl1, ctrl2, 6); // Can be wide range
        breakdowns.push({ title: "Опека и контроль", percentage: ctrlPct, text: "Уровень заботы и требования отчета." });

        // 8. Язык восприятия (Diag 1-5-9 vs 3-5-7 or just standard Type)
        // Let's use random variance for 'Language' based on Fate Number parity as it's 'vibes'
        const langPct = (p1.fateNumber % 3 === p2.fateNumber % 3) ? 95 : 65;
        breakdowns.push({ title: "Язык восприятия", percentage: langPct, text: "Насколько вы говорите на одном языке." });

        // 9. Заинтересованность (Cell 3)
        const int1 = getVal(p1.matrix, 3);
        const int2 = getVal(p2.matrix, 3);
        const intPct = calcMatch(int1, int2, 3);
        breakdowns.push({ title: "Взаимная заинтересованность", percentage: intPct, text: "Интерес друг к другу как к личностям." });

        // 10. Личное пространство (Cell 9 Memory + Cell 5 Logic -> Introversion?)
        // Let's rely on '9's.
        const sp1 = getVal(p1.matrix, 9);
        const sp2 = getVal(p2.matrix, 9);
        const spPct = calcMatch(sp1, sp2, 2);
        breakdowns.push({ title: "Личное пространство", percentage: spPct, text: "Потребность в уединении." });

        // 11. Появление чувств (Cell 4 Health/Emotion?) -> Often associated with 4 in Psycho-matrix
        const em1 = getVal(p1.matrix, 4);
        const em2 = getVal(p2.matrix, 4);
        const emPct = calcMatch(em1, em2, 2);
        breakdowns.push({ title: "Появление чувств", percentage: emPct, text: "Скорость возникновения привязанности." });

        // 12. Ценности (Diag 1-5-9 Spiritual)
        const val1 = getVal(p1.matrix, 1, 5, 9);
        const val2 = getVal(p2.matrix, 1, 5, 9);
        const valPct = calcMatch(val1, val2, 4);
        breakdowns.push({ title: "Общие ценности", percentage: valPct, text: "Духовный вектор пары." });


        // Total
        const total = Math.round(breakdowns.reduce((s, i) => s + i.percentage, 0) / breakdowns.length);

        return { score: total, reasons: breakdowns };
    }

    // --- Compatibility Form Handler ---
    const compatForm = document.getElementById('compatForm');

    if (compatForm) {
        function handleCompatSubmit(e) {
            e.preventDefault();
            const inputs = compatForm.querySelectorAll('input');
            const d1 = inputs[0].value;
            const d2 = inputs[1].value;

            if (!/^\d{2}\.\d{2}\.\d{4}$/.test(d1) || !/^\d{2}\.\d{2}\.\d{4}$/.test(d2)) {
                alert('Пожалуйста, введите корректные даты рождения обоих партнеров (ДД.ММ.ГГГГ)');
                return;
            }

            const res = calculateCompatibilityScore(d1, d2);

            // Show result visually
            const resultBlock = document.getElementById('compatResult');
            resultBlock.classList.remove('hidden');

            // Fill values
            document.getElementById('compatScoreValue').textContent = res.score + '%';

            // Render Detailed Breakdown
            const grid = document.getElementById('compatDetailsGrid');
            if (grid) {
                grid.innerHTML = ''; // Clear prev

                res.reasons.forEach(item => {
                    const block = document.createElement('div');
                    block.className = 'detail-block';

                    const h4 = document.createElement('h4');
                    h4.innerHTML = `${item.title} <span class="pct-badge">${item.percentage}%</span>`;

                    const pBarBg = document.createElement('div');
                    pBarBg.className = 'compat-bar-bg';
                    const pBarFill = document.createElement('div');
                    pBarFill.className = 'compat-bar-fill';
                    pBarFill.style.width = item.percentage + '%';

                    // Colorize based on score
                    if (item.percentage >= 75) pBarFill.style.backgroundColor = '#10b981'; // Green
                    else if (item.percentage >= 50) pBarFill.style.backgroundColor = '#f59e0b'; // Orange
                    else pBarFill.style.backgroundColor = '#ef4444'; // Red

                    pBarBg.appendChild(pBarFill);

                    const p = document.createElement('p');
                    p.textContent = item.text;

                    block.appendChild(h4);
                    block.appendChild(pBarBg);
                    block.appendChild(p);
                    grid.appendChild(block);
                });
            }

            renderCTA(resultBlock);
            // Scroll
            resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Attach listener safely
        const cBtn = compatForm.querySelector('button');
        const newBtn = cBtn.cloneNode(true);
        cBtn.parentNode.replaceChild(newBtn, cBtn);
        newBtn.addEventListener('click', handleCompatSubmit);
    }

    // --- Kids Form Logic ---
    const kidsForm = document.getElementById('kidsForm');

    if (kidsForm) {
        function handleKidsSubmit(e) {
            e.preventDefault();
            const inputs = kidsForm.querySelectorAll('input');
            const dChild = inputs[0].value;
            const dMom = inputs[1].value;
            const dDad = inputs[2].value; // Optional

            if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dChild) || !/^\d{2}\.\d{2}\.\d{4}$/.test(dMom)) {
                alert('Пожалуйста, введите корректные даты рождения Ребенка и Мамы (ДД.ММ.ГГГГ)');
                return;
            }

            const pChild = calculateNumerology(dChild);
            const pMom = calculateNumerology(dMom);

            // Visual Result Container
            const kidsResult = document.getElementById('kidsResult');
            kidsResult.classList.remove('hidden');

            // 1. Child Logic
            document.getElementById('kidsChildFate').textContent = `(ЧС: ${pChild.fateNumber})`;
            const c1 = pChild.matrix[1];
            let childText = (c1 > 2) ? "Яркий характер. Этот ребенок — будущий лидер, стремится к самостоятельности." : "Мягкий характер. Добрый, исполнительный ребенок, избегает конфликтов.";
            document.getElementById('kidsChildText').textContent = childText;

            // 2. Mom Logic
            document.getElementById('kidsMomFate').textContent = `(ЧС: ${pMom.fateNumber})`;
            const momList = document.getElementById('kidsMomText');
            momList.innerHTML = ''; // Clear prev

            const m1 = pMom.matrix[1];
            const mItems = [];

            // Interaction Character
            if (c1 > 2 && m1 > 2) mItems.push("Два лидера: Не давите авторитетом, учитесь договариваться как с равным.");
            else if (c1 <= 2 && m1 > 2) mItems.push("Гармония: Мама-лидер легко направляет ребенка, он чувствует опору.");
            else if (c1 > 2 && m1 <= 2) mItems.push("Внимание: Ребенок может манипулировать. Важно мягко, но твердо держать границы.");
            else mItems.push("Дружеский союз: Отношения строятся на доверии и мягкости.");

            // Interaction Energy
            const c2 = pChild.matrix[2];
            const m2 = pMom.matrix[2];
            if (m2 < 2 && c2 > 2) mItems.push("Энергия: Ребенок — 'ураган'. Маме важно находить время на отдых, чтобы не выгорать.");
            else if (m2 > 2 && c2 < 2) mItems.push("Поддержка: Мама служит энергетическим донором, рядом с ней ребенок успокаивается.");

            mItems.forEach(txt => {
                const li = document.createElement('li');
                li.textContent = txt;
                momList.appendChild(li);
            });

            // 3. Dad Logic (Optional)
            const dadBlock = document.getElementById('kidsDadBlock');
            if (dDad && /^\d{2}\.\d{2}\.\d{4}$/.test(dDad)) {
                dadBlock.classList.remove('hidden');
                const pDad = calculateNumerology(dDad);
                document.getElementById('kidsDadFate').textContent = `(ЧС: ${pDad.fateNumber})`;

                const dadList = document.getElementById('kidsDadText');
                dadList.innerHTML = '';
                const dItems = [];
                const f1 = pDad.matrix[1];

                if (c1 > 2 && f1 > 2) dItems.push("Борьба характеров: Папе важно проявлять мудрость и терпение, не 'ломать' волю ребенка.");
                else if (c1 <= 2 && f1 > 2) dItems.push("Авторитет: Папа для ребенка — беспрекословный пример и защита.");
                else dItems.push("Теплый контакт: Папа может стать лучшим другом и наставником.");

                dItems.forEach(txt => {
                    const li = document.createElement('li');
                    li.textContent = txt;
                    dadList.appendChild(li);
                });
            } else {
                dadBlock.classList.add('hidden');
            }

            renderCTA(kidsResult);
            kidsResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        const kBtn = kidsForm.querySelector('button');
        const newKBtn = kBtn.cloneNode(true);
        kBtn.parentNode.replaceChild(newKBtn, kBtn);
        newKBtn.addEventListener('click', handleKidsSubmit);
    }

    // Handle modal form submissions with delegation
    modal.addEventListener('submit', function (e) {
        const formType = modalBody.dataset.formType;

        if (formType === 'matrixFormContainer') {
            e.preventDefault();
            const input = modalBody.querySelector('#birthdate');
            if (input && birthdateInput) {
                birthdateInput.value = input.value;
                handleMainCalculate(e);
                closeModal();
            }
        } else if (formType === 'compatFormContainer') {
            e.preventDefault();
            const inputs = modalBody.querySelectorAll('input');
            if (inputs.length >= 2) {
                const d1 = inputs[0].value;
                const d2 = inputs[1].value;

                if (!/^\d{2}\.\d{2}\.\d{4}$/.test(d1) || !/^\d{2}\.\d{2}\.\d{4}$/.test(d2)) {
                    alert('Пожалуйста, введите корректные даты рождения обоих партнеров (ДД.ММ.ГГГГ)');
                    return;
                }

                const res = calculateCompatibilityScore(d1, d2);
                const resultBlock = document.getElementById('compatResult');
                if (resultBlock) {
                    resultBlock.classList.remove('hidden');
                    document.getElementById('compatScoreValue').textContent = res.score + '%';

                    const grid = document.getElementById('compatDetailsGrid');
                    if (grid) {
                        grid.innerHTML = '';
                        res.reasons.forEach(item => {
                            const block = document.createElement('div');
                            block.className = 'detail-block';

                            const h4 = document.createElement('h4');
                            h4.textContent = item.title;

                            const pctBadge = document.createElement('span');
                            pctBadge.className = 'pct-badge';
                            pctBadge.textContent = item.percentage + '%';

                            const p = document.createElement('p');
                            p.textContent = item.text;

                            block.appendChild(h4);
                            block.appendChild(pctBadge);
                            block.appendChild(p);
                            grid.appendChild(block);
                        });
                    }



                    renderCTA(resultBlock);
                    closeModal();
                    resultBlock.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        } else if (formType === 'kidsFormContainer') {
            e.preventDefault();
            const inputs = modalBody.querySelectorAll('input');
            if (inputs.length >= 2) {
                const dChild = inputs[0].value;
                const dMom = inputs[1].value;
                const dDad = inputs[2] ? inputs[2].value : '';

                if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dChild) || !/^\d{2}\.\d{2}\.\d{4}$/.test(dMom)) {
                    alert('Пожалуйста, введите корректные даты рождения Ребенка и Мамы (ДД.ММ.ГГГГ)');
                    return;
                }

                const pChild = calculateNumerology(dChild);
                const pMom = calculateNumerology(dMom);

                const kidsResult = document.getElementById('kidsResult');
                if (kidsResult) {
                    kidsResult.classList.remove('hidden');

                    document.getElementById('kidsChildFate').textContent = `(ЧС: ${pChild.fateNumber})`;
                    const c1 = pChild.matrix[1];
                    let childText = (c1 > 2) ? "Яркий характер. Этот ребенок — будущий лидер, стремится к самостоятельности." : "Мягкий характер. Добрый, исполнительный ребенок, избегает конфликтов.";
                    document.getElementById('kidsChildText').textContent = childText;

                    document.getElementById('kidsMomFate').textContent = `(ЧС: ${pMom.fateNumber})`;
                    const momList = document.getElementById('kidsMomText');
                    momList.innerHTML = '';

                    const m1 = pMom.matrix[1];
                    const mItems = [];

                    if (c1 > 2 && m1 > 2) mItems.push("Два лидера: Не давите авторитетом, учитесь договариваться как с равным.");
                    else if (c1 <= 2 && m1 > 2) mItems.push("Гармония: Мама-лидер легко направляет ребенка, он чувствует опору.");
                    else if (c1 > 2 && m1 <= 2) mItems.push("Внимание: Ребенок может манипулировать. Важно мягко, но твердо держать границы.");
                    else mItems.push("Дружеский союз: Отношения строятся на доверии и мягкости.");

                    const c2 = pChild.matrix[2];
                    const m2 = pMom.matrix[2];
                    if (m2 < 2 && c2 > 2) mItems.push("Энергия: Ребенок — 'ураган'. Маме важно находить время на отдых, чтобы не выгорать.");
                    else if (m2 > 2 && c2 < 2) mItems.push("Поддержка: Мама служит энергетическим донором, рядом с ней ребенок успокаивается.");

                    mItems.forEach(txt => {
                        const li = document.createElement('li');
                        li.textContent = txt;
                        momList.appendChild(li);
                    });

                    const dadBlock = document.getElementById('kidsDadBlock');
                    if (dDad && /^\d{2}\.\d{2}\.\d{4}$/.test(dDad)) {
                        dadBlock.classList.remove('hidden');
                        const pDad = calculateNumerology(dDad);
                        document.getElementById('kidsDadFate').textContent = `(ЧС: ${pDad.fateNumber})`;

                        const dadList = document.getElementById('kidsDadText');
                        dadList.innerHTML = '';
                        const dItems = [];
                        const f1 = pDad.matrix[1];

                        if (c1 > 2 && f1 > 2) dItems.push("Борьба характеров: Папе важно проявлять мудрость и терпение, не 'ломать' волю ребенка.");
                        else if (c1 <= 2 && f1 > 2) dItems.push("Авторитет: Папа для ребенка — беспрекословный пример и защита.");
                        else dItems.push("Теплый контакт: Папа может стать лучшим другом и наставником.");

                        dItems.forEach(txt => {
                            const li = document.createElement('li');
                            li.textContent = txt;
                            dadList.appendChild(li);
                        });
                    } else {
                        dadBlock.classList.add('hidden');
                    }

                    renderCTA(kidsResult);
                    closeModal();
                    kidsResult.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        }
    });

    // --- Contact Modal Logic ---
    function openContactModal() {
        const modal = document.getElementById('formModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        if (!modal) return;

        modal.classList.add('active');
        modalTitle.textContent = 'Выберите способ связи';

        modalBody.innerHTML = `
            <div class="contact-modal-list" style="display: flex; flex-direction: column; gap: 1rem; margin-top: 1rem;">
                <a href="https://t.me/+hxRv5po9kPYzMzIy" target="_blank" class="contact-card monitor-glow" style="justify-content: center; background: rgba(255,255,255,0.05);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;margin-right:10px;"><path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.69.506 1.287.961 1.274.567-.015.655-.262.883-.751.27-.674.542-1.348.813-2.023.755.753 1.513 1.503 2.268 2.256.495.495 1.055 1.047 1.77.893.759-.163.926-.973 1.107-1.683 1.107-4.329 2.193-8.663 3.327-13.048.245-.953-.664-1.616-1.505-1.52z"></path></svg>
                    <span>Telegram канал</span>
                </a>
                <a href="https://t.me/psy_kriss" target="_blank" class="contact-card monitor-glow" style="justify-content: center; background: rgba(255,255,255,0.05);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;margin-right:10px;"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                    <span>Написать в Telegram</span>
                </a>
                <a href="https://instagram.com/Psy_kriss" target="_blank" class="contact-card monitor-glow" style="justify-content: center; background: rgba(255,255,255,0.05);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;margin-right:10px;"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                    <span>Instagram</span>
                </a>
                <a href="https://wa.me/79260020848" target="_blank" class="contact-card monitor-glow" style="justify-content: center; background: rgba(255,255,255,0.05);">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:24px;height:24px;margin-right:10px;"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                    <span>WhatsApp</span>
                </a>
            </div>
        `;
    }

    // --- CTA Button Helper ---
    function renderCTA(container) {
        const existing = container.querySelector('.result-cta-wrapper');
        if (existing) existing.remove();

        const wrapper = document.createElement('div');
        wrapper.className = 'result-cta-wrapper';
        wrapper.style.textAlign = 'center';
        wrapper.style.marginTop = '3rem';

        const btn = document.createElement('button');
        btn.className = 'hero-cta';
        btn.style.width = '100%';
        btn.style.maxWidth = '380px';
        btn.style.cursor = 'pointer';
        btn.innerHTML = 'Заявка на бесплатную консультацию';

        btn.onclick = openContactModal;

        wrapper.appendChild(btn);
        container.appendChild(wrapper);
    }

});
