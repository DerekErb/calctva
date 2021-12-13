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
    pTVA;
    arrBtns = [];
    btnUndo;
    btnReset;
    percentage;
    lastEntry = [];
    arrTotals = [
        [0.2, 0, 0, 0],
        [0.1, 0, 0, 0],
        [0.055, 0, 0, 0],
        [0.021, 0, 0, 0]
    ];
    ht;
    ttc;
    tva;

    constructor(idTTC, idHT, idTVA, btnsClass, idBtnUndo, idBtnReset) {
        this.fldTTC         = document.getElementById(idTTC);
        this.fldHT          = document.getElementById(idHT);
        this.pTVA           = document.getElementById(idTVA);
        this.arrBtns        = document.querySelectorAll(btnsClass)
        this.btnUndo        = document.getElementById(idBtnUndo);
        this.btnReset       = document.getElementById(idBtnReset);
    }

    /**************************************************************
    ** addToTotals()
    ** Adds the new entry to the totals array
    **************************************************************/
    addToTotals() {

        for (let i = 0; i < this.arrTotals.length; i++) {
            if (this.arrTotals[i][0] === this.lastEntry[0]) {
                this.arrTotals[i][1] += this.lastEntry[1];
                this.arrTotals[i][2] += this.lastEntry[2];
                this.arrTotals[i][3] += this.lastEntry[3];
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

    /**********************************************************
     ** calculateTVA()
     ** sets TVA value from HT and TTC input fields
     **********************************************************/

    calculateTVA() {
        if (this.fldHT.value === '') {
            this.tva = 0;
        }
        else {
            this.tva = (parseFloat(this.fldTTC.value) - parseFloat(this.fldHT.value)).toFixed(2);
        }
    }

    /*************************************************************************
    ** createEntry()
    ** Creates an entry in Details section and calls addToTotals
    *************************************************************************/
    createEntry() {
        this.lastEntry = [ this.percentage, parseFloat(this.fldHT.value), parseFloat(this.tva) , parseFloat(this.fldTTC.value)];
        this.addToTotals();
        //    this.createEntryHTML();
    }

    /**************************************************************************************
    ** createEntryHTML()
    ** Creates all the HTML elements of the last entry and inserts them in #sectDetails
    ***************************************************************************************/
    /*createEntryHTML() {
        let div = document.createElement('div');
        div.classList.add('dEntry');
        let p1 = document.createElement('p');
        p1.classList.add('pHT');
        p1.innerHTML = this.lastEntry[0].toFixed(2) + '€';
        let p2 = document.createElement('p');
        p2.classList.add('pTaux');
        p2.innerHTML = (this.lastEntry[0] * 100).toFixed(2) + ' %';
        let p3 = document.createElement('p');
        p3.classList.add('pTTC');
        p3.innerHTML = this.lastEntry[2].toFixed(2) + '€';
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        document.getElementById('sectDetails').insertBefore(div, document.querySelector('.dEntry'));
    } */


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
            if (!document.getElementById('dTotal'  + (array[0] * 100).toString())) {
                if (array[1] !== 0) {
                    let div = document.createElement('div');
                    div.classList.add('dTotal');
                    div.id = 'dTotal' + (array[0] * 100).toString();
                    let pRate = document.createElement('p');
                    pRate.classList.add('pRate');
                    pRate.innerHTML = (array[0] * 100).toFixed(2) + ' %';
                    let p1 = document.createElement('p');
                    p1.classList.add('pHT');
                    p1.innerHTML = (array[1]).toFixed(2) + '€';
                    let p2 = document.createElement('p');
                    p2.classList.add('pTVA');
                    p2.innerHTML = array[2].toFixed(2) + '€';
                    let p3 = document.createElement('p');
                    p3.classList.add('pTTC');
                    p3.innerHTML = array[3].toFixed(2) + '€';
                    div.appendChild(pRate);
                    div.appendChild(p1);
                    div.appendChild(p2);
                    div.appendChild(p3);
                    document.getElementById('dTotals').appendChild(div);
                }
            }
            else
            {
                document.getElementById('dTotal'  + (array[0] * 100).toString()).querySelector('.pHT').innerHTML = array[1].toFixed(2) + '€';
                document.getElementById('dTotal'  + (array[0] * 100).toString()).querySelector('.pRate').innerHTML = (array[0] * 100).toFixed(2) + ' %';
                document.getElementById('dTotal'  + (array[0] * 100).toString()).querySelector('.pTTC').innerHTML = array[3].toFixed(2) + '€';
                document.getElementById('dTotal'  + (array[0] * 100).toString()).querySelector('.pTVA').innerHTML = array[2].toFixed(2) + '€';
            }
        })
    }

    /**************************************************************************
    ** undo()
    ** Substracts last entry from corresponding subarray in arrTotals
    **************************************************************************/
    undo() {
        for (let i = 0; i < this.arrTotals.length; i++) {
            if (this.arrTotals[i][0] === this.lastEntry[0]) {
                this.arrTotals[i][1] -= this.lastEntry[1];
                this.arrTotals[i][2] -= this.lastEntry[2];
                this.arrTotals[i][3] -= this.lastEntry[3];
            }
          }
        this.renderTotals();
    }

    /**************************************************************************
    ** reset()
    ** Resets the arrays and interface
    **************************************************************************/
    reset() {
        this.arrTotals = [
            [0.2, 0, 0, 0],
            [0.1, 0, 0, 0],
            [0.055, 0, 0, 0],
            [0.021, 0, 0, 0]
        ];
        this.renderTotals();
        this.fldTTC.value = '';
        this.fldHT.value = '';
        this.tva = 0;
        this.showTVA();
        document.querySelector('input[lastused]').select();
    }


    getHT() {
        this.ht = parseFloat(this.fldHT.value).toFixed(2);
    }

    getTTC() {
        this.ttc = parseFloat(this.fldTTC.value).toFixed(2);
    }

    calcHT() {
        this.ht = this.ttc / this.taux;
    }

    calcTTC() {
        this.ttc = this.ht * this.taux;
    }

    showHT() {
        this.fldHT.value = this.ht;
    }

    showTTC() {
        this.fldTTC.value = this.ttc;
    }

    showTVA() {
        this.pTVA.innerHTML = this.tva;
    }

}


