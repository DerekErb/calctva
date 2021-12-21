/*********************************************************************
 *
 *  CalcTVA
 *
 *  Created by Derek Erb Solutions ( https://derekerb.solutions)
 *  JavaScript programming and CSS styling by
 *  Victor Polouchine (victor@derekerb.solutions)
 *
 ********************************************************************/

class CalcTVA {

    fldHT;
    fldTTC;
    fldTVA;

    ht;
    ttc;
    tva;

    btnUndo;
    btnReset;

    lastEntry = [];
    arrTotals = [
        [0.2, 0, 0, 0],
        [0.1, 0, 0, 0],
        [0.055, 0, 0, 0],
        [0.021, 0, 0, 0]
    ];

    constructor(idTTC, idHT, idTVA, idBtnUndo, idBtnReset) {
        this.fldTTC         = document.getElementById(idTTC);
        this.fldHT          = document.getElementById(idHT);
        this.fldTVA         = document.getElementById(idTVA);
        this.btnUndo        = document.getElementById(idBtnUndo);
        this.btnReset       = document.getElementById(idBtnReset);
    }


    /*************************************************************************
    ** addEntry()
    ** Creates an entry in Details section and calls updateTotals
    *************************************************************************/
    addEntry() {
        this.lastEntry = [this.lastEntry[0], parseFloat(this.fldHT.value), parseFloat(this.tva) , parseFloat(this.fldTTC.value)];
        this.updateTotals();
        //    this.addEntryHTML();
    }

    /**************************************************************************************
    ** addEntryHTML()
    ** Creates all the HTML elements of the last entry and inserts them in #sectTotals
    ***************************************************************************************/
    /*addEntryHTML() {
        let div = document.createElement('div');
        div.classList.add('dEntry');
        let input1 = document.createElement('p');
        input1.classList.add('pHT');
        input1.innerHTML = this.lastEntry[0].toFixed(2) + '€';
        let input2 = document.createElement('p');
        input2.classList.add('pTaux');
        input2.innerHTML = (this.lastEntry[0] * 100).toFixed(2) + ' %';
        let input3 = document.createElement('p');
        input3.classList.add('pTTC');
        input3.innerHTML = this.lastEntry[2].toFixed(2) + '€';
        div.appendChild(input1);
        div.appendChild(input2);
        div.appendChild(input3);
        document.getElementById('sectDetails').insertBefore(div, document.querySelector('.dEntry'));
    } */

    /**********************************************************
     *** calcHT()
     ** sets HT value from TTC field value
     **********************************************************/
    calcHT() {
        this.setTTC();
        this.ht = parseFloat(this.ttc / this.taux).toFixed(2);
        return this.ht;
    }

    /**********************************************************
     ** calcTTC()
     ** sets TTC value from HT input field
     **********************************************************/
    calcTTC() {
        this.setHT();
        this.ttc = parseFloat(this.ht * this.taux).toFixed(2);
        return this.ttc;
    }

    /**********************************************************
     ** calcTVA()
     ** sets TVA value from HT and TTC input fields
     **********************************************************/

    calcTVA() {
        this.tva = (this.fldHT.value === '' ? 0 : (parseFloat(this.fldTTC.value) - parseFloat(this.fldHT.value)).toFixed(2));
        return this.tva;
    }

    /*****************************************************************************************************
    ** getTaux()
    ** Gets the passed button's data-value to set percentage and ID to set lastEntry's first item
    *****************************************************************************************************/
    getTaux(strBtnID = 'btn0') {
        this.taux           = 1 + parseFloat(document.getElementById(strBtnID).dataset.value);
        this.lastEntry[0]   = parseInt(strBtnID.slice(strBtnID.length -1));
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
        this.fldTTC.value = '';
        this.fldHT.value = '';

        this.showTotals();
        this.showTVA();

        document.querySelectorAll('.dTotal').forEach(total => total.remove());
        this.getTaux('btn0');
        document.querySelectorAll('.btnPerc').forEach(button => {
            button.classList.remove("active");
        });
        document.getElementById('btn0').classList.add('active');
        this.fldHT.select();
        document.getElementById('sectTotals').style.display = 'none';
    }

    /**************************************************************************
    ** setHT()
    ** Sets the value of HT from the HT field
    **************************************************************************/
    setHT(fHT) {
        this.ht = fHT || parseFloat(this.fldHT.value).toFixed(2);
    }

    /**************************************************************************
    ** setTTC()
    ** Sets the value of ttc from the TTC field
    **************************************************************************/
    setTTC(fTTC) {
        this.ttc = fTTC || parseFloat(this.fldTTC.value).toFixed(2);
    }

    /**************************************************************************
    ** showHT()
    ** Displays the value of HT in the HT field
    **************************************************************************/
    showHT() {
        this.fldHT.value = this.calcHT();
    }

