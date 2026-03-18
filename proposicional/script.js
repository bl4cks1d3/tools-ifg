
const allLetters = 'abcdefghijklmnopqrstuvwxyz'.split('');
const varsContainer = document.getElementById('allVariables');
allLetters.forEach(letter => {
    const btn = document.createElement('button');
    btn.onclick = () => insertVariable(letter);
    btn.className = 'operator-btn bg-purple-50 hover:bg-purple-100 text-purple-700 px-3 py-2 rounded-lg border border-purple-200 font-mono font-bold';
    btn.textContent = letter;
    varsContainer.appendChild(btn);
});

let variableValues = {};
let currentExpression = '';
let currentVariables = [];
let operationStepCounter = 0;

function insertOperator(op) {
    const input = document.getElementById('expressionInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + op + text.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + op.length;
}

function insertVariable(v) {
    const input = document.getElementById('expressionInput');
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const text = input.value;
    input.value = text.substring(0, start) + v + text.substring(end);
    input.focus();
    input.selectionStart = input.selectionEnd = start + 1;
}

function extractVariables(expr) {
    const vars = expr.match(/[a-z]/g) || [];
    return [...new Set(vars)].sort();
}
function validateExpression(expr) {
    // Remove espaços para análise
    const clean = expr.replace(/\s/g, '');

    // 1. Verifica parênteses balanceados
    const stack = [];
    for (let char of clean) {
        if (char === '(') stack.push(char);
        else if (char === ')') {
            if (stack.length === 0) {
                return { valid: false, error: 'Parêntese ) sem abertura correspondente' };
            }
            stack.pop();
        }
    }
    if (stack.length > 0) {
        return { valid: false, error: 'Parênteses desbalanceados (faltando fechamento)' };
    }

    // 2. Verifica dois operadores binários consecutivos
    const binaryOps = '[∧∨→↔⊕]';
    const binaryBinaryRegex = new RegExp(`${binaryOps}${binaryOps}`);
    if (binaryBinaryRegex.test(clean)) {
        const match = clean.match(binaryBinaryRegex);
        return {
            valid: false,
            error: `Dois operadores binários consecutivos: "${match[0]}"\n\nDica: Falta uma variável ou parêntese entre eles`
        };
    }

    // 3. Verifica operador binário no início
    if (new RegExp(`^[${binaryOps}]`).test(clean)) {
        return { valid: false, error: 'Operador binário no início da expressão' };
    }

    // 4. Verifica operador binário no final (antes de fechar parêntese)
    if (new RegExp(`[${binaryOps}]\\)?$`).test(clean)) {
        return { valid: false, error: 'Operador binário no final da expressão' };
    }

    // 5. Verifica se tem pelo menos uma variável
    if (!/[a-z]/.test(clean)) {
        return { valid: false, error: 'Nenhuma variável encontrada (use a-z)' };
    }

    // 6. Verifica ¬ seguido de operador binário (inválido)
    if (/¬[∧∨→↔⊕]/.test(clean)) {
        return { valid: false, error: 'Negação (¬) seguida de operador binário' };
    }

    return { valid: true };
}

function extractAndConfigure() {
    // LIMPEZA
    document.getElementById('resultSection').classList.add('hidden');
    document.getElementById('stepByStep').innerHTML = '';
    document.getElementById('operationTables').innerHTML = '';
    operationStepCounter = 0;
    variableValues = {};
    currentExpression = '';
    currentVariables = [];

    const expr = document.getElementById('expressionInput').value.trim();
    if (!expr) {
        alert('Por favor, digite uma expressão lógica');
        return;
    }

    // VALIDAÇÃO
    const validation = validateExpression(expr);
    if (!validation.valid) {
        alert(`❌ Expressão Inválida!\n\n${validation.error}\n\nExpressão: ${expr}`);
        return;
    }

    currentExpression = expr;
    currentVariables = extractVariables(expr);

    if (currentVariables.length === 0) {
        alert('Por favor, use letras (a-z) como variáveis');
        return;
    }

    generateVariableConfig(currentVariables);
    document.getElementById('variablesSection').classList.remove('hidden');
    document.getElementById('variablesSection').scrollIntoView({ behavior: 'smooth' });
}


// ========== EXPRESSION GENERATOR ==========
function generateRandomExpression() {
    const numVars = parseInt(document.getElementById('numVariables').value);
    const complexity = document.getElementById('complexity').value;
    const operatorType = document.getElementById('operators').value;

    const vars = allLetters.slice(0, numVars);
    let operators = [];

    if (operatorType === 'basic') {
        operators = ['¬', '∧', '∨'];
    } else if (operatorType === 'implication') {
        operators = ['¬', '∧', '', '→'];
    } else {
        operators = ['¬', '∧', '', '→', '↔', '⊕'];
    }

    let expression = '';

    switch (complexity) {
        case 'easy':
            expression = generateEasy(vars, operators);
            break;
        case 'medium':
            expression = generateMedium(vars, operators);
            break;
        case 'hard':
            expression = generateHard(vars, operators);
            break;
        case 'expert':
            expression = generateExpert(vars, operators);
            break;
    }

    // Remove all spaces
    expression = expression.replace(/\s/g, '');

    document.getElementById('expressionInput').value = expression;
    document.getElementById('expressionInput').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getRandomVar(vars) {
    return vars[Math.floor(Math.random() * vars.length)];
}

function getRandomOp(operators) {
    const filtered = operators.filter(o => o !== '¬');
    return filtered[Math.floor(Math.random() * filtered.length)];
}

function generateEasy(vars, operators) {
    const binaryOps = operators.filter(o => o !== '¬');
    const patterns = [
        () => `${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)}`,
        () => `¬${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)}`,
        () => `${getRandomVar(vars)}${getRandomOp(binaryOps)}¬${getRandomVar(vars)}`,
        () => `¬${getRandomVar(vars)}${getRandomOp(binaryOps)}¬${getRandomVar(vars)}`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
}

function generateMedium(vars, operators) {
    const binaryOps = operators.filter(o => o !== '¬');
    const patterns = [
        () => `(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(binaryOps)}${getRandomVar(vars)}`,
        () => `${getRandomVar(vars)}${getRandomOp(binaryOps)}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
        () => `¬(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
        () => `(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(binaryOps)}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
}

function generateHard(vars, operators) {
    const binaryOps = operators.filter(o => o !== '¬');
    const complexOps = ['→', '↔', '⊕'].filter(op => operators.includes(op));
    const ops = complexOps.length > 0 ? complexOps : binaryOps;

    const patterns = [
        () => `(${getRandomVar(vars)}${getRandomOp(ops)}${getRandomVar(vars)})${getRandomOp(binaryOps)}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
        () => `¬(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(binaryOps)}¬(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
        () => `(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(['↔', '→'])}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
        () => `¬${getRandomVar(vars)}${getRandomOp(binaryOps)}(${getRandomVar(vars)}${getRandomOp(ops)}${getRandomVar(vars)})`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
}

function generateExpert(vars, operators) {
    const binaryOps = operators.filter(o => o !== '¬');
    const complexOps = ['→', '↔', ''].filter(op => operators.includes(op));
    const ops = complexOps.length > 0 ? complexOps : binaryOps;

    const patterns = [
        () => `¬(${getRandomVar(vars)}${getRandomOp(['⊕', '', ''])}${getRandomVar(vars)})${getRandomOp(['∧', ''])}¬(¬${getRandomVar(vars)}${getRandomOp(['⊕', ''])}${getRandomVar(vars)})`,
        () => `((${getRandomVar(vars)}${getRandomOp(['→', '↔'])}${getRandomVar(vars)})${getRandomOp(['∨', ''])}${getRandomVar(vars)})${getRandomOp(['↔', '→'])}(${getRandomVar(vars)}${getRandomOp(['∧', ''])}${getRandomVar(vars)})`,
        () => `¬(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(['∧', ''])}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(['∧', ''])}${getRandomVar(vars)}`,
        () => `((${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})${getRandomOp(['→', '↔'])}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)}))${getRandomOp(['∧', ''])}¬${getRandomVar(vars)}`,
        () => `¬(${getRandomVar(vars)}${getRandomOp(['⊕', '∧', ''])}${getRandomVar(vars)})${getRandomOp(['∧', '∨', '→'])}(${getRandomVar(vars)}${getRandomOp(binaryOps)}${getRandomVar(vars)})`,
    ];
    return patterns[Math.floor(Math.random() * patterns.length)]();
}
// ========== END EXPRESSION GENERATOR ==========
function generateVariableConfig(vars) {
    const container = document.getElementById('variablesContainer');
    container.innerHTML = '';

    vars.forEach((v, idx) => {
        variableValues[v] = true;

        const card = document.createElement('div');
        card.className = 'variable-card bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100';
        card.innerHTML = `
                    <div class="flex items-start gap-4">
                        <div class="bg-indigo-600 text-white w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">${v}</div>
                        <div class="flex-1">
                            <div class="mt-3 flex items-center gap-3">
                                <span class="text-sm font-semibold text-gray-700">Valor lógico:</span>
                                <div class="flex gap-2">
                                    <button onclick="setVariableValue('${v}', true)" id="btnV_${v}"
                                        class="px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition ring-4 ring-green-200">Verdadeiro (V)</button>
                                    <button onclick="setVariableValue('${v}', false)" id="btnF_${v}"
                                        class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition">Falso (F)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
        container.appendChild(card);
    });
}

function setVariableValue(v, isTrue) {
    variableValues[v] = isTrue;
    const btnV = document.getElementById(`btnV_${v}`);
    const btnF = document.getElementById(`btnF_${v}`);

    if (isTrue) {
        btnV.className = 'px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition ring-4 ring-green-200';
        btnF.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition';
    } else {
        btnF.className = 'px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition ring-4 ring-red-200';
        btnV.className = 'px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition';
    }
}

const truthTables = {
    '→': {
        name: 'Implicação (→)',
        table: [
            { p: 'V', q: 'V', r: 'V', desc: 'V→V = V' },
            { p: 'V', q: 'F', r: 'F', desc: 'V→F = F (único caso falso)' },
            { p: 'F', q: 'V', r: 'V', desc: 'F→V = V' },
            { p: 'F', q: 'F', r: 'V', desc: 'F→F = V' }
        ],
        calc: (a, b) => (a === 'V' && b === 'F') ? 'F' : 'V'
    },
    '∨': {
        name: 'Disjunção (∨) - OU',
        table: [
            { p: 'V', q: 'V', r: 'V', desc: 'V∨V = V' },
            { p: 'V', q: 'F', r: 'V', desc: 'V∨F = V' },
            { p: 'F', q: 'V', r: 'V', desc: 'F∨V = V' },
            { p: 'F', q: 'F', r: 'F', desc: 'F∨F = F (único caso falso)' }
        ],
        calc: (a, b) => (a === 'V' || b === 'V') ? 'V' : 'F'
    },
    '∧': {
        name: 'Conjunção (∧) - E',
        table: [
            { p: 'V', q: 'V', r: 'V', desc: 'V∧V = V (único caso verdadeiro)' },
            { p: 'V', q: 'F', r: 'F', desc: 'V∧F = F' },
            { p: 'F', q: 'V', r: 'F', desc: 'F∧V = F' },
            { p: 'F', q: 'F', r: 'F', desc: 'F∧F = F' }
        ],
        calc: (a, b) => (a === 'V' && b === 'V') ? 'V' : 'F'
    },
    '↔': {
        name: 'Bicondicional (↔)',
        table: [
            { p: 'V', q: 'V', r: 'V', desc: 'V↔V = V (iguais)' },
            { p: 'V', q: 'F', r: 'F', desc: 'V↔F = F (diferentes)' },
            { p: 'F', q: 'V', r: 'F', desc: 'F↔V = F (diferentes)' },
            { p: 'F', q: 'F', r: 'V', desc: 'F↔F = V (iguais)' }
        ],
        calc: (a, b) => (a === b) ? 'V' : 'F'
    },
    '⊕': {
        name: 'Ou Exclusivo (⊕) - XOR',
        table: [
            { p: 'V', q: 'V', r: 'F', desc: 'V⊕V = F (iguais)' },
            { p: 'V', q: 'F', r: 'V', desc: 'V⊕F = V (diferentes)' },
            { p: 'F', q: 'V', r: 'V', desc: 'F⊕V = V (diferentes)' },
            { p: 'F', q: 'F', r: 'F', desc: 'F⊕F = F (iguais)' }
        ],
        calc: (a, b) => (a !== b) ? 'V' : 'F'
    },
    '¬': {
        name: 'Negação (¬)',
        table: [
            { p: 'V', r: 'F', desc: '¬V = F' },
            { p: 'F', r: 'V', desc: '¬F = V' }
        ],
        calc: (a) => a === 'V' ? 'F' : 'V'
    }
};

function generateOperationTableHTML(op, a, b, result, stepNum, context) {
    const opData = truthTables[op];
    if (!opData) return '';

    let html = `
                <div class="step-box rounded-lg p-5 step-animation border-2 border-yellow-400">
                    <h4 class="font-bold text-gray-800 mb-3 flex items-center gap-2 text-lg">
                        <span class="bg-indigo-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold">${stepNum}</span>
                        ${opData.name}
                    </h4>
                    <div class="bg-white rounded-lg p-3 mb-3 border-2 border-indigo-300">
                        <p class="text-sm text-gray-600 mb-1">Contexto na expressão:</p>
                        <p class="text-base font-mono font-bold text-gray-800">
                            ${context}
                        </p>
                        <p class="text-lg font-mono font-bold text-indigo-700 mt-2">
                            (${a}) ${op} ${op === '¬' ? '' : '(' + b + ')'} = <span class="${result === 'V' ? 'result-v text-2xl' : 'result-f text-2xl'}">${result}</span>
                        </p>
                    </div>
                    
                    <p class="text-sm text-gray-700 mb-3 font-medium bg-yellow-100 p-2 rounded">
                        📚 ${opData.table.find(row => op === '¬' ? row.p === a : (row.p === a && row.q === b))?.desc}
                    </p>
                    
                    <p class="text-xs text-gray-600 mb-2 font-semibold">Tabela verdade completa:</p>
                    <table class="w-full max-w-md border-collapse text-sm shadow-sm">
                        <thead>
                            <tr class="bg-indigo-600 text-white">
                                <th class="border-2 border-indigo-700 px-4 py-2">p</th>
                                ${op !== '¬' ? '<th class="border-2 border-indigo-700 px-4 py-2">q</th>' : ''}
                                <th class="border-2 border-indigo-700 px-4 py-2">p ${op} ${op === '¬' ? '' : 'q'}</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

    opData.table.forEach((row) => {
        const isHighlight = op === '¬' ? (row.p === a) : (row.p === a && row.q === b);
        const rowClass = isHighlight ? 'highlight-row' : 'border border-gray-300';
        const resultClass = row.r === 'V' ? 'text-green-600 font-bold' : 'text-red-600 font-bold';

        html += `<tr class="${rowClass}">`;
        html += `<td class="px-4 py-2 text-center ${row.p === 'V' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}">${row.p}</td>`;
        if (op !== '¬') {
            html += `<td class="px-4 py-2 text-center ${row.q === 'V' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}">${row.q}</td>`;
        }
        html += `<td class="px-4 py-2 text-center ${resultClass}">${row.r}</td></tr>`;
    });

    html += '</tbody></table></div>';
    return html;
}

function findAllOperations(expr) {
    const operations = [];

    // Find ALL parentheses (including nested)
    const parenRegex = /\(([^()]+)\)/g;
    let match;

    while ((match = parenRegex.exec(expr)) !== null) {
        const inner = match[1];
        const startPos = match.index;

        // STEP 1: Find ALL negations first (highest precedence)
        // Match ¬ followed by V or F
        const negRegex = /¬([VF])/g;
        let negMatch;
        while ((negMatch = negRegex.exec(inner)) !== null) {
            operations.push({
                type: 'negation',
                op: '¬',
                left: negMatch[1],
                right: null,
                fullExpr: inner,
                position: startPos,
                parentExpr: match[0],
                operatorPos: negMatch.index,
                priority: 1 // HIGHEST - resolve first
            });
        }

        // STEP 2: Find binary operations in precedence order
        // Precedence: ∧ > ∨ > ⊕ > → > ↔
        const binaryOps = [
            { op: '∧', priority: 2 },
            { op: '∨', priority: 3 },
            { op: '⊕', priority: 4 },
            { op: '→', priority: 5 },
            { op: '↔', priority: 6 }
        ];

        for (const opInfo of binaryOps) {
            // Find ALL occurrences of this operator
            let idx = 0;
            while ((idx = inner.indexOf(opInfo.op, idx)) !== -1) {
                if (idx > 0 && idx < inner.length - 1) {
                    const left = inner[idx - 1];
                    const right = inner[idx + 1];

                    // Only if both operands are V or F (already evaluated)
                    if (/^[VF]$/.test(left) && /^[VF]$/.test(right)) {
                        // Make sure left operand is NOT a negation waiting to be resolved
                        const isLeftNegated = (idx >= 2 && inner[idx - 2] === '¬');

                        if (!isLeftNegated) {
                            operations.push({
                                type: 'binary',
                                op: opInfo.op,
                                left: left,
                                right: right,
                                fullExpr: inner,
                                position: startPos,
                                parentExpr: match[0],
                                operatorPos: idx,
                                priority: opInfo.priority
                            });
                        }
                    }
                }
                idx++;
            }
        }
    }

    // Sort by priority (lower number = higher priority = resolves first)
    operations.sort((a, b) => {
        if (a.priority !== b.priority) {
            return a.priority - b.priority;
        }
        // If same priority, resolve left to right
        return a.position - b.position;
    });

    return operations;
}

function solveExpression() {
    operationStepCounter = 0;
    let steps = [];
    let operationTables = [];

    steps.push({
        expr: currentExpression,
        desc: 'Expressão original',
        type: 'original'
    });

    let substituted = currentExpression;
    currentVariables.forEach(v => {
        const val = variableValues[v] ? 'V' : 'F';
        substituted = substituted.replace(new RegExp(`\\b${v}\\b`, 'g'), val);
    });

    steps.push({
        expr: substituted,
        desc: 'Substituindo variáveis pelos valores (V/F)',
        type: 'substitution'
    });

    let currentExpr = substituted;
    let maxIterations = 300;
    let iteration = 0;

    while (iteration < maxIterations) {
        iteration++;

        // Remove espaços
        currentExpr = currentExpr.replace(/\s/g, '');

        // Remove parênteses desnecessários repetidamente
        let prevExpr;
        do {
            prevExpr = currentExpr;
            currentExpr = currentExpr.replace(/\(([VF])\)/g, '$1');
        } while (currentExpr !== prevExpr);

        // Verifica se terminou
        if (/^[VF]$/.test(currentExpr)) {
            break;
        }

        let madeProgress = false;

        // 1. Encontra o parêntese interno mais à esquerda
        const parenMatch = currentExpr.match(/\(([^()]+)\)/);
        if (parenMatch) {
            const inner = parenMatch[1];
            const fullParen = parenMatch[0];

            // Tenta resolver negações primeiro (¬V ou ¬F)
            const negMatch = inner.match(/¬([VF])/);
            if (negMatch) {
                const val = negMatch[1];
                const result = truthTables['¬'].calc(val);
                operationStepCounter++;

                operationTables.push({
                    step: operationStepCounter,
                    html: generateOperationTableHTML('¬', val, '', result, operationStepCounter, fullParen)
                });

                const newInner = inner.replace(`¬${val}`, result);
                currentExpr = currentExpr.replace(fullParen, `(${newInner})`);

                steps.push({
                    expr: currentExpr,
                    desc: `Operação ${operationStepCounter}: ¬${val} = ${result} (dentro de ${fullParen})`,
                    type: 'operation'
                });
                madeProgress = true;
                continue;
            }

            // Tenta resolver operações binárias
            // Procura padrões válidos: VopV, VopF, FopV, FopF
            const binaryMatch = inner.match(/([VF])([∧∨→↔⊕])([VF])/);
            if (binaryMatch) {
                const left = binaryMatch[1];
                const op = binaryMatch[2];
                const right = binaryMatch[3];
                const result = truthTables[op].calc(left, right);
                operationStepCounter++;

                operationTables.push({
                    step: operationStepCounter,
                    html: generateOperationTableHTML(op, left, right, result, operationStepCounter, fullParen)
                });

                const opStr = `${left}${op}${right}`;
                const newInner = inner.replace(opStr, result);
                currentExpr = currentExpr.replace(fullParen, `(${newInner})`);

                steps.push({
                    expr: currentExpr,
                    desc: `Operação ${operationStepCounter}: ${left} ${op} ${right} = ${result} (dentro de ${fullParen})`,
                    type: 'operation'
                });
                madeProgress = true;
                continue;
            }
        }

        // 2. Se não tem parênteses ou não conseguiu resolver dentro deles,
        // resolve no nível superior

        // Primeiro negações no nível superior
        const topNegMatch = currentExpr.match(/¬([VF])/);
        if (topNegMatch) {
            const val = topNegMatch[1];
            const result = truthTables['¬'].calc(val);
            operationStepCounter++;

            operationTables.push({
                step: operationStepCounter,
                html: generateOperationTableHTML('¬', val, '', result, operationStepCounter, `¬${val}`)
            });

            currentExpr = currentExpr.replace(`¬${val}`, result);
            steps.push({
                expr: currentExpr,
                desc: `Operação ${operationStepCounter}: ¬${val} = ${result}`,
                type: 'operation'
            });
            madeProgress = true;
            continue;
        }

        // 3. Operações binárias no nível superior
        // Procura da direita para esquerda, respeitando precedência
        const ops = ['↔', '→', '⊕', '', '∧']; // Menor para maior precedência

        for (const op of ops) {
            // Procura TODOS os padrões válidos deste operador
            const pattern = new RegExp(`([VF])${op}([VF])`, 'g');
            let match;
            let lastMatch = null;
            let lastMatchPos = -1;

            while ((match = pattern.exec(currentExpr)) !== null) {
                lastMatch = match;
                lastMatchPos = match.index;
            }

            if (lastMatch) {
                const left = lastMatch[1];
                const right = lastMatch[2];
                const result = truthTables[op].calc(left, right);
                operationStepCounter++;

                operationTables.push({
                    step: operationStepCounter,
                    html: generateOperationTableHTML(op, left, right, result, operationStepCounter,
                        `${left}${op}${right}`)
                });

                const opStr = `${left}${op}${right}`;
                const idx = currentExpr.lastIndexOf(opStr);
                const before = currentExpr.substring(0, idx);
                const after = currentExpr.substring(idx + opStr.length);
                currentExpr = before + result + after;

                steps.push({
                    expr: currentExpr,
                    desc: `Operação ${operationStepCounter}: ${left} ${op} ${right} = ${result}`,
                    type: 'operation'
                });
                madeProgress = true;
                break;
            }
        }

        if (!madeProgress) {
            // Não conseguiu progredir - tenta forçar limpeza
            currentExpr = currentExpr.replace(/\s/g, '');
            if (/^[VF]$/.test(currentExpr)) break;
            console.log('Stuck at:', currentExpr);
            break;
        }
    }

    // Extrai o resultado final
    const vfChars = currentExpr.match(/[VF]/g);
    const finalResult = vfChars ? vfChars[vfChars.length - 1] : 'F';
    displayResults(steps, operationTables, finalResult);
}

function displayResults(steps, operationTables, result) {
    const isTrue = result === 'V';

    const resultDiv = document.getElementById('finalResult');
    resultDiv.className = `${isTrue ? 'final-result-v border-green-300' : 'final-result-f border-red-300'} border-2 rounded-2xl p-6`;

    document.getElementById('resultIcon').textContent = result;
    document.getElementById('resultIcon').className = `text-6xl font-bold ${isTrue ? 'text-green-600' : 'text-red-600'}`;
    document.getElementById('resultValue').textContent = isTrue ? 'VERDADEIRO (V)' : 'FALSO (F)';
    document.getElementById('resultExpression').textContent = currentExpression;

    let stepsHtml = '';
    steps.forEach((step, idx) => {
        let bgColor = 'bg-white';
        let borderColor = 'border-gray-300';
        let icon = '📝';

        if (step.type === 'original') {
            bgColor = 'bg-blue-50';
            borderColor = 'border-blue-400';
            icon = '1️⃣';
        } else if (step.type === 'substitution') {
            bgColor = 'bg-purple-50';
            borderColor = 'border-purple-400';
            icon = '2️⃣';
        } else if (step.type === 'operation') {
            bgColor = 'bg-yellow-50';
            borderColor = 'border-yellow-400';
            icon = '➡️';
        }

        stepsHtml += `
                    <div class="step-animation ${bgColor} rounded-lg p-4 border-l-4 ${borderColor}">
                        <div class="flex items-start gap-3">
                            <span class="text-2xl">${icon}</span>
                            <div class="flex-1">
                                <div class="text-lg font-mono font-bold text-gray-800 mb-1">${step.expr}</div>
                                <div class="text-sm text-gray-600 italic">${step.desc}</div>
                            </div>
                        </div>
                    </div>
                `;
    });

    document.getElementById('stepByStep').innerHTML = stepsHtml;

    operationTables.sort((a, b) => a.step - b.step);
    document.getElementById('operationTables').innerHTML = `
                <div class="bg-indigo-50 border-2 border-indigo-300 rounded-lg p-4 mb-4">
                    <p class="text-indigo-900 font-semibold">
                        📊 Total de operações realizadas: <span class="text-2xl">${operationTables.length}</span>
                    </p>
                    <p class="text-indigo-700 text-sm mt-1">Cada operação foi executada e mostrada individualmente</p>
                </div>
                ${operationTables.map(t => t.html).join('')}
            `;

    document.getElementById('resultSection').classList.remove('hidden');
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}
