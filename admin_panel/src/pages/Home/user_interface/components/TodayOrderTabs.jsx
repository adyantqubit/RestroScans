import React from "react";
import style from "../style/todayOrder.module.css";
import { ORDER_TABS } from "../../services/todayOrderRules";

const TodayOrderTabs = ({ onSelect }) => (
  <div className={style.radioGroup}>
    {ORDER_TABS.map((tab) => (
      <React.Fragment key={tab.id}>
        <input
          className={style.radioButton}
          type="radio"
          id={tab.id}
          name="group"
          defaultChecked={localStorage.getItem("selectedTab") === tab.key}
        />
        <label className={style.tabLabel} htmlFor={tab.id} onClick={() => onSelect(tab)}>
          {tab.label}
        </label>
      </React.Fragment>
    ))}
  </div>
);

export default TodayOrderTabs;
