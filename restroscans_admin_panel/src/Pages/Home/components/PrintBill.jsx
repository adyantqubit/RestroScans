  
    function PrintBill(orderDetail,orderItems,restaurantDetail,settings) {
        
        var restaurantName=restaurantDetail.name
        var restaurantAddress=restaurantDetail.address
        var customerDetail={
          "last_customer_name":orderDetail.last_customer_name,
          "contact_number":orderDetail.customer_number
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
                ${settings.gstin.length>0?<div class="inLineContainer">
                  <div class="centerLabel">GSTIN :- ${settings.gstin}</div>
                </div>:``}
                ${settings.fssaino.length>0?<div class="inLineContainer">
                  <div class="centerLabel">FSSAI NO :- ${settings.fssaino
                }</div>
                </div>:``}
                <hr>
    
                <div class="inLineContainer">
                  <div class="label">Name   </div>
                  <div class="text">  ${customerDetail.last_customer_name}</div>
                  <div class="label">Mob No.</div>
                  <div class="text">  ${customerDetail.contact_number}</div>
                </div>
                
                <div class="inLineContainer">
                  <div class="label">Date </div>
                  <div class="text">
                  <!-- Eddited By Rohan Kansari - 12/5/23
                  Reason - To show payment confirmation time in bill --!>
                  ${
                    BillDateTime(orderDetail.payment_confirmation_date_time).date
                  }
                  </div>
                  <div class="label">Time  </div>
                  <div class="text">  ${BillDateTime(orderDetail.payment_confirmation_date_time).time
          }</div>
                  <!-- ENd of code - 12/5/23 - Rohan Kansari --!>
                </div>
                <div class="inLineContainer">
                  <div class="label">Bill No. </div>
                  <div class="text"> ${orderDetail.order_id}</div>
                  <div class="label">Table </div>
                  <div class="text">  ${!orderDetail.table_number ? "N/A" : orderDetail.table_number
          }</div>
                  
                </div>
             
                <div class="inLineContainer">
                  <div class="label">Payment   </div>
                  <div class="text" style= "margin-right:53%">  
                  ${orderDetail.payment_mode==null||orderDetail.payment_mode==undefined?"":orderDetail.payment_mode}
                  </div>
                  
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
              <hr style= "border:0.5px solid black">
              <div class="TotalBoxContainer">
                <div class="TotalBox">
                    <div class="calculationLine">
                      <div class="TotalLabel">Payable Amount</div>
                      <div class="TotalLabel">: </div>
                      <div class="grandTotalText">${rupee_sign}${(orderDetail.final_amount.toFixed(2))}
                      </div>
                    </div>
                </div>
              </div>
              <hr>
              <div class="calculationLine">
                <div class="calculationLabel">
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
      min-width: 100%;
      min-height: 10px;
      margin: 4px 0;
      display: flex;
      justify-content: space-between;
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
      min-width: 15%;
      font-size: 10px;
      font-weight: 700;
      padding: 0 2%;
      text-align: start;
      white-space: nowrap;
    }
    .text {
      min-width: 22%;
      word-break: break-all;
      font-size: 10px;
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
      min-height: 100px;
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
      width: 100%;
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
    /* padding: 0 15%; */
    display: flex;
    flex-direction: row;
    justify-content: center;
    }
    .TotalBox{
      width: 90%;
    margin-bottom: 2%;
    height: auto;
    }
    .TotalLabel{
      font-size: 14px;
      width: 20%;
      padding: 2% 4%;
      // font-weight: 800;
      white-space:nowrap;
      width: 100%;
      letter-spacing: 2px;
    }
    .grandTotalText{
      font-size: 17px;
      width: 80%;
      text-align: end;
      padding: 2% 4%;
      font-weight: 800;
      width: 100%;
      letter-spacing: 2px;
    }
    
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
        
        if (orderItems.length > 0)
            a.print();
        a.close();    
      
      };


export default PrintBill