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
    fldLastInput;

    fldMaxChar = 20;

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
        this.fldHT          =   document.getElementById(idHT);
        this.fldTTC         =   document.getElementById(idTTC);
        this.fldTVA         =   document.getElementById(idTVA);
        this.btnUndo        =   document.getElementById(idBtnUndo);
        this.btnReset       =   document.getElementById(idBtnReset);

        // Set HT input as default first input field
        this.fldLastInput   =   this.fldHT;
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
    /* FUTURE HISTORY SECTION
    addEntryHTML() {
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
    }
    */

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
     ** gotoLastInput()
     ** Set focus to the last input field
     **************************************************************************/
    gotoLastInput() {
        this.fldLastInput.focus();
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
    ** setFldMaxChar()
    ** Sets the inputs' max characters that can be entered
    **************************************************************************/
    setFldMaxChar(number) {
        if (window.matchMedia("(max-width: 500px)").matches) {
            this.fldMaxChar = number || 9;
        }
    }

    /**************************************************************************
    ** setHT()
    ** Sets the value of HT from the HT field
    **************************************************************************/
    setHT(fHT) {
        this.ht = fHT || parseFloat(this.fldHT.value).toFixed(2);
    }

    /**************************************************************************
     ** setLastInput()
     ** Sets the ID of the last input field focused
     **************************************************************************/
    setLastInput(fldLastInput) {
        this.fldLastInput = fldLastInput;
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
