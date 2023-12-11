import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import Pricing from "./components/Pricing/Pricing";
import HowItWorks from "./components/Steps/HowItWorks";
import CallToAction from "./components/CallToAction";
import Contact from "./components/Contact/Contact";
import Summary from "./components/Summary/Summary";
import Header, {
  DOWNLOAD_ID,
  FEATURES_ID,
  HOW_IT_WORKS,
  PRICING_ID,
  CONTACT_ID,
  SUMMARY_ID
} from "./components/NavBar";

const RootPage = () => (
  <>
    <Header />
    <Hero />
    <HowItWorks id={`${HOW_IT_WORKS}`} />
    <Features id={`${FEATURES_ID}`} />
    <Contact id={`${CONTACT_ID}`} />
  </>
);

export default RootPage;
