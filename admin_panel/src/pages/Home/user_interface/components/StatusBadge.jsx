import React from "react";
import style from "../style/todayOrder.module.css";
import { STATUS_COLORS } from "../../services/todayOrderRules";

const StatusBadge = ({ status }) => {
  const background = STATUS_COLORS[status];
  if (!background) return null;
  return (
    <button className={style.statusBtn} style={{ background }}>
      <span>{status}</span>
    </button>
  );
};

export default StatusBadge;
