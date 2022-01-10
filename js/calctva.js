/*********************************************************************
 *
 *  CalcTVA
 *
 *  Created by Derek Erb Solutions ( https://derekerb.solutions)
 *  JavaScript programming and CSS styling by
 *  Victor Polouchine (victor@derekerb.solutions)
 *
 ********************************************************************/

/*************************************************************************
 ** EVENT LISTENERS
 ** Events to trigger once the DOM is loaded
*************************************************************************/

document.addEventListener('DOMContentLoaded', () => {

    // Create calc class instance
    calc = new CalcTVA('fldTTC', 'fldHT', 'fldTVA', 'btnUndo', 'btnReset');
    calc.getTaux();
    calc.showTVA();
    calc.setFldMaxChar();

    // Initialise first field
    calc.fldHT.setAttribute("lastused",'');
    calc.gotoLastInput();

    /*************************************************************************
     ** EVENT LISTENER
     ** CLICK
     *************************************************************************/
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
            if (window.matchMedia("(min-width: 500px)").matches) {
                // If on mobile, no automatic input select
                document.querySelector('input[lastused]').select();
                // If on mobile try vibrate function
                if (window.navigator.vibrate)
                    window.navigator.vibrate([300,100,300]);
            }
            calc.showTotals();
            document.getElementById('sectTotals').style.display = 'flex';
            calc.gotoLastInput();
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

        /******** NAVBAR CALC PAGE ********/
        if (event.target === document.getElementById('btnCalc')) {
            calc.gotoLastInput();
        }

    });

    /*************************************************************************
     ** EVENT LISTENER
     ** FOCUSIN
     *************************************************************************/
    document.addEventListener('focusin', (event) => {
        /****** Adds 'lastused' attribute when input is focused and remove previous one *******/
        if (event.target === calc.fldHT) {
            calc.fldTTC.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
            calc.setLastInput(calc.fldHT);
        }
        if (event.target === calc.fldTTC) {
            calc.fldHT.removeAttribute('lastused');
            event.target.setAttribute('lastused', '');
            calc.setLastInput(calc.fldTTC);
        }
    });

    /*************************************************************************
     ** EVENT LISTENER
     ** INPUT
     *************************************************************************/
    document.addEventListener('input', (event) => {
        /******* Changes HT or TTC field whenever the other field changes *********/
        if (event.target === document.getElementById('fldHT')) {
            if (event.target.value.length <= calc.fldMaxChar) {
                calc.showTTC();
            }
            else {
                calc.fldHT.value = parseFloat(calc.ht);
            }
        }
        if (event.target === document.getElementById('fldTTC')) {
            if (event.target.value.length <= calc.fldMaxChar) {
                calc.showHT();
            }
            else {
                calc.fldTTC.value = parseFloat(calc.ttc);
            }
        }
        calc.showTVA();
    });

    /*************************************************************************
     ** EVENT LISTENER
     ** KEYDOWN
     *************************************************************************/
    document.addEventListener('keydown', (event) => {
        /********* Enables entry creation and totals update by pressing Enter key ********/
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

    /*************************************************************************
     ** EVENT LISTENERS
     ** OFFLINE / ONLINE
     *************************************************************************/
    window.addEventListener('online', chgOnlineStatus);
    window.addEventListener('offline', chgOnlineStatus);

});

/*************************************************************************
 ** SERVICE WORKER registration
 *************************************************************************/
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/calctvasw.js').then(reg => {
        }).catch(err => {
        });
    });
}

/*************************************************************************
 ** chgOnlineStatus()
 *************************************************************************/
function chgOnlineStatus() {
    // Change app background if offline
    document.body.style.backgroundColor = window.navigator.onLine ? 'var(--MainBack)' : 'slategrey';
}
