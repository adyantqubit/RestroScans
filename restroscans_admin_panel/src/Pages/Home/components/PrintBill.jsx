  
    function PrintBill(orderDetail,orderItems,restaurantDetail,settings) {
        
        var restaurantName=restaurantDetail?.name
        var restaurantAddress=restaurantDetail?.address
        var customerDetail={
          // Modiified by Rohan kansari - 16/8/23
          // "last_customer_name":orderDetail.last_customer_name,
          "last_customer_name":orderDetail.customer_name,
          "contact_number":orderDetail.customer_number
          // End of code - Rohan kansari - 16/8/23
        }

        console.log(orderDetail,restaurantAddress)
        var rupee_sign="₹"

        function BillDateTime(format) {
            var date = format?.substring(0, 10)
            var time = format?.substring(11, 19)
            return { date, time }
          }


        function SubtotalOfItems() {
        var total = 0;
        orderItems.filter((o) => {
            if (o.item_status != "Cancelled") {
            total += o.price;
            }
        });
        return total;
        }

        var str=""
        var html=""
       
        var itemStr = "";
        for (var i = 0; i < orderItems.length; i++) {
          if (orderItems[i].item_status != "Cancelled") {
            itemStr =
              itemStr +
              `<div class="tableContents ">
                      <div class="titleText">${orderItems[i].item} (${orderItems[i].serving_size
              })</div>
                      <div class="quantityText">${orderItems[i].quantity}</div>
                      <div class="rateText">${(
                orderItems[i].price / orderItems[i].quantity
              ).toFixed(2)}</div>
                      <div class="totalText"> ${orderItems[i].price.toFixed(
                2
              )}</div>
    
                    </div>`;
          }
        }
    
    
        var discountCalculations = '';
     
         if (orderDetail.discount_rupees > 0) {
            discountCalculations = `<div class="calculationLine">
            <div  class="calculationLabel">
            <div style= "width:98%">Discount</div>
            <div>:</div></div>
            <div  class="calculationText" >${rupee_sign}${orderDetail.discount_rupees.toFixed(2)}</div>
          </div>
          ${orderDetail.loyality_point_price > 0 && orderDetail.loyality_point_price != null ?
    
            `<div class="calculationLine">
        <div  class="calculationLabel" > 
        <div style= "width:98%">Loyality Price</div>
        <div>:</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.loyality_point_price.toFixed(2)} </div>
      </div>
     `      : ``}  `
            discountCalculations = discountCalculations + `
            <hr>
            ${orderDetail.cgst>0 || orderDetail.sgst>0 ?
            `<div class="calculationLine">
            <div  class="calculationLabel"> 
            <div style= "width:98%">Total</div>
            <div>:</div></div>
            <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}</div>
          </div>`:``}
          ${orderDetail.cgst>0?`<div class="calculationLine">
            <div  class="calculationLabel" > 
            <div style= "width:98%">CGST</div>
            <div> (${((orderDetail.cgst / orderDetail.total * 100)).toFixed(2)}%):</div></div>
            <div  class="calculationText" >${rupee_sign}${orderDetail.cgst} </div>
          </div>`:``}
          ${orderDetail.sgst>0?`<div class="calculationLine">
            <div  class="calculationLabel" > 
            <div style= "width:98%">SGST</div>
            <div> (${((orderDetail.sgst / orderDetail.total * 100)).toFixed(2)}%):</div></div>
            <div  class="calculationText" >${rupee_sign}${orderDetail.sgst} </div>
          </div>`:``}` 
       
        }
        else {
          discountCalculations =
            ` ${orderDetail.loyality_point_price > 0 && orderDetail.loyality_point_price != null ?
    
              `<div class="calculationLine">
          <div  class="calculationLabel" > 
          <div style= "width:98%">Loyality Price</div>
          <div>:</div></div>
          <div  class="calculationText" >${rupee_sign}${orderDetail.loyality_point_price.toFixed(2)} </div>
        </div>
        
    
        <hr>
        <div class="calculationLine">
        <div  class="calculationLabel" > 
        <div style= "width:98%">Total</div>
        <div>:</div></div>
        <div  class="calculationText" >${rupee_sign}${orderDetail.total.toFixed(2)}  </div>
        </div>`
    
              : ``}
    
              ${orderDetail.cgst>0?`<div class="calculationLine">
              <div  class="calculationLabel" > 
              <div style= "width:98%">CGST</div>
              <div> (${((orderDetail.cgst / orderDetail.total * 100)).toFixed(2)}%):</div></div>
              <div  class="calculationText" >${rupee_sign}${orderDetail.cgst}  </div>
            </div>`:''}
            ${orderDetail.sgst>0?`<div class="calculationLine">
              <div  class="calculationLabel" > 
              <div style= "width:98%">SGST</div>
              <div> (${((orderDetail.sgst / orderDetail.total * 100)).toFixed(2)}%):</div></div>
              <div  class="calculationText" >${rupee_sign}${orderDetail.sgst} </div>
            </div>`:''}`
        }
    
        str = `<div class="billingContainer">
                <div class="inLineContainer" >
                  <div class="Hotellabel"  style="text-align:center;"> ${restaurantName}</div>
                </div>
                <div class="inLineContainer"  style="text-align:center;">
                  <div class="centerLabel">${restaurantAddress} </div>
                </div>
                ${settings.gstin?.length>0?
                  `<div class="inLineContainer">
                  <div class="centerLabel">GSTIN :- ${settings.gstin}</div>
                </div>`:``}
                ${settings.fssaino?.length>0?
                
            `<div class="inLineContainer">
            <div class="centerLabel">FSSAI NO :- ${settings.fssaino}</div>
          </div>`:``}
                <hr>
    
                
                ${orderDetail.order_created_by=="Admin"||orderDetail.order_created_by=="Waiter"?``:`<div class="inLineContainer">
                    <div class="column1" >
                        <div class="label1">
                            <div style= "width:90%" >Name</div>
                            <div>:</div>  
                        </div>
                        <div class="text">
                        ${customerDetail.last_customer_name?.length ? customerDetail.last_customer_name:"---"}
                        </div>
                    </div>
                    <div class="column1" >
                      <div class="label">
                        <div style= "width:90%" >
                          Mob No.
                          </div>
                          <div>:</div> 
                        </div>
                      <div class="text">
                      ${customerDetail?.contact_number}
                      </div>
                    </div>
                </div>`}

                <div class="inLineContainer">
                    <div class="column1" >
                        <div class="label1">
                            <div style= "width:90%" >Date</div>
                            <div>:</div>  
                        </div>
                        <div class="text">
                        ${
                          BillDateTime(orderDetail.payment_confirmation_date_time).date
                        }
                        </div>
                    </div>
                    <div class="column1" >
                      <div class="label">
                        <div style= "width:90%" >
                          Time
                          </div>
                          <div>:</div> 
                        </div>
                      <div class="text">
                      ${
                        BillDateTime(orderDetail.payment_confirmation_date_time).time
                      }
                      </div>
                    </div>
                </div>

                <div class="inLineContainer">
                    <div class="column1" >
                        <div class="label1">
                            <div style= "width:90%" >Bill No.</div>
                            <div>:</div>  
                        </div>
                        <div class="text">
                        ${orderDetail.order_id}
                        </div>
                    </div>
                    <div class="column1" >
                      <div class="label">
                        <div style= "width:90%" >
                        Table
                          </div>
                          <div>:</div> 
                        </div>
                      <div class="text">
                      ${!orderDetail.table_number ? "N/A" : orderDetail.table_number}
                      </div>
                    </div>
                </div>

                <div class="inLineContainer">
                  <div class="column1"><div class="label"><div style= "width:90%">Payment</div><div>:</div>  </div><div class="text">
                  ${orderDetail.payment_mode==null||orderDetail.payment_mode==undefined?"":orderDetail.payment_mode}
                  </div></div>
                </div>

                <div class="tableHeader">
                  <div class="titleHeading"> Item Name   </div>
                  <div class="quantityHeading">Qty</div>
                  <div class="rateHeading">     Rate(${rupee_sign}) </div>
                  <div class="totalHeading"> Amt(${rupee_sign})</div>
                </div>
                
                ${itemStr} 
              <hr>
              <div class='CalculationBoxContainer'>
              <div class="calculationBox">
              ${orderDetail.cgst || orderDetail.sgst || orderDetail.loyality_point_price > 0 ? `<div class="calculationLine">
              
                    <div  class="calculationLabel"> 
                    <div style= "width:98%">Sub-Total</div>
                    <div>:</div></div>
                    <div  class="calculationText" >${rupee_sign}${SubtotalOfItems().toFixed(
            2
          )}</div>
                  </div>`: ``}
    
                  ${discountCalculations}
                  
                  ${orderDetail.cgst || orderDetail.sgst ? `<hr>` : ``}
                  <div class="calculationLine">
                    <div  class="calculationLabel"> 
                    <div style= "width:98%">Grand Total</div>
                    <div>:</div></div>
                    <div  class="calculationText" >${rupee_sign}${(orderDetail.final_amount.toFixed(2))}</div>
                  </div>
                </div>
              </div> 
              <hr>
              <div class="TotalBoxContainer">
                <div class="TotalBox">
                    <div class="calculationLine">
                      <div class="TotalLabel" style="min-width:140px; ">Payable Amount</div>
                      <div class="TotalLabel" style="width:10px">: </div>
                      <div class="grandTotalText">${rupee_sign}${(orderDetail.final_amount.toFixed(2))}
                      </div>
                    </div>
                </div>
              </div>
              <hr>
              <div class="calculationLine">
                <div class="calculationLabel" >
                ****** THANK YOU VISIT AGAIN ******
                </div>
              </div>
    
        </div>`;
    
        str = str + `</div>`;
    
        html = `
        <html>
        <head>
    <style>
    .billingContainer {
      font-family:monospace;
      letter-spacing: 0.6px;
      width: 300px;
      height: auto;
      margin: 0 auto;
      border-radius: 5px;
      padding: 2px 0;
      padding-bottom: 150px;
      border: 1px solid black;
    }
    .inLineContainer {
    width: 95%;
    min-height: 10px;
    margin: 4px auto;
    display: flex;
    justify-content: flex-start;
    gap:2px;
    }
    .column1{
      min-width:50%;
      display: flex;
    }
    .label1{
      min-width: 45%;
      font-size: 12px;
      font-weight: 700;
      text-align: start;
      white-space: nowrap;
      display: flex;
  }
    .Hotellabel{
      min-width: 100%;
      font-size: 17px;
      font-weight: 900;
      padding: 0 3%;
      text-align: center;
    }
    .centerLabel{
      min-width: 100%;
      font-size: 10px;
      font-weight: 700;
      text-align: center;
    }
    .label {
      min-width: 45%;
      font-size: 12px;
      font-weight: 700;
      text-align: start;
      white-space: nowrap;
      display: flex;
  }
    .text {
      min-width: 50%;
      word-break: break-all;
      font-size: 12px;
      font-weight: 600;
      text-align: left;
  }
    .tableHeader {
      height: 30px;
      width: 95%;
      margin: auto;
      border-top: 1px solid black;
      margin-top: 20px;
      border-bottom: 1px solid black;
      display: flex;
      gap: 8px;
    }
    .titleHeading {
      font-size: 10px;
      width: 60%;
      padding: 2% 0% 2% 1%;
      
      font-weight: 600;
      text-align: start;
    }
    .quantityHeading {
      font-size: 10px;
      width: 20%;
      padding: 2% 0% 2% 12%;
      font-weight: 600;
    }
    .rateHeading {
      font-size: 10px;
      width: 15%;
      padding: 2% 4%;
      font-weight: 600;
    }
    .totalHeading {
      font-size: 10px;
      width: 15%;
      padding: 2% 4%;
      font-weight: 600;
    }
    .tableContents {
      min-height: 30px;
      width: 95%;
      margin:0 auto;
      margin: 1px 0 !important;
      display: flex;
      gap: 4px;
    }
    .TotalLabel{
      font-size: 14px;
      width: 50%;
      padding: 2% 4px;
      font-weight: 800;
      width: 60%;
      letter-spacing: 2px;
    }
    .titleText {
      font-size: 10px;
      width: 58% !important;
      padding: 0.5% 4%;
      font-weight: 600;
    }
    .quantityText {
      font-size: 10px;
      width: 5%;
      padding: 2% 2%;
      font-weight: 600;
    }
    .rateText {
      font-size: 10px;
      width: 30%;
      padding: 2% 2%;
      font-weight: 600;
      text-align: end;
      white-space: nowrap;
    }
    .totalText {
      font-size: 10px;
      width: 30%;
      padding: 2% 2%;
      font-weight: 600;
      text-align: end;
      white-space: nowrap;
    }
    .CalculationBoxContainer {
      width: 100%;
  // Modification by Pratap sahu on 28-10-2023 
  // Reason : To Decrease the gap between Grand Total and Payable Amount when taxes,loyalty points or discount has not applied 
      // min-height: 100px;
  // End of code by Pratap sahu on 28-10-20
      min-height: 30px;
      display: flex;
      justify-content: flex-end;
    }
    .calculationBox {
      width: 75%;
      margin-right: 4%;
      margin-bottom: 2%;
    }
    .calculationLine {
      display: flex;
      justify-content: space-between;
    }
    .calculationLabel {
      font-size: 12px;
      width: 20%;
      padding: 2% 2%;
      font-weight: 600;
      width: 50%;
      white-space: nowrap;
      display: flex;
    }
    .calculationText {
      width: 50%;
      text-align: end;
      font-size: 10px;
      white-space: nowrap;
      padding: 2% 4%;
      font-weight: 600;
    }
    .TotalBoxContainer{
      width: 100%;
      height: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
   
    .TotalBox{
      width: 90%;
      margin-right: 4%;
      margin-bottom: 2%;
      height: auto;  
      margin: auto;
    }
    .grandTotalText{
      font-size: 17px;
      text-align: end;
      padding: 2% 4%;
      font-weight: 800;
      letter-spacing: 2px;
    }


    @media print{@page{margin:0;}}
    
    </style>
    </head>
          <body>
              <div >
              ${str}
            </div>
          </body>
        </html>
        `;


        var a = window.open('', '', 'height=800, width=1200');

        a.document.write(html)
        
        // if (orderItems.length > 0)
        //     a.print();
        // a.close();    


        if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone/i)) {
          a.document.addEventListener('load', function () {
            a.focus();
            a.document.close();
            a.print();
          }, true);
    
        } else {
          a.document.addEventListener('load', function () {
            a.focus();
            a.document.close();
            a.print();
            a.close();
          }, true);
        }
      
      };


export default PrintBill