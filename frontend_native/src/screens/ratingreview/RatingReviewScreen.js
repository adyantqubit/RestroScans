/**
 * Created by Om Shrivastava on 26-07-2023
 * Reason - to get all rating and review for restaurant
 */

import { View, Text, StyleSheet, Pressable, TextInput } from "react-native";
import React from "react";
import { getRestaurantRatingReview } from "../../api/Services";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import { useEffect } from "react";
import { ScrollView } from "react-native-gesture-handler";
import Footer from "../../components/Footer/Footer";
import { useIsFocused } from "@react-navigation/native";
import { colors, inputs } from "../../Colours/globalColor";
import ReadMore from '@fawazahmed/react-native-read-more';

export default function CustomerListScreen({ route, navigation }) {
  const isFocused = useIsFocused();

  /**
   * This is used for render the page and API call first the screen renders
   */
  useEffect(() => {
    allRatingReview();
    /**
     * Added by Om Shrivastava on 26-07-2023
     * Reason - to clear the state
     */
    setSearch("");
    /**
     * End of addition by Om Shrivastava on 26-07-2023
     */
  }, [isFocused]);

  /**
   * This react hooks is used to set all ratingReview
   * Which is used for map and showing data to user
   */
  var [ratingReview, setRatingReview] = useState([]);
  /**
   * End of setting orders
   */

  /**
   * Added by Om Shrivastava on 26-07-2023
   * Reason - to set searched objects and search keyword
   */
  var [seeratingReview, setSeeratingReview] = useState([]);
  var [search, setSearch] = useState("");
  /**
   * End of addition by Om Shrivastava on 26-07-2023
   */

  // Added by Om Shrivastava on 26-07-2023
  // Reason - to show loading when we call backend
  // This react hooks is used to set loading for response
  var [isLoading, setLoading] = useState(false);
  // End of loading

  /**
   * This function is created for getting all rating and review for restaurant
   */
  const allRatingReview = async () => {
    setLoading(true);
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    var response = await getRestaurantRatingReview(tenant);
    // if (response.msg) {
    setLoading(false);
    setRatingReview(response.allRatingData);
    /**
     * Added by Om Shrivastava on 26-07-2023
     * Reson - to set value for search
     */
    setSeeratingReview(response.allRatingData);
    /**
     * End of addition by Om Shrivastava on 26-07-2023
     */
    // }
  };

  /**
   * Added by Om Shrivastava on 26-07-2023
   * Reason - to search menu using name wise
   */
  const handleSearch = (searchKey) => {
    var splitedWord = searchKey.trimStart().replace(".", " ").split(" ");
    var sapratedWord = splitedWord.reverse().join().replace(",", " ");
    setSearch(searchKey.replace(".", " "));
    if (searchKey == "") {
      setSeeratingReview(ratingReview);
    } else {
      var searchedMenus = ratingReview.filter(
        (dt) =>
          dt.name.toLowerCase().includes(searchKey.toLowerCase()) || // search by word (left-right)
          dt.name.toLowerCase().includes(sapratedWord.toLowerCase()) || // search word with space and reverse
          splitedWord.includes(dt.name.toLowerCase()) || // search for multiple object
          dt.contact_number.toLowerCase().includes(searchKey.toLowerCase()) // search contact number wish
      );
      setSeeratingReview(searchedMenus);
    }
  };
  /**
   * End of addition by Om Shrivastava on 26-07-2023
   */

  /**
   * Added by Om Shrivastava on 26-07-2023
   * Reason - to set name sorting value
   */
  var [nameSortVal, setNameSortVal] = useState("");
  /**
   * End of addition by Om Shrivastava on 26-07-2023
   */
  /**
   * Added by Om Shrivastava on 26-07-2023
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
   * End of setting name by Om Shrivastava on 26-07-2023
   */

  /**
   * Added by Om Shrivastava on 26-07-2023
   * Reason - to sort data according to name
   */
  const handleNameSort = (sort) => {

    if (sort == "ascending") {
      var latest = seeratingReview.sort((a, b) => {
        if (Number(a.rating) < Number(b.rating)) {
          return -1;
        }
        if (Number(a.rating) > Number(a.rating)) {
          return 1;
        }
        return 0;
      });
      setSeeratingReview(latest);
    }
    if (sort == "descending") {
      var latest = seeratingReview.sort((a, b) => {
        if (Number(a.rating) > Number(b.rating)) {
          return -1;
        }
        if (Number(a.rating) < Number(a.rating)) {
          return 1;
        }
        return 0;
      });
      setSeeratingReview(latest);
    }
    if (sort == "remove sort") {
      var latest = seeratingReview.sort((a, b) => {
        if (Number(a.id) < Number(b.id)) {
          return -1;
        }
        if (Number(a.id) > Number(a.id)) {
          return 1;
        }
        return 0;
      });
      setSeeratingReview(latest);
    }
  };
  /**
   * End of sorting from name by Om Shrivastava on 26-07-2023
   */

  return (
    <>
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Added by Om Shrivastava on 26-07-2023
          Reason - to give search functionality */}
        {/* <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            onChangeText={(e) => handleSearch(e)}
            value={search}
            placeholderTextColor="#A4A4A4"
            placeholder="Search"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View> */}
        {/* End given search functionality by Om Shrivastava on 26-07-2023 */}


        {/* -------------------------- Tabular design ---------------------- */}

        {seeratingReview != null && seeratingReview.length > 0 ? (
          <View style={styles.orderTableContainer}>
            <View style={styles.orderHeadingContainer}>
              <Text style={styles.tableColHeading1}>SNo.</Text>

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
                  Rating
                  {nameSortVal == "" && "↓↑"}
                  {nameSortVal == "ascending" && "↑"}
                  {nameSortVal == "descending" && "↓"}
                </Text>
              </Pressable>

              <Pressable style={styles.tableColHeading4}>
                <Text
                  style={{
                    fontWeight: "bold",
                    // textAlign: "center",
                  }}
                >
                  Review
                </Text>
              </Pressable>
              {/* End of modification and addition by Om Shrivastava on 26-07-2023 */}

            </View>

            {seeratingReview.map((RatingReviews, id) => (
              <View style={styles.tdContainer} key={id}>
                <Text style={styles.td1}>{id + 1}</Text>
                <Text style={styles.td3}>
                  {RatingReviews.rating != null || RatingReviews.rating != undefined ?
                    <>
                      {RatingReviews.rating}
                    </> : '-'}
                </Text>

                <View style={styles.root}>
                  <ReadMore numberOfLines={2} style={styles.textStyle}
                    seeMoreStyle={{ color: 'blue', fontWeight: "bold" }}
                    seeLessStyle={{ color: 'blue', fontWeight: "bold" }}
                  >

                    {RatingReviews.review ? RatingReviews.review : '------'}
                  </ReadMore>
                </View>
                {/* End of modification and addition by Om Shrivastava on 26-07-2023 */}
              </View>
            ))}
          </View>
        ) : (
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            No data available
          </Text>
        )}
        {/* End of show tabular formate by Om Shrivastava on 26-07-2023 */}
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
    backgroundColor: colors.lightTheme,
    alignSelf: "center",
    justifyContent: "center",
  },
  customerDetail: {
    width: "87%",
    paddingLeft: 15,
  },

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
    width: "50%",
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
    width: "50%",
    textAlign: "center",
  },
  root: {
    flex: 1,
  },
  textStyle: {
    fontSize: 14,
  },
  /**
   * End of addition by Om Shrivastava on 26-07-2023
   */
});
