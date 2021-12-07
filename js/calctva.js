/* JavaScript */
/* CalcTVA JS */

class CalcTVA {

    ttc;
    ht;
    btn20;
    btn10;
    btn5_5;
    btn2_1;
    percentage;
    arr20 = [];
    arr10 = [];
    arr5_5 = [];
    arr2_1 = [];
    arr20Total = [0, 0.2, 0];
    arr10Total = [0, 0.1, 0];
    arr5_5Total = [0, 0.05, 0];
    arr2_1Total = [0, 0.021, 0];

    constructor(idTTC, idHT, idBtn20, idBtn10, idBtn5_5, idBtn2_1) {
    this.ttc = document.getElementById(idTTC);
    this.ht = document.getElementById(idHT);
    this.btn20 = document.getElementById(idBtn20);
    this.btn10 = document.getElementById(idBtn10);
    this.btn5_5 = document.getElementById(idBtn5_5);
    this.btn2_1 = document.getElementById(idBtn2_1);
    }

    /**********************************************************
    ** getPercentage()
    ** gets the selected button's data-value to set percentage
    **********************************************************/
    getPercentage() {
        let activeButton = document.querySelector('button.active');
        return this.percentage = parseFloat(activeButton.dataset.value);
    }

    /**********************************************************
    ** calculateTTC()
    ** sets TTC value from HT input field
    **********************************************************/
    calculateTTC() {
        this.taux = 1 + this.percentage;
        this.ttc.value = (parseFloat(this.ht.value) * this.taux).toFixed(2);
    }

    /**********************************************************
    ** calculateHT()
    ** sets HT value from TTC input field
    **********************************************************/
    calculateHT() {
        this.taux = 1 + this.percentage;
        this.ht.value = (parseFloat(this.ttc.value) / this.taux).toFixed(2);
    }

    /*************************************************************************
    ** createEntry()
    ** Creates an entry in Details section and calls pushToParentArrAndTotal
    *************************************************************************/
    createEntry() {
        let newEntry = [parseFloat(this.ht.value), this.percentage, parseFloat(this.ttc.value)];
        this.pushToParentArrAndTotal(newEntry);
        this.createEntryHTML(newEntry);
    }

    /**************************************************************************************
    ** createEntryHTML()
    ** Creates all the HTML elements of the entry passed and inserts them in #sectDetails
    ***************************************************************************************/
    createEntryHTML(entry) {
        let div = document.createElement('div');
        div.classList.add('dEntry');
        let p1 = document.createElement('p');
        p1.classList.add('pHT');
        p1.innerHTML = entry[0].toFixed(2) + '€';
        let p2 = document.createElement('p');
        p2.classList.add('pTaux');
        p2.innerHTML = (entry[1] * 100).toFixed(2) + ' %';
        let p3 = document.createElement('p');
        p3.classList.add('pTTC');
        p3.innerHTML = entry[2].toFixed(2) + '€';
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        document.getElementById('sectDetails').insertBefore(div, document.querySelector('.dEntry'));
    }

    /**************************************************************
    ** pushToParentArrAndTotal()
    ** Pushes the new entry to the correct array and total array
    **************************************************************/
    pushToParentArrAndTotal(entry) {
        switch (entry[1]) {
            case 0.2:
                this.arr20.push(entry);
                this.arr20Total[0] += entry[0];
                this.arr20Total[2] += entry[2];
                break;
            case 0.1:
                this.arr10.push(entry);
                this.arr10Total[0] += entry[0];
                this.arr10Total[2] += entry[2];
                break;
            case 0.055:
                this.arr5_5.push(entry);
                this.arr5_5Total[0] += entry[0];
                this.arr5_5Total[2] += entry[2];
                break;
            case 0.021:
                this.arr2_1.push(entry);
                this.arr2_1Total[0] += entry[0];
                this.arr2_1Total[2] += entry[2];
                break;
        }
    }

