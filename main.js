// Função para pegar os dados da API
async function obterDadosConsumo() {
    try {
      // Fazendo a requisição GET para a API
      const response = await fetch('http://localhost:3000/api/consumo');
      
      // Verificando se a resposta foi bem-sucedida
      if (response.ok) {
        const dados = await response.json();
  
        // Exibindo os dados no console (ou exibindo em elementos HTML)
        console.log('Consumo:', dados.consumo);
        console.log('Fatura:', dados.fatura);
  
        // Exemplo de como inserir os dados no HTML (se você tiver elementos com ids específicos)
        document.getElementById('consumo').innerText = `${dados.consumo} kWh`;
        document.getElementById('fatura').innerText = `R$ ${dados.fatura}`;
      } else {
        console.error('Erro na resposta da API:', response.status);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    }
  }
  
  // Chama a função quando a página carrega
  document.addEventListener('DOMContentLoaded', obterDadosConsumo);
  