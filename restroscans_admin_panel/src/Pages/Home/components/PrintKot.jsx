export function PrintKot(order_detail,order_item,restroDetail,gstFssai) {
    // Modified by Rohan KAnsari - 26/6/23
    // Reason - To dont print cancelled items
    var kotData={ gstFssai: gstFssai, restro_detail: restroDetail, order: order_detail, orderItem: order_item };
    
    console.log(kotData)

    function ExtractDateTime(format) {
        var date = format.substring(0, 10)
        var time = format.substring(11, 19)
        return { date, time }
    }

    var a = window.open('', '', 'height=800, width=1200');

    a.document.write(`<html>
    <head>
    <style>
    
    .container{
        width: 100%;
        height: auto;
        position: relative;
    }


    .kotContainer {
        font-family:monospace;
        letter-spacing: 0.6px;
        width: 300px;   
        height:auto;
        margin:auto auto;
        border-radius: 5px;
        padding: 2px 0;
        overflow-x: hidden;
        padding-bottom: 50px;
        padding-top: 60px;
        border: 1px solid black
    }
    .billingContainer {
        font-family:monospace;
        letter-spacing: 0.6px;
        width: 320px;
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
        margin: 4px 5px;
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
        font-size: 12px;
        font-weight: 700;
        text-align: center;
    }
    .column1{
        min-width:50%;
        display: flex;
    }
    
    .label {
        min-width: 45%;
        font-size: 12px;
        font-weight: 700;
        text-align: start;
        white-space: nowrap;
        display: flex;
        }

    .label1{
        min-width: 32%;
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
    .serialNo {
        font-size: 12px;
        width: 15%;
        padding: 2% 0%;
        font-weight: 700;
    }
    .titleHeading {
        font-size: 12px;
        width: 67%;
        padding: 2% 0%;
        padding-right: 8%;
        font-weight: 700;
        text-align: start;
    }
    
    .qtyHeading {
        font-size: 12px;
        width: 17%;
        padding: 2% 0% 0% 0%;
        font-weight: 700;
    }
    
    .tableContents {
        min-height: 30px;
        width: 95%;
        margin:0 auto;
        margin: 1px 0;
        display: flex;
        gap: 4px;
    }
    .quantityText {
        font-size: 10px;
        width: 10%;
        padding: 2% 0% 0% 5%;
        font-weight: 600;
    }
    .titleText {
        font-size: 10px;
        width: 70%;
        font-weight: 600;
        padding: 2% 0% 0% 8%;
        text-align:left
    }
    .rateText {
        font-size: 12px;
        width: 15%;
        font-weight: 600;
        text-align: end;
        white-space: nowrap;
        padding: 2% 0% 0% 5%;
        text-align:left
    }
    .totalText {
        font-size: 12px;
        width: 30%;
        padding: 2% 2%;
        font-weight: 700;
        text-align: center;
        white-space: nowrap;
    }
    #line{
        background-color: black;
        height: .5px;
        width: 95%;
        margin: 0 auto;
        border: .5px solid #9c9c9c;
    }

    .btnContainer{
        width: 280px;
        min-height: 40px;
        position: fixed;
        top: 8px;
        left: 0;
        right: 0;
        margin: 0 auto;
        background-color:#fff ;
        display: flex;
        justify-content: space-around;
    }

    .btn{
        width: 45%;
        height: 100%;
        background-color: #185ee0;
        border-radius: 5px;
        color: #e6eef9;
        margin: auto 0;
    }

    .btn:hover{
        background-color: #e6eef9;
        color: #185ee0;
        border: 1px solid #185ee0;
    }
    @media print{
        .btn{
            display: none;
        }

        .kotContainer{
        padding-top: 0;
        }

        .btnContainer{
        display: none;
        }
        @page{margin:0;}
    }
    </style>
    </head>
    <body>
    <div class="container" style={{ paddingBottom: "50px", background: "grey" }} >
        <div class="kotContainer" style={{ background: "white", border: "2px solid black" }}>
            <div class="inLineContainer" >
                <div class="Hotellabel" style={{ textAlign: "center" }}>${kotData.restro_detail.name.toUpperCase()}</div>
            </div>
            <hr />
            <div class="inLineContainer">
                <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Date</div><div>:</div>  </div><div class="text">${new Date(
        kotData.order.date
    ).toLocaleDateString("en-GB")}</div></div>
                <div class="column1"><div class="label"><div style={{ width: "90%" }}>Time</div><div>:</div> </div><div class="text"> ${ExtractDateTime(kotData.order.date).time}</div></div>
            </div>
            <div class="inLineContainer">
                <div class="column1"><div class="label1"><div style={{ width: "90%" }}>Order id</div><div>:</div>  </div><div class="text"> ${kotData.order.order_id}</div></div>
                <div class="column1"><div class="label"><div style={{ width: "90%" }}>Table</div><div>:</div>  </div><div class="text">${!kotData.order.table_number ? "N/A" : kotData.order.table_number
        }</div></div>

            </div>
            <div class="tableHeader">
                <div class="serialNo"> SNo   </div>
                <div class="titleHeading">Item Name</div>
                <div class="qtyHeading">   Qty   </div>
            </div>`+
        kotData.orderItem.filter(e=>e.item_status!="Cancelled").map((item, i) =>
            `<div class="tableContents">
                    <div class="quantityText">${i + 1}</div>
                    <div class="titleText">${item.item} (${item.serving_size
            })</div>
                    <div class="rateText">${item.quantity}</div>
                </div>`
        ).join("")
        + `</div>
           
    </div>
    </body>
    </html>`)
    a.document.open();

    if (kotData.orderItem.filter(e=>e.item_status!="Cancelled").length > 0)
        a.print();
    a.close();
}