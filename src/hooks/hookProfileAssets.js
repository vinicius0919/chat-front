import  boy from "../assets/boy.png";
import  boyDred from "../assets/boyDred.png";
import  businessMan from "../assets/businessMan.png";
import girl from "../assets/girl.png";
import girlBlack from "../assets/girlBlack.png";
import girlRedHead from "../assets/girlRedHead.png";
import  man from "../assets/man.png";
import manBlack from "../assets/manBlack.png";
import manNoHear from "../assets/manNoHear.png";

const profileAssets = {
  boy: { src: boy, name:"boy", alt: "Boy" },
  boyDred: { src: boyDred, name:"boyDred", alt: "Boy with Dreadlocks" },
  businessMan: { src: businessMan, name:"businessMan", alt: "Business Man" },
  girl: { src: girl, name:"girl", alt: "Girl" },
  girlBlack: { src: girlBlack, name:"girlBlack", alt: "Black Girl" },
  girlRedHead: { src: girlRedHead, name:"girlRedHead", alt: "Red Head Girl" },
  man: { src: man, name:"man", alt: "Man" },
  manBlack: { src: manBlack, name:"manBlack", alt: "Black Man" },
  manNoHear: { src: manNoHear, name:"manNoHear", alt: "Man with No Hair" },
  // export each png name in one array
  getAll: [
    {src: boy, name:"boy", alt: "boy"},
    {src: girl, name:"girl", alt: "girl"},
    {src: man, name:"man", alt: "man"},
    {src: businessMan, name:"businessMan", alt: "businessMan"},
    {src: girlBlack, name:"girlBlack", alt: "girlBlack"},
    {src: girlRedHead, name:"girlRedHead", alt: "girlRedHead"},
    {src: boyDred, name:"boyDred", alt: "boyDred"},
    {src: manBlack, name:"manBlack", alt: "manBlack"},
    {src: manNoHear, name:"manNoHear", alt: "manNoHear"}
  ]
};
export default profileAssets;
