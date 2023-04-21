import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { getAllMenuList, getMenuList } from "../../api/Services";
import { colors } from "../../Colours/globalColor";
import config, { tenantName } from "../../config/config";
import Icon from "react-native-vector-icons/FontAwesome";
import * as SecureStore from "expo-secure-store";
import { useContext } from "react";
import { AppStateContext } from "../../context/AppStateProvider";
import { useIsFocused } from "@react-navigation/native";
import Footer from '../../components/Footer/Footer'


// Added by Yuvraj Sahu on 15-3-2023
// Reason - to tenant from localstorage and get menu lost

export default function MenuListScreen({ navigation }) {

  const isFocused = useIsFocused();

  var {render, setRender} = useContext(AppStateContext)
  useEffect(() => {
    getAllMenus();
    // getTenant();
  }, [render, isFocused]);

  var [menuList, setMenuList] = useState([]);
  var [categoryList, setCategoryList] = useState([]);
  var [itemList, setItemList] = useState([]);
  var [filterCategory, setFilterCategory] = useState([]);
  var [filterItem, setFilterItem] = useState([]);

  const getAllMenus = async () => {
    var tenant = JSON.parse(
      await SecureStore.getItemAsync("tenantInfo")
    ).tenant_name;
    const response = await getAllMenuList(tenant);
    if (response) {
      setMenuList(response.menuList);
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
      menuList: menuList
    });
    // setFilterCategory(categoryList.filter((e) => e.menu_name == val));
    // setFilterItem([]);
  }

  function itemFilter(val) {
    setFilterItem(itemList.filter((e) => e.category_name == val));
  }

  return (
    <>
    <View style={{ height: "100%" }}>
      <ScrollView>
        {/* Menu Items ----------------------------------------------- */}
        <View style={styles.menuContainer}>
          {menuList.length > 0 ? (
            <>
              {menuList.map((menuData, id) => (
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
            <Text>No menus are listed here</Text>
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
    <Footer/>
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
});
