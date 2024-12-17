import express from 'express';
var router = express.Router();
import axios from 'axios';
import { API_URL } from '../config/conf.js';
import { createObjectCsvWriter } from 'csv-writer';

/* ----------------------------------------------------------- 
   Lista os EMD na página principal
   ----------------------------------------------------------- */
router.get('/', function(req, res) {
  var data = new Date().toISOString().substring(0, 16)
  axios.get(API_URL + '/emds?_sort=dataExame&_order=desc')
    .then(response => {
      res.render('index', { lista: response.data, data: data });
    })
    .catch(error => {
      res.render('error', {error: error});
    });
});

/* ----------------------------------------------------------- 
   CRIAÇÂO DE NOVO REGISTO (PARTE1)
   ----------------------------------------------------------- */
router.get('/novoRegisto', function(req, res){
  var data = new Date().toISOString().substring(0, 16)
  res.render('form-emd', {data: data})
})

/* ----------------------------------------------------------- 
   CRIAÇÂO DE NOVO REGISTO (PARTE2)
   ----------------------------------------------------------- */
   async function calcularNovoId() {
    try {
      const response = await axios.get(API_URL + '/confs');
      
      // Extrair o ID do último registro
      const ultimo = response.data.ultimoId;
      const novoId = parseInt(ultimo.slice(1), 10) + 1;
      const novo = `e${novoId}`
      const conf = {
        "ultimoId": novo
      }
      await axios.put(API_URL + '/confs', conf);
  
      console.log(`Último ID: ${ultimo} :: Novo ID: ${novo}`);
      return novo;
    } catch (error) {
      console.error('Erro ao calcular novo ID:', error);
      return `e-1`;
    }
  }

router.post('/emd', async function(req, res){
  var data = new Date().toISOString().substring(0, 16)
  var novo = req.body
  novo.id = await calcularNovoId();
  axios.post(API_URL + '/emds', novo)
    .then(response => {
      res.render('novoRegisto', { dados: response.data, data: data });
    })
    .catch(error => {
      res.render('error', {error: error});
    });
})

/* ----------------------------------------------------------- 
   ALTERAÇÂO DE UM REGISTO (PARTE1):
   Lança a página de edição de um registo depois de o carregar
   ----------------------------------------------------------- */
router.get('/editRegisto/:id', function(req,res){
  var data = new Date().toISOString().substring(0, 16)
  axios.get(API_URL + '/emds/' + req.params.id)
    .then(response => {
      res.render('form-edit-emd', { emd: response.data, data: data });
    })
    .catch(error => {
      res.render('error', {error: error});
    });
})

/* ----------------------------------------------------------- 
   ALTERAÇÂO DE UM REGISTO (PARTE2):
   Recebe os dados de alteração do registo e altera-o
   ----------------------------------------------------------- */
router.post('/emdAlterado', function(req,res){
  var data = new Date().toISOString().substring(0, 16)
  axios.put(API_URL + '/emds/' + req.body.id, req.body)
    .then(response => {
      res.render('registoAlterado', { dados: response.data, data: data });
    })
    .catch(error => {
      res.render('error', {error: error});
    });
})

/* ----------------------------------------------------------- 
   APAGAR UM REGISTO:
   ----------------------------------------------------------- */
router.get('/delRegisto/:id', function(req,res){
    var data = new Date().toISOString().substring(0, 16)
    axios.delete(API_URL + '/emds/' + req.params.id)
      .then(response => {
        res.render('registoApagado', { id: req.params.id, data: data });
      })
      .catch(error => {
        res.render('error', {error: error});
      });
  })

/* ----------------------------------------------------------- 
   EXPORTAÇÂO DA BD EM CSV:
   ----------------------------------------------------------- */
router.get('/exportCSV', function(req, res){
  axios.get(API_URL + '/emds?_sort=dataExame&_order=desc')
    .then(response => {
      const csvWriter = createObjectCsvWriter({
        path: 'EMD-export.csv',
        header: ['id', 'dataExame', 'nome', 'genero', 'dataNasc', 'nif', 'morada', 'federado', 'modalidade', 
                'clube', 'resultadoEMD', 'exameComplementar', 'controlo', 'pagamento', 'contacto' ]
      });
      csvWriter.writeRecords(response.data)     
        .then(() => {
          res.download( 'EMD-export.csv', 'EMD-export.csv', e => {
            if(e) console.log('Erro no download: ' + e)
          });
          console.log('Exportação realizada...');
        })
        .catch(erro => res.render('error', {error: erro}))
    })
    .catch(error => {
      res.render('error', {error: error});
    });
});


export default router;
