import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { getAllMenuList, getMenuList } from "../../api/Services";
import { colors, inputs } from "../../Colours/globalColor";
import config, { tenantName } from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";
import Footer from "../../components/Footer/Footer";

// Added by Yuvraj Sahu on 15-3-2023
// Reason - to tenant from localstorage and get menu lost

export default function MenuListScreen({ navigation }) {
  const isFocused = useIsFocused();

  useEffect(() => {
    getAllMenus();
    /**
     * Added by Yuvraj Sahu on 21-05-2023
     * Reason - to clear the state
     */
    setSearch("");
    /**
     * End of addition by Yuvraj Sahu on 21-05-2023
     */
    // getTenant();
  }, [isFocused]);

  var [menuList, setMenuList] = useState([]);
  var [categoryList, setCategoryList] = useState([]);
  var [itemList, setItemList] = useState([]);
  var [filterCategory, setFilterCategory] = useState([]);

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to set searched objects and search keyword
   */
  var [seeMenus, setSeeMenus] = useState([]);
  var [search, setSearch] = useState("");
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */

  const getAllMenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    const response = await getAllMenuList(tenant);
    if (response) {
      setMenuList(response.menuList);
      /**
       * Added by Yuvraj Sahu on 21-05-2023
       * Reson - to set value for search
       */
      setSeeMenus(response.menuList);
      /**
       * End of addition by Yuvraj Sahu on 21-05-2023
       */
      setCategoryList(response.categoryList);
      setItemList(response.itemList);
    }
  };

  function categoryFilter(menuID, menuName) {
    var filteredMenu = menuList.filter((dt) => dt.id == menuID);
    var filteredCategories = categoryList.filter((e) => e.menu == menuID);
    var filteredItem = itemList.filter((dt) => dt.menu_id == menuID);
    navigation.navigate("CategoryListScreen", {
      menuID: menuID,
      menuObj: filteredMenu,
      menuName: menuName,
      filteredCategories: filteredCategories,
      categoryList: categoryList,
      itemList: filteredItem,
      menuList: menuList,
    });
    // setFilterCategory(categoryList.filter((e) => e.menu_name == val));
  }

  // function itemFilter(val) {
  //   setFilterItem(itemList.filter((e) => e.category_name == val));
  // }

  /**
   * Added by Yuvraj Sahu on 21-05-2023
   * Reason - to search menu using name wise
   */
  const handleSearch = (searchKey) => {
    // Commeted and modified by Yuvraj Sahu on 04-06-2023
    // Reason - to trim searched word from start and end
    // var splitedWord = searchKey.trimStart().replace(".", " ").split(" ");
    var splitedWord = searchKey.trim().replace(".", " ").split(" ");
    // End of trimming word by Yuvraj Sahu on 04-06-2023
    var sapratedWord = splitedWord.reverse().join().replace(",", " ");
    setSearch(searchKey.replace(".", " "));
    if (searchKey == "") {
      setSeeMenus(menuList);
    } else {
      var searchedMenus = menuList.filter(
        (dt) =>
          dt.name.toLowerCase().includes(searchKey.toLowerCase()) || // search by word (left-right)
          dt.name.toLowerCase().includes(sapratedWord.toLowerCase()) || // search word with space and reverse
          splitedWord.includes(dt.name.toLowerCase()) // search for multiple object
      );
      setSeeMenus(searchedMenus);
    }
  };
  /**
   * End of addition by Yuvraj Sahu on 21-05-2023
   */


  return (
    <>
      <View style={{ height: "100%" }}>
        <ScrollView>
          {/* Menu Items ----------------------------------------------- */}
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

          <View style={styles.menuContainer}>
            {seeMenus.length > 0 ? (
              <>
                {seeMenus.map((menuData, id) => (
                  <Pressable
                    style={styles.menuPress}
                    onPress={(e) => categoryFilter(menuData.id, menuData.name)}
                    key={id}
                  >
                    <Image
                      source={{
                        uri: config.staticBaseURL + menuData.icon,
                      }}
                      style={styles.menuIcon}
                    />
                    <Text style={styles.btnText} value={menuData.id}>
                      {menuData.name}
                    </Text>
                  </Pressable>
                ))}
              </>
            ) : (
              <Text style={styles.noMenusText}>No menus are listed here</Text>
            )}
          </View>
          {/* Menu Item Close ------------------------------------------ */}
          {/* Category List ----------------------------------------------- */}
          {/* <View style={styles.categoryContainer}>
          {filterCategory.map((categoryData, id) => (
            <View key={id}>
              <View style={styles.categoryView} key={id}>
                <Pressable
                  style={styles.categoryPress}
                  onPress={(e) => itemFilter(categoryData.name)}
                >
                  <Image
                    source={{
                      uri: config.staticBaseURL + categoryData.icon,
                    }}
                    style={styles.categoryIcon}
                  />
                  <Text style={styles.categoryLable}>{categoryData.name}</Text>
                  <Icon name="edit" size={20} color="black" />
                </Pressable>
              </View>
              {filterItem[0] && (
                <>
                  {categoryData.name == filterItem[0].category_name ? (
                    <>
                      {filterItem.map((itemData, id) => (
                        <View style={styles.btnContainer} key={id}>
                          <Pressable style={styles.itemList}>
                            <Text style={styles.btnText}>{itemData.name}</Text>
                          </Pressable>
                        </View>
                      ))}
                    </>
                  ) : null}
                </>
              )}
            </View>
          ))}
        </View> */}
          {/* Category List Close ------------------------------------------ */}
          {/* Items List ----------------------------------------------- */}
          {/* <View style={styles.itemContainer}>
        {filterItem.map((itemData, id) => (
          <View style={styles.btnContainer} key={id}>
            <Pressable style={styles.menuPress}>
              <Text style={styles.btnText}>{itemData.name}</Text>
            </Pressable>
          </View>
        ))}
      </View> */}
          {/* Items List Close ------------------------------------------ */}
        </ScrollView>
        {/* Added by Om on 18-04-23 For showing the footer*/}
        <Footer />
        {/* End of addition */}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  btnContainer: {
    backgroundColor: "#e6e6e6",
    width: "90%",
    alignSelf: "center",
    borderRadius: 5,
    borderColor: "grey",
    borderWidth: 2,
  },
  menuPress: {
    backgroundColor: "white",
    margin: 8,
    padding: 10,
    borderRadius: 5,
    height: 130,
    width: "45%",
    alignItems: "center",
  },
  btnText: {
    color: "black",
    fontWeight: "bold",
  },
  categoryView: {
    marginTop: 5,
    marginRight: 20,
    marginBottom: 5,
    marginLeft: 20,
    borderRadius: 10,
    height: 50,
    backgroundColor: "white",
  },
  categoryPress: {
    display: "flex",
    flexDirection: "row",
    height: "100%",
    justifyContent: "space-around",
    alignItems: "center",
  },
  menuContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "stretch",
    flexWrap: "wrap",
    alignContent: "stretch",
  },
  categoryContainer: {},
  itemContainer: {},
  categoryIcon: {
    width: "20%",
    height: "80%",
    borderRadius: 10,
  },
  categoryLable: {
    color: "black",
    fontWeight: "bold",
  },
  menuIcon: {
    height: "80%",
    width: "100%",
    borderRadius: 5,
  },
  itemList: {
    backgroundColor: "white",
    height: 30,
  },

  // Added by- Suman sahu  On 23/04/2023
  // Reason- fix text margin when no items added in the menu list
  noMenusText: {
    marginLeft: 100,
    marginTop: 50,
  },
  // End of added code 23/04/2023

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

});
