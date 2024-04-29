const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = 4000;

app.use(express.json());
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'harrypotterbackend',
    password: 'ds564',
    port: 7007,
});
function calcularIdade(dataNascimento) {
    const dataAtual = new Date();
    const dataNascimentoFormatada = new Date(dataNascimento);
    const idade = dataAtual.getFullYear() - dataNascimentoFormatada.getFullYear();
    return idade;
}
function gerarPatrono() {
    const animaisPatrono = [
        'Cervo', 'Fênix', 'Lobo', 'Leão', 'Águia', 'Gato', 'Cachorro', 'Golfinho', 'Coruja', 'Tigre', 'Cisne', 'Unicórnio'
    ];

    const indiceAleatorio = Math.floor(Math.random() * animaisPatrono.length);
    const patronoGerado = animaisPatrono[indiceAleatorio];

    return patronoGerado;
}

function gerarHabilidadeEspecial() {
    const habilidadesEspeciais = [
        'Invisibilidade', 'Teletransporte', 'Telepatia', 'Controle Elemental', 'Cura Instantânea', 'Visão do Futuro', 'Transformação de Forma', 'Levitação', 'Superforça', 'Criocinese', 'Pirocinese', 'Voo', 'Ilusão', 'Camuflagem', 'Mimetismo', 'Telecinese'
    ];

    const indiceAleatorio = Math.floor(Math.random() * habilidadesEspeciais.length);
    const habilidadeGerada = habilidadesEspeciais[indiceAleatorio];

    return habilidadeGerada;
}

