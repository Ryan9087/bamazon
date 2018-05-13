var mysql = require('mysql');
var inquirer = require('inquirer');
var colors = require('colors');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database: 'bamazon',
    insecureAuth: true
});

var managerOptions = [
{
    type: "rawlist",
    name: "choice",
    message: "Menu Options",
    choices: ['View Products for Sale', 'View Low Inventory', "Add to Inventory", "Add New Product"],
},
];

var products = null;

connection.connect(function(err) {
    if (!err) {
        //console.log('error connecting: ' + err.stack);
        //return;
        console.log('connected as id ' + connection.threadId);
        processManagerOption();
    }
});

function getProductList() {
    console.log("run this");
    connection.query('SELECT * FROM products', function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        products = results;
        products.forEach(function(item) {
            console.log(item.item_id + ' ' + item.product.name + ' ' + item.price + ' ' + item.item_quantity);
        });
    });
    processManagerOption();
}

function processManagerOption() {
   inquirer.prompt(managerOptions).then( answers => {
       console.log(answers.choice);
         switch(answers.choice) {
            case 'View Products for Sale': 
                getProductList();
                break;
            case 'View Low Inventory':
                getLowInventoryList();
                break;
            case "Add to Inventory": 
                addToInventory();
                break;
            case "Add New Product":
                addNewProduct();
                break;
         };
   });
}