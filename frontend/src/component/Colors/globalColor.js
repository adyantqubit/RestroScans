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
        // Modified by Rohan Knasari, 13/5/23  to solve theme issue
        colors={
            // End of  modification Rohan Kansari- 13/5/23
            headingColor: color.heading_color,
            backgroundTheme: color.background_color,
            subHeadingColor: color.subheading_color,
            bannerColor: color.banner_heading_color,
            headingBackgroundColor:color.heading_bgcolor,
            subheadingBackgroundColor:color.subheading_bgcolor,
            // backgroundTheme:color.length==0 ? color.background_color :'red'
            // commented on -Rohan Kansari - 7/5/23
            // reason - to get updated allow_half_price also if theme is not selected 
            // allow_half_price:color.allow_half_price,

            // Added by Rohankansari - 28/4/23
            // Reason - To add card color here
            card_color:color.card_color,
            // End of code
        }}
        

        // Added by Rohan Kansari - 7/5/23
        // Reason - To decouple half price with color , 
        // issue was if no theme was selected then update allow_half_price is not getting
        // Modification and added by Om Shrivastava on 24-05-23
        // Reason : When first tenant create than show the half price
        // colors['allow_half_price']=color?.allow_half_price
        // setColors(colors)
        if(color && typeof color.allow_half_price!= "undefined"){
            colors['allow_half_price']=color.allow_half_price
            setColors(colors)
            }
        // End of modification and aded by Om Shrivastava on 24-05-23
        // end of code - Rohan Kansari - 7/5/23
        // end of code - 24/4/23
    },[color])

    return (
        <>
            {/* <div style={{ backgroundColor: 'yellow', color: 'black' }}>Yupp</div> */}
        </>
    );
}