app.get('/bruxos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM bruxos');
        res.json({
            total: result.rowCount,
            bruxos: result.rows
        })
    } catch (error) {
        console.error('Erro ao buscar bruxos', error);
        res.status(500).json({ message: 'Erro ao buscar bruxos' });
    }
});
app.get('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM bruxos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Bruxo não encontrado' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Erro ao buscar bruxo por id', error);
        res.status(500).json({ message: 'Erro ao buscar bruxo por id' });
    }
});
app.get('/bruxos/nome/:letra', async (req, res) => {
    try {
        const{letra} = req.params;
        const result = await pool.query('SELECT * FROM bruxos LIKE $1', ['%' + letra + '%']);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Bruxo não encontrado' });
        } else {
            res.json(result.rows);
        }
    } catch (error) {
        console.error('Erro ao buscar bruxo por nome', error);
        res.status(500).json({ message: 'Erro ao buscar bruxo por nome' });
    }
});
app.post('/bruxos', async (req, res) => {
    try {
        const { nome, data_nascimento, casa, sangue } = req.body;
        const patrono = gerarPatrono();
        const habilidade_especial = gerarHabilidadeEspecial();
        const idade = calcularIdade(data_nascimento);

        let casas = ['Grifinória', 'Sonserina', 'Corvinal', 'Lufa-Lufa'];
        let sangues = ['puro', 'mestiço', 'trouxa'];
        let isNotEmpty = nome && data_nascimento && casa && sangue;

        if (!isNotEmpty) {
            return res.status(400).json({ message: 'Nome, data de nascimento, casa e sangue são obrigatórios' });
        } 

        if (!casas.includes(casa)){
            return res.status(400).json({ message: 'Casa deve ser Grifinória, Sonserina, Corvinal ou Lufa-Lufa' });
        }
        
        if (!sangues.includes(sangue)) {
            return res.status(400).json({ message: 'Sangue deve ser puro, mestiço ou trouxa' });
        } 

        await pool.query('INSERT INTO bruxos (nome, data_nascimento, casa, sangue, patrono, habilidade_especial, idade) VALUES ($1, $2, $3, $4, $5, $6, $7)', [nome, data_nascimento, casa, sangue, patrono, habilidade_especial, idade]);
        res.status(201).json({ message: 'Bruxo criado com sucesso' });

    } catch (error) {
        console.error('Erro ao criar bruxo', error);
        res.status(500).json({ message: 'Erro ao criar bruxo' });
    }
});
app.delete('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM bruxos WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Bruxo não encontrado' });
        } else {
            res.json({ message: 'Bruxo deletado com sucesso' });
        }
    } catch (error) {
        console.error('Erro ao deletar bruxo', error);
        res.status(500).json({ message: 'Erro ao deletar bruxo' });
    }
});
app.put('/bruxos/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, data_nascimento, casa, sangue } = req.body;
        const patrono = gerarPatrono();
        const habilidade_especial = gerarHabilidadeEspecial();
        const idade = calcularIdade(data_nascimento);
        await pool.query('UPDATE bruxos SET nome = $1, data_nascimento = $2, casa = $3, sangue = $4, patrono = $5, habilidade_especial = $6, idade = $7 WHERE id = $8', [nome, data_nascimento, casa, sangue, patrono, habilidade_especial, idade, id]);
        res.status(200).json({ message: 'Bruxo atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar bruxo', error);
        res.status(500).json({ message: 'Erro ao atualizar bruxo' });
        
    }
});
app.get('/varinhas' , async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM varinhas');
        res.json({
            total: result.rowCount,
            varinhas: result.rows
        })
    } catch (error) {
        console.error('Erro ao buscar varinhas', error);
        res.status(500).json({ message: 'Erro ao buscar varinhas' });
    }
});
app.get('/varinhas/:id', async (req, res) => {

    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM varinhas WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Varinha não encontrada' });
        } else {
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error('Erro ao buscar varinha por id', error);
        res.status(500).json({ message: 'Erro ao buscar varinha por id' });
    }
});
app.post('/varinhas', async (req, res) => {
    try {
        const { material, comprimento, nucleo, data_fabricacao } = req.body;
        let isNotEmpty = material && comprimento && nucleo && data_fabricacao;
        let materiaisVarinha = ['Abeto', 'Acer', 'Azevinho', 'Bétula', 'Carvalho', 'Cedro', 'Cerejeira', 'Espinheiro', 'Faia', 'Figueira', 'Freixo', 'Hera', 'Louro', 'Macieira', 'Nogueira', 'Olmo', 'Pinheiro', 'Sabugueiro', 'Salgueiro', 'Teixo', 'Tília', 'Videira', 'Zimbro'];
        let nucleosVarinha = ['Pena de Fênix', 'Pelo de Unicórnio', 'Pelo de Veela', 'Escama de Dragão', 'Pena de Hipogrifo', 'Pena de Fênix', 'Pelo de Testrálio', 'Pena de Occami', 'Pelo de Demiguise', 'Pena de Thunderbird', 'Pelo de Esfinge', 'Pena de Garça', 'Pelo de Acromântula', 'Pena de Pássaro-Trovão', 'Pelo de Serpente Marinha', 'Pena de Pássaro-Trovão', 'Pelo de Hipogrifo', 'Pena de Garça', 'Pelo de Testrálio', 'Pena de Occami', 'Pelo de Demiguise', 'Pena de Thunderbird', 'Pelo de Esfinge', 'Pena de Acromântula', 'Pelo de Serpente Marinha'];
        if (!isNotEmpty) {
            return res.status(400).json({ message: 'Material, comprimento, núcleo e data de fabricação são obrigatórios' });
        }
        if (!materiaisVarinha.includes(material)) {
            return res.status(400).json({ message: 'Material deve ser Abeto, Acer, Azevinho, Bétula, Carvalho, Cedro, Cerejeira, Espinheiro, Faia, Figueira, Freixo, Hera, Louro, Macieira, Nogueira, Olmo, Pinheiro, Sabugueiro, Salgueiro, Teixo, Tília, Videira ou Zimbro' });
        }
        if (!nucleosVarinha.includes(nucleo)) {
            return res.status(400).json({ message: 'Núcleo deve ser Pena de Fênix, Pelo de Unicórnio, Pelo de Veela, Escama de Dragão, Pena de Hipogrifo, Pena de Fênix, Pelo de Testrálio, Pena de Occami, Pelo de Demiguise, Pena de Thunderbird, Pelo de Esfinge, Pena de Garça, Pelo de Acromântula, Pena de Pássaro-Trovão, Pelo de Serpente Marinha, Pena de Pássaro-Trovão, Pelo de Hipogrifo, Pena de Garça, Pelo de Testrálio, Pena de Occami, Pelo de Demiguise, Pena de Thunderbird, Pelo de Esfinge ou Pena de Acromântula' });
        }
        await pool.query('INSERT INTO varinhas (material, comprimento, nucleo, data_fabricacao) VALUES ($1, $2, $3, $4)', [material, comprimento, nucleo, data_fabricacao]);
        res.status(201).json({ message: 'Varinha criada com sucesso' });
    } catch (error) {
        console.error('Erro ao criar varinha', error);
        res.status(500).json({ message: 'Erro ao criar varinha' });
    }
});
app.delete('/varinhas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('DELETE FROM varinhas WHERE id = $1', [id]);
        if (result.rowCount === 0) {
            res.status(404).json({ message: 'Varinha não encontrada' });
        } else {
            res.json({ message: 'Varinha deletada com sucesso' });
        }
    } catch (error) {
        console.error('Erro ao deletar varinha', error);
        res.status(500).json({ message: 'Erro ao deletar varinha' });
    }
});
app.put('/varinhas/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { material, comprimento, nucleo, data_fabricacao } = req.body;
        await pool.query('UPDATE varinhas SET material = $1, comprimento = $2, nucleo = $3, data_fabricacao = $4 WHERE id = $5', [material, comprimento, nucleo, data_fabricacao, id]);
        res.status(200).json({ message: 'Varinha atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar varinha', error);
        res.status(500).json({ message: 'Erro ao atualizar varinha' });
    }
});

app.get('/', (req, res) => {
    res.send('Servidor rodando!');
});
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});