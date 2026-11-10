// --- 1. GERENCIAMENTO DE NAVEGAÇÃO DE ABAS ---
const buttons = {
    organicos: document.getElementById('btn-organicos'),
    inorganicos: document.getElementById('btn-inorganicos'),
    jogo: document.getElementById('btn-jogo'),
    ecopontos: document.getElementById('btn-ecopontos')
};

const sections = {
    organicos: document.getElementById('secao-organicos'),
    inorganicos: document.getElementById('secao-inorganicos'),
    jogo: document.getElementById('secao-jogo'),
    ecopontos: document.getElementById('secao-ecopontos')
};

function alternarAba(abaSelecionada) {
    Object.keys(buttons).forEach(key => {
        if (key === abaSelecionada) {
            buttons[key].classList.add('active');
            sections[key].classList.remove('hidden');
        } else {
            buttons[key].classList.remove('active');
            sections[key].classList.add('hidden');
        }
    });
}

buttons.organicos.addEventListener('click', () => alternarAba('organicos'));
buttons.inorganicos.addEventListener('click', () => alternarAba('inorganicos'));
buttons.jogo.addEventListener('click', () => alternarAba('jogo'));
buttons.ecopontos.addEventListener('click', () => alternarAba('ecopontos'));


// --- 2. BUSCA RÁPIDA DE ITENS ORGÂNICOS ---
const inputBuscaOrg = document.getElementById('search-input-org');
const resultBuscaOrg = document.getElementById('search-result-org');

const dicionarioOrg = {
    "banana": "✅ Pode ir na composteira! A casca é rica em potássio.",
    "maca": "✅ Pode ir na composteira!",
    "cafe": "✅ Pó e filtro de papel podem ir direto!",
    "ovo": "✅ Lave e triture as cascas antes de misturar na terra.",
    "carne": "❌ Não coloque carne! Atrai pragas e gera mau cheiro.",
    "frango": "❌ Não coloque restos de carnes ou ossos.",
    "leite": "❌ Laticínios prejudicam a fermentação natural.",
    "folha": "✅ Excelente material seco para cobrir a composteira!"
};

if(inputBuscaOrg) {
    inputBuscaOrg.addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        if (termo === "") {
            resultBuscaOrg.innerText = "";
            return;
        }

        let encontrado = false;
        for (let chave in dicionarioOrg) {
            if (chave.includes(termo) || termo.includes(chave)) {
                resultBuscaOrg.innerText = dicionarioOrg[chave];
                encontrado = true;
                break;
            }
        }

        if (!encontrado) {
            resultBuscaOrg.innerText = "🔍 Item não cadastrado no teste rápido. Consulte a lista abaixo!";
        }
    });
}


// --- 3. LÓGICA DO MINI-JOGO DRAG AND DROP ---
const draggables = document.querySelectorAll('.draggable-item');
const dropBins = document.querySelectorAll('.drop-bin');
const gameFeedback = document.getElementById('game-feedback');

let draggedElement = null;

draggables.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        draggedElement = item;
        e.dataTransfer.setData('text/plain', item.dataset.tipo);
    });
});

dropBins.forEach(bin => {
    bin.addEventListener('dragover', (e) => {
        e.preventDefault(); // Necessário para permitir o drop
    });

    bin.addEventListener('drop', (e) => {
        e.preventDefault();
        const tipoItem = e.dataTransfer.getData('text/plain');
        const aceitaTipo = bin.dataset.aceita;

        if (tipoItem === aceitaTipo) {
            bin.appendChild(draggedElement);
            draggedElement.setAttribute('draggable', 'false'); // Trava o item na lixeira
            draggedElement.style.cursor = 'default';
            gameFeedback.innerText = "✨ Boa! Descarte correto realizado com sucesso!";
        } else {
            gameFeedback.innerText = "❌ Ops! Essa lixeira não é a correta para este item.";
        }
    });
});


// --- 4. LISTA E FILTRO DOS ECOPONTOS DE NATAL ---
const dadosEcopontos = [
    {
        nome: "Ecoponto do Baldo",
        bairro: "Cidade Alta / Centro",
        categoria: "centro",
        detalhes: "Recebe recicláveis, papelão, garrafas PET e metais."
    },
    {
        nome: "Ecoponto Parque dos Coqueiros",
        bairro: "N. Sra. da Apresentação",
        categoria: "zona-norte",
        detalhes: "Ponto de descarte para resíduos da Zona Norte."
    },
    {
        nome: "Ponto de Coleta Del Prete",
        bairro: "Av. Piloto Carlos Del Prete",
        categoria: "zona-norte",
        detalhes: "Recebe recicláveis gerais e plásticos."
    },
    {
        nome: "EcoPonto Lâmpadas e Pilhas",
        bairro: "Av. Prudente de Morais",
        categoria: "especiais",
        detalhes: "Especializado em pilhas, baterias e lâmpadas usadas."
    }
];

const containerEcopontos = document.getElementById('lista-ecopontos');
const filterBtns = document.querySelectorAll('.filter-btn');

function renderizarEcopontos(filtro) {
    containerEcopontos.innerHTML = "";
    
    const filtrados = filtro === "todos" 
        ? dadosEcopontos 
        : dadosEcopontos.filter(item => item.categoria === filtro);

    filtrados.forEach(ponto => {
        const card = document.createElement('div');
        card.className = 'ecoponto-card';
        card.innerHTML = `
            <h4>📍 ${ponto.nome}</h4>
            <p><strong>Bairro:</strong> ${ponto.bairro}</p>
            <p>${ponto.detalhes}</p>
        `;
        containerEcopontos.appendChild(card);
    });
}

filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        filterBtns.forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        renderizarEcopontos(e.target.dataset.filter);
    });
});

// Renderização inicial
renderizarEcopontos('todos');