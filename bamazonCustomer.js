var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

var purchaseQuestions = [
 {
   name: "buyId",
   message: "Enter id of item you want to buy"
 },
 {
   name: "buyQuantity", 
   message: "Enter quantity you want to buy"
 }
];

var continueQuestion = [
 {
   name: "continue",
   message: "Do you want to continue shopping?(y/n)"
 }
];

var products = null;

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'bamazon',
  });

  connection.connect(function(err) {
    if (!err) {
      console.log('connected as id' +  connection.threadId);
      
      connection.query("SELECT * FROM products", function(error, results, fields) {
      if (!error) {
        //console.log(results);
        products = results;
        products.forEach(function(product) {
          console.log(product.item_id + " " + product.product_name + " " + product.price);

        })
        purchasePrompt();
      }
      // connection.end();
      });
  }
    });

    function purchasePrompt() {
      inquirer.prompt(purchaseQuestions).then( answers => {
        var item = getItemById(answers.buyId);

        if(item) {
            var stockQuantity = item.stock_quantity;
            console.log(answers.buyQuantity);
            if (stockQuantity < answers.buyQuantity) {
                console.log("Insufficent Quantity".red);
            } else {
                stockQuantity--;

                var updateQueryStr = "UPDATE products SET stock_quantity = '" + stockQuantity + "' WHERE item_id='" + item.item_id + "'";
    
                connection.query(updateQueryStr, function(error, results, fields) {
                    if(error) throw error;
                    console.log("Congratulations! You have purchased item successfully!");
                    console.log("Total cost: " + item.price * answers.buyQuantity + "$");
                    continuePrompt();
                });
            }
        } else {
            console.log("Not a valid item id.");
        } 
      });
    }

    function getItemById(id) {
       for(var i = 0; i < products.length; i++) {
           if(products[i].item_id == id) {
               return products[i];
           }
       }
       return null;
    }
 
    function continuePrompt() {
        inquirer.prompt(continueQuestion).then( answers => {
            if(answers.continue.toLowerCase() == "y") {
                purchasePrompt();
            } else {
                console.log("Thank you for shopping with us!");
                connection.end();
            }
        })
    }