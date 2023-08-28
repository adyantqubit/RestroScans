import { View, Text, StyleSheet, Pressable, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { getOrdersApi } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";
import { colors, inputs } from "../../Colours/globalColor";
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Ionicons } from "@expo/vector-icons";


export default function OrderListScreen({ route, navigation }) {
  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to re render the screen
  const isFocused = useIsFocused();
  // End of re render

  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to set start and end date
   */
  const [showStartDate, setShowStartDate] = useState("")
  const [showEndDate, setShowEndDate] = useState("")

  const [startDateSelected, setStartDateSelected] = useState(new Date());
  const [endDateSelected, setEndDateSelected] = useState(new Date());

  const [filterDisable, setFilterDisable] = useState(true);

  /**
   * End of addition by Yuvraj Sahu on 04-08-2023
   */

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to call function when page is render
  // This function is used for calling
  // function when page render

  // Added by Yuvraj Sahu on 17-4-2023
  // Reason - to re render the screen
  useEffect(() => {
    allOrders();
    /**
     * Added by Yuvraj Sahu on 22-05-2023
     * Reason - to clear the state
     */
    setSearch("");
    /**
     * End of addition by Yuvraj Sahu on 22-05-2023
     */
    /**
     * Added by Yuvraj Sahu on 03-06-2023
     * Reason - to clear the state
     */
    setTableNoSort("");
    setOrderIdSort("");
    setOrderStatusSortVal("");
    setPaymentStatusSortVal("");
    /**
     * End of addition by Yuvraj Sahu on 03-06-2023
     */
  }, [isFocused]);
  // End of addition

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to set all order
  // This react hooks is used to set all orders
  // Which is used for map and showing data to user
  var [orders, setOrders] = useState([]);
  // End of setting orders

  /**
   * Added by Yuvraj Sahu on 22-05-2023
   * Reason - to set searched objects and search keyword
   */
  var [seeOrders, setSeeOrders] = useState([]);
  var [search, setSearch] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 22-05-2023
   */

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to show loading when we call backend
  // This react hooks is used to set loading for response
  var [isLoading, setLoading] = useState(false);
  // End of loading

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get orders
  // This function is created for getting all orders
  const allOrders = async () => {
    // Added by Yuvraj Sahu on 13-4-2023
    // setLoading(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getOrdersApi(tenant);
    if (response.msg) {
      setLoading(false);
      setOrders(response.allOrders);
      /**
       * Added by Yuvraj Sahu on 22-05-2023
       * Reson - to set value for search
       */
      setSeeOrders(response.allOrders);
      /**
       * End of addition by Yuvraj Sahu on 22-05-2023
       */
    }
  };

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to search menu using name wise
   */
  const handleSearch = (searchKey) => {
    /**
     * Added by Yuvraj Sahu on 04-08-2023
     * Reason - to remove the filters
     */
    setEndDateSelected(new Date())
    setShowEndDate("")
    setStartDateSelected(new Date())
    setShowStartDate("")
    setFilterDisable(true)
    /**
     * End of addition by Yuvraj Sahu on 04-08-2023
     */
    var splitedWord = searchKey.trim().replace(".", " ").split(" ");
    var sapratedWord = splitedWord.reverse().join().replace(",", " ");
    setSearch(searchKey.replace(".", " "));
    if (searchKey == "") {
      setSeeOrders(orders);
    } else {
      var searchedMenus = orders.filter(
        (dt) =>
          dt.table_number.toLowerCase().includes(searchKey.toLowerCase()) || // search by table number
          dt.order_id.toLowerCase().includes(searchKey.toLowerCase()) || // search by orderID
          dt.table_number.toLowerCase().includes(sapratedWord.toLowerCase()) || // search data also start and end spaces
          dt.order_id.toLowerCase().includes(sapratedWord.toLowerCase()) // search data also start and end spaces
      );
      setSeeOrders(searchedMenus);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */

  // Added by Yuvraj Sahu on 9-4-2023
  // Reason - to get id and navigate
  // This method is created for navigate the order
  // and sreen and send the order id after navigation
  // it will be used for getting order items
  const handleOrder = async (id, order_id) => {
    // Added and modified by Yuvraj Sahu on 17-4-2023
    // Reason - to send order_id in order itema screen
    navigation.navigate("OrderItemsScreen", {
      id: id,
      orderID: order_id,
    });
    // And of modification
  };

  // Added by- Suman Sahu on 29-4-2023
  // Reason - to show time in order list screen
  function ExtractDateTime(format) {
    var d = new Date(format);
    var time = d.toLocaleTimeString();
    // Added by Yuvraj Sahu on 28-07-2023
    // Reason - to show the date 
    var date = d.toLocaleDateString();
    return { time, date };
    // End of modification by Yuvraj Sahu on 18-07-2023
  }
  // End of addition 29-4-2023

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set table number sorting value
   */
  var [tableNoSort, setTableNoSort] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 03-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set orders (asc or desc) send
   * props for sorting functionality
   */
  const handleTableOrder = () => {
    setOrderIdSort("");
    setOrderStatusSortVal("");
    setPaymentStatusSortVal("");
    // Added by yuvraj Sahu on 28-07-2023
    // Reason - to clear the date sort
    setDateSort("")
    // end of addition by yuvraj Sahu on 28-07-2023
    if (tableNoSort == "") {
      setTableNoSort("ascending");
      tableSort("ascending");
    }
    if (tableNoSort == "ascending") {
      setTableNoSort("descending");
      tableSort("descending");
    }
    if (tableNoSort == "descending") {
      setTableNoSort("");
      tableSort("remove sort");
    }
  };
  /**
   * End of setting orders by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to sort data according to table number
   */
  const tableSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeOrders.sort((a, b) => {
        if (Number(a.table_number) < Number(b.table_number)) {
          return -1;
        }
        if (Number(a.table_number) > Number(a.table_number)) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "descending") {
      var latest = seeOrders.sort((a, b) => {
        if (Number(a.table_number) > Number(b.table_number)) {
          return -1;
        }
        if (Number(a.table_number) < Number(a.table_number)) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "remove sort") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < a.date) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
  };
  /**
   * End of sorting from table number by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set order id sorting value
   */
  var [orderIdSort, setOrderIdSort] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 03-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set orders (asc or desc) send
   * props for sorting functionality
   */
  const handleSetOrderId = () => {
    setTableNoSort("");
    setOrderStatusSortVal("");
    setPaymentStatusSortVal("");
    // Added by yuvraj Sahu on 28-07-2023
    // Reason - to clear the date sort
    setDateSort("")
    // end of addition by yuvraj Sahu on 28-07-2023
    if (orderIdSort == "") {
      setOrderIdSort("ascending");
      handleOrderIdSort("ascending");
    }
    if (orderIdSort == "ascending") {
      setOrderIdSort("descending");
      handleOrderIdSort("descending");
    }
    if (orderIdSort == "descending") {
      setOrderIdSort("");
      handleOrderIdSort("remove sort");
    }
  };
  /**
   * End of setting orders by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to sort data according to order id
   */
  const handleOrderIdSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.order_id.toLowerCase() < b.order_id.toLowerCase()) {
          return -1;
        }
        if (a.order_id.toLowerCase() > a.order_id.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "descending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.order_id.toLowerCase() > b.order_id.toLowerCase()) {
          return -1;
        }
        if (a.order_id.toLowerCase() < a.order_id.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "remove sort") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < a.date) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
  };
  /**
   * End of sorting from order id by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set order status sorting value
   */
  var [orderStatusSortVal, setOrderStatusSortVal] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 03-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set orders status (asc or desc) send
   * props for sorting functionality
   */
  const handleSetOrderStatus = () => {
    setTableNoSort("");
    setOrderIdSort("");
    setPaymentStatusSortVal("");
    // Added by yuvraj Sahu on 28-07-2023
    // Reason - to clear the date sort
    setDateSort("")
    // end of addition by yuvraj Sahu on 28-07-2023
    if (orderStatusSortVal == "") {
      setOrderStatusSortVal("ascending");
      handleOrderStatusSort("ascending");
    }
    if (orderStatusSortVal == "ascending") {
      setOrderStatusSortVal("descending");
      handleOrderStatusSort("descending");
    }
    if (orderStatusSortVal == "descending") {
      setOrderStatusSortVal("");
      handleOrderStatusSort("remove sort");
    }
  };
  /**
   * End of setting orders by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to sort data according to order status
   */
  const handleOrderStatusSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.order_status.toLowerCase() < b.order_status.toLowerCase()) {
          return -1;
        }
        if (a.order_status.toLowerCase() > a.order_status.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "descending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.order_status.toLowerCase() > b.order_status.toLowerCase()) {
          return -1;
        }
        if (a.order_status.toLowerCase() < a.order_status.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "remove sort") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < a.date) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
  };
  /**
   * End of sorting from order status by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set payment status sorting value
   */
  var [paymentStatusSortVal, setPaymentStatusSortVal] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 03-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set payment status (asc or desc) send
   * props for sorting functionality
   */
  const handleSetPaymentStatus = () => {
    setTableNoSort("");
    setOrderIdSort("");
    setOrderStatusSortVal("");
    // Added by yuvraj Sahu on 28-07-2023
    // Reason - to clear the date sort
    setDateSort("")
    // end of addition by yuvraj Sahu on 28-07-2023
    if (paymentStatusSortVal == "") {
      setPaymentStatusSortVal("ascending");
      handlePaymentStatusSort("ascending");
    }
    if (paymentStatusSortVal == "ascending") {
      setPaymentStatusSortVal("descending");
      handlePaymentStatusSort("descending");
    }
    if (paymentStatusSortVal == "descending") {
      setPaymentStatusSortVal("");
      handlePaymentStatusSort("remove sort");
    }
  };
  /**
   * End of setting orders by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to sort data according to payment status
   */
  const handlePaymentStatusSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.payment_status.toLowerCase() < b.payment_status.toLowerCase()) {
          return -1;
        }
        if (a.payment_status.toLowerCase() > a.payment_status.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "descending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.payment_status.toLowerCase() > b.payment_status.toLowerCase()) {
          return -1;
        }
        if (a.payment_status.toLowerCase() < a.payment_status.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "remove sort") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < a.date) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
  };
  /**
   * End of sorting from payment status by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 28-07-2023
   * Reason - to set date sorting value
   */
  var [dateSort, setDateSort] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 28-07-2023
   */

  /**
   * Added by Yuvraj Sahu on 28-07-2023
   * Reason - to sort data according to date
   */
  const handleDateSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date.toLowerCase() < b.date.toLowerCase()) {
          return -1;
        }
        if (a.date.toLowerCase() > a.date.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "descending") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date.toLowerCase() > b.date.toLowerCase()) {
          return -1;
        }
        if (a.date.toLowerCase() < a.date.toLowerCase()) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
    if (sort == "remove sort") {
      var latest = seeOrders.sort((a, b) => {
        if (a.date > b.date) {
          return -1;
        }
        if (a.date < a.date) {
          return 1;
        }
        return 0;
      });
      setSeeOrders(latest);
    }
  };
  /**
   * End of sorting from order id by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 28-07-2023
   * Reason - to set orders (asc or desc) send
   * props for sorting functionality
   */
  const handleSetDate = () => {
    setTableNoSort("");
    setOrderStatusSortVal("");
    setPaymentStatusSortVal("");
    setOrderIdSort("");
    if (dateSort == "") {
      setDateSort("ascending");
      handleDateSort("ascending");
    }
    if (dateSort == "ascending") {
      setDateSort("descending");
      handleDateSort("descending");
    }
    if (dateSort == "descending") {
      setDateSort("");
      handleDateSort("remove sort");
    }
  };
  /**
   * End of setting orders by Yuvraj Sahu on 28-07-2023
   */

  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to set the start and end date in date picker
   */
  function convertStartDate(str) {
    setStartDateSelected(new Date(str))
    setEndDateSelected(new Date())
    setShowEndDate("")
    setFilterDisable(true)
    setSeeOrders(orders)
    setSearch("")
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var date = [date.getFullYear(), mnth, day].join("-")
    setShowStartDate(`${date}`)
  }

  function convertEndDate(str) {
    setEndDateSelected(new Date(str))
    setFilterDisable(false)
    setSearch("")
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    var date = [date.getFullYear(), mnth, day].join("-")
    setShowEndDate(`${date}`)
  }
  /**
   * End of addition by Yuvraj Sahu on 04-08-2023
   */

  const handleFilter = () => {
    var newData = orders.filter((dt)=> {
      let date = new Date(dt.date);
      if (date >= startDateSelected && date <= endDateSelected){
        return dt
      }
    })
    setSeeOrders(newData)
  }

  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to remove the filters
   */
  const clearFilter = () => {
    setEndDateSelected(new Date())
    setShowEndDate("")
    setStartDateSelected(new Date())
    setShowStartDate("")
    setFilterDisable(true)
    setSeeOrders(orders)
    setSearch("")
  }
  /**
   * End of addition by Yuvraj Sahu on 04-08-2023
   */


  
  return (
    <>
      {/* Added byYuvraj Sahu on 27-4-2023
    Reason - to click at one time on button when cursor stays on input */}
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* End of addition - button click */}

        {/* Added by Yuvraj Sahu on 22-05-2023
          Reason - to give search functionality */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleSearch(e)}
            value={search}
            placeholderTextColor="#A4A4A4"
            placeholder="Search by table number and order id"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {/* End given search functionality by Yuvraj Sahu on 22-05-2023 */}

        {/* Added by Yuvraj Sahu on 04-08-2023
        Reason - to add filter design */}
        <View 
          style={styles.dateContainer}
        >
          <Pressable
            // style={[styles.input, styles.datePickerContainer]}
            style={styles.startDateContainer}
            placeholderTextColor="#A4A4A4"
            placeholder="Please enter date"
            autoCapitalize="none"
            autoCorrect={false}
            // disabled={object.id != "add new data" ? false : true}
          >
            {/* <Text style = {{color : (object.id)!= "add new data" ? "grey" : "black"}}>{values.date ? values.date.split("-").reverse().join("/") : "Please enter date"}</Text> */}
            <Text>{showStartDate == "" ? "Select date" : showStartDate.split("-").reverse().join("/")}</Text>
            <TouchableOpacity
              // disabled={object.id != "add new data" ? true : false}
              onPress={() => {
                DateTimePickerAndroid.open({
                  value: startDateSelected,
                  onChange: (event, selectedDate) => {
                    convertStartDate(selectedDate)
                  },
                  mode: "date",
                  is24Hour: true,
                  maximumDate: new Date(),
                  placeholder: "Please enter date",
                });
              }}
            >
              <Ionicons
                name="calendar"
                size={15}
                // color={(object.id)!= "add new data" ? "grey" : "black"}
                // style={styles.passIcon}
              />
            </TouchableOpacity>
          </Pressable>

          <Pressable
            style={styles.endDateContainer}
          >
            <Text>{showEndDate == "" ? "Select date" : showEndDate.split("-").reverse().join("/")}</Text>
            <TouchableOpacity
              // disabled={object.id != "add new data" ? true : false}
              onPress={() => {
                DateTimePickerAndroid.open({
                  value: endDateSelected,
                  onChange: (event, selectedDate) => {
                    convertEndDate(selectedDate)
                  },
                  mode: "date",
                  is24Hour: true,
                  minimumDate: startDateSelected,
                  maximumDate: new Date(),
                  placeholder: "Please enter date",
                });
              }}
            >
              <Ionicons
                name="calendar"
                size={15}
                // color={(object.id)!= "add new data" ? "grey" : "black"}
                // style={styles.passIcon}
              />
            </TouchableOpacity>
          </Pressable>
          {/* {errors.date && touched.date && (
          <Text style={styles.textdanger}>{errors.date}</Text>
          )} */}
        </View>

        <View style={styles.filterButtonContainer}>
        <Pressable
            onPress={clearFilter}
            style={[styles.filterButtonStyle, {backgroundColor: "#d2a479"}]}
            // disabled = {filterDisable}
          >
          <Text
            style={
              [styles.filterText,
                {
                  color: "white"
                }
              ]
            }
          >
            Clear filter
          </Text>
          </Pressable>

        <Pressable
          onPress={handleFilter}
          style={[styles.filterButtonStyle, {backgroundColor: filterDisable ? colors.btnDisableBackgroundColor : "#996633"}]}
          disabled = {filterDisable}
        >
          <Text
            style={
              [styles.filterText,
                {
                  color: filterDisable ? colors.btnDisableTextColor : "white"
                }
              ]
            }
          >
            Filter
          </Text>
          </Pressable>
        </View>
        {/* End of addition by Yuvraj Sahu on 04-08-2023 */}

        {seeOrders.length > 0 ? (
          <ScrollView horizontal={true}>
          <View style={styles.orderTableContainer}>
            {/* {seeOrders.map((order, id) => (
              <Pressable
                key={id}
                style={styles.orderListContainer}
                onPress={(e) => handleOrder(order.id, order.order_id)}
              >
                <View
                  style={{ width: "45%" }}
                >
                  <Text style={styles.customerName}>
                    {order.last_customer_name}
                  </Text>
                  <Text style={styles.tableNo}>
                    Table no. : {order.table_number}
                  </Text>
                  <Text style={styles.tableNo}>
                    Order ID : {order.order_id}
                  </Text>
                </View>
                <View
                  style={{
                    width: "55%",
                  }}
                >
                  <Text style={styles.orderandPaymentStatus}>
                    Order status : {order.order_status}
                  </Text>
                  <Text style={styles.orderandPaymentStatus}>
                    Payment status : {order.payment_status}
                  </Text>
                  <Text style={styles.tableNo}>
                    Date :{" "}
                    {new Date(order.date)
                      .toISOString()
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </Text>
                  <Text style={styles.tableNo}>
                    Time : {ExtractDateTime(order.date).time}
                  </Text>
                </View>
              </Pressable>
            ))} */}
            {/* ----------------------- Design tabular format ------------------------ */}
            <View style={styles.orderHeadingContainer}>
              <Text style={styles.tableColHeading1}>#</Text>
              {/* Added by yuvraj Sahu on 28-07-2023
              Reason - to add date in order list */}
              <Pressable
                style={styles.tableColHeading1_A}
                onPress={handleSetDate}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Date{dateSort == "" && "↓↑"}
                  {dateSort == "ascending" && "↑"}
                  {dateSort == "descending" && "↓"}
                </Text>
              </Pressable>
              {/* End of addition by yuvraj Sahu on 28-07-2023 */}
              <Pressable
                style={styles.tableColHeading2}
                onPress={handleTableOrder}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Table No.{tableNoSort == "" && "↓↑"}
                  {tableNoSort == "ascending" && "↑"}
                  {tableNoSort == "descending" && "↓"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.tableColHeading3}
                onPress={handleSetOrderId}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  OrderID{orderIdSort == "" && "↓↑"}
                  {orderIdSort == "ascending" && "↑"}
                  {orderIdSort == "descending" && "↓"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.tableColHeading4}
                onPress={handleSetOrderStatus}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Order Status{orderStatusSortVal == "" && "↓↑"}
                  {orderStatusSortVal == "ascending" && "↑"}
                  {orderStatusSortVal == "descending" && "↓"}
                </Text>
              </Pressable>
              <Pressable
                style={styles.tableColHeading5}
                onPress={handleSetPaymentStatus}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Payment Status{paymentStatusSortVal == "" && "↓↑"}
                  {paymentStatusSortVal == "ascending" && "↑"}
                  {paymentStatusSortVal == "descending" && "↓"}
                </Text>
              </Pressable>
            </View>

            {seeOrders.map((order, id) => (
              <Pressable
                style={styles.tdContainer}
                key={id}
                onPress={(e) => handleOrder(order.id, order.order_id)}
              >
                <Text style={styles.td1}>{id + 1}</Text>
                {/* Added by yuvraj Sahu on 28-07-2023
                Reason - to add date in order list */}
                {/* <Text>{ExtractDateTime(order.date).date}</Text> */}
                <Text style={styles.td1_A}>
                    {" "}
                    {new Date(order.date)
                      .toISOString()
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}
                  </Text>
                {/* End of addition by yuvraj Sahu on 28-07-2023 */}
                <Text style={styles.td2}>{order.table_number}</Text>
                <Text style={styles.td3}>{order.order_id}</Text>
                <Text style={styles.td4}>{order.order_status}</Text>
                <Text style={styles.td5}>{order.payment_status}</Text>
              </Pressable>
            ))}
          </View>
          </ScrollView>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  orderListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "95%",
    // height: 80,
    alignSelf: "center",
    padding: 10,
    // Added by Yuvraj Sahu on 20-4-2023
    // Reason - to design card
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // End of designing
  customerName: {
    fontSize: 16,
  },
  tableNo: {
    fontSize: 14,
    marginTop: 4,
    // Added by Yuvraj Sahu on 24-4-2023
    // Reason - to fix overflow
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    // End of addition
  },
  // Added by Om on 26-04-23
  // Reason : Create the order and payment status class name
  orderandPaymentStatus: {
    fontSize: 14,
    marginTop: 4,
    fontWeight: "bold",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    fontWeight: "bold",
  },
  // End of addition
  /**
   * Modified by yuvraj Sahu on 22-05-2023
   * Reason - to design search field and shorting
   */
  input: {
    height: inputs.inputBoxHeight,
    margin: 12,
    borderWidth: 1,
    paddingHorizontal: 20,
    marginTop: 0,
    fontSize: 16,
    borderRadius: 25,
  },
  searchContainer: {
    marginTop: 10,
  },
  /**
   * End of addition by yuvraj Sahu on 22-05-2023
   */

  /**
   * Added by Yuvraj Sahu on 02-06-2023
   * Reason - to design table
   */
  orderTableContainer: {
    margin: 5,
    borderRadius: 5,
    backgroundColor: "white",
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderTopWidth: 1,
    marginTop: 0
  },
  orderHeadingContainer: {
    height: 45,
    width: "100%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    borderTopEndRadius: 5,
    borderTopLeftRadius: 5,
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
  },
  tableColHeading1: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "5%",
    width: 50,
    textAlign: "center",
    // end of Modification by yuvraj Sahu on 28-07-2023
    fontWeight: "bold",
  },
  // Modified by Yuvraj Sahu on 28-07-2023
  // Reason - to adjust the width of columns
  tableColHeading1_A: {
    // minWidth: "25%",
    width: 100,
    textAlign: "center",
    paddingHorizontal: 3
  },
  // end of Modification by yuvraj Sahu on 28-07-2023
  tableColHeading2: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "25%",
    width: 80,
    textAlign: "center",
    // end of Modification by yuvraj Sahu on 28-07-2023
  },
  tableColHeading3: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 100,
    // end of Modification by yuvraj Sahu on 28-07-2023
    fontWeight: "bold",
    textAlign: "center",
  },
  tableColHeading4: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 90,
    paddingHorizontal: 3,
    // end of Modification by yuvraj Sahu on 28-07-2023
    fontWeight: "bold",
  },
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to add order id space
   */
  tableColHeading5: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 100,
    paddingHorizontal: 3,
    // end of Modification by yuvraj Sahu on 28-07-2023
    fontWeight: "bold",
  },
  /**
   * End of adding order id space by Yuvraj Sahu on 03-06-2023
   */
  tdContainer: {
    // modified by yuvraj Sahu on 28-07-2023
    // reason - to adjust height
    // height: 40,
    // marginHorizontal: 10,
    minHeight: 40,
    // end of modification by yuvraj Sahu on 28-07-2023
    width: "100%",
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  td1: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "5%",
    minWidth: 50,
    paddingHorizontal: 3,
    // end of Modification by yuvraj Sahu on 28-07-2023
    textAlign: "center",
  },
  // Modified by Yuvraj Sahu on 28-07-2023
  // Reason - to adjust the width of columns
  td1_A: {
    // minWidth: "25%",
    width: 100,
    textAlign: "center",
    paddingHorizontal: 3
  },
  // end of Modification by yuvraj Sahu on 28-07-2023
  td2: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // minWidth: "25%",
    width: 80,
    // end of Modification by yuvraj Sahu on 28-07-2023
    textAlign: "center",
  },
  td3: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 100,
    // end of Modification by yuvraj Sahu on 28-07-2023
    textAlign: "center",
  },
  td4: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 90,
    paddingHorizontal: 3,
    // end of Modification by yuvraj Sahu on 28-07-2023
    textAlign: "center",
  },
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to add order id space
   */
  td5: {
    // Modified by Yuvraj Sahu on 28-07-2023
    // Reason - to adjust the width of columns
    // width: "23%",
    width: 100,
    paddingHorizontal: 3,
    // end of Modification by yuvraj Sahu on 28-07-2023
    textAlign: "center",
  },
  /**
   * End of adding order id space by Yuvraj Sahu on 03-06-2023
   */
  /**
   * End of addition by Yuvraj Sahu on 02-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 04-08-2023
   * Reason - to design date container
   */
  dateContainer: {
    flexDirection : "row",
    alignSelf: "center",
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "space-around"
  },
  endDateContainer : {
    width: "40%",
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center"
  },
  startDateContainer : {
    width: "40%",
    height: 30,
    borderWidth: 1,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 5,
    alignItems: "center"
  },
  filterButtonContainer: {
    paddingHorizontal: 10,
    width: "100%",
    paddingVertical: 10,
    flexDirection: "row",
    justifyContent: "center"
  },
  filterButtonStyle: {
    minWidth: 70,
    marginHorizontal: 5,
    paddingHorizontal: 5,
    height: 27,
    backgroundColor: "grey",
    borderRadius: 5,
    alignSelf: "center",
    textAlign: "center",
    alignContent: "center",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  filterText: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    // height: "100%"
  }
  /**
   * End of addition by yuvraj sahu on 04-08-2023
   */
});
