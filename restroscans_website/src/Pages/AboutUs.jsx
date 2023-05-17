// Created by:- Suman sahu On 14/04/2023
// Reason:- Create About us page for RestroScans website

import React from "react";
import "./aboutus.css";
import Scanner from "../images/scanner4.jpg";

function AboutUs() {
  return (
    <>
      <div className="Aboutus_main_div">
        <div className="aboutus_first_section">
          <div className="aboutus_parent_div">
            <div className="aboutus_heading_div">
              <h2 className="aboutus_restroscans_heading">RestroScans</h2>
            </div>

            <div className="aboutus_description_div">
              <div className="description_container">
                <div className="aboutus_adyant">
                  <p>
                    The Restroscan application is created to assist restaurant
                    proprietors and administrators in handling different aspects
                    of their business. It has a user-friendly and easy-to-use
                    interface that allows users to navigate through the various
                    modules and functions with ease. The Restroscan application
                    is created to assist restaurant proprietors and
                    administrators in handling different aspects of their
                    business. It has a user-friendly and easy-to-use interface
                    that allows users to navigate through the various modules
                    and functions with ease. The Restroscan application is
                    created to assist restaurant proprietors and administrators
                    in handling different aspects of their business. It has a
                    user-friendly and easy-to-use interface that allows users to
                    navigate through the various modules and functions with
                    ease. The Restroscan application is created to assist
                    restaurant proprietors and administrators in handling
                    different aspects of their business. It has a user-friendly
                    and easy-to-use interface that allows users to navigate
                    through the various modules and functions with ease.
                  </p>
                </div>
              </div>
              <img src={Scanner} className="aboutus_scanner_img" />
            </div>
          </div>
        </div>
      </div>

      <div className="Aboutus_adyant_details_div">
        <div className="aboutus_heading_div">
          <h2 className="aboutus_restroscans_adyant_heading">ADYANT</h2>
        </div>
        <div className="about_adyant_container">
          <div className="adyant_details_first_div">
            <div className="adyant_details_heading_div">
              <h2 className="aboutus_adyant_heading">About Adyant</h2>
            </div>
            <div className="aboutus_adyant_1">
              <p>
                "Adyant" a word taken from Sanskrit which means from "Beginning
                To End".
                <p> (A complete solution for all your needs)</p>
              </p>{" "}
              <p>
                Adyant is a group of IT professionals having 15+ years of
                experience with a common goal of customer satisfactions. We
                believe in a motto to build world class software for everyone,
                which can make everyone’s life easy and meet day to day needs.
              </p>
              <p>
                We build software which satisfies Client needs from individual
                Customers to an Enterprise.
              </p>
              <p>We are both Customer and Employee centric. </p>
              <p>
                We are true believer of Youth empowerment and providing a
                platform for learning, specially for the students to mark their
                presence at global stage.
              </p>
            </div>
          </div>

          <div className="adyant_details_second_div">
            <div className="adyant_details_heading_div">
              <h2 className="aboutus_adyant_heading">Adyant Roots</h2>
            </div>

            <div className="aboutus_adyant_1">
              <p>
                Our Skilled Professionals are in the industry since 2003 and our
                roots are built out globally, our branches are spread over
                India, US, New Zealand and UK. We have a big footprint because
                we believe world is a global village
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="Aboutus_services_div">
        <div className="services_left_div">
          <div className="services_heading_div">
            <h2 className="aboutus_services_heading">Products and Services</h2>
          </div>

          <div className="aboutus_services_description">
            <p>
              Adyant provides global products for small, medium, and scaled
              business size. We always emphasize in an innovation in a unique
              approach which develop robust and scalable software products and
              application to meet our client requirements.<br></br> <br></br>Our
              unique and innovative approach in developing and delivering the
              software cuts the project risk by bringing Agile software methods
              using different framework powered by open-source model ensuring to
              deliver working software early working around allocated budget.
              <br></br>
              <br></br>
              Adyant experts tactically addresses clients’ requirements for
              better functioning of their business. We believe in customer
              satisfaction simultaneously giving solution that is crafted for
              next generation enterprise needs.
            </p>
          </div>
        </div>

        <div className="services_right_div">
          <div className="aboutus_services_description">
            <p>We work in various industries vertical like</p>
            <ul className="lasd">
              <li>Accounting</li>
              <li>Logistic</li>
              <li>Billing</li>
              <li>Legal</li>
              <li>Biometrics</li>
              <li>Analytics</li>
              <li>Education</li>
              <li>Security</li>
              <li>Automation </li>
              <li>Banking and Finance </li>
              <li>E-Commerce</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="success_story_div">
        <div className="success_story_heading_div">
          <h2 className="success_story_heading">Success Story</h2>
        </div>
        <div className="success_story_content_div">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            voluptatum cum impedit eaque! Blanditiis, perferendis reiciendis!
            Dolores hic adipisci, fugit vero quis cumque, soluta beatae,
            repellat explicabo ipsa exercitationem molestiae.
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Est
            voluptatum cum impedit eaque! Blanditiis, perferendis reiciendis!
            Dolores hic adipisci, fugit vero quis cumque, soluta beatae,
            repellat explicabo ipsa exercitationem molestiae.
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutUs;
/* End of created code by-Suman sahu On  05/04/2023 */
