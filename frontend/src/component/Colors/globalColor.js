// Create by Om on 14-03-23
// Reason : show the theme of page
import { useContext, useEffect, useState } from "react";
import { getThemeChanges } from "../../api/Services";
import Context, { GlobalContext } from "../../context/Context";

// var mydata = []
// alert(mydata)


export const fonts = {
    title1: 20,
    title2: 25,
}

export default function GlobalColor() {

    const [color, setColor] = useState(null); // Our menu set in this variable
    var { colors, setColors } =useContext(GlobalContext);

    useEffect(() => {
        getTheme(tenantt);
    }, []);

    var tenantt = localStorage.getItem("tenantName")

    const getTheme = async () => {
        const response = await getThemeChanges(tenantt);
        if (response) {
            setColor(response.setting);
        }
    };

    useEffect(()=>{
        // Modiefied By Rohan - 24/4/23
        // Reason - check if color are not available so don't set any color
        if(color?.banner_heading_color!=null){
        setColors({
            headingColor: color.heading_color,
            backgroundTheme: color.background_color,
            subHeadingColor: color.subheading_color,
            bannerColor: color.banner_heading_color,
            headingBackgroundColor:color.heading_bgcolor,
            subheadingBackgroundColor:color.subheading_bgcolor,
            // backgroundTheme:color.length==0 ? color.background_color :'red'
            allow_half_price:color.allow_half_price
        })}
        // end of code - 24/4/23
    },[color])

    return (
        <>
            {/* <div style={{ backgroundColor: 'yellow', color: 'black' }}>Yupp</div> */}
        </>
    );
}
