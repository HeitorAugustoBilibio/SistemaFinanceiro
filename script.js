const db = new PouchDB("finances");
const form = document.getElementById("recordForm")
const list = document.getElementById("recordsList")
const totalDaily = document.getElementById("DailySum")
const total = document.getElementById("TotalSum")
const today = new Date().toISOString().slice(0, 10)




form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const desc = document.getElementById('Description').value
    const value = parseFloat(document.getElementById('Value').value);
    const recordtype = document.getElementById('Type').value
    const date = today

    const doc = {
        _id: new Date().toISOString(),
        desc, value, recordtype, date
    }

    await db.put(doc)
    form.reset();
    refresh();
});

async function refresh(){
    const res = await db.allDocs({include_docs: true, descending: true});
    list.innerHTML = '';
    let totalD = 0;
    let totalG = 0;

    res.rows.forEach(row => {
        const {desc, value, recordtype, date} = row.doc;
        const li = document.createElement('li');
        li.textContent = `${date} - ${desc} : R$ ${value.toFixed(2).replace('.', ',')} - (${recordtype})`
        list.appendChild(li);

        if(recordtype === 'Income'){
            totalG += value;
            if(date === today) totalD += value;
        } else {
            totalG -= value;
            if(date === today) totalD -= value
        }
    });

    totalDaily.textContent = `R$ ${totalD.toFixed(2)}`;
    total.textContent = `R$ ${totalG.toFixed(2)}`;
}

refresh();