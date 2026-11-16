import { useEffect, useState } from "react";
import { explainFailure } from "../../../../http/http_client";
import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../../../../Context/AppContext";
import { attachOfferItem, detachOfferItem, loadOfferCatalog } from "../../services/bannerOfferService";
import style from "../style/offer.module.css";

function salePrice(price, discount) {
  const amount = Number(price);
  const cut = Number(discount);
  if (!amount) return "";
  const next = cut ? amount - (amount * cut) / 100 : amount;
  return next.toFixed(2);
}

export default function OfferItem() {
  const { enableHeader, Message } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const offerId = location.state && location.state.id;
  const [offerName, setOfferName] = useState(location.state?.name || "");
  const [discount, setDiscount] = useState(location.state?.discount || "");
  const [attached, setAttached] = useState([]);
  const [items, setItems] = useState([]);
  const [picked, setPicked] = useState("");

  useEffect(() => {
    enableHeader();
    if (offerId) load();
  }, [offerId]);

  async function load() {
    const tenant = JSON.parse(localStorage.getItem("tenantInfo") || "{}").tenant_name;
    const response = await loadOfferCatalog(tenant, offerId);
    const lines = response?.offerItemList || [];
    setAttached(lines);
    setItems(response?.itemList || []);
    if (lines[0]) {
      setOfferName(lines[0].offer_name || offerName);
      setDiscount(lines[0].item_discount ?? discount);
    }
  }

  const taken = new Set(attached.map((line) => String(line.item_id)));
  const available = items.filter((item) => !taken.has(String(item.id)));

  async function addDish() {
    if (!picked) {
      Message("Choose a dish", "warning");
      return;
    }
    const response = await attachOfferItem(offerId, picked);
    if (response && response.msg) {
      setPicked("");
      load();
      return;
    }
    Message(explainFailure(response, "This dish was not added."), "warning");
  }

  async function removeDish(line) {
    const response = await detachOfferItem(line.id);
    if (response && response.msg) load();
    else Message(explainFailure(response, "This dish was not removed."), "warning");
  }

  return (
    <div className="custom-screen-page-stack">
      <div className="page-header">
        <div className="page-header__title-wrap">
          <h2 className="page-header__title">{offerName || "Offer dishes"}</h2>
          <p className="page-header__subtitle">{discount ? `${discount}% off the dishes below` : "Choose which dishes this offer covers"}</p>
        </div>
        <div className="page-header__meta">
          <button type="button" className="desk-action desk-action--quiet" onClick={() => navigate("/BannerOffer")}>Back to offers</button>
        </div>
      </div>
      <section className="custom-screen-section custom-screen-section--table">
        <div className={style.addRow}>
          <div className={style.field}>
            <label htmlFor="offer-dish">Add a dish</label>
            <select id="offer-dish" value={picked} onChange={(event) => setPicked(event.target.value)}>
              <option value="">Select a dish</option>
              {available.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.menu_name ? `${item.menu_name} · ` : ""}{item.category_name ? `${item.category_name} · ` : ""}{item.name}
                </option>
              ))}
            </select>
          </div>
          <button type="button" className="desk-action" onClick={addDish}>Add</button>
        </div>
        <table className={style.table}>
          <thead>
            <tr>
              <th>Dish</th>
              <th>Full</th>
              <th>Half</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {attached.length === 0 ? (
              <tr>
                <td className={style.empty} colSpan="4">No dishes on this offer yet.</td>
              </tr>
            ) : attached.map((line) => (
              <tr key={line.id}>
                <td>{line.item_name}</td>
                <td>
                  {line.item_fullprice ? <span className={style.price}>₹{line.item_fullprice}</span> : null}
                  {salePrice(line.item_fullprice, discount) ? `₹${salePrice(line.item_fullprice, discount)}` : "—"}
                </td>
                <td>
                  {line.item_halfprice ? <span className={style.price}>₹{line.item_halfprice}</span> : null}
                  {salePrice(line.item_halfprice, discount) ? `₹${salePrice(line.item_halfprice, discount)}` : "—"}
                </td>
                <td>
                  <div className={style.rowActions}>
                    <button type="button" className="desk-action desk-action--quiet" onClick={() => removeDish(line)}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
