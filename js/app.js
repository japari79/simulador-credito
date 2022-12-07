/****
    Proyecto:   Simulador de crédito
    Nombre:     Jofran Aparicio
    Comisión:   45070
    Descripción: Simulador de créditos el cual realiza el cálculo de la cuota a pagar en función a:
        - Tipo de préstamo seleccionado por el usuario
        - Monto del préstamo especificado por el usuario
        - Plazo del préstamo seleccionado por el usuario
        - Tasa del préstamo cuyo valor depende del tipo de préstamo seleccionado representado en EM "Efectivo Mensual"

    ¿Qué utilizo de JavaScript para esta entrega del Proyecto final?
    Respuesta:
        - Funciones
        - Condicionales 
        - Objetos
        - Array
        - Eventos
        - JSON
        - Storage
        - Manejo del DOM
        - Asincronía y fetch
        - Uso de librerías externas
****/

//** Variables globales
let simulations = [];


//** Creación del objeto Prestamo
function objLoan(amount, term, capitalPaymentPerMonth, interestAmount, totalPayPerMonth, totalPay, rate, creditType) {
    this.amount = amount,
    this.term = term,
    this.capitalPaymentPerMonth = capitalPaymentPerMonth,
    this.interestAmount = interestAmount,
    this.totalPayPerMonth = totalPayPerMonth,
    this.totalPay = totalPay,
    this.rate = rate,
    this.creditType = creditType
}


//** Funciones
calculateLoan = (name, amount, term, rate, creditType) => {
    
    let capitalPaymentPerMonth = amount / term;
    let interestAmount = (amount * rate).toFixed(2) / 100;
    let totalPayPerMonth = (capitalPaymentPerMonth + interestAmount).toFixed(2);
    let totalPay = (totalPayPerMonth * term).toFixed(2);

    let objResult = new objLoan(amount, term, capitalPaymentPerMonth, interestAmount, totalPayPerMonth, totalPay, rate, creditType);

    //** Se convierte el resultado en un JSON
    let resultSimulation = JSON.stringify(objResult)

    //** Almacenamiento en el storage
    sessionStorage.setItem("nameUser", name);
    sessionStorage.setItem("resultSimulation", resultSimulation);

    //** Se llama a la función que imprime los resultados de la simulación
    printResult();
}

printResult = () => {
    //** Recupero los datos del storage
    let nameUser = sessionStorage.getItem("nameUser");
    let resultSimulation = sessionStorage.getItem("resultSimulation");
    
    if(resultSimulation) {
        let result = JSON.parse(resultSimulation);
        let resultTittle = `Hola ${nameUser}!`;
        let introText = `A continuación te presentamos el resultado de la simulación para ${result.creditType}:`
        
        document.getElementById('titleResult').innerText = resultTittle;
        document.getElementById('introText').innerText = introText;
        document.getElementById('rate').innerText = result.rate + "% E.M (Efectiva Mensual)";
        document.getElementById('amount').innerText = "$" + result.amount;
        document.getElementById('term').innerText = result.term + " meses";
        document.getElementById('totalPayPerMonth').innerText = "$" + result.totalPayPerMonth;
        document.getElementById('interestAmount').innerText = "$" + result.interestAmount;
        document.getElementById('totalPay').innerText = "$" + result.totalPay;

        let frmResult = document.getElementById('card-result');
        frmResult.className = "card card-result bg-light";
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            confirmButtonColor: '#D4AC0D',
            text: 'Lo siento! Ocurrió un error al realizar la simulación del crédito, por favor verifica los datos e inténtalo nuevamente.'
        })
    }
}

