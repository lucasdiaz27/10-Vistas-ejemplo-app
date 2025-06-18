import React from "react";
import { Link } from 'react-router-dom';

export const Footer = () => {
    return (


        <footer className="text-white py-4 bg-dark">
            <div className="container">
                <div className="row align-items-center">
                    <div className="col-md-3 d-flex justify-content-center justify-content-md-start mb-3 mb-md-0">
                        <Link to="/" className="navbar-brand">
                            <img src="Logo.png" alt="Logo" width="120" />
                        </Link>
                    </div>

                    <div className="col-md-9  text-md-end">
                        <ul className="list-unstyled mb-0">
                            <li className="font-weight-bold mb-1">Directora: Dra. Luciana Montinho</li>
                            <li className="font-weight-bold mb-1">25 de Mayo 35 CP (4200)</li>
                            <li className="font-weight-bold mb-1">(0385) 4211062 / 4218461 / 0800 888 3030</li>
                            <li className="font-weight-bold mb-1">Email: areacomerciosde@hotmail.com</li>
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    <button type="submit" className="btn btn-outline-light">Personal</button>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </footer>


    )
};

export default Footer;