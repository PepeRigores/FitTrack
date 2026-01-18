import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/landing/bootstrap.min.css';
import '../assets/styles/landing/font-awesome.min.css';
import '../assets/styles/landing/aos.css';
import '../assets/styles/landing/tooplate-gymso-style.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <div data-spy="scroll" data-target="#navbarNav" data-offset="50">
            {/* MENU BAR */}
            <nav className="navbar navbar-expand-lg fixed-top">
                <div className="container">
                    <a className="navbar-brand" href="#">Fitness Tracker</a>

                    <button
                        className="navbar-toggler"
                        type="button"
                        onClick={toggleMenu}
                        aria-expanded={isMenuOpen}
                        aria-label="Toggle navigation"
                    >
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`} id="navbarNav">
                        <ul className="navbar-nav ml-lg-auto">
                            <li className="nav-item">
                                <a href="#feature" className="nav-link smoothScroll">Qué es?</a>
                            </li>
                            <li className="nav-item">
                                <a href="#class" className="nav-link smoothScroll">Entrenamientos</a>
                            </li>
                            <li className="nav-item">
                                <a href="#schedule" className="nav-link smoothScroll">Asistente</a>
                            </li>
                            <li className="nav-item">
                                <a href="#contact" className="nav-link smoothScroll">Contacto</a>
                            </li>
                        </ul>

                        <ul className="social-icon ml-lg-3">
                            <li><a href="#" className="fa fa-facebook"></a></li>
                            <li><a href="#" className="fa fa-twitter"></a></li>
                            <li><a href="#" className="fa fa-instagram"></a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            {/* HERO */}
            <section className="hero d-flex flex-column justify-content-center align-items-center" id="home">
                <div className="bg-overlay"></div>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-8 col-md-10 mx-auto col-12">
                            <div className="hero-text mt-5 text-center">
                                <h6 data-aos="fade-up" data-aos-delay="300">construye un estilo de vida saludable!</h6>
                                <h1 className="text-white" data-aos="fade-up" data-aos-delay="500">Registra tu progreso con Fitness Tracker</h1>
                                <button onClick={() => navigate('/register')} className="btn custom-btn mt-3" data-aos="fade-up" data-aos-delay="600">Regístrate</button>
                                <button onClick={() => navigate('/login')} className="btn custom-btn bordered mt-3" data-aos="fade-up" data-aos-delay="700">log in</button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="feature" id="feature">
                <div className="container" style={{ paddingTop: '100px' }}>
                    <div className="row">
                        <div className="d-flex flex-column justify-content-center ml-lg-auto mr-lg-5 col-lg-5 col-md-6 col-12">
                            <h2 className="mb-3 text-white" data-aos="fade-up">Qué es Fitness Tracker?</h2>
                            <h6 className="mb-4 text-white" data-aos="fade-up">Sencillamente... una aplicación web para registrar tus entrenamientos</h6>
                            <p data-aos="fade-up" data-aos-delay="200">Es completamente gratuita y además te aseguramos que no recibirás correo spam por nuestra parte</p>
                            <button onClick={() => navigate('/register')} className="btn custom-btn bg-color mt-3" data-aos="fade-up" data-aos-delay="300">Regístrate y comienza!</button>
                        </div>
                        <div className="mr-lg-auto mt-3 col-lg-4 col-md-6 col-12">
                            <div className="about-details">
                                <div>
                                    <h2 className="mb-3 text-white" data-aos="fade-up">¿Cómo funciona?</h2>
                                    <h6 className="mb-4 text-white" data-aos="fade-up">Crea tus ejercicios y organiza tus entrenamientos</h6>
                                    <p data-aos="fade-up" data-aos-delay="200">Cada ejercicio tiene su propia descripción, duración y repeticiones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CLASS */}
            <section className="class section" id="class">
                <div className="container" style={{ paddingTop: '60px' }}>
                    <div className="row">
                        <div className="col-lg-12 col-12 text-center mb-5">
                            <h6 data-aos="fade-up">crea tus ejercicios o elige entre una gran variedad de nuestro staff</h6>
                            <h2 data-aos="fade-up" data-aos-delay="200">y organiza tus entrenamientos!</h2>
                        </div>
                        <div className="col-lg-4 col-md-6 col-12" data-aos="fade-up" data-aos-delay="400">
                            <div className="class-thumb">
                                <img src="/landing/images/class/feature-2.jpg" className="img-fluid" alt="Class" />
                                <div className="class-info">
                                    <h3 className="mb-1">Fuerza</h3>
                                    <p className="mt-3">Press banca, Curl bíceps, etc...</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 mt-lg-0 mt-md-0 col-lg-4 col-md-6 col-12" data-aos="fade-up" data-aos-delay="500">
                            <div className="class-thumb">
                                <img src="/landing/images/class/feature-4.jpg" className="img-fluid" alt="Class" />
                                <div className="class-info">
                                    <h3 className="mb-1">Calistenia</h3>
                                    <p className="mt-3">Dominadas, Flexiones, etc...</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-5 mt-lg-0 col-lg-4 col-md-6 col-12" data-aos="fade-up" data-aos-delay="600">
                            <div className="class-thumb">
                                <img src="/landing/images/class/cardio-class.jpg" className="img-fluid" alt="Class" />
                                <div className="class-info">
                                    <h3 className="mb-1">Cardio</h3>
                                    <p className="mt-3">Caminar, Correr, Burpees, etc...</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCHEDULE */}
            <section className="schedule section" id="schedule">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-12 text-center">
                            <h6 data-aos="fade-up">próximamente!!</h6>
                            <h2 className="text-white" data-aos="fade-up" data-aos-delay="200">Un asistente para diseñar tus rutinas</h2>
                        </div>
                        <div className="col-lg-12 py-5 col-md-12 col-12">
                            <table className="table table-bordered table-responsive schedule-table" data-aos="fade-up" data-aos-delay="300">
                                <thead className="thead-light">
                                    <tr>
                                        <th><i className="fa fa-calendar"></i></th>
                                        <th>L</th>
                                        <th>M</th>
                                        <th>X</th>
                                        <th>J</th>
                                        <th>V</th>
                                        <th>S</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td><small>7:00</small></td>
                                        <td></td>
                                        <td>
                                            <strong>Cardio</strong>
                                            <span>7:00 - 8:00</span>
                                        </td>
                                        <td></td>
                                        <td>
                                            <strong>Cardio</strong>
                                            <span>7:00 - 8:00</span>
                                        </td>
                                        <td></td>
                                        <td>
                                            <strong>Power Fitness</strong>
                                            <span>7:00 - 8:30</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td><small>19:00</small></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <strong>Tren inferior</strong>
                                            <span>19:00 - 20:30</span>
                                        </td>
                                        <td></td>
                                        <td>
                                            <strong>Calistenia</strong>
                                            <span>19:00 - 20:30</span>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td><small>20:00</small></td>
                                        <td>
                                            <strong>Tren superior</strong>
                                            <span>20:00 - 21:00</span>
                                        </td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section className="contact section" id="contact">
                <div className="container">
                    <div className="row">
                        <div className="ml-auto col-lg-5 col-md-6 col-12">
                            <h2 className="mb-4 pb-2" data-aos="fade-up" data-aos-delay="200">Dudas o sugerencias:</h2>
                            <form action="#" method="post" className="contact-form webform" data-aos="fade-up" data-aos-delay="400" role="form">
                                <input type="text" className="form-control" name="cf-name" placeholder="Nombre" />
                                <input type="email" className="form-control" name="cf-email" placeholder="Email" />
                                <textarea className="form-control" rows={5} name="cf-message" placeholder="Mensaje"></textarea>
                                <button type="submit" className="form-control" id="submit-button" name="submit">Enviar Mensaje</button>
                            </form>
                        </div>
                        <div className="mx-auto mt-4 mt-lg-0 mt-md-0 col-lg-5 col-md-6 col-12">
                            <h2 className="mb-4" data-aos="fade-up" data-aos-delay="600">Dónde encontrarnos?</h2>
                            <p data-aos="fade-up" data-aos-delay="800"><i className="fa fa-map-marker mr-1"></i> Calle Cabo de San Antonio, 22 <br /> 30740 - San Pedro del Pinatar (Murcia)</p>
                            <div className="google-map" data-aos="fade-up" data-aos-delay="900">
                                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.3977388232342!2d-0.7839667121232773!3d37.82757353686138!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd630fc763ae89e9%3A0xd4af5bfd6597c441!2sI.E.S.%20%22Dos%20Mares%22!5e0!3m2!1sen!2sus!4v1768601016592!5m2!1sen!2sus" width="100%" height="250" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="site-footer">
                <div className="container">
                    <div className="row">
                        <div className="ml-auto col-lg-4 col-md-5">
                            <p className="copyright-text">Copyright &copy; 2026 Fitness Tracker Co.
                                <br />Design: <a href="https://www.tooplate.com">Jose Conesa</a></p>
                        </div>
                        <div className="d-flex flex-column justify-content-center mx-auto col-lg-5 col-md-7 col-12">
                            <div className="d-flex justify-content-center">
                                <p className="mr-4">
                                    <i className="fa fa-envelope-o mr-1"></i>
                                    <a href="#">pepe.rigores@gmail.com</a>
                                </p>
                                <p><i className="fa fa-phone mr-1"></i> 699 08 65 83</p>
                            </div>
                            <div className="d-flex justify-content-center">
                                <p className="mr-4">
                                    <i className="fa fa-envelope-o mr-1"></i>
                                    <a href="#">sebastian@gmail.com</a>
                                </p>
                                <p><i className="fa fa-phone mr-1"></i> 647 29 73 67</p>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>


        </div>
    );
};
export default LandingPage;