/******* Events to trigger once the DOM is loaded ********/
document.addEventListener('DOMContentLoaded', () => {

    // Create calc class instance
    calc = new CalcTVA('fldTTC', 'fldHT', 'pTVA', '.btnPerc', 'btnUndo', 'btnReset');
    calc.getPercentage();

    document.addEventListener('click', (event) => {

        /********* Adds active class to clicked rate button *********/
        if (event.target.classList.contains('btnPerc')) {
            document.querySelectorAll('.btnPerc').forEach(button => {
                button.classList.remove("active");
            });
            event.target.classList.add('active');

            /****** Updates the input fields when the rate is changed ********/
            calc.getPercentage();
            if (calc.fldTTC.hasAttribute('lastused')) calc.calculateHT();
            if (calc.fldHT.hasAttribute('lastused')) calc.calculateTTC();
            calc.calculateTVA();
            calc.showTVA();
        }

        /******** Creates an entry, calculates and renders the totals, and shows sectDetails if it's hidden *********/
        if (event.target === document.getElementById('btnAdd') && document.getElementById('fldHT').value.length > 0) {
            calc.createEntry();
            document.querySelector('input[lastused]').select();
            calc.renderTotals();
            document.getElementById('sectDetails').style.display = 'flex';
        }

        /****** Undo function *****/
        if (event.target === document.getElementById('btnUndo')) calc.undo();

        /****** Reset function *****/
        if (event.target === document.getElementById('btnReset')) {
             calc.reset();
            document.getElementById('sectDetails').style.display = 'none';
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
        calc.calculateTVA();
        calc.showTVA();
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