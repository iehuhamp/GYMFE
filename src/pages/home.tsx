import { useState, useEffect, useRef } from "react";
import "./home.css";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: string;
}

const ServiceCard = ({ title, description, icon }: ServiceCardProps) => {
  const getBackgroundImage = (title: string) => {
    switch (title.toLowerCase()) {
      case "yoga":
        return "https://i.pinimg.com/736x/65/ad/ff/65adffa0f6e005d0a20599d9f97b4f3d.jpg";
      case "bums & tums":
        return "https://i.pinimg.com/736x/b8/27/30/b8273092550a52ad530fece477872df5.jpg";
      case "dance":
        return "https://i.pinimg.com/736x/90/7e/83/907e83da631e880efafc85dfbe101765.jpg";
      case "personal trainer":
        return "https://i.pinimg.com/736x/7c/eb/d1/7cebd12991b141e16439829cbbb72dca.jpg";
      default:
        return "https://i.pinimg.com/736x/16/5b/1f/165b1f9b4d72e33df3c7645221a04dd4.jpg";
    }
  };

  return (
    <div
      className="service-card"
      style={{
        backgroundImage: `url(${getBackgroundImage(title)})`,
      }}
    >
      <div className="service-card__overlay">
        <div className="service-card__content">
          <div className="service-card__icon">{icon}</div>
          <h3 className="service-card__title">{title}</h3>
          <p className="service-card__description">{description}</p>
          <button className="service-card__button">Book Now</button>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRef = useRef(null);

  const slides = [
    {
      title: "Building Digital Excellence",
      description: "Creating innovative solutions for modern businesses",
      image:
        "https://i.pinimg.com/736x/f5/51/48/f55148ad2ef92de8597008b60bcd29a8.jpg",
    },
    {
      title: "Expert Development",
      description: "Crafting powerful and scalable applications",
      image:
        "https://i.pinimg.com/736x/c9/ca/74/c9ca74be14e1e93c577d4324dec5c15a.jpg",
    },
    {
      title: "Creative Solutions",
      description: "Turning your vision into reality",
      image:
        "https://i.pinimg.com/736x/9e/0f/f2/9e0ff29e5c7e405cb715a9d94b06a382.jpg",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      goToNextSlide();
    }, 3000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="homepage">
      <section className="hero">
        <div className="slider" ref={slideRef}>
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`slide ${index === currentSlide ? "active" : ""}`}
            >
              <img src={slide.image} alt={slide.title} />
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.description}</p>
                <button className="btn-primary">Learn More</button>
              </div>
            </div>
          ))}
        </div>
        <button className="slider-btn prev" onClick={goToPrevSlide}>
          ❮
        </button>
        <button className="slider-btn next" onClick={goToNextSlide}>
          ❯
        </button>
        <div className="slider-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? "active" : ""}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>
      <section className="about">
        <div className="container">
          <h2>Welcome to Our Company</h2>
          <p>
            We specialize in creating exceptional digital experiences through
            innovative technology solutions and creative design. Our team of
            experts is dedicated to helping your business succeed in the digital
            world.
          </p>
          <button className="btn-secondary">About Us</button>
        </div>
      </section>

      <Services />
      <Story />
      <Footer />
    </div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Yoga",
      description:
        "Find your inner peace and flexibility with our expert-led yoga classes. Perfect for all levels from beginners to advanced practitioners.",
      icon: "🧘‍♀️",
    },
    {
      title: "Bums & Tums",
      description:
        "Target those specific areas with our high-energy workout sessions. Get the toned body you've always wanted.",
      icon: "💪",
    },
    {
      title: "Dance",
      description:
        "Get fit while having fun! Our dance classes combine cardio with awesome moves to keep you engaged and energized.",
      icon: "💃",
    },
    {
      title: "Personal Trainer",
      description:
        "Get personalized attention and achieve your fitness goals faster with our certified personal trainers.",
      icon: "🏋️‍♀️",
    },
  ];

  return (
    <section className="services">
      <div className="services__container">
        <h2 className="services__title">Our Services</h2>
        <div className="services__grid">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

const Story = () => {
  return (
    <section className="story">
      <div className="story__container">
        <h2 className="story__title">Our Journey</h2>

        <div className="story__content">
          <div className="story__image-container">
            <div className="story__image story__image--main">
              {/* Replace with your actual image path */}
              <img
                src="https://i.pinimg.com/736x/1e/4b/75/1e4b75d6d203c7de1d8f0fb090524e89.jpg"
                alt="Our gym facility"
              />
            </div>
            <div className="story__image story__image--secondary">
              {/* Replace with your actual image path */}
              <img
                src="https://i.pinimg.com/736x/21/c0/fb/21c0fb395cf3a178c7188d7824800eed.jpg"
                alt="Happy gym members"
              />
            </div>
          </div>

          <div className="story__text-content">
            <h3 className="story__subtitle">Building Strength Since 2010</h3>

            <div className="story__paragraph">
              <p>
                What started as a small personal training studio has grown into
                a thriving fitness community. Our journey began with a simple
                vision: to create a space where everyone feels empowered to
                transform their lives through fitness.
              </p>
            </div>

            <div className="story__highlights">
              <div className="story__highlight-item">
                <span className="story__highlight-number">5000+</span>
                <span className="story__highlight-text">
                  Members Transformed
                </span>
              </div>
              <div className="story__highlight-item">
                <span className="story__highlight-number">15</span>
                <span className="story__highlight-text">Expert Trainers</span>
              </div>
              <div className="story__highlight-item">
                <span className="story__highlight-number">300+</span>
                <span className="story__highlight-text">Classes Monthly</span>
              </div>
            </div>

            <div className="story__values">
              <h4 className="story__values-title">Our Core Values</h4>
              <ul className="story__values-list">
                <li className="story__values-item">
                  <span className="story__values-icon">💪</span>
                  <div>
                    <h5>Community First</h5>
                    <p>
                      Building a supportive fitness family where everyone
                      belongs
                    </p>
                  </div>
                </li>
                <li className="story__values-item">
                  <span className="story__values-icon">🎯</span>
                  <div>
                    <h5>Expert Guidance</h5>
                    <p>Professional trainers dedicated to your success</p>
                  </div>
                </li>
                <li className="story__values-item">
                  <span className="story__values-icon">🌟</span>
                  <div>
                    <h5>Innovation</h5>
                    <p>
                      Constantly evolving our programs to deliver the best
                      results
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          {/* Gym Info */}
          <div className="footer__section">
            <h3 className="footer__title">FitLife Gym</h3>
            <p className="footer__description">
              Your journey to a healthier life starts here. Join our community
              and transform your life through fitness.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link">
                Facebook
              </a>
              <a href="#" className="footer__social-link">
                Instagram
              </a>
              <a href="#" className="footer__social-link">
                Twitter
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Quick Links</h4>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">
                  Home
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Classes
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Schedule
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Services</h4>
            <ul className="footer__links">
              <li>
                <a href="#" className="footer__link">
                  Personal Training
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Group Classes
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Nutrition Planning
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Fitness Assessment
                </a>
              </li>
              <li>
                <a href="#" className="footer__link">
                  Online Coaching
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer__section">
            <h4 className="footer__subtitle">Contact Us</h4>
            <div className="footer__contact">
              <p>
                <strong>Address:</strong>
                <br />
                123 Fitness Street
                <br />
                Workout City, WC 12345
              </p>
              <p>
                <strong>Phone:</strong>
                <br />
                (555) 123-4567
              </p>
              <p>
                <strong>Email:</strong>
                <br />
                info@fitlifegym.com
              </p>
              <p>
                <strong>Hours:</strong>
                <br />
                Mon-Fri: 6am - 10pm
                <br />
                Sat-Sun: 8am - 8pm
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer__bottom">
          <p className="footer__copyright">
            © {new Date().getFullYear()} FitLife Gym. All rights reserved.
          </p>
          <div className="footer__legal">
            <a href="#" className="footer__legal-link">
              Privacy Policy
            </a>
            <a href="#" className="footer__legal-link">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Home;
