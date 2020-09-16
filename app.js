//Budget Controller

var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    var calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (current) {

            sum = sum + current.value;

        });
        data.totals[type] = sum
    }

    return {
        addItem: function (type, des, val) {
            var newItem, ID;

            //Create new Id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }


            //Create new item [inc, exp] type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            // push it in data structure
            data.allItems[type].push(newItem);

            //return the new element
            return newItem;
        },

        calculateBudget: function () {

            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            // Calculate the buget and expenses
            data.budget = data.totals.inc - data.totals.exp;

            //calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                perc: data.percentage
            }
        },

        testing: function () {
            console.log(data);
        }
    };

})();





//UI Controller


var UIcontroller = (function () {

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expLabel: '.budget__expenses--value',
        percentLabel: '.budget__expenses--percentage'
    }

    return {
        getinput: function () {

            return {


                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            }
        },

        addListItem: function (obj, type) {

            var html, newHTML, element;
            // Create HTML string with placeholer text
            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i> </button> </div> </div> </div>';
            } else if (type == 'exp') {
                element = DOMstrings.expenseContainer
                html = '<div class= "item clearfix" id="expense-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            // Replace the placeholder text with some actual data
            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

        },

        clearFields: function () {
            var fields, fieldsArray;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArray = Array.prototype.slice.call(fields);

            fieldsArray.forEach(function (current, index, arr) {
                current.value = "";
            });

            fieldsArray[0].focus();
        },

        displayBudget: function(obj) {
            
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expLabel).textContent = obj.totalExp;
            
            if (obj.perc > 0) {
                document.querySelector(DOMstrings.percentLabel).textContent = obj.perc + '%';
            } else {
                document.querySelector(DOMstrings.percentLabel).textContent = '---';
            }
            
            
        },
        
        getDOMstrings: function () {
            return DOMstrings;
        }
    };

})();


var updateBudget = function () {

    // Calculate the budget
    budgetController.calculateBudget();

    // Return the budget
    var budget = budgetController.getBudget();

    // Display the budget on the UI
    UIcontroller.displayBudget(budget)


};





//Global app controller

var appController = (function (budgetCtrl, UICtrl) {

    var setupEventListener = function () {
        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);

        document.addEventListener("keypress", function (e) {

            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();

            }

        });
    }



    var ctrlAddItem = function () {
        var input, newItem;

        // INPUT DATA
        var input = UICtrl.getinput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {


            // ADD ITEM TO THE BUDGET CONTROLLER
            var newItem = budgetCtrl.addItem(input.type, input.description, input.value)


            // ADD THE NEW ITEM TO UI
            UICtrl.addListItem(newItem, input.type);

            // Clear the fields

            UICtrl.clearFields();

            // Calculate and Update budget

            updateBudget();
        }
    };

    return {
        init: function () {
            console.log('application has started.');
            UIcontroller.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                perc: -1
            })
            setupEventListener();
        }
    };





})(budgetController, UIcontroller);

appController.init();
