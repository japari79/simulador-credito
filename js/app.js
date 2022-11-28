/****
    Proyecto:   Simulador de crédito
    Nombre:     Jofran Aparicio
    Comisión:   45070
    Descripción: Simulador de créditos el cual realiza el cálculo de la cuota a pagar en función a:
        - Monto del préstamo especificado por el usuario
        - Plazo del préstamo especificado por el usuario
        - Tasa del préstamo cuyo valor es fijo y está representado en EM "Efectivo Mensual"

    ¿Qué utilizo de JavaScript para esta tercera entrega del Proyecto?
    Respuesta:
        - Funciones
        - Condicionales 
        - Objetos
        - Eventos (Botón "Simular Crédito")
        - JSON
        - Storage
        - Manejo del DOM
****/

//** Variables globales
let rateEM = 1.32;


//** Crear el objeto Prestamo
function objLoan(amount, term, capitalPaymentPerMonth, interestAmount, totalPayPerMonth, totalPay) {
    this.amount = amount,
    this.term = term,
    this.capitalPaymentPerMonth = capitalPaymentPerMonth,
    this.interestAmount = interestAmount,
    this.totalPayPerMonth = totalPayPerMonth,
    this.totalPay = totalPay
}


//** Funciones
function calculateLoan(name,amount,term) {
    
    let capitalPaymentPerMonth = amount / term;
    let interestAmount = (amount * rateEM) / 100;
    let totalPayPerMonth = (capitalPaymentPerMonth + interestAmount).toFixed(2);
    let totalPay = (totalPayPerMonth * term).toFixed(2);

    let objResult = new objLoan(amount, term, capitalPaymentPerMonth, interestAmount, totalPayPerMonth, totalPay);

    //** Se convierte el resultado en un JSON
    let resultSimulation = JSON.stringify(objResult)

    //** Almacenamiento en el storage
    sessionStorage.setItem("nameUser", name);
    sessionStorage.setItem("resultSimulation", resultSimulation);

    //** Se llama a la función que imprime los resultados
    printResult();
}

function printResult() {
    //** Recupero los datos del storage
    let nameUser = sessionStorage.getItem("nameUser");
    let resultSimulation = sessionStorage.getItem("resultSimulation");
    
    let frmResult = document.getElementById('card-result');
    let resultTittle = `Hola ${nameUser}!`;

    if(resultSimulation) {
        let result = JSON.parse(resultSimulation);
        document.getElementById('titleResult').innerText = resultTittle;
        document.getElementById('rate').innerText = rateEM + "% E.M (Efectiva Mensual)";
        document.getElementById('amount').innerText = "$" + result.amount;
        document.getElementById('term').innerText = result.term + " meses";
        document.getElementById('totalPayPerMonth').innerText = "$" + result.totalPayPerMonth;
        document.getElementById('totalPay').innerText = "$" + result.totalPay;
        frmResult.className = "card card-result bg-light";
    }else{
        alert("Lo siento! Ocurrió un error al realizar la simulación del crédito, por favor verifica los datos e inténtalo nuevamente.");
    }
}


//** Inicio del programa
let frmSimulation = document.getElementById('simulation-form');

frmSimulation.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.getElementById('nombre').value;
    let amount = parseInt(document.getElementById('monto').value);
    let term = parseInt(document.getElementById('plazo').value);

    if(name != '' && amount != '') {
        if(amount > 0) {
            calculateLoan(name,amount,term);
        }else{
            alert("Lo siento! Debes especificar un valor numérico para el monto del crédito.");  
        }
    } else {
        alert("Lo siento! Debes especificar un valor en todos los campos obligatorios del formulario para poder realizar la simulación.");
    }
});