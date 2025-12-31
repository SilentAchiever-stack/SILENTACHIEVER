const Product1_cost = 25.99;
const Product2_cost = 10.50;
const product3_cost = 4.00;
 
let customer_name = "sarah";

const is_distance_applied = true;
const Tax_Rate = 0.07;
let subTotal = Product1_cost + Product2_cost + product3_cost;
let Tax_amount = subTotal * Tax_Rate;
console.log("Tax (7%): $" + Tax_amount.toFixed(2));
console.log(customer_name);
console.log("final_total: $" + final_total.toFixed(2));
console.log("Discount Applied: " + is_distance_applied);

