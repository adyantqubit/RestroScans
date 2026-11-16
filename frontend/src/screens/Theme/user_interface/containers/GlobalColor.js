import { useContext, useEffect, useState } from "react";
import { loadThemeSetting, themeColors } from '../../services/themeService';
import Context, { GlobalContext } from "../../../../context/Context";
import { useGlobalColorState } from "../../usestate/globalColorState";

export const fonts = {
    title1: 20,
    title2: 25,
}

export default function GlobalColor() {
    var { color, setColor } = useGlobalColorState();
    var { colors, setColors } =useContext(GlobalContext);

    useEffect(() => {
        getTheme(tenantt);
    }, []);

    var tenantt = localStorage.getItem("tenantName")

    const getTheme = async () => {
        const setting = await loadThemeSetting(tenantt);
        if (setting) {
            setColor(setting);
        }
    };

    useEffect(()=>{
        var mapped = themeColors(color)
        if(mapped){
        colors=mapped}

        if(color && typeof color.allow_half_price!= "undefined"){
            colors['allow_half_price']=color.allow_half_price
            setColors(colors)
            }
    },[color])

    return (
        <>
        </>
    );
}
