
import React from "react";

export default function ComingSoonPage(){


    return (
        <>
    <div style={{
            margin: 0,
            padding: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            background: "linear-gradient(to right, #ff7e5f, #feb47b)",
            textAlign: "center",
            color: "white",
            fontFamily: "Arial, sans-serif"
        }}>
            <div>
                <h1 style={{ fontSize: "50px", marginBottom: "10px" }}>Coming Soon</h1>
                <p style={{ fontSize: "20px", marginBottom: "20px" }}>We are working hard to bring something amazing. Stay tuned!</p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    {/* <input 
                        type="email" 
                        placeholder="Enter your email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ padding: "10px", border: "none", borderRadius: "5px", marginRight: "10px" }}
                    />
                    <button 
                        onClick={handleNotify}
                        style={{ padding: "10px 20px", border: "none", background: "#ff4b2b", color: "white", borderRadius: "5px", cursor: "pointer" }}>
                        Notify Me
                    </button> */}
                </div>
            </div>
        </div>
      </>
    )
}