import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "../style/d_style.css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import simBg from "../image/z1.png";
import simBg1 from "../image/z2.png";
import simBg2 from "../image/z3.png";
import simBg3 from "../image/z4.png";

export default function TestSlider() {
  return (
    <Swiper
      modules={[Navigation, Autoplay]}
      navigation={true}
      autoplay={{ delay: 3000, disableOnInteraction: false }}
      loop={true}
      style={{ width: "100%", height: "400px" }}
      className="d_newhero-section-swiper"
    >
      <SwiperSlide>
               <div
                 className="d_newhero-slide"
                 style={{
                   backgroundImage: `url(${simBg})`,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "right center",
                   backgroundSize: "cover",
                   minHeight: "500px",
                   width: "100%",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   position: "relative",
                 }}
               >
                 <div className="d_newhero-content-swiper">
                   <div
                     className="d_newhero-icons mb-3"
                     style={{
                       display: "flex",
                       gap: "18px",
                       fontSize: "2.1rem",
                       color: "#fff",
                     }}
                   >
                     {/* WiFi Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                         <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                         <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                         <line x1="12" y1="20" x2="12.01" y2="20" />
                       </svg>
                     </span>
                     {/* Message Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                       </svg>
                     </span>
                     {/* Call Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.05.73 3a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.95.36 1.95.6 3 .73a2 2 0 0 1 1.72 2z" />
                       </svg>
                     </span>
                   </div>
                   <h1
                     className="d_newhero-title"
                     style={{
                       fontWeight: 700,
                       fontSize: "2.1rem",
                       marginBottom: "0.7rem",
                       color: "#fff",
                       lineHeight: 1.2,
                     }}
                   >
                     Choose the Best
                     <br />
                     <span style={{ fontWeight: 700 }}>SIM Plans for You</span>
                   </h1>
                   <p
                     className="d_newhero-desc"
                     style={{
                       color: "#fff",
                       fontSize: "1.1rem",
                       marginBottom: "0.5rem",
                     }}
                   >
                     Affordable Data, Calls &amp; SMS – All in One Place
                   </p>
                   <div
                     className="d_newhero-btns mt-md-4"
                     style={{ display: "flex", gap: "12px" }}
                   >
                     <button
                       className="d_btn d_btn-primary"
                       style={{
                         background: "#ffc845",
                         color: "#b71414",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       Buy SIM
                     </button>
                     <button
                       className="d_btn d_btn-secondary"
                       style={{
                         background: "#fff",
                         color: "#374150",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       View Plans
                     </button>
                   </div>
                 </div>
               </div>
             </SwiperSlide>
             <SwiperSlide>
               <div
                 className="d_newhero-slide"
                 style={{
                   backgroundImage: `url(${simBg1})`,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "right center",
                   backgroundSize: "cover",
                   minHeight: "500px",
                   width: "100%",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   position: "relative",
                 }}
               >
                 <div className="d_newhero-content-swiper">
                   <div
                     className="d_newhero-icons mb-3"
                     style={{
                       display: "flex",
                       gap: "18px",
                       fontSize: "2.1rem",
                       color: "#fff",
                     }}
                   >
                     {/* WiFi Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                         <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                         <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                         <line x1="12" y1="20" x2="12.01" y2="20" />
                       </svg>
                     </span>
                     {/* Message Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                       </svg>
                     </span>
                     {/* Call Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.05.73 3a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.95.36 1.95.6 3 .73a2 2 0 0 1 1.72 2z" />
                       </svg>
                     </span>
                   </div>
                   <h1
                     className="d_newhero-title"
                     style={{
                       fontWeight: 700,
                       fontSize: "2.1rem",
                       marginBottom: "0.7rem",
                       color: "#fff",
                       lineHeight: 1.2,
                     }}
                   >
                     Choose the Best
                     <br />
                     <span style={{ fontWeight: 700 }}>SIM Plans for You</span>
                   </h1>
                   <p
                     className="d_newhero-desc"
                     style={{
                       color: "#fff",
                       fontSize: "1.1rem",
                       marginBottom: "0.5rem",
                     }}
                   >
                     Affordable Data, Calls &amp; SMS – All in One Place
                   </p>
                   <div
                     className="d_newhero-btns mt-md-4"
                     style={{ display: "flex", gap: "12px" }}
                   >
                     <button
                       className="d_btn d_btn-primary"
                       style={{
                         background: "#ffc845",
                         color: "#b71414",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       Buy SIM
                     </button>
                     <button
                       className="d_btn d_btn-secondary"
                       style={{
                         background: "#fff",
                         color: "#374150",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       View Plans
                     </button>
                   </div>
                 </div>
               </div>
             </SwiperSlide>
             <SwiperSlide>
               <div
                 className="d_newhero-slide"
                 style={{
                   backgroundImage: `url(${simBg2})`,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "right center",
                   backgroundSize: "cover",
                   minHeight: "500px",
                   width: "100%",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   position: "relative",
                 }}
               >
                 <div className="d_newhero-content-swiper">
                   <div
                     className="d_newhero-icons mb-3"
                     style={{
                       display: "flex",
                       gap: "18px",
                       fontSize: "2.1rem",
                       color: "#fff",
                     }}
                   >
                     {/* WiFi Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                         <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                         <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                         <line x1="12" y1="20" x2="12.01" y2="20" />
                       </svg>
                     </span>
                     {/* Message Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                       </svg>
                     </span>
                     {/* Call Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.05.73 3a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.95.36 1.95.6 3 .73a2 2 0 0 1 1.72 2z" />
                       </svg>
                     </span>
                   </div>
                   <h1
                     className="d_newhero-title"
                     style={{
                       fontWeight: 700,
                       fontSize: "2.1rem",
                       marginBottom: "0.7rem",
                       color: "#fff",
                       lineHeight: 1.2,
                     }}
                   >
                     Choose the Best
                     <br />
                     <span style={{ fontWeight: 700 }}>SIM Plans for You</span>
                   </h1>
                   <p
                     className="d_newhero-desc"
                     style={{
                       color: "#fff",
                       fontSize: "1.1rem",
                       marginBottom: "0.5rem",
                     }}
                   >
                     Affordable Data, Calls &amp; SMS – All in One Place
                   </p>
                   <div
                     className="d_newhero-btns mt-md-4"
                     style={{ display: "flex", gap: "12px" }}
                   >
                     <button
                       className="d_btn d_btn-primary"
                       style={{
                         background: "#ffc845",
                         color: "#b71414",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       Buy SIM
                     </button>
                     <button
                       className="d_btn d_btn-secondary"
                       style={{
                         background: "#fff",
                         color: "#374150",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       View Plans
                     </button>
                   </div>
                 </div>
               </div>
             </SwiperSlide>
             <SwiperSlide>
               <div
                 className="d_newhero-slide"
                 style={{
                   backgroundImage: `url(${simBg3})`,
                   backgroundRepeat: "no-repeat",
                   backgroundPosition: "right center",
                   backgroundSize: "cover",
                   minHeight: "500px",
                   width: "100%",
                   display: "flex",
                   alignItems: "center",
                   justifyContent: "flex-start",
                   position: "relative",
                 }}
               >
                 <div className="d_newhero-content-swiper">
                   <div
                     className="d_newhero-icons mb-3"
                     style={{
                       display: "flex",
                       gap: "18px",
                       fontSize: "2.1rem",
                       color: "#fff",
                     }}
                   >
                     {/* WiFi Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                         <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                         <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                         <line x1="12" y1="20" x2="12.01" y2="20" />
                       </svg>
                     </span>
                     {/* Message Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                       </svg>
                     </span>
                     {/* Call Icon */}
                     <span style={{ display: "inline-flex", alignItems: "center" }}>
                       <svg
                         width="32"
                         height="32"
                         viewBox="0 0 24 24"
                         fill="none"
                         stroke="currentColor"
                         strokeWidth="2"
                         strokeLinecap="round"
                         strokeLinejoin="round"
                       >
                         <path d="M22 16.92V21a2 2 0 0 1-2.18 2A19.72 19.72 0 0 1 3 5.18 2 2 0 0 1 5 3h4.09a2 2 0 0 1 2 1.72c.13 1.05.37 2.05.73 3a2 2 0 0 1-.45 2.11l-1.27 1.27a16 16 0 0 0 6.29 6.29l1.27-1.27a2 2 0 0 1 2.11-.45c.95.36 1.95.6 3 .73a2 2 0 0 1 1.72 2z" />
                       </svg>
                     </span>
                   </div>
                   <h1
                     className="d_newhero-title"
                     style={{
                       fontWeight: 700,
                       fontSize: "2.1rem",
                       marginBottom: "0.7rem",
                       color: "#fff",
                       lineHeight: 1.2,
                     }}
                   >
                     Choose the Best
                     <br />
                     <span style={{ fontWeight: 700 }}>SIM Plans for You</span>
                   </h1>
                   <p
                     className="d_newhero-desc"
                     style={{
                       color: "#fff",
                       fontSize: "1.1rem",
                       marginBottom: "0.5rem",
                     }}
                   >
                     Affordable Data, Calls &amp; SMS – All in One Place
                   </p>
                   <div
                     className="d_newhero-btns mt-md-4"
                     style={{ display: "flex", gap: "12px" }}
                   >
                     <button
                       className="d_btn d_btn-primary"
                       style={{
                         background: "#ffc845",
                         color: "#b71414",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       Buy SIM
                     </button>
                     <button
                       className="d_btn d_btn-secondary"
                       style={{
                         background: "#fff",
                         color: "#374150",
                         border: "none",
                         fontWeight: 600,
                         padding: "0.7rem 2.1rem",
                         borderRadius: "0.7rem",
                         fontSize: "1.1rem",
                       }}
                     >
                       View Plans
                     </button>
                   </div>
                 </div>
               </div>
             </SwiperSlide>
    </Swiper>
  );
}
