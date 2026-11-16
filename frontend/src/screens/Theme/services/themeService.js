import { getThemeChanges as requestThemeChanges } from "../api/themeApi";

export function getThemeChanges(tenantId) {
  return requestThemeChanges(tenantId);
}

export async function loadThemeSetting(tenantId) {
  const response = await requestThemeChanges(tenantId);
  return response ? response.setting : null;
}

export function themeColors(setting) {
  if (setting?.banner_heading_color == null) {
    return null;
  }
  return {
    headingColor: setting.heading_color,
    backgroundTheme: setting.background_color,
    subHeadingColor: setting.subheading_color,
    bannerColor: setting.banner_heading_color,
    headingBackgroundColor: setting.heading_bgcolor,
    subheadingBackgroundColor: setting.subheading_bgcolor,
    card_color: setting.card_color,
  };
}
