
import React, { useContext, useEffect } from 'react';
import '../style/Footer.css';
import { getfooterDetails } from '../../services/footerService';
import { GlobalContext } from '../../../../context/Context';
import { useFooterState } from '../../usestate/footerState';

function Footer() {
  const { colors } = useContext(GlobalContext);
  const {
    setFooterDetails,
    restaurantDescription,
    setRestaurantDescription
  } = useFooterState();

  useEffect(() => {
    const getDetails = async () => {
      try {
        const tenantName = localStorage.getItem('tenantName');
        if (!tenantName) return;

        const response = await getfooterDetails(tenantName);
        if (response) {
          setFooterDetails(response.footer || {});
          setRestaurantDescription(
            Array.isArray(response.descriptionList)
              ? response.descriptionList
              : []
          );
        }
      } catch (error) {
        console.error('Error fetching footer details:', error);
        setRestaurantDescription([]);
      }
    };

    getDetails();
  }, [setFooterDetails, setRestaurantDescription]);

  const descriptions = Array.isArray(restaurantDescription)
    ? restaurantDescription
    : [];

  return (
    <div>
      <div className="main_footer" id="footer">
        <div
          className="powered_text"
          style={{ background: colors?.bannerColor }}
        >
          <a
            className="anchor_container"
            style={{ color: colors?.backgroundTheme }}
            href="https://adyant.co.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Adyant Powered © 2023
          </a>
        </div>

        {descriptions.map((showdata, index) => (
          <marquee
            key={showdata.id ?? index}
            scrollDelay="100"
            className="marquee_container"
            style={{ backgroundColor: colors?.backgroundTheme }}
          >
            {showdata.content}
          </marquee>
        ))}
      </div>
    </div>
  );
}

export default Footer;
