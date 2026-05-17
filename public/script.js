
async function register(){

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/register',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({name,email,password})
    });

    const data = await response.json();

    alert(data.message || data.error);
}

async function login(){

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const response = await fetch('/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({email,password})
    });

    const data = await response.json();

    alert(data.message || data.error);
}

async function addTransaction(){

    const type = document.getElementById('type').value;
    const description = document.getElementById('description').value;
    const amount = document.getElementById('amount').value;

    const response = await fetch('/transaction',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({type,description,amount})
    });

    const data = await response.json();

    alert(data.message);

    loadTransactions();
}

async function loadTransactions(){

    const response = await fetch('/transactions');

    const data = await response.json();

    const transactions = document.getElementById('transactions');

    transactions.innerHTML = '';

    data.forEach(item => {

        transactions.innerHTML += `
            <div class="transaction">
                <strong>${item.type}</strong><br>
                ${item.description}<br>
                R$ ${item.amount}
            </div>
        `;

    });

}

loadTransactions();
