/**
 * Created by Yuvraj Sahu on 01-05-2023
 * Reason - to get all customer list for restaurant
 */

import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React from "react";
import { getAllCustomerApi } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";
import { colors, inputs } from "../../Colours/globalColor";


export default function CustomerListScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  /**
   * This is used for render the page and API call first the screen renders
   */
  useEffect(() => {
    allCustomers();
    /**
     * Added by Yuvraj Sahu on 22-05-2023
     * Reason - to clear the state
     */
    setSearch("");
    /**
     * End of addition by Yuvraj Sahu on 22-05-2023
     */
  }, [isFocused]);

  /**
   * This react hooks is used to set all customers
   * Which is used for map and showing data to user
   */
  var [customers, setCustomers] = useState([]);
  /**
   * End of setting orders
   */

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to set searched objects and search keyword
   */
  var [seeCustomers, setSeeCustomers] = useState([]);
  var [search, setSearch] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */

  // Added by Yuvraj Sahu on 13-4-2023
  // Reason - to show loading when we call backend
  // This react hooks is used to set loading for response
  var [isLoading, setLoading] = useState(false);
  // End of loading

  /**
   * This function is created for getting all customer list
   */
  const allCustomers = async () => {
    setLoading(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getAllCustomerApi(tenant);
    if (response.msg) {
      setLoading(false);
      setCustomers(response.allCustomers);
      /**
       * Added by Yuvraj Sahu on 21-05-2023
       * Reson - to set value for search
       */
      setSeeCustomers(response.allCustomers);
      /**
       * End of addition by Yuvraj Sahu on 21-05-2023
       */
    }
  };

  /**
   * Added by Yuvraj Sahu on 22-05-2023
   * Reason - to search menu using name wise
   */
  const handleSearch = (searchKey) => {
    var splitedWord = searchKey.trimStart().replace(".", " ").split(" ");
    var sapratedWord = splitedWord.reverse().join().replace(",", " ");
    setSearch(searchKey.replace(".", " "));
    if (searchKey == "") {
      setSeeCustomers(customers);
    } else {
      var searchedMenus = customers.filter(
        (dt) =>
          dt.name.toLowerCase().includes(searchKey.toLowerCase()) || // search by word (left-right)
          dt.name.toLowerCase().includes(sapratedWord.toLowerCase()) || // search word with space and reverse
          splitedWord.includes(dt.name.toLowerCase()) || // search for multiple object
          dt.contact_number.toLowerCase().includes(searchKey.toLowerCase()) // search contact number wish
      );
      setSeeCustomers(searchedMenus);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 22-05-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set name sorting value
   */
  var [nameSortVal, setNameSortVal] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 03-06-2023
   */
  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to set payment status (asc or desc) send
   * props for sorting functionality
   */
  const handleSetName = () => {
    if (nameSortVal == "") {
      setNameSortVal("ascending");
      handleNameSort("ascending");
    }
    if (nameSortVal == "ascending") {
      setNameSortVal("descending");
      handleNameSort("descending");
    }
    if (nameSortVal == "descending") {
      setNameSortVal("");
      handleNameSort("remove sort");
    }
  };
  /**
   * End of setting name by Yuvraj Sahu on 03-06-2023
   */

  /**
   * Added by Yuvraj Sahu on 03-06-2023
   * Reason - to sort data according to name
   */
  const handleNameSort = (sort) => {
    if (sort == "ascending") {
      var latest = seeCustomers.sort((a, b) => {
        if (
          a.last_customer_name.toLowerCase() <
          b.last_customer_name.toLowerCase()
        ) {
          return -1;
        }
        if (
          a.last_customer_name.toLowerCase() >
          a.last_customer_name.toLowerCase()
        ) {
          return 1;
        }
        return 0;
      });
      setSeeCustomers(latest);
    }
    if (sort == "descending") {
      var latest = seeCustomers.sort((a, b) => {
        if (
          a.last_customer_name.toLowerCase() >
          b.last_customer_name.toLowerCase()
        ) {
          return -1;
        }
        if (
          a.last_customer_name.toLowerCase() <
          a.last_customer_name.toLowerCase()
        ) {
          return 1;
        }
        return 0;
      });
      setSeeCustomers(latest);
    }
    if (sort == "remove sort") {
      var latest = seeCustomers.sort((a, b) => {
        if (a.id > b.id) {
          return -1;
        }
        if (a.id < a.id) {
          return 1;
        }
        return 0;
      });
      setSeeCustomers(latest);
    }
  };
  /**
   * End of sorting from name by Yuvraj Sahu on 03-06-2023
   */

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Added by Yuvraj Sahu on 21-05-2023
          Reason - to give search functionality */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleSearch(e)}
            value={search}
            placeholderTextColor="#A4A4A4"
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        {/* End given search functionality by Yuvraj Sahu on 21-05-2023 */}

        {/* Commeted and modified by Yuvraj Sahu on 02-06-2023
        Reason - to design tabular format customer list */}
        {/* {seeCustomers.length > 0 ? (
          <>
            {seeCustomers.map((customer, id) => (
              <Pressable key={id} style={styles.customerListContainer}>
                <View style={styles.customerIcon}>
                  <Text
                    style={{
                      alignSelf: "center",
                      alignItems: "center",
                      fontSize: 30,
                    }}
                  >
                    {customer.last_customer_name ? (
                      `${customer.last_customer_name}`.charAt(0).toUpperCase()
                    ) : (
                      <AntDesign name="user" size={24} color="black" />
                    )}
                  </Text>
                </View>
                <View style={styles.customerDetail}>
                  <Text style={styles.customerName}>
                    Name :{" "}
                    {customer.last_customer_name
                      ? customer.last_customer_name
                      : "--"}
                  </Text>
                  <Text style={styles.customerLable}>
                    Email : {customer.last_email ? customer.last_email : "--"}
                  </Text>
                  <Text style={styles.customerLable}>
                    Contact number : {customer.contact_number}
                  </Text>
                </View>
              </Pressable>
            ))}
          </>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )} */}

        {/* -------------------------- Tabular design ---------------------- */}
        {seeCustomers.length > 0 ? (
          <View style={styles.orderTableContainer}>
            <View style={styles.orderHeadingContainer}>
              <Text style={styles.tableColHeading1}>#</Text>
              <Pressable style={styles.tableColHeading2}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Contact number
                </Text>
              </Pressable>
              <Pressable
                style={styles.tableColHeading3}
                onPress={handleSetName}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Name{nameSortVal == "" && "↓↑"}
                  {nameSortVal == "ascending" && "↑"}
                  {nameSortVal == "descending" && "↓"}
                </Text>
              </Pressable>
              <Pressable style={styles.tableColHeading4}>
                <Text
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Email
                </Text>
              </Pressable>
            </View>

            {seeCustomers.map((order, id) => (
              <View style={styles.tdContainer} key={id}>
                <Text style={styles.td1}>{id + 1}</Text>
                <Text style={styles.td2}>{order.contact_number}</Text>
                <Text style={styles.td3}>
                  {order.last_customer_name ? order.last_customer_name : "-"}
                </Text>
                <Text style={styles.td4}>
                  {order.last_email ? order.last_email : "-"}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
        {/* End of show tabular formate by Yuvraj Sahu on 02-06-2023 */}
      </ScrollView>
      <Footer />
    </>
  );
}

const styles = StyleSheet.create({
  customerListContainer: {
    display: "flex",
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 10,
    width: "95%",
    alignSelf: "center",
    padding: 10,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  customerName: {
    fontSize: 16,
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  customerLable: {
    fontSize: 14,
    marginTop: 4,
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
    flexShrink: 1,
    flexWrap: "wrap",
    width: "100%",
  },
  customerIcon: {
    width: "13%",
    height: 45,
    borderWidth: 1,
    borderRadius: 25,
    borderColor: "black",
    /**
     * Added by yuvraj Sahu on 03-05-2023
     * Reason - to give background color using global
     */
    // backgroundColor: "#BAB8F7",
    backgroundColor: colors.lightTheme,
    /**
     * End of addition
     */
    alignSelf: "center",
    justifyContent: "center",
  },
  customerDetail: {
    width: "87%",
    paddingLeft: 15,
  },
  /**
   * Modified by yuvraj Sahu on 21-05-2023
   * Reason - to design search field
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
   * End of addition by yuvraj Sahu on 21-05-2023
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
    paddingHorizontal: 5,
    borderBottomWidth: 1,
  },
  tableColHeading1: {
    width: "10%",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableColHeading2: {
    width: "30%",
  },
  tableColHeading3: {
    width: "25%",
    fontWeight: "bold",
    textAlign: "center",
  },
  tableColHeading4: {
    width: "35%",
    fontWeight: "bold",
  },
  tdContainer: {
    minHeight: 40,
    width: "100%",
    marginHorizontal: 10,
    alignSelf: "center",
    display: "flex",
    flexDirection: "row",
    padding: 5,
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  td1: {
    width: "10%",
    textAlign: "center",
  },
  td2: {
    width: "30%",
    textAlign: "center",
  },
  td3: {
    width: "25%",
    textAlign: "center",
  },
  td4: {
    width: "35%",
    textAlign: "center",
  },
  /**
   * End of addition by Yuvraj Sahu on 02-06-2023
   */
});
