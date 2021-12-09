/* JavaScript */
/* CalcTVA JS */

class CalcTVA {

    ttc;
    ht;
    arrBtns = [];
    percentage;
    lastEntry;
    arrTotals = [
        [0, 0.2, 0],
        [0, 0.1, 0],
        [0, 0.055, 0],
        [0, 0.021, 0]
    ];

    constructor(idTTC, idHT, btnsClass) {
        this.ttc = document.getElementById(idTTC);
        this.ht = document.getElementById(idHT);
        this.arrBtns = document.querySelectorAll(btnsClass)
    }

    /**********************************************************
    ** getPercentage()
    ** gets the selected button's data-value to set percentage
    **********************************************************/
    getPercentage() {

        this.arrBtns.forEach(button => {
            if (button.classList.contains('active')) this.percentage = parseFloat(button.dataset.value);
        })
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
}


/******* Events to trigger once the DOM is loaded ********/
document.addEventListener('DOMContentLoaded', () => {

    /******* Creates the calculator ********/
    const calcCreation = () => {
        calc = new CalcTVA('fldTTC', 'fldHT', '.btnPerc');
        calc.getPercentage();
    }

    calcCreation();

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

    /******* Changes HT or TTC field whenever the other changes *********/
    document.addEventListener('input', (event) => {
        if (event.target === document.getElementById('fldHT')) calc.calculateTTC();
        if (event.target === document.getElementById('fldTTC')) calc.calculateHT();
    })

});