    /**************************************************************************
    ** renderTotals()
    ** Renders the totals of each array (creates the elements or updates them)
    **************************************************************************/
    renderTotals(...arrays) {
        arrays.forEach(array => {
            if (!document.getElementById('dTotal'  + (array[1] * 100).toString())) {
                if (array[0] !== 0) {
                    let div = document.createElement('div');
                    div.classList.add('dTotal');
                    div.id = 'dTotal' + (array[1] * 100).toString();
                    let p1 = document.createElement('p');
                    p1.classList.add('pHT');
                    p1.innerHTML = array[0].toFixed(2) + '€';
                    let p2 = document.createElement('p');
                    p2.classList.add('pTaux');
                    p2.innerHTML = (array[1] * 100).toFixed(2) + ' %';
                    let p3 = document.createElement('p');
                    p3.classList.add('pTTC');
                    p3.innerHTML = array[2].toFixed(2) + '€';
                    div.appendChild(p1);
                    div.appendChild(p2);
                    div.appendChild(p3);
                    document.getElementById('dTotals').appendChild(div);
                }
            }
            else
            {
                document.getElementById('dTotal'  + (array[1] * 100).toString()).querySelector('.pHT').innerHTML = array[0].toFixed(2) + '€';
                document.getElementById('dTotal'  + (array[1] * 100).toString()).querySelector('.pTaux').innerHTML = (array[1] * 100).toFixed(2) + ' %';
                document.getElementById('dTotal'  + (array[1] * 100).toString()).querySelector('.pTTC').innerHTML = array[2].toFixed(2) + '€';
            }
        })
    }




}


/******* Events to trigger once the DOM is loaded ********/
document.addEventListener('DOMContentLoaded', () => {

    /******* Creates the calculator ********/
    const calcCreation = () => {
        calc = new CalcTVA('fldTTC', 'fldHT', 'btn20', 'btn10', 'btn5_5', 'btn2_1');
        calc.getPercentage();
    }

    calcCreation();

    const copyToClipboard = (el) => {
        console.log(el);
        let div = el.parentElement;
        console.log(div);
        let copyText = div.querySelector('input');
        console.log(copyText);
        copyText.select();
        document.execCommand("copy");
        showCopySuccess();
    }

    const showCopySuccess = () => {
        let main = document.querySelector('main');
        let successMessage = document.createElement('p');
        successMessage.id = 'successMessage';
        successMessage.innerText = 'Copié dans le presse-papiers !'
        main.appendChild(successMessage);
        setTimeout(() => {main.removeChild(successMessage)}, 3000);
    }

    document.addEventListener('click', (event) => {

        /********* Handles the rate *********/
        if (event.target.classList.contains('btnPerc')) {
            document.querySelectorAll('.btnPerc').forEach(button => {
                button.classList.remove("active");
            });
            event.target.classList.add('active');
            /****** Updates the input fields when the rate is changed ********/
            calc.getPercentage();
            calc.calculateTTC();
            calc.calculateHT();
        }

        /******** Creates an entry, calculate and render the totals, and show sectDetails if it's hidden when the button is clicked *********/
        if (event.target === document.getElementById('btnAdd') && document.getElementById('fldHT').value.length > 0) {
            calc.createEntry();
            document.querySelector('input[lastused]').select();
            calc.renderTotals(calc.arr20Total, calc.arr10Total, calc.arr5_5Total, calc.arr2_1Total);
            document.getElementById('sectDetails').style.display = 'flex';
        }

        if (event.target.classList.contains('copy')) {
            copyToClipboard(event.target);
        }
    });

    /****** Adds 'lastused' attribute when input is focused and remove previous one *******/
    document.addEventListener('focusin', (event) => {
        if (event.target === calc.ht) {
            calc.ttc.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
        }
        if (event.target === calc.ttc) {
            calc.ht.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
        }
    });

    /******* Changes HT or TTC field whenever the other changes *********/
    document.addEventListener('input', (event) => {
        if (event.target === document.getElementById('fldHT')) calc.calculateTTC();
        if (event.target === document.getElementById('fldTTC')) calc.calculateHT();
    })

    /********* Enables entry creation and totals udpdate by pressing Enter key ********/
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.getElementById('fldHT').value.length > 0) {
            calc.createEntry();
            document.querySelector('input[lastused]').select();
            calc.renderTotals(calc.arr20Total, calc.arr10Total, calc.arr5_5Total, calc.arr2_1Total);
            document.getElementById('sectDetails').style.display = 'flex';
        }
    });

});