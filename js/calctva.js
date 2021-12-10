/*********************************************************************
 *
 *  CalcTVA
 *  Version 1.0
 *
 *  Created by Derek Erb Solutions ( https://derekerb.solutions)
 *  JavaScript programming and CSS styling by
 *  Victor Polouchine (victor@derekerb.solutions)
 *
 ********************************************************************/

class CalcTVA {

    fldTTC;
    fldHT;
    arrBtns = [];
    percentage;
    lastEntry = [];
    arrTotals = [
        [0, 0.2, 0],
        [0, 0.1, 0],
        [0, 0.055, 0],
        [0, 0.021, 0]
    ];

    constructor(idTTC, idHT, btnsClass) {
        this.fldTTC     = document.getElementById(idTTC);
        this.fldHT      = document.getElementById(idHT);
        this.arrBtns    = document.querySelectorAll(btnsClass)
    }

    /**************************************************************
    ** addToTotals()
    ** Adds the new entry to the totals array
    **************************************************************/
    addToTotals() {

        for (let i = 0; i < this.arrTotals.length; i++) {
            if (this.arrTotals[i][1] === this.lastEntry[1]) {
                this.arrTotals[i][0] += this.lastEntry[0];
                this.arrTotals[i][2] += this.lastEntry[2];
            }
          }
    }

    /**********************************************************
     ** calculateHT()
     ** sets HT value from TTC field value
     **********************************************************/
    calculateHT() {
        this.fldHT.value = (parseFloat(this.fldTTC.value) / this.taux).toFixed(2);
    }

    /**********************************************************
     ** calculateTTC()
     ** sets TTC value from HT input field
     **********************************************************/
    calculateTTC() {
        this.fldTTC.value = (parseFloat(this.fldHT.value) * this.taux).toFixed(2);
    }

    /*************************************************************************
    ** createEntry()
    ** Creates an entry in Details section and calls addToTotals
    *************************************************************************/
    createEntry() {
        this.lastEntry = [parseFloat(this.fldHT.value), this.percentage, parseFloat(this.fldTTC.value)];
        this.addToTotals();
        this.createEntryHTML();
    }

    /**************************************************************************************
    ** createEntryHTML()
    ** Creates all the HTML elements of the last entry and inserts them in #sectDetails
    ***************************************************************************************/
    createEntryHTML() {
        let div = document.createElement('div');
        div.classList.add('dEntry');
        let p1 = document.createElement('p');
        p1.classList.add('pHT');
        p1.innerHTML = this.lastEntry[0].toFixed(2) + '€';
        let p2 = document.createElement('p');
        p2.classList.add('pTaux');
        p2.innerHTML = (this.lastEntry[1] * 100).toFixed(2) + ' %';
        let p3 = document.createElement('p');
        p3.classList.add('pTTC');
        p3.innerHTML = this.lastEntry[2].toFixed(2) + '€';
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        document.getElementById('sectDetails').insertBefore(div, document.querySelector('.dEntry'));
    }


    /**********************************************************
    ** getPercentage()
    ** gets the selected button's data-value to set percentage
    **********************************************************/
    getPercentage() {
        this.arrBtns.forEach(button => {
            if (button.classList.contains('active')) this.percentage = parseFloat(button.dataset.value);
            this.taux = 1 + this.percentage;
        })
    }

    /**************************************************************************
    ** renderTotals()
    ** Renders the totals of each array (creates the elements or updates them)
    **************************************************************************/
    renderTotals() {
        this.arrTotals.forEach(array => {
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

    // Create calc class instance
    const calc = new CalcTVA('fldTTC', 'fldHT', '.btnPerc');
    calc.getPercentage();

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

        /******** Creates an entry, calculates and renders the totals, and shows sectDetails if it's hidden *********/
        if (event.target === document.getElementById('btnAdd') && document.getElementById('fldHT').value.length > 0) {
            calc.createEntry();
            document.querySelector('input[lastused]').select();
            calc.renderTotals();
            document.getElementById('sectDetails').style.display = 'flex';
        }
    });

    /****** Adds 'lastused' attribute when input is focused and remove previous one *******/
    document.addEventListener('focusin', (event) => {
        if (event.target === calc.fldHT) {
            calc.fldTTC.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
        }
        if (event.target === calc.fldTTC) {
            calc.fldHT.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
        }
    });

    /******* Changes HT or TTC field whenever the other field changes *********/
    document.addEventListener('input', (event) => {
        if (event.target === document.getElementById('fldHT')) calc.calculateTTC();
        if (event.target === document.getElementById('fldTTC')) calc.calculateHT();
    });

    /********* Enables entry creation and totals udpdate by pressing Enter key ********/
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.getElementById('fldHT').value.length > 0) {
            calc.createEntry();
            document.querySelector('input[lastused]').select();
            calc.renderTotals();
            document.getElementById('sectDetails').style.display = 'flex';
        }
    });

});