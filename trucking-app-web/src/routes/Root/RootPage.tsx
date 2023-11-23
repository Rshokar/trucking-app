import Hero from "./components/Hero/Hero";
import Features from "./components/Features/Features";
import Pricing from "./components/Pricing/Pricing";
import Steps from "./components/Steps/Steps";
import CallToAction from "./components/CallToAction";
import Contact from "./components/Contact";
import Header, {
  DOWNLOAD_ID,
  FEATURES_ID,
  GET_STARTED_ID,
  PRICING_ID,
  CONTACT_ID,
} from "./components/header/header";

const RootPage = () => (
  <>
    <Header />
    <Hero />
    <Features id={`${FEATURES_ID}`} />
    <Steps id={`${GET_STARTED_ID}`} />
    <Pricing id={`${PRICING_ID}`} />
    <CallToAction id={`${DOWNLOAD_ID}`} />
    <Contact id={`${CONTACT_ID}`} />
  </>
);

export default RootPage;