    /**************************************************************************
    ** showTotals()
    ** Shows the totals of each array (creates the elements or updates them)
    **************************************************************************/
    showTotals() {

        document.querySelectorAll('.dTotal').forEach(total => total.remove());

        this.arrTotals.forEach(array => {
                if (array[1] !== 0) {
                    // show total if array isn't empty
                    let div = document.createElement('div');
                    div.classList.add('dTotal');
                    div.id = 'dTotal' + (array[0] * 1000).toString();
                    let lblRate = document.createElement('label');
                    lblRate.classList.add('lblRate');
                    lblRate.innerHTML = (array[0] * 100).toFixed(2) + '&nbsp;%';
                    lblRate.setAttribute('for', 'inputTVA' + (array[0] * 100).toString());
                    lblRate.setAttribute('aria-label', 'Totaux' + (array[0] * 100).toString() + ' %');
                    let input1 = document.createElement('input');
                    input1.classList.add('inputHT');
                    input1.setAttribute('readonly', '');
                    input1.setAttribute('aria-label', 'Total Hors-Taxe' + (array[0] * 100).toString() + ' %');
                    input1.value = (array[1]).toFixed(2) + ' €';
                    let input2 = document.createElement('input');
                    input2.classList.add('inputTVA');
                    input2.id = 'inputTVA' + (array[0] * 100).toString();
                    input2.setAttribute('readonly', '');
                    input2.setAttribute('aria-label', 'Total TVA' + (array[0] * 100).toString() + ' %');
                    input2.value = array[2].toFixed(2) + ' €';
                    let input3 = document.createElement('input');
                    input3.classList.add('inputTTC');
                    input3.setAttribute('readonly', '');
                    input3.setAttribute('aria-label', 'Total TTC' + (array[0] * 100).toString() + ' %');
                    input3.value = array[3].toFixed(2) + ' €';
                    div.appendChild(lblRate);
                    div.appendChild(input1);
                    div.appendChild(input2);
                    div.appendChild(input3);
                    document.getElementById('dTotals').appendChild(div);
                }
        })
    }

    /**************************************************************************
    ** showTTC()
    ** Displays the value of TTC in the TTC field
    **************************************************************************/
    showTTC() {
        this.fldTTC.value = this.calcTTC();
    }

    /**************************************************************************
    ** showTVA()
    ** Displays the value of TVA in the TVA field
    **************************************************************************/
    showTVA() {
        this.fldTVA.value = this.calcTVA();
    }

    /**************************************************************************
    ** undo()
    ** Updates the totals by substracting lastEntry to totals
    **************************************************************************/
    undo() {
        // disable undo function if nothing has been added
        if (this.lastEntry[1]) {
            this.updateTotals(false);
            this.fldTTC.value = '';
            this.fldHT.value = '';
            this.showTVA();
            // Return to last selected field
            document.querySelector('input[lastused]').select();
        }
    }

    /**************************************************************
    ** updateTotals()
    ** Adds or substracts the new entry to the totals array
    **************************************************************/
    updateTotals(bAdd = true, bShow = true) {
        if (bAdd) {
            this.arrTotals[this.lastEntry[0]][1] += this.lastEntry[1];
            this.arrTotals[this.lastEntry[0]][2] += this.lastEntry[2];
            this.arrTotals[this.lastEntry[0]][3] += this.lastEntry[3];
        }
        else {
            this.arrTotals[this.lastEntry[0]][1] -= this.lastEntry[1];
            this.arrTotals[this.lastEntry[0]][2] -= this.lastEntry[2];
            this.arrTotals[this.lastEntry[0]][3] -= this.lastEntry[3];
        }

        if (bShow)
            this.showTotals();
    }
}


/*************************************************************************
 ** EVENT LISTENERS
 ** Events to trigger once the DOM is loaded
*************************************************************************/
document.addEventListener('DOMContentLoaded', () => {

    // Create calc class instance
    calc = new CalcTVA('fldTTC', 'fldHT', 'fldTVA', 'btnUndo', 'btnReset');
    calc.getTaux();
    calc.showTVA();

    // Initialise first field
    calc.fldHT.setAttribute("lastused",'');

    document.addEventListener('click', (event) => {

        /********* Adds active class to clicked rate button *********/
        if (event.target.classList.contains('btnPerc')) {
            document.querySelectorAll('.btnPerc').forEach(button => {
                button.classList.remove("active");
            });
            event.target.classList.add('active');

            /****** Updates the input fields when the rate is changed ********/
            calc.getTaux(event.target.id);
            if (calc.fldTTC.hasAttribute('lastused')) calc.showHT();
            if (calc.fldHT.hasAttribute('lastused')) calc.showTTC();
            calc.showTVA();
        }

        /******** Creates an entry, calculates and renders the totals, and shows sectTotals if it's hidden *********/
        if (event.target === document.getElementById('btnAdd') && document.getElementById('fldHT').value.length > 0) {
            calc.addEntry();
            // If on mobile, no automatic input select
            if (window.matchMedia("(min-width: 500px)").matches) {
                document.querySelector('input[lastused]').select();
            }
            calc.showTotals();
            document.getElementById('sectTotals').style.display = 'flex';
        }

        /****** Undo function *****/
        if (event.target === document.getElementById('btnUndo')) calc.undo();

        /****** Reset function *****/
        if (event.target === document.getElementById('btnReset')) {
             calc.reset();
            document.getElementById('sectTotals').style.display = 'none';
        }


        /******** NAVBAR FUNCTIONS ********/
        if (event.target.classList.contains('btnNav')) {
            document.querySelectorAll('.btnNav').forEach(button => {
                 button.classList.remove('active');
            })
            event.target.classList.add('active');
            document.getElementById('navActiveIndicator').style.transform = `translateX(${100 * event.target.dataset.index}%)`;
            document.querySelectorAll('article').forEach((article, index) => {
                if (index === parseInt(event.target.dataset.index)) {
                    article.classList.remove('inactive');
                    article.classList.add('active');
                }
                else {
                    article.classList.remove('active');
                    article.classList.add('inactive');
                }
            })
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
        if (event.target === document.getElementById('fldHT'))
            calc.showTTC();
        if (event.target === document.getElementById('fldTTC'))
            calc.showHT();
        calc.showTVA();
    });

    /********* Enables entry creation and totals udpdate by pressing Enter key ********/
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && document.getElementById('fldHT').value.length > 0) {
            calc.addEntry();
            // If on mobile, no automatic input select
            if (window.matchMedia("(min-width: 500px)").matches) {
                document.querySelector('input[lastused]').select();
            }
            calc.showTotals();
            document.getElementById('sectTotals').style.display = 'flex';
        }
    });
});
