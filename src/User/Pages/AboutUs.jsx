import "../Components/CSS/About.css"
import developer from "../../assets/Developer.png"
import logo from "../../assets/logo.png";
import React from "react";

function AboutUs() {
    return (
        <>
            <div className="home-content-background">
                <div className="home-content">
                    <div className="aboutus-title">
                        About Us
                    </div>
                    <div className="aboutus-content-container">
                        <div className="aboutus-content-title">
                            About Content
                        </div>
                        <div className="aboutus-content-description">
                            <p>
                            Biblio was born from a simple idea: making great literature accessible to everyone,
                            everywhere. We believe that stories have the power to transform lives, and technology should
                            help—not hinder this transformation.
                            </p>
                            <p>
                            Designed to enhance your digital reading experience, Biblio provides features like dark/light mode, font customization, and spacing adjustments.
                            </p>
                            <p>
                                Developed as a final year project
                            </p>
                        </div>
                    </div>

                    <div className="aboutus-content-container">
                        <div className="aboutus-content-title">
                            Developer
                        </div>
                        <div className="aboutus-content-developer">
                            <img
                                className="dev-img"
                                src={developer} alt="dev"/>
                            <div className="aboutus-content-developer-name">
                                Someone
                                <div className="aboutus-content-developer-positon">
                                    Developer, Designer
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AboutUs