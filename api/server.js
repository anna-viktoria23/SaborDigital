const app = require('./app')
const { PORTA, SIMULAR_ERROS} = require('./config')

app.listen(PORTA, () => {
    console.log(`API Sabor Digital rodando em http://localhost:${PORTA}`)

    console.log(`Simulacao de error: ${SIMULAR_ERROS ? 'ATIVADA' : 'DESATIVADA'}`)
})