printHistory = () => {
    let html = "<br><h5>Histórico de Simulaciones</h5><hr>";
    let table = "<table class='table-result'><tr><th># Simulación</th><th>Tipo de crédito</th><th>Tasa aplicada</th><th>Valor del préstamo</th><th>Plazo del préstamo</th><th>Valor Cuota Mensual</th><th>Valor interes mensual</th><th>Valor total a pagar</th></tr>";
    let numSimulation = 0;

    simulations.forEach((simulation) => {
        let result = JSON.parse(simulation);
        
        let rate = result.rate;
        let amount = result.amount;
        let interestAmount = result.interestAmount.toFixed(2);
        let term = result.term;
        let totalPayPerMonth = result.totalPayPerMonth;
        let totalPay = result.totalPay;
        let creditType = result.creditType;

        numSimulation++;
        table+= `<tr><td>${numSimulation}</td><td>${creditType}</td><td>${rate} % E.M (Efectiva Mensual)</td><td>$${amount}</td><td>${term} meses</td><td>$${totalPayPerMonth}</td><td>$${interestAmount}</td><td>$${totalPay}</td></tr>`;
    });

    table+= "</table><hr>";
    html+= table;

    let divResult = document.getElementById('main-table');
    divResult.innerHTML = html;
}

reset = () => {
    let frmResult = document.getElementById('card-result');
    frmResult.className = "hidden";

    document.getElementById('monto').value = "";
    document.getElementById('plazo').value = 0;
    document.getElementById('tipo').value = 0;
}

clearHistory = () => {
    document.getElementById('nombre').value = "";

    reset();

    simulations = [];

    let divResult = document.getElementById('main-table');
    divResult.innerHTML = "";
}


//** Inicio del programa
loadCreditType()

async function loadCreditType() {
    const response = await fetch('./json/creditType.json');
    const data = await response.json();

    if(data) {
        const select = document.getElementById('tipo');

        data.forEach(function (typeCredit) {
            const option = document.createElement('option');
            option.value = typeCredit.rate.toFixed(2);
            option.text = typeCredit.type;
            select.appendChild(option);
        });
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            confirmButtonColor: '#D4AC0D',
            text: 'Lo siento! Hubo un error al momento de cargar la lista de los tipos de crédito. Recargue la página nuevamente!.'
        })
    }
}

let frmSimulation = document.getElementById('simulation-form');

frmSimulation.addEventListener('submit', (e) => {
    e.preventDefault();
    let name = document.getElementById('nombre').value;
    let amount = parseInt(document.getElementById('monto').value);
    let term = parseInt(document.getElementById('plazo').value);
    let rate = parseFloat(document.getElementById('tipo').value);
    let creditType = document.getElementById('tipo');
    let creditTypeSelected = creditType.options[creditType.selectedIndex].text;

    if(name != '' && amount != '' && rate != '') {
        if(amount > 0) {
            calculateLoan(name, amount, term, rate, creditTypeSelected);
        }else{
            Swal.fire({
                icon: 'warning',
                title: 'Validación',
                confirmButtonColor: '#D4AC0D',
                text: 'Lo siento! Debes especificar un valor numérico para el monto del crédito.'
            })
        }
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Validación',
            confirmButtonColor: '#D4AC0D',
            text: 'Lo siento! Debes especificar un valor en todos los campos obligatorios del formulario para poder realizar la simulación.'
        })
    }
});


let btnNew = document.getElementById('btnNew');

btnNew.addEventListener('click', () => {
    let resultSimulation = sessionStorage.getItem("resultSimulation");

    if(resultSimulation) {
        simulations.push(resultSimulation);
        
        reset();
        printHistory();

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Tu simulación ha sido almacenada en el historial!.',
            showConfirmButton: false,
            timer: 1500
        })
    }else{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            confirmButtonColor: '#D4AC0D',
            text: 'Lo siento! Hubo un error al momento de registrar esta simulación en el historial.'
        })
    }
});

let btnClear = document.getElementById('btnClear');

btnClear.addEventListener('click', () => {

    if(simulations.length > 0) {
        Swal.fire({
            title: 'Confirmación',
            text: "Estás seguro de querer borrar el historial de simulaciones?.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#D4AC0D',
            cancelButtonColor: '#866d09',
            confirmButtonText: 'Si, borrar!'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: 'El historial de simulacionaciones ha sido borrado satisfactoriamente!.',
                    showConfirmButton: false,
                    timer: 1500
                })
                clearHistory();
            }
        })
    }else{
        Swal.fire({
            icon: 'warning',
            title: 'Validación',
            confirmButtonColor: '#D4AC0D',
            text: 'Lo siento! No existe un historial de simulaciones para eliminar!.'
        })
    }
});