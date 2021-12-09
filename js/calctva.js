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

    constructor(idTTC, idHT, btnsClass) {
        this.fldTTC     = document.getElementById(idTTC);
        this.fldHT      = document.getElementById(idHT);
        this.arrBtns    = document.querySelectorAll(btnsClass)
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
    ** getPercentage()
    ** gets the selected button's data-value to set percentage
    **********************************************************/
    getPercentage() {
        this.arrBtns.forEach(button => {
            if (button.classList.contains('active')) this.percentage = parseFloat(button.dataset.value);
            this.taux = 1 + this.percentage;
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
    });

    /******* Changes HT or TTC field whenever the other field changes *********/
    document.addEventListener('input', (event) => {
        if (event.target === document.getElementById('fldHT')) calc.calculateTTC();
        if (event.target === document.getElementById('fldTTC')) calc.calculateHT();
    })

});